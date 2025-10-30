import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create avatar storage bucket on startup
(async () => {
  const bucketName = 'make-41f20081-avatars';
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: false });
      console.log('Created avatar storage bucket');
    }
  } catch (error) {
    console.error('Error creating bucket:', error);
  }
})();

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate random session ID
function generateSessionId(): string {
  return crypto.randomUUID();
}

// Generate access token
function generateAccessToken(userId: string): string {
  return `${userId}_${crypto.randomUUID()}`;
}

// Middleware to verify access token
async function verifyToken(authHeader: string | null): Promise<{ userId: string } | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  const tokenData = await kv.get(`token:${token}`);
  
  if (!tokenData) {
    return null;
  }
  
  return JSON.parse(tokenData);
}

// Send SMS via Twilio
async function sendSMS(to: string, message: string): Promise<boolean> {
  const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

  // If Twilio credentials are not configured, skip SMS sending (demo mode)
  if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
    console.log('Twilio not configured - Demo mode: SMS would be sent to', to, 'with message:', message);
    return false; // Return false to indicate demo mode
  }

  try {
    const auth = btoa(`${twilioAccountSid}:${twilioAuthToken}`);
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: twilioPhoneNumber,
          Body: message,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Twilio API error:', errorData);
      return false;
    }

    console.log('SMS sent successfully to', to);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

// Health check endpoint
app.get("/make-server-41f20081/health", (c) => {
  return c.json({ status: "ok" });
});

// Send OTP endpoint
app.post("/make-server-41f20081/auth/send-otp", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone) {
      return c.json({ error: 'Phone number is required' }, 400);
    }

    const otpCode = generateOTP();
    const sessionId = generateSessionId();
    
    // Store OTP with 5 minute expiration
    await kv.set(`otp:${sessionId}`, JSON.stringify({
      phone,
      otpCode,
      createdAt: new Date().toISOString(),
    }), { expiresIn: 300 }); // 5 minutes
    
    // Try to send SMS via Twilio
    const smsMessage = `Your EventConnect verification code is: ${otpCode}. Valid for 5 minutes.`;
    const smsSent = await sendSMS(phone, smsMessage);
    
    console.log(`OTP for ${phone}: ${otpCode} (SMS sent: ${smsSent})`);
    
    return c.json({
      sessionId,
      message: smsSent ? 'OTP sent to your phone' : 'OTP generated',
      // Only return OTP code in demo mode (when Twilio is not configured)
      ...(smsSent ? {} : { otpCode }),
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return c.json({ error: 'Failed to send OTP' }, 500);
  }
});

// Verify OTP endpoint
app.post("/make-server-41f20081/auth/verify-otp", async (c) => {
  try {
    const { sessionId, otpCode, phone } = await c.req.json();
    
    if (!sessionId || !otpCode || !phone) {
      return c.json({ error: 'Session ID, OTP, and phone are required' }, 400);
    }

    // Get stored OTP
    const otpDataStr = await kv.get(`otp:${sessionId}`);
    if (!otpDataStr) {
      return c.json({ error: 'Invalid or expired OTP session' }, 400);
    }

    const otpData = JSON.parse(otpDataStr);
    
    // Verify OTP
    if (otpData.otpCode !== otpCode || otpData.phone !== phone) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    // Delete used OTP
    await kv.del(`otp:${sessionId}`);

    // Check if user exists
    let userDataStr = await kv.get(`user:phone:${phone}`);
    let user;
    
    if (userDataStr) {
      user = JSON.parse(userDataStr);
    } else {
      // Create new user
      const userId = crypto.randomUUID();
      user = {
        id: userId,
        phone,
        userType: 'individual',
        createdAt: new Date().toISOString(),
      };
      
      await kv.set(`user:${userId}`, JSON.stringify(user));
      await kv.set(`user:phone:${phone}`, JSON.stringify(user));
    }

    // Generate access token
    const accessToken = generateAccessToken(user.id);
    await kv.set(`token:${accessToken}`, JSON.stringify({ userId: user.id }));

    return c.json({
      accessToken,
      userId: user.id,
      user,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return c.json({ error: 'Failed to verify OTP' }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-41f20081/user/profile", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tokenData = await verifyToken(authHeader);
    
    if (!tokenData) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userDataStr = await kv.get(`user:${tokenData.userId}`);
    if (!userDataStr) {
      return c.json({ error: 'User not found' }, 404);
    }

    const user = JSON.parse(userDataStr);
    return c.json({ user });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return c.json({ error: 'Failed to get user profile' }, 500);
  }
});

// Update user profile endpoint
app.put("/make-server-41f20081/user/profile", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tokenData = await verifyToken(authHeader);
    
    if (!tokenData) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, email, avatar } = await c.req.json();

    const userDataStr = await kv.get(`user:${tokenData.userId}`);
    if (!userDataStr) {
      return c.json({ error: 'User not found' }, 404);
    }

    const user = JSON.parse(userDataStr);
    
    // Update user data
    const updatedUser = {
      ...user,
      name,
      email,
      avatar,
    };

    await kv.set(`user:${tokenData.userId}`, JSON.stringify(updatedUser));
    await kv.set(`user:phone:${user.phone}`, JSON.stringify(updatedUser));

    return c.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({ error: 'Failed to update user profile' }, 500);
  }
});

// Upload avatar endpoint
app.post("/make-server-41f20081/user/upload-avatar", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tokenData = await verifyToken(authHeader);
    
    if (!tokenData) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const avatarFile = formData.get('avatar') as File;
    const userId = formData.get('userId') as string;

    if (!avatarFile) {
      return c.json({ error: 'Avatar file is required' }, 400);
    }

    if (userId !== tokenData.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Generate unique filename
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const bucketName = 'make-41f20081-avatars';

    // Upload to Supabase Storage
    const arrayBuffer = await avatarFile.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, arrayBuffer, {
        contentType: avatarFile.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload avatar' }, 500);
    }

    // Get signed URL (valid for 1 year)
    const { data: urlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365);

    if (!urlData) {
      return c.json({ error: 'Failed to generate avatar URL' }, 500);
    }

    return c.json({ avatarUrl: urlData.signedUrl });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return c.json({ error: 'Failed to upload avatar' }, 500);
  }
});

// Social login - Initiate OAuth flow
app.post("/make-server-41f20081/auth/social-login", async (c) => {
  try {
    const { provider } = await c.req.json();
    
    if (!['google', 'facebook', 'github'].includes(provider)) {
      return c.json({ error: 'Invalid provider. Supported: google, facebook, github' }, 400);
    }

    // Use Supabase Auth for OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'facebook' | 'github',
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-41f20081/auth/social-callback`,
      },
    });

    if (error) {
      console.error('OAuth initiation error:', error);
      return c.json({ error: 'Failed to initiate social login' }, 500);
    }

    return c.json({ url: data.url });
  } catch (error) {
    console.error('Error initiating social login:', error);
    return c.json({ error: 'Failed to initiate social login' }, 500);
  }
});

// Social login callback
app.get("/make-server-41f20081/auth/social-callback", async (c) => {
  try {
    const code = c.req.query('code');
    
    if (!code) {
      return c.json({ error: 'No authorization code provided' }, 400);
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData.user) {
      console.error('Session exchange error:', sessionError);
      return c.json({ error: 'Failed to authenticate' }, 500);
    }

    const supabaseUser = sessionData.user;

    // Check if user exists in our system
    let userDataStr = await kv.get(`user:email:${supabaseUser.email}`);
    let user;

    if (userDataStr) {
      user = JSON.parse(userDataStr);
    } else {
      // Create new user from OAuth data
      const userId = crypto.randomUUID();
      user = {
        id: userId,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
        avatar: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture,
        userType: 'individual',
        authProvider: supabaseUser.app_metadata?.provider || 'unknown',
        createdAt: new Date().toISOString(),
      };

      await kv.set(`user:${userId}`, JSON.stringify(user));
      await kv.set(`user:email:${supabaseUser.email}`, JSON.stringify(user));
    }

    // Generate access token
    const accessToken = generateAccessToken(user.id);
    await kv.set(`token:${accessToken}`, JSON.stringify({ userId: user.id }));

    // Redirect to app with token (you can customize this)
    return c.json({
      accessToken,
      userId: user.id,
      user,
    });
  } catch (error) {
    console.error('Error in social callback:', error);
    return c.json({ error: 'Failed to complete social login' }, 500);
  }
});

// Request account deletion
app.post("/make-server-41f20081/user/request-deletion", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tokenData = await verifyToken(authHeader);
    
    if (!tokenData) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userDataStr = await kv.get(`user:${tokenData.userId}`);
    if (!userDataStr) {
      return c.json({ error: 'User not found' }, 404);
    }

    const user = JSON.parse(userDataStr);

    // Send OTP for deletion confirmation
    const otpCode = generateOTP();
    const sessionId = generateSessionId();
    
    await kv.set(`deletion:${sessionId}`, JSON.stringify({
      userId: tokenData.userId,
      otpCode,
      createdAt: new Date().toISOString(),
    }), { expiresIn: 300 }); // 5 minutes

    // Send SMS or email with OTP
    if (user.phone) {
      const smsMessage = `Your EventConnect account deletion code is: ${otpCode}. This action is irreversible.`;
      await sendSMS(user.phone, smsMessage);
    }

    console.log(`Account deletion OTP for user ${tokenData.userId}: ${otpCode}`);

    return c.json({
      sessionId,
      message: 'Deletion OTP sent',
      // Only return in demo mode
      ...(!user.phone ? { otpCode } : {}),
    });
  } catch (error) {
    console.error('Error requesting account deletion:', error);
    return c.json({ error: 'Failed to request account deletion' }, 500);
  }
});

// Confirm account deletion
app.delete("/make-server-41f20081/user/confirm-deletion", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const tokenData = await verifyToken(authHeader);
    
    if (!tokenData) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { sessionId, otpCode } = await c.req.json();

    if (!sessionId || !otpCode) {
      return c.json({ error: 'Session ID and OTP are required' }, 400);
    }

    // Verify deletion OTP
    const deletionDataStr = await kv.get(`deletion:${sessionId}`);
    if (!deletionDataStr) {
      return c.json({ error: 'Invalid or expired deletion session' }, 400);
    }

    const deletionData = JSON.parse(deletionDataStr);

    if (deletionData.userId !== tokenData.userId || deletionData.otpCode !== otpCode) {
      return c.json({ error: 'Invalid OTP' }, 400);
    }

    // Delete user data
    const userDataStr = await kv.get(`user:${tokenData.userId}`);
    if (userDataStr) {
      const user = JSON.parse(userDataStr);
      
      // Delete all user-related data
      await kv.del(`user:${tokenData.userId}`);
      if (user.phone) {
        await kv.del(`user:phone:${user.phone}`);
      }
      if (user.email) {
        await kv.del(`user:email:${user.email}`);
      }
      
      // Delete all tokens for this user
      const tokens = await kv.getByPrefix(`token:`);
      for (const tokenEntry of tokens) {
        const tokenInfo = JSON.parse(tokenEntry);
        if (tokenInfo.userId === tokenData.userId) {
          const tokenKey = tokenEntry.split(':')[1];
          await kv.del(`token:${tokenKey}`);
        }
      }

      // Delete avatar from storage if exists
      if (user.avatar) {
        const bucketName = 'make-41f20081-avatars';
        const fileName = user.avatar.split('/').pop()?.split('?')[0];
        if (fileName) {
          await supabase.storage.from(bucketName).remove([fileName]);
        }
      }
    }

    // Delete deletion session
    await kv.del(`deletion:${sessionId}`);

    return c.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    return c.json({ error: 'Failed to delete account' }, 500);
  }
});

// Recover account (send recovery OTP)
app.post("/make-server-41f20081/auth/recover-account", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone) {
      return c.json({ error: 'Phone number is required' }, 400);
    }

    // Check if account exists
    const userDataStr = await kv.get(`user:phone:${phone}`);
    if (!userDataStr) {
      return c.json({ error: 'No account found with this phone number' }, 404);
    }

    const otpCode = generateOTP();
    const sessionId = generateSessionId();
    
    await kv.set(`recovery:${sessionId}`, JSON.stringify({
      phone,
      otpCode,
      createdAt: new Date().toISOString(),
    }), { expiresIn: 300 }); // 5 minutes

    const smsMessage = `Your EventConnect account recovery code is: ${otpCode}. Valid for 5 minutes.`;
    const smsSent = await sendSMS(phone, smsMessage);

    console.log(`Recovery OTP for ${phone}: ${otpCode}`);

    return c.json({
      sessionId,
      message: smsSent ? 'Recovery code sent to your phone' : 'Recovery code generated',
      ...(smsSent ? {} : { otpCode }),
    });
  } catch (error) {
    console.error('Error sending recovery OTP:', error);
    return c.json({ error: 'Failed to send recovery code' }, 500);
  }
});

// Verify recovery OTP
app.post("/make-server-41f20081/auth/verify-recovery", async (c) => {
  try {
    const { sessionId, otpCode, phone } = await c.req.json();
    
    if (!sessionId || !otpCode || !phone) {
      return c.json({ error: 'Session ID, OTP, and phone are required' }, 400);
    }

    const recoveryDataStr = await kv.get(`recovery:${sessionId}`);
    if (!recoveryDataStr) {
      return c.json({ error: 'Invalid or expired recovery session' }, 400);
    }

    const recoveryData = JSON.parse(recoveryDataStr);

    if (recoveryData.otpCode !== otpCode || recoveryData.phone !== phone) {
      return c.json({ error: 'Invalid recovery code' }, 400);
    }

    // Delete used recovery session
    await kv.del(`recovery:${sessionId}`);

    // Get user data
    const userDataStr = await kv.get(`user:phone:${phone}`);
    if (!userDataStr) {
      return c.json({ error: 'User not found' }, 404);
    }

    const user = JSON.parse(userDataStr);

    // Generate new access token
    const accessToken = generateAccessToken(user.id);
    await kv.set(`token:${accessToken}`, JSON.stringify({ userId: user.id }));

    return c.json({
      accessToken,
      userId: user.id,
      user,
      message: 'Account recovered successfully',
    });
  } catch (error) {
    console.error('Error verifying recovery:', error);
    return c.json({ error: 'Failed to verify recovery code' }, 500);
  }
});

Deno.serve(app.fetch);
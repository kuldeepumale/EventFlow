# EventConnect Authentication & Account Management

This document describes all authentication and account management features in EventConnect.

## 🔐 Features Overview

### 1. Mobile OTP Authentication
- Phone number-based login
- 6-digit OTP verification
- SMS delivery via Twilio (optional)
- Demo mode without SMS setup
- 5-minute OTP expiration

### 2. Social Login (OAuth)
- Google Sign-In
- Facebook Login
- GitHub Authentication
- Automatic account creation
- Profile data sync

### 3. Account Recovery
- Phone-based recovery
- OTP verification
- Secure session restoration
- Access to locked accounts

### 4. Account Management
- Profile editing (name, email)
- Avatar upload and management
- Account deletion with confirmation
- Secure data removal

---

## 📱 Mobile OTP Login

### User Flow:
1. Enter phone number
2. Receive OTP via SMS
3. Enter 6-digit code
4. Select user type (individual/corporate/vendor)
5. Access the app

### Demo Mode:
Without Twilio configuration:
- OTP appears in browser console
- Toast notification shows code
- All features work normally

### Production Mode:
With Twilio configured:
- Real SMS sent to phone
- No OTP displayed in UI
- Professional user experience

### Setup Instructions:
See [SMS_SETUP.md](./SMS_SETUP.md) for Twilio configuration

---

## 🌐 Social Login

### Supported Providers:
- **Google**: Most popular, high trust
- **Facebook**: Large user base
- **GitHub**: Developer-friendly

### Benefits:
- Faster onboarding
- No password management
- Auto-filled profile data
- Higher conversion rates

### User Flow:
1. Click "Continue with [Provider]"
2. Redirected to provider login
3. Authorize EventConnect
4. Account created automatically
5. Access the app

### Setup Instructions:
See [SOCIAL_LOGIN_SETUP.md](./SOCIAL_LOGIN_SETUP.md) for OAuth setup

---

## 🔄 Account Recovery

### When to Use:
- Lost phone access
- Forgot login details
- Locked out of account
- Need to verify identity

### Recovery Process:
1. Click "Can't access your account?"
2. Enter registered phone number
3. Receive recovery code via SMS
4. Enter 6-digit code
5. Access restored

### Security Features:
- OTP expires in 5 minutes
- One-time use codes
- Phone number verification
- Secure session creation

---

## 👤 Profile Management

### Editable Fields:
- **Full Name**: Display name throughout app
- **Email**: Optional, for notifications
- **Avatar**: Profile picture upload
- **Phone**: Read-only (identity verification)

### Avatar Upload:
- Supported formats: JPG, PNG, GIF, WebP
- Max size: 5MB
- Stored in Supabase Storage
- Private with signed URLs
- Automatic resizing (future)

### Profile Update Flow:
1. Click profile picture or "Edit Profile"
2. Update desired fields
3. Upload new avatar (optional)
4. Click "Save Changes"
5. Profile updated instantly

---

## 🗑️ Account Deletion

### Deletion Process:
1. Go to Profile → Edit Profile
2. Scroll to "Danger Zone"
3. Click "Delete Account"
4. Review what will be deleted
5. Confirm deletion intent
6. Receive OTP via SMS
7. Enter code to confirm
8. Account permanently deleted

### What Gets Deleted:
- ✅ User profile and avatar
- ✅ All favorites and preferences
- ✅ Booking history
- ✅ Messages and notifications
- ✅ All personal data
- ✅ Authentication tokens

### Security Measures:
- Double confirmation required
- OTP verification needed
- Irreversible action warning
- Immediate data removal
- No recovery possible

### Data Privacy:
- GDPR compliant
- Complete data erasure
- Avatar removed from storage
- All user tokens invalidated

---

## 🔒 Security Features

### OTP Security:
- 6-digit random codes
- 5-minute expiration
- One-time use only
- Session-based validation
- Rate limiting (recommended)

### Token Management:
- Unique access tokens
- Server-side validation
- Automatic expiration
- Secure storage in KV store

### Data Protection:
- All API calls authenticated
- Private storage buckets
- Signed URLs for images
- HTTPS only in production

### Best Practices:
- Never log sensitive data
- Rotate tokens regularly
- Monitor for suspicious activity
- Implement rate limiting
- Use environment variables

---

## 🛠️ Technical Implementation

### Backend Endpoints:

```typescript
// OTP Authentication
POST /auth/send-otp
POST /auth/verify-otp

// Social Login
POST /auth/social-login
GET /auth/social-callback

// Account Recovery
POST /auth/recover-account
POST /auth/verify-recovery

// Profile Management
GET /user/profile
PUT /user/profile
POST /user/upload-avatar

// Account Deletion
POST /user/request-deletion
DELETE /user/confirm-deletion
```

### Frontend Components:
- `LoginScreen.tsx`: Main authentication UI
- `SocialLogin.tsx`: OAuth provider buttons
- `AccountRecovery.tsx`: Recovery flow
- `ProfileSettings.tsx`: Profile editor
- `AccountDeletion.tsx`: Deletion flow

### Data Storage:

**Supabase KV Store:**
```
user:{userId} → User profile data
user:phone:{phone} → User lookup by phone
user:email:{email} → User lookup by email
token:{token} → Authentication tokens
otp:{sessionId} → Temporary OTP data
recovery:{sessionId} → Recovery sessions
deletion:{sessionId} → Deletion confirmations
```

**Supabase Storage:**
```
make-41f20081-avatars/
  ├── {userId}_{timestamp}.jpg
  ├── {userId}_{timestamp}.png
  └── ...
```

---

## 🧪 Testing

### Demo Mode Testing:
```bash
# Login Flow
1. Enter any phone: +1234567890
2. Check console for OTP
3. Enter OTP from console
4. Complete onboarding

# Recovery Flow
1. Click "Can't access your account?"
2. Enter phone used during signup
3. Check console for recovery code
4. Enter code to recover

# Account Deletion
1. Go to Profile → Edit Profile
2. Click "Delete Account"
3. Check console for deletion code
4. Enter code to confirm deletion
```

### Production Testing:
```bash
# With Twilio configured
1. Enter real phone number
2. Check phone for SMS
3. Enter received OTP
4. Complete flow

# Test each provider
- Google: Use Gmail account
- Facebook: Create test user
- GitHub: Use personal account
```

---

## 📊 Monitoring

### Key Metrics:
- Login success rate
- OTP delivery success
- Social login adoption
- Account recovery requests
- Account deletion rate

### Logs to Monitor:
- Failed OTP verifications
- SMS delivery failures
- OAuth callback errors
- Token validation failures
- Storage upload errors

### Recommended Tools:
- Supabase Dashboard (auth logs)
- Twilio Console (SMS logs)
- Application logs (errors)
- Analytics (user behavior)

---

## 🚀 Future Enhancements

### Planned Features:
- [ ] Email-based authentication
- [ ] Biometric login (Touch ID / Face ID)
- [ ] Two-factor authentication (2FA)
- [ ] Account linking (multiple methods)
- [ ] Remember device feature
- [ ] Magic links (passwordless)
- [ ] Push notification OTP
- [ ] Account export (GDPR)

### Improvements:
- [ ] Avatar image optimization
- [ ] Rate limiting implementation
- [ ] Session management dashboard
- [ ] Login history tracking
- [ ] Suspicious activity alerts
- [ ] Account freeze/suspend
- [ ] Bulk user management
- [ ] SSO for enterprise

---

## ❓ FAQ

### Q: Can users have multiple accounts?
A: Yes, but each phone number can only be registered once. Social login accounts with different emails are separate.

### Q: What happens if SMS fails?
A: In demo mode, OTP is shown in console. In production, implement retry mechanism and fallback methods.

### Q: Can deleted accounts be recovered?
A: No, deletion is permanent and irreversible. All data is immediately removed.

### Q: How long are sessions valid?
A: Tokens don't expire by default. Implement TTL in production for security.

### Q: Can users change their phone number?
A: Not currently. This would require building a number change flow with verification.

### Q: Is social login more secure than OTP?
A: Both are secure. OAuth delegates authentication to trusted providers. OTP requires SMS security.

### Q: What about GDPR compliance?
A: Account deletion feature provides GDPR-compliant data removal. Add privacy policy and cookie consent as needed.

---

## 📞 Support

For issues or questions:
1. Check setup guides (SMS_SETUP.md, SOCIAL_LOGIN_SETUP.md)
2. Review Supabase Auth docs
3. Check provider documentation
4. Inspect browser console for errors
5. Review server logs in Supabase

---

## 📝 License & Credits

Built with:
- **Supabase**: Authentication and storage
- **Twilio**: SMS delivery (optional)
- **React**: Frontend framework
- **Tailwind CSS**: Styling
- **ShadCN UI**: Component library

---

Last Updated: 2024
Version: 1.0

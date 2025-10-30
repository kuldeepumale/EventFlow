# Social Login Setup Guide

This guide explains how to enable Google, Facebook, and GitHub OAuth login for EventConnect.

## Overview

Social login is powered by Supabase Auth. Each provider requires configuration in both the provider's developer console and your Supabase project.

## Prerequisites

- Active Supabase project
- Access to provider developer consoles

---

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen:
   - User Type: External
   - App name: EventConnect
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: Web application
   - Name: EventConnect
   - Authorized redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
7. Save your **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Find **Google** and enable it
3. Enter your **Client ID** and **Client Secret**
4. Save changes

### 3. Test Google Login

- Click "Continue with Google" button
- Complete OAuth flow
- User will be automatically created

**Documentation**: [Supabase Google Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## Facebook OAuth Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Select **Consumer** as app type
4. Fill in app details:
   - App name: EventConnect
   - Contact email: your email
5. In the app dashboard, add **Facebook Login** product
6. Configure OAuth settings:
   - Valid OAuth Redirect URIs:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
7. Get your **App ID** and **App Secret** from **Settings** → **Basic**

### 2. Configure in Supabase

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Find **Facebook** and enable it
3. Enter your **Client ID** (App ID) and **Client Secret**
4. Save changes

### 3. Make App Public

1. In Facebook App dashboard, go to **Settings** → **Basic**
2. Switch app from **Development** to **Live** mode
3. Add **Privacy Policy URL** and **Terms of Service URL** (required for public apps)

**Documentation**: [Supabase Facebook Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-facebook)

---

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in app details:
   - Application name: EventConnect
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Generate a **Client Secret**
6. Save your **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Find **GitHub** and enable it
3. Enter your **Client ID** and **Client Secret**
4. Save changes

**Documentation**: [Supabase GitHub Auth Guide](https://supabase.com/docs/guides/auth/social-login/auth-github)

---

## How It Works

### Frontend Flow:
1. User clicks social login button (e.g., "Continue with Google")
2. App calls backend endpoint: `POST /auth/social-login`
3. Backend initiates OAuth flow with Supabase
4. User is redirected to provider's login page
5. After authentication, provider redirects back to app
6. Backend receives callback and creates/updates user
7. Access token is issued to frontend
8. User is logged in

### Backend Implementation:
```typescript
// Initiate OAuth
POST /make-server-41f20081/auth/social-login
Body: { provider: 'google' | 'facebook' | 'github' }

// Handle callback
GET /make-server-41f20081/auth/social-callback?code=...
```

### User Data Mapping:
- Google: name, email, avatar from `user_metadata`
- Facebook: name, email, avatar from `user_metadata`
- GitHub: username, email, avatar from `user_metadata`

---

## Security Considerations

### 1. Redirect URI Security
- Always use HTTPS in production
- Validate redirect URIs match exactly
- Never use wildcards in production

### 2. Scope Permissions
Only request necessary scopes:
- Google: `email`, `profile`
- Facebook: `email`, `public_profile`
- GitHub: `user:email`

### 3. State Parameter
- Supabase handles CSRF protection automatically
- Never disable state validation

### 4. Token Storage
- Access tokens stored securely via Supabase
- Never expose tokens in URLs or logs

---

## Testing

### Test Accounts
Create test accounts for each provider:
- Google: Use Gmail account
- Facebook: Use test users in App dashboard
- GitHub: Use personal GitHub account

### Demo Mode
Without provider setup:
- Buttons are visible but show setup instructions
- Users see toast notification about configuration
- Links to setup guides are provided

---

## Production Checklist

Before going live:

- [ ] All OAuth apps verified with providers
- [ ] Redirect URIs configured correctly
- [ ] App review completed (if required by provider)
- [ ] Privacy policy and terms of service published
- [ ] Test login flow with real accounts
- [ ] Monitor auth logs in Supabase dashboard
- [ ] Set up error tracking for auth failures
- [ ] Configure email templates in Supabase (for email-based recovery)

---

## Troubleshooting

### "Provider is not enabled" Error
**Solution**: Complete provider setup in Supabase dashboard

### Redirect URI Mismatch
**Solution**: Ensure redirect URI in provider console matches exactly:
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

### User Not Created
**Solution**: Check Supabase auth logs for errors

### Email Already in Use
**Solution**: User may have signed up with different method. Implement account linking.

---

## Multi-Provider Account Linking

Users can link multiple providers to one account:

1. User signs in with Google (account created)
2. Later signs in with Facebook using same email
3. Supabase can link accounts automatically (if enabled)

Configure in Supabase:
- Go to **Authentication** → **Settings**
- Enable **Automatically link accounts with same email**

---

## Rate Limits

### Provider Limits:
- **Google**: 10,000 requests/day (can request increase)
- **Facebook**: Varies by app review status
- **GitHub**: 5,000 requests/hour

### Supabase Limits:
- Free tier: 50,000 monthly active users
- Pro tier: 100,000 monthly active users

---

## Support Resources

- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth
- **Google OAuth**: https://developers.google.com/identity/protocols/oauth2
- **Facebook Login**: https://developers.facebook.com/docs/facebook-login
- **GitHub OAuth**: https://docs.github.com/en/developers/apps/building-oauth-apps

---

## Cost Analysis

### Free Tiers:
- **Supabase**: 50,000 MAU free
- **Google OAuth**: Free
- **Facebook Login**: Free
- **GitHub OAuth**: Free

### Paid Plans (if needed):
- **Supabase Pro**: $25/month (100,000 MAU)
- Provider OAuth services are typically free

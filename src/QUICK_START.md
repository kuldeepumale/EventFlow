# EventConnect - Quick Start Guide

Get your EventConnect app up and running in minutes!

## 🚀 Immediate Usage (Demo Mode)

The app works out of the box in **demo mode** without any configuration:

### What Works:
✅ Mobile OTP login (OTP shown in console)  
✅ Account recovery  
✅ Profile management  
✅ Avatar uploads  
✅ Account deletion  
✅ All vendor marketplace features  

### What You'll See:
- OTP codes appear in browser console
- Toast notifications show codes for 10 seconds
- Social login shows setup instructions

### Try It Now:
1. Open the app
2. Enter any phone number (e.g., +1234567890)
3. Click "Send OTP"
4. Check console for OTP code
5. Enter the code
6. Start using the app!

---

## 🔧 Production Setup (Optional)

### For Real SMS (Recommended for Production)

**Time Required:** 15 minutes  
**Cost:** Free tier available ($15 credit)

1. **Create Twilio Account**
   - Visit: https://www.twilio.com/try-twilio
   - Sign up and verify email
   - Get a phone number

2. **Get Credentials**
   - Account SID
   - Auth Token
   - Phone Number

3. **Add to Supabase**
   ```bash
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

📖 **Detailed Guide:** [SMS_SETUP.md](./SMS_SETUP.md)

---

### For Social Login (Optional)

**Time Required:** 30 minutes per provider  
**Cost:** Free

Enable login with Google, Facebook, or GitHub:

1. **Google OAuth**
   - Create project in Google Cloud Console
   - Get Client ID and Secret
   - Configure in Supabase

2. **Facebook Login**
   - Create app in Facebook Developers
   - Get App ID and Secret
   - Configure in Supabase

3. **GitHub OAuth**
   - Create OAuth app in GitHub
   - Get Client ID and Secret
   - Configure in Supabase

📖 **Detailed Guide:** [SOCIAL_LOGIN_SETUP.md](./SOCIAL_LOGIN_SETUP.md)

---

## 📖 Feature Documentation

### Authentication Features:
- [x] Mobile OTP Login
- [x] Social Login (Google/Facebook/GitHub)
- [x] Account Recovery
- [x] Profile Management
- [x] Avatar Upload
- [x] Account Deletion

📖 **Complete Reference:** [AUTHENTICATION_FEATURES.md](./AUTHENTICATION_FEATURES.md)

---

## 🧪 Testing Guide

### Demo Mode Testing:

**Login Flow:**
```
1. Enter phone: +1234567890
2. Console shows: "OTP for +1234567890: 123456"
3. Toast shows: "Demo OTP: 123456"
4. Enter OTP: 123456
5. Login successful!
```

**Recovery Flow:**
```
1. Click "Can't access your account?"
2. Enter phone: +1234567890
3. Console shows recovery code
4. Enter code to recover account
```

**Account Deletion:**
```
1. Profile → Edit Profile
2. Danger Zone → Delete Account
3. Confirm action
4. Console shows deletion code
5. Enter code to delete
```

---

## 🏗️ Project Structure

```
/components
  ├── LoginScreen.tsx          # Main login UI
  ├── SocialLogin.tsx          # OAuth buttons
  ├── AccountRecovery.tsx      # Recovery flow
  ├── ProfileSettings.tsx      # Profile editor
  └── AccountDeletion.tsx      # Deletion flow

/supabase/functions/server
  └── index.tsx                # Backend API

/types
  └── index.ts                 # TypeScript types

Documentation:
  ├── QUICK_START.md           # This file
  ├── SMS_SETUP.md             # Twilio configuration
  ├── SOCIAL_LOGIN_SETUP.md    # OAuth setup
  └── AUTHENTICATION_FEATURES.md # Complete reference
```

---

## 🎯 User Flows

### New User Journey:
```
Login Screen
  ↓
Enter Phone
  ↓
Verify OTP
  ↓
Select User Type
  ↓
[Individual/Corporate] → Main App
[Vendor] → Vendor Onboarding → Vendor Dashboard
```

### Existing User Journey:
```
Login Screen
  ↓
Enter Phone
  ↓
Verify OTP
  ↓
Main App (user type remembered)
```

### Recovery Journey:
```
Login Screen
  ↓
"Can't access account?"
  ↓
Enter Phone
  ↓
Verify Recovery Code
  ↓
Account Recovered → Main App
```

---

## 🔐 Security Notes

### Demo Mode:
- ⚠️ OTP codes visible in console
- ⚠️ Not suitable for production
- ✅ Perfect for development/testing
- ✅ All features fully functional

### Production Mode:
- ✅ SMS sent via Twilio
- ✅ OTP codes never exposed
- ✅ Secure authentication
- ✅ Professional experience

---

## 💡 Pro Tips

### Development:
1. Keep console open to see OTP codes
2. Use consistent test phone numbers
3. Clear browser storage if needed
4. Check Supabase logs for errors

### Production:
1. Set up Twilio for SMS
2. Configure at least one OAuth provider
3. Implement rate limiting
4. Monitor authentication logs
5. Set up error tracking

---

## 🐛 Troubleshooting

### OTP Not Showing:
- ✅ Check browser console
- ✅ Look for toast notifications
- ✅ Verify network tab for API calls

### Login Not Working:
- ✅ Check Supabase project is active
- ✅ Verify environment variables
- ✅ Check browser console for errors
- ✅ Try different phone format

### Avatar Upload Failing:
- ✅ File size under 5MB
- ✅ Image format supported
- ✅ Check Supabase storage bucket exists

### Social Login Not Working:
- ✅ Provider needs configuration
- ✅ Check setup documentation
- ✅ Verify redirect URIs match

---

## 📈 Next Steps

After getting started:

1. **Customize Branding**
   - Update colors in globals.css
   - Replace logo and icons
   - Modify welcome messages

2. **Add Vendor Data**
   - Import real vendor profiles
   - Connect to database
   - Enable real bookings

3. **Production Checklist**
   - [ ] Configure Twilio for SMS
   - [ ] Set up OAuth providers
   - [ ] Implement rate limiting
   - [ ] Add privacy policy
   - [ ] Set up analytics
   - [ ] Configure error tracking
   - [ ] Test all flows thoroughly

4. **Launch Preparation**
   - [ ] Domain setup
   - [ ] SSL certificate
   - [ ] App store submission
   - [ ] Marketing materials
   - [ ] Customer support plan

---

## 💬 Support

Need help? Check these resources:

1. **Documentation**
   - SMS Setup: [SMS_SETUP.md](./SMS_SETUP.md)
   - Social Login: [SOCIAL_LOGIN_SETUP.md](./SOCIAL_LOGIN_SETUP.md)
   - Features: [AUTHENTICATION_FEATURES.md](./AUTHENTICATION_FEATURES.md)

2. **External Resources**
   - Supabase Docs: https://supabase.com/docs
   - Twilio Docs: https://www.twilio.com/docs
   - React Docs: https://react.dev

3. **Community**
   - Supabase Discord
   - Stack Overflow
   - GitHub Issues

---

## ✨ Features at a Glance

| Feature | Demo Mode | Production | Setup Time |
|---------|-----------|------------|------------|
| Mobile OTP Login | ✅ (Console) | ✅ (SMS) | 0 / 15 min |
| Social Login | ⚠️ (Setup Msg) | ✅ (OAuth) | 30 min |
| Account Recovery | ✅ (Console) | ✅ (SMS) | 0 / 15 min |
| Profile Management | ✅ | ✅ | 0 min |
| Avatar Upload | ✅ | ✅ | 0 min |
| Account Deletion | ✅ (Console) | ✅ (SMS) | 0 / 15 min |

---

## 🎉 You're Ready!

Your EventConnect app is ready to use. Start exploring features in demo mode, or follow the setup guides to enable production features.

**Happy Building! 🚀**

---

Last Updated: 2024  
Version: 1.0

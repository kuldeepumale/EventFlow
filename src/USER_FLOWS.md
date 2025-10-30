# EventConnect - User Flow Diagrams

Visual representation of all authentication and account management flows.

---

## 🔐 Login Flow (Phone OTP)

```
┌─────────────────────────────────────────────────────────────┐
│                      LOGIN SCREEN                            │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  Welcome to EventConnect                       │         │
│  │  Enter your mobile number to get started      │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Phone Number: [+1 234 567 8900          ]  📱             │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │          [Send OTP]                            │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ─────────────── Or continue with ───────────────           │
│                                                              │
│  [🔵 Google]  [📘 Facebook]  [⚫ GitHub]                    │
│                                                              │
│  Can't access your account?                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
                   Click "Send OTP"
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                   OTP VERIFICATION                          │
│                                                              │
│  Enter OTP sent to +1 234 567 8900                         │
│  ← Change number                                            │
│                                                              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                     │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │                     │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                     │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │        [Verify & Continue]                     │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Resend OTP                                                 │
└─────────────────────────────────────────────────────────────┘
                        ↓
                  OTP Verified ✓
                        ↓
         ┌─────────────┴──────────────┐
         │    New User?    Existing?   │
         └─────────────┬──────────────┘
              ↓                    ↓
     ┌────────────────┐    ┌──────────────┐
     │  User Type     │    │   Main App   │
     │  Selection     │    │   (Home)     │
     └────────────────┘    └──────────────┘
              ↓
        ┌─────────┐
        │Main App │
        └─────────┘
```

---

## 🌐 Social Login Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   SOCIAL LOGIN BUTTONS                       │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  🔵 Continue with Google                       │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  📘 Continue with Facebook                     │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  ⚫ Continue with GitHub                       │         │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                        ↓
            Click Provider Button
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              PROVIDER LOGIN PAGE                            │
│         (Google / Facebook / GitHub)                        │
│                                                              │
│  Sign in with your [Provider] account                      │
│                                                              │
│  Email: [________________]                                  │
│  Password: [____________]                                   │
│                                                              │
│  [ Sign In ]                                                │
└─────────────────────────────────────────────────────────────┘
                        ↓
                 User Authenticates
                        ↓
┌─────────────────────────────────────────────────────────────┐
│            AUTHORIZATION CONSENT                            │
│                                                              │
│  EventConnect wants to:                                     │
│  ✓ Access your email address                               │
│  ✓ Access your basic profile info                          │
│  ✓ Access your profile picture                             │
│                                                              │
│  [ Cancel ]  [ Allow ]                                      │
└─────────────────────────────────────────────────────────────┘
                        ↓
                  User Allows
                        ↓
         ┌──────────────────────────┐
         │   Account Created/Found   │
         │   Profile Data Synced     │
         └──────────────────────────┘
                        ↓
              ┌──────────────┐
              │   Main App   │
              │   (Home)     │
              └──────────────┘
```

---

## 🔄 Account Recovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   LOGIN SCREEN                              │
│                                                              │
│  Can't access your account? ←─── Click                     │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                 ACCOUNT RECOVERY                            │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  🛡️  Account Recovery                          │         │
│  │  Enter your phone to recover account          │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ← Back to login                                            │
│                                                              │
│  Phone Number: [+1 234 567 8900          ]                 │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │      [Send Recovery Code]                      │         │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                        ↓
            Send Recovery Code Click
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              RECOVERY CODE ENTRY                            │
│                                                              │
│  Recovery Code sent to +1 234 567 8900                     │
│  ← Change number                                            │
│                                                              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                     │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │                     │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                     │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │         [Recover Account]                      │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Resend Code                                                │
└─────────────────────────────────────────────────────────────┘
                        ↓
                Code Verified ✓
                        ↓
         ┌──────────────────────────┐
         │   Account Recovered!     │
         │   New Token Generated    │
         └──────────────────────────┘
                        ↓
              ┌──────────────┐
              │   Main App   │
              │   (Home)     │
              └──────────────┘
```

---

## 👤 Profile Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN APP - HOME                          │
│                                                              │
│  Welcome back, John                                         │
│  📍 Downtown                          [👤 Avatar] ←─ Click  │
│                                                              │
│  OR                                                         │
│                                                              │
│  Profile Tab → Edit Profile Button                         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  EDIT PROFILE                               │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │        [Edit Profile]           [Cancel]       │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│       ┌──────────┐                                          │
│       │   👤📷   │  ← Click camera to upload                │
│       │  Avatar  │                                          │
│       └──────────┘                                          │
│                                                              │
│  Full Name *                                                │
│  [John Doe                              ]                   │
│                                                              │
│  Phone Number                                               │
│  [+1 234 567 8900                       ] 🔒                │
│  Phone number cannot be changed                             │
│                                                              │
│  Email (Optional)                                           │
│  [john@example.com                      ]                   │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │           [Save Changes]                       │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  ───────────────── Danger Zone ─────────────────           │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  🗑️  [Delete Account]                          │         │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                        ↓
                Click Save Changes
                        ↓
         ┌──────────────────────────┐
         │  Profile Updated! ✓      │
         │  Changes Saved           │
         └──────────────────────────┘
                        ↓
              Back to Main App
```

---

## 📸 Avatar Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  EDIT PROFILE                               │
│                                                              │
│       ┌──────────┐                                          │
│       │   👤📷   │  ← Click camera icon                     │
│       │  Avatar  │                                          │
│       └──────────┘                                          │
└─────────────────────────────────────────────────────────────┘
                        ↓
            File Picker Opens
                        ↓
┌─────────────────────────────────────────────────────────────┐
│               FILE PICKER DIALOG                            │
│                                                              │
│  Select an image file:                                      │
│                                                              │
│  📁 Documents                                               │
│  📁 Pictures                                                │
│     └─ vacation.jpg                                         │
│     └─ profile.png        ← Select                         │
│  📁 Downloads                                               │
│                                                              │
│  [Cancel]  [Open]                                           │
└─────────────────────────────────────────────────────────────┘
                        ↓
              File Selected
                        ↓
         ┌─��────────────────────────┐
         │    Validating File...    │
         │    • Type: ✓             │
         │    • Size: ✓ (< 5MB)     │
         └──────────────────────────┘
                        ↓
         ┌──────────────────────────┐
         │  Uploading to Storage... │
         │  ████████░░░░ 70%        │
         └──────────────────────────┘
                        ↓
         ┌──────────────────────────┐
         │   Upload Complete! ✓     │
         │   Generating URL...      │
         └──────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                  EDIT PROFILE                               │
│                                                              │
│       ┌──────────┐                                          │
│       │   😊     │  ← New avatar displayed                  │
│       │  Photo   │                                          │
│       └──────────┘                                          │
│                                                              │
│  Profile picture updated! ✅                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗑️ Account Deletion Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  EDIT PROFILE                               │
│                                                              │
│  ───────────────── Danger Zone ─────────────────           │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  🗑️  [Delete Account]                          │  ← Click│
│  └───────────���────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                 DELETE ACCOUNT                              │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │    ⚠️  This action cannot be undone             │         │
│  │                                                 │         │
│  │  All data will be permanently deleted:         │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  What will be deleted:                                      │
│  • Your profile information and avatar                      │
│  • All saved favorites                                      │
│  • Booking history and messages                             │
│  • All account preferences                                  │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │  🗑️  [Continue with Deletion]                  │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  [Cancel]                                                   │
└─────────────────────────────────────────────────────────────┘
                        ↓
           Click Continue
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              CONFIRMATION DIALOG                            │
│                                                              │
│  Are you absolutely sure?                                   │
│                                                              │
│  This will permanently delete your account                  │
│  and remove all your data from our servers.                │
│                                                              │
│  [Cancel]  [Yes, Delete My Account] ← Click                │
└─────────────────────────────────────────────────────────────┘
                        ↓
          Confirmed Deletion
                        ↓
         ┌──────────────────────────┐
         │  Sending Deletion Code   │
         │  via SMS...              │
         └──────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              CONFIRM DELETION                               │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │         ⚠️  Final Step                          │         │
│  │  Enter code to permanently delete account      │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Deletion Code:                                             │
│                                                              │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                     │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │                     │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                     │
│                                                              │
│  ┌────────────────────────────────────────────────┐         │
│  │        [Delete My Account]                     │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Resend Code   |   [Cancel]                                │
└─────────────────────────────────────────────────────────────┘
                        ↓
               Code Verified ✓
                        ↓
         ┌──────────────────────────┐
         │   Deleting Account...    │
         │   • Profile data         │
         │   • Avatar image         │
         │   • User tokens          │
         │   • Preferences          │
         └──────────────────────────┘
                        ↓
         ┌──────────────────────────┐
         │  Account Deleted! ✓      │
         │  Goodbye!                │
         └──────────────────────────┘
                        ↓
              ┌──────────────┐
              │ Login Screen │
              │ (Signed Out) │
              └──────────────┘
```

---

## 📊 State Diagram

```
                    ┌─────────────┐
                    │   Not       │
                    │Authenticated│
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
        ┌────▼───┐    ┌────▼────┐   ┌───▼──────┐
        │ Phone  │    │ Social  │   │ Recovery │
        │  OTP   │    │  Login  │   │   Flow   │
        └────┬───┘    └────┬────┘   └───┬──────┘
             │             │             │
             └─────────────┼─────────────┘
                           │
                    ┌──────▼──────┐
                    │Authenticated│
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
        ┌────▼───┐    ┌────▼────┐   ┌───▼──────┐
        │  Main  │    │ Profile │   │  Vendor  │
        │  App   │    │Settings │   │Dashboard │
        └────────┘    └────┬────┘   └──────────┘
                           │
                    ┌──────▼──────┐
                    │   Delete    │
                    │  Account    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Signed    │
                    │    Out      │
                    └─────────────┘
```

---

## 🔄 Data Flow

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP Request
       │ (with token)
       │
       ▼
┌─────────────────────┐
│   Backend Server    │
│   (Hono/Deno)       │
│                     │
│  ┌───────────────┐  │
│  │ Auth Verify   │  │
│  └───────┬───────┘  │
│          │          │
│          ▼          │
│  ┌───────────────┐  │
│  │ Business      │  │
│  │ Logic         │  │
│  └───────┬───────┘  │
│          │          │
└──────────┼──────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼             ▼
┌─────────┐  ┌──────────┐
│Supabase │  │Supabase  │
│KV Store │  │ Storage  │
│(User    │  │(Avatars) │
│ Data)   │  │          │
└─────────┘  └──────────┘
```

---

## 📱 App Navigation Flow

```
         ┌─────────────────────────┐
         │      Login Screen       │
         └───────────┬─────────────┘
                     │
                     ▼
         ┌─────────────────────────┐
         │   User Type Selector    │
         └───────────┬─────────────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│Individual│  │Corporate │  │  Vendor  │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     │             │             ▼
     │             │        ┌──────────┐
     │             │        │ Vendor   │
     │             │        │Onboarding│
     │             │        └────┬─────┘
     │             │             │
     └─────────────┼─────────────┘
                   │
                   ▼
        ┌────────────────────┐
        │    Main App        │
        │  ┌──────────────┐  │
        │  │   Bottom     │  │
        │  │ Navigation   │  │
        │  │──────────────│  │
        │  │Home│Search│  │  │
        │  │Fav │Profile│  │  │
        │  └──────────────┘  │
        └────────────────────┘
```

---

## 🎯 Decision Points

### Login Method Selection
```
User arrives at app
    │
    ├─ Has phone? → Use OTP Login
    │
    ├─ Prefers social? → Use OAuth Login
    │
    └─ Lost access? → Use Account Recovery
```

### User Type Impact
```
User Type Selected
    │
    ├─ Individual → Main App (All Features)
    │
    ├─ Corporate → Main App (Business Features)
    │
    └─ Vendor → Vendor Onboarding → Dashboard
```

### Profile Actions
```
Profile Tab
    │
    ├─ Edit Profile → Profile Settings Modal
    │
    ├─ Settings → App Settings
    │
    └─ Sign Out → Back to Login
```

---

**Note:** All flows support both demo mode (OTP in console) and production mode (SMS delivery) seamlessly.

---

Last Updated: 2024  
Version: 1.0

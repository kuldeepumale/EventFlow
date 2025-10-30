# SMS Integration Setup (Twilio)

This app supports real SMS OTP delivery via Twilio. Follow these steps to enable SMS functionality:

## Demo Mode (Current)
Without Twilio configuration, the app runs in **demo mode**:
- OTP codes are displayed in the browser console
- Toast notifications show the OTP code
- All authentication features work, but SMS is not sent

## Enable Real SMS with Twilio

### 1. Create a Twilio Account
1. Go to [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free account
3. Verify your email and phone number

### 2. Get Twilio Credentials
1. Go to your [Twilio Console](https://console.twilio.com/)
2. Find your **Account SID** and **Auth Token**
3. Get a [Twilio Phone Number](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)

### 3. Configure Environment Variables in Supabase

Add the following environment variables to your Supabase project:

```bash
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

#### How to Add Environment Variables:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Click on **Environment Variables**
4. Add each variable with its corresponding value

### 4. Restart the Edge Function
After adding the environment variables, restart the edge function:
```bash
supabase functions deploy server
```

## Testing

### Demo Mode Testing:
- OTP appears in console: `console.log('OTP for +1234567890: 123456')`
- Toast notification shows OTP for 10 seconds

### Production Mode Testing:
- SMS will be sent to the provided phone number
- Check your Twilio console for message logs
- Free trial accounts can only send to verified numbers

## Cost Considerations

### Twilio Pricing (as of 2024):
- **Trial Account**: Free with $15 credit
- **SMS (US/Canada)**: ~$0.0079 per message
- **International SMS**: Varies by country

### Monthly Estimates:
- 100 users signing up: ~$0.79
- 1,000 users: ~$7.90
- 10,000 users: ~$79.00

## Alternative SMS Providers

You can also use other SMS providers by modifying the `sendSMS` function in `/supabase/functions/server/index.tsx`:

### AWS SNS
- More complex setup but cheaper at scale
- Requires AWS account

### MessageBird
- Good international coverage
- Competitive pricing

### Vonage (formerly Nexmo)
- Simple API
- Good for global reach

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate credentials** regularly
4. **Monitor usage** in Twilio dashboard
5. **Set spending limits** to avoid unexpected charges
6. **Implement rate limiting** to prevent abuse

## Troubleshooting

### SMS Not Sending:
1. Check environment variables are set correctly
2. Verify Twilio phone number is SMS-enabled
3. Check Twilio console for error logs
4. Ensure phone number format is E.164 (+1234567890)

### Trial Account Limitations:
- Can only send to verified phone numbers
- Messages include "Sent from your Twilio trial account"
- Upgrade to remove restrictions

### Rate Limits:
- Implement rate limiting on your end
- Twilio has built-in limits for trial accounts
- Monitor for abuse

## Support

- Twilio Documentation: https://www.twilio.com/docs
- Twilio Support: https://support.twilio.com/

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Smartphone, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { SocialLogin } from './SocialLogin';
import { AccountRecovery } from './AccountRecovery';

interface LoginScreenProps {
  onLoginSuccess: (accessToken: string, userId: string, phone: string) => void;
}

type ViewType = 'login' | 'recovery';

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [view, setView] = useState<ViewType>('login');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Show recovery view
  if (view === 'recovery') {
    return (
      <AccountRecovery
        onRecoverySuccess={onLoginSuccess}
        onBack={() => setView('login')}
      />
    );
  }

  const handleSendOTP = async () => {
    // Validate phone number (basic validation)
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/auth/send-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ phone: phoneNumber }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setSessionId(data.sessionId);
      setStep('otp');
      toast.success(`OTP sent to ${phoneNumber}`);
      
      // For demo purposes, show the OTP in console (remove in production)
      if (data.otpCode) {
        console.log('Demo OTP Code:', data.otpCode);
        toast.info(`Demo OTP: ${data.otpCode}`, { duration: 10000 });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/auth/verify-otp`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            sessionId,
            otpCode: otp,
            phone: phoneNumber,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      toast.success('Login successful!');
      onLoginSuccess(data.accessToken, data.userId, phoneNumber);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid OTP');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    await handleSendOTP();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Smartphone className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-white mb-2">EventConnect</h1>
          <p className="text-purple-100">
            {step === 'phone' 
              ? 'Enter your mobile number to get started' 
              : 'Enter the OTP sent to your phone'}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {step === 'phone' ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  We'll send you a one-time password via SMS
                </p>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading || !phoneNumber}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  'Send OTP'
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                }}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change number
              </button>

              <div className="space-y-2">
                <Label>Enter OTP</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Sent to {phoneNumber}
                </p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Continue'
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* Social Login - only show on phone step */}
          {step === 'phone' && (
            <div className="mt-6">
              <SocialLogin onLoginSuccess={onLoginSuccess} />
            </div>
          )}

          {/* Account Recovery Link */}
          {step === 'phone' && (
            <div className="text-center mt-4">
              <button
                onClick={() => setView('recovery')}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Can't access your account?
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-purple-100 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

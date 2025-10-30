import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface AccountRecoveryProps {
  onRecoverySuccess: (accessToken: string, userId: string, phone: string) => void;
  onBack: () => void;
}

export function AccountRecovery({ onRecoverySuccess, onBack }: AccountRecoveryProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const handleSendRecoveryCode = async () => {
    const phoneRegex = /^\+?[1-9]\d{9,14}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/auth/recover-account`,
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
        if (response.status === 404) {
          throw new Error('No account found with this phone number');
        }
        throw new Error(data.error || 'Failed to send recovery code');
      }

      setSessionId(data.sessionId);
      setStep('otp');
      toast.success('Recovery code sent to your phone');

      if (data.otpCode) {
        console.log('Recovery OTP:', data.otpCode);
        toast.info(`Demo Recovery Code: ${data.otpCode}`, { duration: 10000 });
      }
    } catch (error) {
      console.error('Error sending recovery code:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send recovery code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRecovery = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/auth/verify-recovery`,
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
        throw new Error(data.error || 'Invalid recovery code');
      }

      toast.success('Account recovered successfully!');
      onRecoverySuccess(data.accessToken, data.userId, phoneNumber);
    } catch (error) {
      console.error('Error verifying recovery:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid recovery code');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-purple-600" />
          </div>
          <h1 className="text-white mb-2">Account Recovery</h1>
          <p className="text-purple-100">
            {step === 'phone'
              ? 'Enter your phone number to recover your account'
              : 'Enter the recovery code sent to your phone'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {step === 'phone' ? (
            <div className="space-y-6">
              <button
                onClick={onBack}
                className="flex items-center text-purple-600 hover:text-purple-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </button>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
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
                  We'll send a recovery code to this number
                </p>
              </div>

              <Button
                onClick={handleSendRecoveryCode}
                disabled={isLoading || !phoneNumber}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Recovery Code'
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
                <Label>Recovery Code</Label>
                <p className="text-sm text-gray-600 mb-4">Sent to {phoneNumber}</p>
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
                onClick={handleVerifyRecovery}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Recover Account'
                )}
              </Button>

              <div className="text-center">
                <button
                  onClick={handleSendRecoveryCode}
                  disabled={isLoading}
                  className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

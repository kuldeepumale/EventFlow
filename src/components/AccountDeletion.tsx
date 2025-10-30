import { useState } from 'react';
import { Button } from './ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Label } from './ui/label';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId } from '../utils/supabase/info';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface AccountDeletionProps {
  accessToken: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function AccountDeletion({ accessToken, onClose, onDeleted }: AccountDeletionProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [step, setStep] = useState<'confirm' | 'otp'>('confirm');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');

  const handleRequestDeletion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/user/request-deletion`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request account deletion');
      }

      setSessionId(data.sessionId);
      setStep('otp');
      setShowConfirmDialog(false);
      toast.success('Deletion code sent to your phone');

      if (data.otpCode) {
        console.log('Deletion OTP:', data.otpCode);
        toast.info(`Demo Deletion Code: ${data.otpCode}`, { duration: 10000 });
      }
    } catch (error) {
      console.error('Error requesting deletion:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to request deletion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeletion = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-41f20081/user/confirm-deletion`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            sessionId,
            otpCode: otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      toast.success('Account deleted successfully');
      onDeleted();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
          {step === 'confirm' ? (
            <>
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2>Delete Account</h2>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-900">
                      This action cannot be undone
                    </p>
                    <p className="text-sm text-red-700 mt-1">
                      All your data, including profile, favorites, and booking history will be
                      permanently deleted.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p>What will be deleted:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Your profile information and avatar</li>
                    <li>All saved favorites</li>
                    <li>Booking history and messages</li>
                    <li>All account preferences</li>
                  </ul>
                </div>

                <Button
                  onClick={() => setShowConfirmDialog(true)}
                  variant="destructive"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Continue with Deletion
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                <h2>Confirm Deletion</h2>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-2" />
                  <p className="text-red-900">
                    Final Step
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Enter the code sent to your phone to permanently delete your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Deletion Code</Label>
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
                  onClick={handleConfirmDeletion}
                  disabled={isLoading || otp.length !== 6}
                  variant="destructive"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting Account...
                    </>
                  ) : (
                    'Delete My Account'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    onClick={handleRequestDeletion}
                    disabled={isLoading}
                    className="text-sm text-purple-600 hover:text-purple-700 disabled:opacity-50"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove
              all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRequestDeletion}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Delete My Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card } from './ui/card';

interface EnvStatus {
  sms: boolean;
  socialLogin: {
    google: boolean;
    facebook: boolean;
    github: boolean;
  };
}

export function EnvironmentStatus() {
  const [isVisible, setIsVisible] = useState(false);

  // Toggle with keyboard shortcut (Cmd/Ctrl + Shift + E)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 z-50">
      <Card className="p-4 shadow-2xl border-2 border-purple-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm">Environment Status</h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          {/* SMS Status */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-700">SMS (Twilio)</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-orange-500" />
                Demo Mode
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              OTP codes shown in console
            </p>
            <a
              href="/SMS_SETUP.md"
              target="_blank"
              className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-1"
            >
              Setup Guide <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Social Login Status */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-700">Social Login</span>
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-orange-500" />
                Not Configured
              </Badge>
            </div>
            <div className="space-y-1 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-gray-400" />
                <span>Google OAuth</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-gray-400" />
                <span>Facebook Login</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-gray-400" />
                <span>GitHub OAuth</span>
              </div>
            </div>
            <a
              href="/SOCIAL_LOGIN_SETUP.md"
              target="_blank"
              className="text-xs text-purple-600 hover:underline flex items-center gap-1 mt-1"
            >
              Setup Guide <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Supabase Status */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-700">Supabase</span>
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                Connected
              </Badge>
            </div>
            <p className="text-xs text-gray-500">
              Database and storage active
            </p>
          </div>

          {/* Info */}
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500">
              <strong>Demo Mode:</strong> All features work, but OTP codes appear in console instead of SMS.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">⌘/Ctrl</kbd> + 
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">Shift</kbd> + 
              <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs ml-1">E</kbd> to toggle
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

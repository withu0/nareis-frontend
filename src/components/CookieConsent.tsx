import { useState, useEffect } from 'react';
import { Cookie, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookieConsent = () => {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShow(true);
    } else {
      const saved = localStorage.getItem('cookiePreferences');
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', 'customized');
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    setShow(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytics: true, marketing: true };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyEssential = { essential: true, analytics: false, marketing: false };
    savePreferences(onlyEssential);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  if (!show) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50 border-t-2 border-blue-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Cookie Preferences</h3>
                <p className="text-sm text-gray-300">
                  We use cookies to enhance your experience. Choose which cookies you accept.{' '}
                  <a href="/privacy-policy" className="underline hover:text-blue-400">Privacy Policy</a>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowSettings(true)} variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                <Settings className="w-4 h-4 mr-1" />
                Customize
              </Button>
              <Button onClick={handleRejectAll} variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white hover:text-gray-900">
                Reject All
              </Button>
              <Button onClick={handleAcceptAll} size="sm" className="bg-blue-600 hover:bg-blue-700">
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. Essential cookies are required for the site to function.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="flex items-start justify-between gap-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="font-semibold text-base">Essential Cookies</Label>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                </div>
                <p className="text-sm text-gray-600">
                  These cookies are necessary for the website to function and cannot be disabled. 
                  They enable core functionality such as security, authentication, and accessibility.
                </p>
              </div>
              <Switch checked={true} disabled className="mt-1" />
            </div>

            <div className="flex items-start justify-between gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <Label className="font-semibold text-base mb-2 block">Analytics Cookies</Label>
                <p className="text-sm text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously. This helps us improve our services.
                </p>
              </div>
              <Switch 
                checked={preferences.analytics} 
                onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                className="mt-1"
              />
            </div>

            <div className="flex items-start justify-between gap-4 p-4 border rounded-lg">
              <div className="flex-1">
                <Label className="font-semibold text-base mb-2 block">Marketing Cookies</Label>
                <p className="text-sm text-gray-600">
                  These cookies track your online activity to help advertisers deliver more relevant 
                  advertising or to limit how many times you see an ad. They may be set by us or third parties.
                </p>
              </div>
              <Switch 
                checked={preferences.marketing} 
                onCheckedChange={(checked) => setPreferences({ ...preferences, marketing: checked })}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button onClick={handleRejectAll} variant="outline">
              Reject All
            </Button>
            <Button onClick={handleSavePreferences} className="bg-blue-600 hover:bg-blue-700">
              Save Preferences
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

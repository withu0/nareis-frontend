import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export const TwoFactorSetup: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const secret = 'JBSWY3DPEHPK3PXP'; // Demo secret

  const handleCopy = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Secret copied!');
  };

  const handleVerify = () => {
    if (code.length === 6) {
      toast.success('2FA enabled successfully!');
      onComplete();
    } else {
      toast.error('Invalid code');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Enable Two-Factor Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Scan this QR code with your authenticator app or enter the secret manually.
        </p>
        <div className="flex items-center gap-2">
          <Input value={secret} readOnly />
          <Button size="icon" variant="outline" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <Input
          placeholder="Enter 6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
        />
        <Button onClick={handleVerify} className="w-full">Verify & Enable</Button>
      </CardContent>
    </Card>
  );
};

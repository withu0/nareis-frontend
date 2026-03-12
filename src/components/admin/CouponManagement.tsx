import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { adminAPI } from '@/lib/api';
import { toast } from 'sonner';
import { Tag, Plus, Ticket } from 'lucide-react';

type Coupon = {
  id: string;
  name?: string;
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  duration: string;
  durationInMonths?: number;
  timesRedeemed?: number;
  valid?: boolean;
};

type PromotionCode = {
  id: string;
  code: string;
  coupon: string;
  active: boolean;
  timesRedeemed?: number;
};

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [promotionCodes, setPromotionCodes] = useState<PromotionCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [createCouponOpen, setCreateCouponOpen] = useState(false);
  const [createPromoOpen, setCreatePromoOpen] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState<string>('');
  const [couponForm, setCouponForm] = useState({
    percentOff: '',
    amountOff: '',
    currency: 'usd',
    duration: 'once',
    durationInMonths: '',
    name: '',
    maxRedemptions: '',
    redeemBy: '',
  });
  const [promoForm, setPromoForm] = useState({ code: '', maxRedemptions: '', expiresAt: '' });

  const fetchCoupons = async () => {
    try {
      const res = await adminAPI.getCoupons();
      if (res.data) setCoupons(res.data);
    } catch {
      toast.error('Failed to load coupons');
    }
  };

  const fetchPromotionCodes = async () => {
    try {
      const res = await adminAPI.getPromotionCodes();
      if (res.data) setPromotionCodes(res.data);
    } catch {
      toast.error('Failed to load promotion codes');
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchCoupons(), fetchPromotionCodes()]);
      setLoading(false);
    };
    load();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const percentOff = couponForm.percentOff ? Number(couponForm.percentOff) : undefined;
    const amountOff = couponForm.amountOff ? Number(couponForm.amountOff) : undefined;
    if (percentOff == null && amountOff == null) {
      toast.error('Enter percent off or amount off');
      return;
    }
    try {
      await adminAPI.createCoupon({
        percentOff,
        amountOff,
        currency: couponForm.currency,
        duration: couponForm.duration,
        durationInMonths: couponForm.durationInMonths ? Number(couponForm.durationInMonths) : undefined,
        name: couponForm.name || undefined,
        maxRedemptions: couponForm.maxRedemptions ? Number(couponForm.maxRedemptions) : undefined,
        redeemBy: couponForm.redeemBy || undefined,
      });
      toast.success('Coupon created');
      setCreateCouponOpen(false);
      setCouponForm({ percentOff: '', amountOff: '', currency: 'usd', duration: 'once', durationInMonths: '', name: '', maxRedemptions: '', redeemBy: '' });
      fetchCoupons();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to create coupon');
    }
  };

  const handleCreatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCouponId || !promoForm.code.trim()) {
      toast.error('Select a coupon and enter a code');
      return;
    }
    try {
      await adminAPI.createPromotionCode(selectedCouponId, {
        code: promoForm.code.trim(),
        maxRedemptions: promoForm.maxRedemptions ? Number(promoForm.maxRedemptions) : undefined,
        expiresAt: promoForm.expiresAt || undefined,
      });
      toast.success('Promotion code created');
      setCreatePromoOpen(false);
      setPromoForm({ code: '', maxRedemptions: '', expiresAt: '' });
      setSelectedCouponId('');
      fetchPromotionCodes();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to create promotion code');
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('Deactivate this promotion code? It will no longer be usable.')) return;
    try {
      await adminAPI.deactivatePromotionCode(id);
      toast.success('Promotion code deactivated');
      fetchPromotionCodes();
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message || 'Failed to deactivate');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Coupons
          </CardTitle>
          <CardDescription>
            Create discount rules (e.g. 20% off or $50 off). Use 100% off for free registration. Then add promotion codes below so customers can enter them at checkout.
          </CardDescription>
          <Button onClick={() => setCreateCouponOpen(!createCouponOpen)} className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Create coupon
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {createCouponOpen && (
            <form onSubmit={handleCreateCoupon} className="p-4 border rounded-lg space-y-3 max-w-md">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Percent off (e.g. 20 or 100 for free)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="20"
                    value={couponForm.percentOff}
                    onChange={(e) => setCouponForm((f) => ({ ...f, percentOff: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Amount off (cents, e.g. 1000 = $10)</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="1000"
                    value={couponForm.amountOff}
                    onChange={(e) => setCouponForm((f) => ({ ...f, amountOff: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Duration</Label>
                <Select value={couponForm.duration} onValueChange={(v) => setCouponForm((f) => ({ ...f, duration: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="repeating">Repeating</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {couponForm.duration === 'repeating' && (
                <div>
                  <Label>Duration (months)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={couponForm.durationInMonths}
                    onChange={(e) => setCouponForm((f) => ({ ...f, durationInMonths: e.target.value }))}
                  />
                </div>
              )}
              <div>
                <Label>Name (optional)</Label>
                <Input value={couponForm.name} onChange={(e) => setCouponForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Launch discount" />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button type="button" variant="outline" onClick={() => setCreateCouponOpen(false)}>Cancel</Button>
              </div>
            </form>
          )}
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Discount</th>
                  <th className="p-2 text-left">Duration</th>
                  <th className="p-2 text-left">Redeemed</th>
                  <th className="p-2 text-left">Valid</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b">
                    <td className="p-2 font-mono text-xs">{c.id}</td>
                    <td className="p-2">{c.name || '-'}</td>
                    <td className="p-2">
                      {c.percentOff != null ? `${c.percentOff}% off` : c.amountOff != null ? `${((c.amountOff || 0) / 100).toFixed(2)} ${(c.currency || 'usd').toUpperCase()} off` : '-'}
                    </td>
                    <td className="p-2">{c.duration}{c.durationInMonths ? ` (${c.durationInMonths} mo)` : ''}</td>
                    <td className="p-2">{c.timesRedeemed ?? 0}</td>
                    <td className="p-2">{c.valid ? <Badge variant="default">Valid</Badge> : <Badge variant="secondary">Invalid</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {coupons.length === 0 && <p className="p-4 text-muted-foreground text-sm">No coupons yet. Create one above.</p>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Promotion codes
          </CardTitle>
          <CardDescription>
            Customer-facing codes (e.g. SAVE20, FREEREG) linked to a coupon. Users enter these at registration or upgrade checkout.
          </CardDescription>
          <Button onClick={() => setCreatePromoOpen(!createPromoOpen)} className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            Create promotion code
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {createPromoOpen && (
            <form onSubmit={handleCreatePromo} className="p-4 border rounded-lg space-y-3 max-w-md">
              <div>
                <Label>Coupon</Label>
                <Select value={selectedCouponId} onValueChange={setSelectedCouponId} required>
                  <SelectTrigger><SelectValue placeholder="Select coupon" /></SelectTrigger>
                  <SelectContent>
                    {coupons.filter((c) => c.valid !== false).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name || c.id} {c.percentOff != null ? `(${c.percentOff}% off)` : c.amountOff != null ? `(${((c.amountOff || 0) / 100).toFixed(2)} off)` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Code (e.g. SAVE20 or FREEREG)</Label>
                <Input
                  value={promoForm.code}
                  onChange={(e) => setPromoForm((f) => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))}
                  placeholder="SAVE20"
                  required
                />
              </div>
              <div>
                <Label>Max redemptions (optional)</Label>
                <Input
                  type="number"
                  min={1}
                  value={promoForm.maxRedemptions}
                  onChange={(e) => setPromoForm((f) => ({ ...f, maxRedemptions: e.target.value }))}
                />
              </div>
              <div>
                <Label>Expires at (optional)</Label>
                <Input
                  type="datetime-local"
                  value={promoForm.expiresAt ? promoForm.expiresAt.slice(0, 16) : ''}
                  onChange={(e) => setPromoForm((f) => ({ ...f, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create</Button>
                <Button type="button" variant="outline" onClick={() => setCreatePromoOpen(false)}>Cancel</Button>
              </div>
            </form>
          )}
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-2 text-left">Code</th>
                  <th className="p-2 text-left">Coupon</th>
                  <th className="p-2 text-left">Redeemed</th>
                  <th className="p-2 text-left">Active</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotionCodes.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="p-2 font-mono font-semibold">{p.code}</td>
                    <td className="p-2 font-mono text-xs">{p.coupon}</td>
                    <td className="p-2">{p.timesRedeemed ?? 0}</td>
                    <td className="p-2">{p.active ? <Badge variant="default">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</td>
                    <td className="p-2">
                      {p.active && (
                        <Button type="button" variant="outline" size="sm" onClick={() => handleDeactivate(p.id)}>
                          Deactivate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {promotionCodes.length === 0 && <p className="p-4 text-muted-foreground text-sm">No promotion codes yet. Create one above.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

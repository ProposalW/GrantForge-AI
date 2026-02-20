import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CreditCard, Lock, CheckCircle, Sparkles } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: 'monthly' | 'yearly';
}

export default function PaymentModal({ open, onOpenChange, plan }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const price = plan === 'monthly' ? 29 : 290;
  const period = plan === 'monthly' ? 'month' : 'year';
  const savings = plan === 'yearly' ? ' (Save $58)' : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !cardNumber || !expiry || !cvc || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
      toast.success('Payment successful! Welcome to Pro!');
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const resetForm = () => {
    setStep('details');
    setEmail('');
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="max-w-md bg-[#F6F4EF]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0B4D4A] text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            {step === 'success' ? 'Welcome to Pro!' : 'Upgrade to Pro'}
          </DialogTitle>
        </DialogHeader>

        {step === 'details' && (
          <div className="space-y-6">
            <div className="bg-[#D4A03A]/10 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-[#0B4D4A]">${price}<span className="text-lg font-normal text-[#0B4D4A]/60">/{period}</span></p>
              {savings && <p className="text-sm text-[#D4A03A] font-medium mt-1">{savings}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[#0B4D4A]">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#0B4D4A]">Cardholder Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#0B4D4A]">Card Number</Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="border-[#0B4D4A]/20 text-[#0B4D4A] pl-10"
                    required
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B4D4A]/40" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[#0B4D4A]">Expiry</Label>
                  <Input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="border-[#0B4D4A]/20 text-[#0B4D4A]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0B4D4A]">CVC</Label>
                  <div className="relative">
                    <Input
                      type="password"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="123"
                      maxLength={3}
                      className="border-[#0B4D4A]/20 text-[#0B4D4A] pl-10"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B4D4A]/40" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#0B4D4A]/60">
                <Lock className="w-3 h-3" />
                <span>Secure payment encrypted with SSL</span>
              </div>

              <Button
                type="submit"
                className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 py-6"
              >
                Pay ${price} / {period}
              </Button>
            </form>

            <p className="text-xs text-center text-[#0B4D4A]/60">
              By subscribing, you agree to our Terms of Service. Cancel anytime.
            </p>
          </div>
        )}

        {step === 'processing' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#D4A03A]/20 rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-8 h-8 text-[#D4A03A]" />
            </div>
            <p className="text-lg text-[#0B4D4A]">Processing payment...</p>
            <p className="text-sm text-[#0B4D4A]/60">Please do not close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <p className="text-xl text-[#0B4D4A] font-medium mb-2">Payment Successful!</p>
              <p className="text-[#0B4D4A]/70">Welcome to GrantForge Pro!</p>
            </div>
            <div className="bg-[#D4A03A]/10 p-4 rounded-lg text-left space-y-2">
              <p className="text-sm text-[#0B4D4A]"><strong>Plan:</strong> Pro ({plan})</p>
              <p className="text-sm text-[#0B4D4A]"><strong>Billed:</strong> ${price} / {period}</p>
              <p className="text-sm text-[#0B4D4A]"><strong>Email:</strong> {email}</p>
            </div>
            <Button
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
              className="w-full gf-btn bg-[#0B4D4A] text-[#F6F4EF] hover:bg-[#0B4D4A]/90"
            >
              Start Using Pro Features
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

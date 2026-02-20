import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ExternalLink, CheckCircle, Sparkles, Shield, Zap, Crown } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: 'monthly' | 'yearly';
}

const STRIPE_LINK = "https://buy.stripe.com/eVq5kFft89MG9gdc7H5os00";

export default function PaymentModal({ open, onOpenChange, plan }: PaymentModalProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const price = plan === 'monthly' ? 22 : 220;
  const period = plan === 'monthly' ? 'month' : 'year';
  const savings = plan === 'yearly' ? ' (Save £44)' : '';

  const handlePayment = () => {
    setIsRedirecting(true);
    toast.info('Redirecting to secure payment...');
    
    // Open Stripe payment link in new tab
    window.open(STRIPE_LINK, '_blank');
    
    setTimeout(() => {
      setIsRedirecting(false);
      onOpenChange(false);
    }, 1000);
  };

  const features = [
    'Unlimited document generation',
    'All 5 AI-powered templates',
    'Word, PDF & Excel exports',
    'Priority email support',
    'Advanced AI enhancements',
    'Custom branding options'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[#F6F4EF]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#0B4D4A] text-center" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
            Upgrade to Pro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Price Display */}
          <div className="bg-gradient-to-br from-[#D4A03A]/20 to-[#0B4D4A]/10 p-6 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-6 h-6 text-[#D4A03A]" />
              <span className="gf-label text-[#0B4D4A]">Pro Plan</span>
            </div>
            <p className="text-4xl font-bold text-[#0B4D4A]">
              £{price}<span className="text-lg font-normal text-[#0B4D4A]/60">/{period}</span>
            </p>
            {savings && (
              <p className="text-sm text-[#D4A03A] font-medium mt-1 bg-[#D4A03A]/20 inline-block px-3 py-1 rounded-full">
                {savings}
              </p>
            )}
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <p className="gf-label text-[#0B4D4A] text-sm">What you get:</p>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-[#0B4D4A]/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#D4A03A] flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-4 text-xs text-[#0B4D4A]/60">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Secure SSL</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>Instant Access</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Cancel Anytime</span>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isRedirecting}
            className="w-full gf-btn bg-[#D4A03A] text-[#0B4D4A] hover:bg-[#D4A03A]/90 py-6 text-base"
          >
            {isRedirecting ? (
              <>
                <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                Redirecting...
              </>
            ) : (
              <>
                Pay £{price} & Subscribe
                <ExternalLink className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-[#0B4D4A]/60">
            You'll be redirected to Stripe's secure payment page. 
            By subscribing, you agree to our Terms of Service.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

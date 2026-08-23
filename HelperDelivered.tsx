import { PartyPopper, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HelperDeliveredProps {
  onContinue: () => void;
  elderName: string;
}

export function HelperDelivered({ onContinue, elderName }: HelperDeliveredProps) {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-12 text-center animate-fadeUp">
      <div className="w-24 h-24 rounded-full bg-successLight flex items-center justify-center mx-auto mb-6">
        <PartyPopper className="w-12 h-12 text-success" strokeWidth={2.5} />
      </div>
      <h1 className="text-4xl font-extrabold text-ink leading-tight">Delivered!</h1>
      <p className="mt-4 text-xl text-muted font-bold">
        {elderName} has been notified. Thank you for helping.
      </p>
      <div className="mt-5 inline-flex items-center gap-2 text-success bg-successLight px-4 py-2 rounded-full text-sm font-bold">
        <Heart className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
        You made someone's day easier
      </div>
      <div className="mt-8">
        <Button size="xl" onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
}

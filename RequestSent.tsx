import { CheckCircle2, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface RequestSentProps {
  familyName: string;
  onBackHome: () => void;
}

export function RequestSent({ familyName, onBackHome }: RequestSentProps) {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-12 text-center animate-fadeUp">
      <div className="w-24 h-24 rounded-full bg-successLight flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-14 h-14 text-success" strokeWidth={2.5} />
      </div>
      <h1 className="text-4xl font-extrabold text-ink leading-tight">Request sent!</h1>
      <p className="mt-4 text-xl text-muted font-bold">
        {familyName} has been notified.
      </p>
      <p className="mt-2 text-base text-muted font-semibold">
        You'll know as soon as it's approved and on the way.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        <Button size="lg" variant="ghost" full onClick={onBackHome}>
          <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
          Back
        </Button>
        <Button size="xl" variant="primary" full onClick={onBackHome}>
          <Home className="w-6 h-6 mr-2" strokeWidth={2.5} />
          Back Home
        </Button>
      </div>
    </div>
  );
}

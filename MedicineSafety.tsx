import { Pill, ShieldCheck, UserCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MedicineSafetyProps {
  transcript: string;
  onSelectUsual: () => void;
  onSelectSomethingElse: () => void;
  onSelectAskChild: () => void;
}

export function MedicineSafety({
  transcript,
  onSelectUsual,
  onSelectSomethingElse,
  onSelectAskChild,
}: MedicineSafetyProps) {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 animate-fadeUp">
      <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-10 h-10 text-primary" strokeWidth={2.5} />
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight text-center">
        I want to make sure.
      </h1>
      <p className="mt-4 text-center text-lg text-muted font-semibold">
        You mentioned medicine. Which medicine do you mean?
      </p>
      <p className="mt-3 text-center text-base font-bold text-ink bg-primary-light rounded-2xl py-3 px-4">
        “{transcript}”
      </p>

      <div className="mt-8 space-y-3">
        <Button size="xl" full variant="primary" onClick={onSelectUsual}>
          <Pill className="w-6 h-6 mr-3" strokeWidth={2.5} />
          My usual medicine
        </Button>
        <Button size="xl" full variant="secondary" onClick={onSelectSomethingElse}>
          <HelpCircle className="w-6 h-6 mr-3" strokeWidth={2.5} />
          Something else
        </Button>
        <Button size="xl" full variant="ghost" onClick={onSelectAskChild}>
          <UserCheck className="w-6 h-6 mr-3" strokeWidth={2.5} />
          Ask my child
        </Button>
      </div>

      <p className="mt-8 text-center text-sm text-muted font-semibold flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.5} />
        We never guess about medicine.
      </p>
    </div>
  );
}

interface MedicineSomethingElseProps {
  onBack: () => void;
  onSubmit: (text: string) => void;
}

export function MedicineSomethingElse({ onBack, onSubmit }: MedicineSomethingElseProps) {
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 animate-fadeUp text-center">
      <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
        <Pill className="w-10 h-10 text-primary" strokeWidth={2.5} />
      </div>
      <h1 className="text-3xl font-extrabold text-ink leading-tight">
        Let's ask your child
      </h1>
      <p className="mt-4 text-lg text-muted font-semibold max-w-md mx-auto">
        To be safe, we'll let Sarah know you need medicine and ask her to confirm
        the details before anyone shops for it.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" variant="primary" onClick={() => onSubmit('I need my medicine')}>
          Send to Sarah
          <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
        </Button>
        <Button size="lg" variant="ghost" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}

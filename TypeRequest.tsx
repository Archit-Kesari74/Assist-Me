import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TypeRequestProps {
  onSubmit: (text: string) => void;
  onBack: () => void;
}

export function TypeRequest({ onSubmit, onBack }: TypeRequestProps) {
  const [text, setText] = useState('');

  const submit = () => {
    if (text.trim()) onSubmit(text.trim());
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 animate-fadeUp">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight text-center">
        Type what you need
      </h1>
      <p className="mt-3 text-lg text-muted font-semibold text-center">
        For example: “I need milk, bread and biscuits.”
      </p>

      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="I need..."
        className="mt-8 w-full text-xl font-semibold text-ink bg-white rounded-3xl p-6 shadow-soft border-2 border-black/[0.06] focus:border-primary focus:outline-none resize-none leading-relaxed"
      />

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <Button size="lg" variant="ghost" full onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
          Back
        </Button>
        <Button
          size="lg"
          variant="primary"
          full
          disabled={!text.trim()}
          onClick={submit}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}

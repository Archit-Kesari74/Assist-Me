import { useState } from 'react';
import { Check, RotateCcw, Sparkles, Clock, Pencil, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSpeechSynthesis } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import type { RequestCategory } from '@/types';

interface ConfirmRequestProps {
  title: string;
  description: string;
  category: RequestCategory;
  estimatedCost: number;
  onConfirm: (description: string) => void;
  onRetry: () => void;
}

export function ConfirmRequest({
  title,
  description,
  estimatedCost,
  onConfirm,
  onRetry,
}: ConfirmRequestProps) {
  const { speak, cancel } = useSpeechSynthesis();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(description);

  useEffect(() => {
    speak(`I understood: ${description}. ${title}. Estimated cost: ${estimatedCost} rupees.`);
    return () => cancel();
  }, [description, title, estimatedCost, speak, cancel]);

  const confirm = () => {
    cancel();
    onConfirm(draft.trim() || description);
  };

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 animate-fadeUp">
      <div className="flex items-center gap-2 text-primary font-bold justify-center">
        <Sparkles className="w-6 h-6" strokeWidth={2.5} />
        <span className="text-sm uppercase tracking-wide">I understood</span>
      </div>

      {editing ? (
        <>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold text-ink leading-tight text-center">
            Edit your request
          </h1>
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            className="mt-6 w-full text-xl font-semibold text-ink bg-white rounded-3xl p-6 shadow-soft border-2 border-black/[0.06] focus:border-primary focus:outline-none resize-none leading-relaxed"
          />
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <Button size="lg" variant="ghost" full onClick={() => setEditing(false)}>
              <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
              Back
            </Button>
            <Button size="lg" variant="primary" full onClick={() => setEditing(false)}>
              <Check className="w-5 h-5 mr-2" strokeWidth={2.5} />
              Done editing
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-ink leading-tight text-center">
            {description}
          </h1>

          <div className="mt-8 bg-white rounded-3xl shadow-soft border border-black/[0.04] p-7 sm:p-8 space-y-5">
            <Row label="Category">
              <span className="text-lg font-extrabold text-primary bg-primary-light px-4 py-1.5 rounded-full">
                {title}
              </span>
            </Row>
            <div className="h-px bg-black/[0.06]" />
            <Row label="Estimated cost">
              <span className="text-2xl font-extrabold text-ink">₹{estimatedCost}</span>
            </Row>
            <div className="h-px bg-black/[0.06]" />
            <Row label="Time">
              <span className="inline-flex items-center gap-2 text-base font-bold text-muted">
                <Clock className="w-5 h-5" strokeWidth={2.5} /> Just now
              </span>
            </Row>
          </div>

          {/* Edit + retry row */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 text-primary font-bold text-base hover:underline underline-offset-4"
            >
              <Pencil className="w-4 h-4" strokeWidth={2.5} />
              Edit the text
            </button>
            <span className="text-muted/40">·</span>
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 text-muted font-bold text-base hover:text-ink hover:underline underline-offset-4"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
              Start over
            </button>
          </div>

          <div className="mt-6">
            <Button size="xl" variant="success" full onClick={confirm}>
              <Check className="w-6 h-6 mr-2" strokeWidth={2.5} />
              YES, SEND IT
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-bold text-muted uppercase tracking-wide">
        {label}
      </span>
      {children}
    </div>
  );
}

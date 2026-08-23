import { History as HistoryIcon, Repeat, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import type { HelpRequest } from '@/types';
import { timeAgo } from '@/lib/timeAgo';

interface ElderHistoryProps {
  history: HelpRequest[];
  onRepeat: (request: HelpRequest) => void;
}

export function ElderHistory({ history, onRepeat }: ElderHistoryProps) {
  if (history.length === 0) return null;

  const completed = history.filter((h) => h.status === 'completed');

  return (
    <div className="mt-8 bg-white rounded-3xl shadow-soft border border-black/[0.04] p-6 sm:p-7">
      <div className="flex items-center gap-2 mb-4">
        <HistoryIcon className="w-5 h-5 text-primary" strokeWidth={2.5} />
        <p className="font-bold text-muted text-sm uppercase tracking-wide">
          Past help
        </p>
      </div>

      <ul className="space-y-3">
        {completed.slice(0, 4).map((req) => (
          <li
            key={req.id}
            className="flex items-center gap-3 bg-bg rounded-2xl p-3.5"
          >
            <span className="w-10 h-10 rounded-xl bg-successLight flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2.5} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-ink text-base truncate">
                {req.description}
              </p>
              <p className="text-sm font-semibold text-muted">
                {req.title} · {timeAgo(req.updatedAt)}
              </p>
            </div>
            <button
              onClick={() => onRepeat(req)}
              aria-label={`Request ${req.description} again`}
              className="inline-flex items-center gap-1.5 text-primary font-bold text-sm px-3 py-2 rounded-xl hover:bg-primary-light transition-colors shrink-0"
            >
              <Repeat className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Again</span>
              <ArrowRight className="w-4 h-4 sm:hidden" strokeWidth={2.5} />
            </button>
          </li>
        ))}
      </ul>

      {history.some((h) => h.status === 'rejected') && (
        <div className="mt-4 pt-4 border-t border-black/[0.06] flex items-center gap-2 text-muted text-sm font-semibold">
          <XCircle className="w-4 h-4" strokeWidth={2.5} />
          {history.filter((h) => h.status === 'rejected').length} declined by family
        </div>
      )}
    </div>
  );
}

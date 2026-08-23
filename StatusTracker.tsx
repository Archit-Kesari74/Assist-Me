import { Clock, Check, UserCheck, Truck, Package, CheckCircle2, XCircle } from 'lucide-react';
import type { RequestStatus } from '@/types';
import { STATUS_FLOW } from '@/lib/statusConfig';

const ICONS = {
  clock: Clock,
  check: Check,
  user: UserCheck,
  truck: Truck,
  package: Package,
  done: CheckCircle2,
  x: XCircle,
} as const;

interface StatusTrackerProps {
  status: RequestStatus;
}

const LABELS: Record<RequestStatus, string> = {
  pending_family: 'Waiting for family',
  approved: 'Approved',
  accepted: 'Helper found',
  on_the_way: 'On the way',
  picked_up: 'Picked up',
  completed: 'Delivered',
  rejected: 'Declined',
};

export function StatusTracker({ status }: StatusTrackerProps) {
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-3 text-error font-bold text-lg">
        <XCircle className="w-7 h-7" strokeWidth={2.5} />
        {LABELS.rejected}
      </div>
    );
  }

  const currentIndex = STATUS_FLOW.indexOf(status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <ol className="space-y-1">
      {STATUS_FLOW.map((s, i) => {
        const done = i < activeIndex;
        const active = i === activeIndex;
        const Icon = ICONS[
          s === 'completed'
            ? 'done'
            : s === 'approved'
            ? 'check'
            : s === 'accepted'
            ? 'user'
            : s === 'on_the_way'
            ? 'truck'
            : s === 'picked_up'
            ? 'package'
            : 'clock'
        ];
        return (
          <li key={s} className="flex items-center gap-3 py-1.5">
            <span
              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                done
                  ? 'bg-success text-white'
                  : active
                  ? 'bg-primary text-white shadow-ring'
                  : 'bg-bg text-muted border-2 border-black/[0.06]'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
            </span>
            <span
              className={`font-bold text-base ${
                done ? 'text-success' : active ? 'text-ink' : 'text-muted'
              }`}
            >
              {LABELS[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

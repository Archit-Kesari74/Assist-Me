import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, MapPin, User, X, AlertCircle } from 'lucide-react';
import { Button, Card } from '@/components/ui/Button';
import { StatusTracker } from '@/components/StatusTracker';
import type { HelpRequest } from '@/types';

interface FamilyHomeProps {
  request: HelpRequest | null;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export function FamilyHome({ request, onApprove, onReject }: FamilyHomeProps) {
  const [confirmApprove, setConfirmApprove] = useState(false);
  const [confirmReject, setConfirmReject] = useState(false);

  if (request && request.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 animate-fadeUp">
        <Header />
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-errorLight flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-9 h-9 text-error" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-ink">Request declined</h2>
          <p className="mt-3 text-muted font-semibold">
            {request.rejectReason ?? 'You declined this request.'}
          </p>
          <p className="mt-2 text-sm font-bold text-ink">
            Mom has been notified.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 animate-fadeUp">
      <Header />

      {/* Empty state */}
      {!request && (
        <Card className="p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-bg flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-muted" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-ink">No new requests</h2>
          <p className="mt-3 text-muted font-semibold">
            Mom hasn't asked for anything yet.
          </p>
        </Card>
      )}

      {/* Pending approval */}
      {request && request.status === 'pending_family' && (
        <>
          <Card className="p-7 sm:p-8">
            <div className="flex items-center gap-2 text-success font-bold text-sm mb-4">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
              Family request
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
              Mom needs {request.title.toLowerCase()}
            </h2>
            <p className="mt-3 text-xl text-ink font-bold leading-relaxed">
              {request.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Meta icon={Clock} label="Estimated cost" value={`₹${request.estimatedCost}`} />
              <Meta icon={MapPin} label="Location" value={request.location ?? "Mary's home"} />
            </div>

            <div className="mt-7 pt-6 border-t border-black/[0.06] flex items-center gap-2 text-muted text-sm font-bold">
              <User className="w-4 h-4" strokeWidth={2.5} />
              From Mom · Just now
            </div>
          </Card>

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <Button size="xl" variant="success" full onClick={() => setConfirmApprove(true)}>
              <CheckCircle2 className="w-6 h-6 mr-2" strokeWidth={2.5} />
              APPROVE
            </Button>
            <Button size="xl" variant="danger" full onClick={() => setConfirmReject(true)}>
              <XCircle className="w-6 h-6 mr-2" strokeWidth={2.5} />
              REJECT
            </Button>
          </div>
        </>
      )}

      {/* Approved/in-progress */}
      {request && request.status !== 'pending_family' && request.status !== 'rejected' && (
        <Card className="p-7 sm:p-8">
          <div className="flex items-center gap-2 text-success font-bold text-sm mb-4">
            <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
            Approved
          </div>
          <h2 className="text-2xl font-extrabold text-ink leading-tight">
            Mom needs {request.title.toLowerCase()}
          </h2>
          <p className="mt-3 text-lg text-ink font-bold">{request.description}</p>
          <p className="mt-4 text-base text-muted font-semibold">
            {request.helper} is handling this. You'll be notified when it's
            delivered.
          </p>
          <div className="mt-6 pt-5 border-t border-black/[0.06]">
            <StatusTracker status={request.status} />
          </div>
        </Card>
      )}

      {/* Approve confirmation modal */}
      {confirmApprove && request && (
        <Modal onClose={() => setConfirmApprove(false)}>
          <h2 className="text-2xl font-extrabold text-ink">Approve this request?</h2>
          <p className="mt-4 text-lg font-bold text-ink">{request.description}</p>
          <p className="mt-2 text-muted font-semibold">
            Estimated cost: ₹{request.estimatedCost}
          </p>
          <div className="mt-7 grid sm:grid-cols-2 gap-3">
            <Button size="lg" variant="ghost" full onClick={() => setConfirmApprove(false)}>
              CANCEL
            </Button>
            <Button
              size="lg"
              variant="success"
              full
              onClick={() => {
                setConfirmApprove(false);
                onApprove();
              }}
            >
              APPROVE & FIND HELPER
            </Button>
          </div>
        </Modal>
      )}

      {/* Reject confirmation modal */}
      {confirmReject && request && (
        <RejectModal
          onClose={() => setConfirmReject(false)}
          onConfirm={(reason) => {
            setConfirmReject(false);
            onReject(reason);
          }}
        />
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
        Sarah's Requests
      </h1>
      <p className="mt-1.5 text-lg font-bold text-muted">Requests from Mom</p>
    </div>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-bg rounded-2xl p-4">
      <div className="flex items-center gap-2 text-muted text-xs font-bold uppercase tracking-wide">
        <Icon className="w-4 h-4" strokeWidth={2.5} />
        {label}
      </div>
      <p className="mt-1.5 text-lg font-extrabold text-ink">{value}</p>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6 animate-soften">
      <div className="bg-white rounded-3xl shadow-soft p-7 w-full max-w-md animate-fadeUp relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-bg flex items-center justify-center text-muted"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>
        {children}
      </div>
    </div>
  );
}

function RejectModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const reasons = ['Too expensive', "I'll handle it", 'Not needed', 'Ask Mom'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6 animate-soften">
      <div className="bg-white rounded-3xl shadow-soft p-7 w-full max-w-md animate-fadeUp relative">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-bg flex items-center justify-center text-muted"
        >
          <X className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2 text-error font-bold text-sm mb-3">
          <AlertCircle className="w-5 h-5" strokeWidth={2.5} />
          Rejecting request
        </div>
        <h2 className="text-2xl font-extrabold text-ink leading-tight">
          Why are you rejecting this?
        </h2>
        <div className="mt-5 space-y-2.5">
          {reasons.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold text-base transition-all border-2 ${
                reason === r
                  ? 'bg-errorLight border-error text-error'
                  : 'bg-bg border-transparent text-ink hover:border-black/10'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          <Button size="lg" variant="ghost" full onClick={onClose}>
            CANCEL
          </Button>
          <Button
            size="lg"
            variant="danger"
            full
            disabled={!reason}
            onClick={() => reason && onConfirm(reason)}
          >
            CONFIRM REJECT
          </Button>
        </div>
      </div>
    </div>
  );
}

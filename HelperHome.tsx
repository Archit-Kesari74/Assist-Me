import { Package, MapPin, UserCheck, Truck, PackageCheck, CheckCircle2, ClipboardList } from 'lucide-react';
import { Button, Card } from '@/components/ui/Button';
import type { HelpRequest } from '@/types';

interface HelperHomeProps {
  request: HelpRequest | null;
  deliveries: number;
  onAccept: () => void;
  onOnMyWay: () => void;
  onPickedUp: () => void;
  onDelivered: () => void;
}

export function HelperHome({
  request,
  deliveries,
  onAccept,
  onOnMyWay,
  onPickedUp,
  onDelivered,
}: HelperHomeProps) {
  // No approved task available
  const hasTask =
    request &&
    request.status !== 'rejected' &&
    request.status !== 'pending_family' &&
    request.status !== 'completed';

  if (!hasTask) {
    const completed = request && request.status === 'completed';
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 animate-fadeUp">
        <Header deliveries={deliveries} />
        {completed ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-successLight flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-9 h-9 text-success" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-extrabold text-ink">Task completed</h2>
            <p className="mt-3 text-muted font-semibold">
              You delivered {request?.description}. Great work!
            </p>
          </Card>
        ) : (
          <Card className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-bg flex items-center justify-center mx-auto mb-5">
              <ClipboardList className="w-8 h-8 text-muted" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-extrabold text-ink">No tasks available</h2>
            <p className="mt-3 text-muted font-semibold">
              Approved requests will appear here.
            </p>
          </Card>
        )}
      </div>
    );
  }

  const status = request!.status;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 animate-fadeUp">
      <Header deliveries={deliveries} />

      <Card className="p-7 sm:p-8">
        <div className="flex items-center gap-2 text-primary font-bold text-sm mb-4">
          <UserCheck className="w-5 h-5" strokeWidth={2.5} />
          {status === 'approved' ? 'New task available' : 'Your active task'}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
          {request!.title === 'Groceries'
            ? 'Grocery delivery'
            : request!.title === 'A Ride'
            ? 'Ride request'
            : request!.title === 'Help at Home'
            ? 'Home help'
            : request!.title === 'Medicine'
            ? 'Medicine delivery'
            : 'Help request'}
        </h2>
        <p className="mt-3 text-xl text-ink font-bold leading-relaxed">
          {request!.description}
        </p>

        <div className="mt-6 space-y-3">
          <Row icon={UserCheck} label="Approved by" value={request!.family} />
          <Row icon={MapPin} label="Location" value={request!.location ?? "Mary's home"} />
          <Row icon={Package} label="Estimated value" value={`₹${request!.estimatedCost}`} />
        </div>
      </Card>

      {/* Action area */}
      <div className="mt-6">
        {status === 'approved' && (
          <Button size="xl" variant="primary" full onClick={onAccept}>
            <CheckCircle2 className="w-6 h-6 mr-2" strokeWidth={2.5} />
            ACCEPT TASK
          </Button>
        )}
        {status === 'accepted' && (
          <ActionBanner
            icon={CheckCircle2}
            title="Task accepted"
            subtitle={`${request!.elder}'s request is assigned to you.`}
            buttonLabel="I'M ON MY WAY"
            iconColor="bg-primary-light text-primary"
            onAction={onOnMyWay}
          />
        )}
        {status === 'on_the_way' && (
          <ActionBanner
            icon={Truck}
            title="On the way"
            subtitle="Let Mary know when you've picked up the items."
            buttonLabel="I'VE PICKED IT UP"
            iconColor="bg-primary-light text-primary"
            onAction={onPickedUp}
          />
        )}
        {status === 'picked_up' && (
          <ActionBanner
            icon={PackageCheck}
            title="Picked up"
            subtitle="All set. Confirm delivery when you've handed it over."
            buttonLabel="I'VE DELIVERED IT"
            iconColor="bg-successLight text-success"
            onAction={onDelivered}
          />
        )}
      </div>
    </div>
  );
}

function Header({ deliveries }: { deliveries: number }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
        Helper Tasks
      </h1>
      <div className="mt-1.5 flex items-center gap-2">
        <p className="text-lg font-bold text-muted">Alex · Trusted helper</p>
        {deliveries > 0 && (
          <span className="inline-flex items-center gap-1 text-success bg-successLight px-2.5 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
            {deliveries} {deliveries === 1 ? 'delivery' : 'deliveries'}
          </span>
        )}
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 bg-bg rounded-2xl p-4">
      <span className="flex items-center gap-2 text-muted text-sm font-bold uppercase tracking-wide">
        <Icon className="w-4 h-4" strokeWidth={2.5} />
        {label}
      </span>
      <span className="text-lg font-extrabold text-ink text-right">{value}</span>
    </div>
  );
}

function ActionBanner({
  icon: Icon,
  title,
  subtitle,
  buttonLabel,
  iconColor,
  onAction,
}: {
  icon: typeof Truck;
  title: string;
  subtitle: string;
  buttonLabel: string;
  iconColor: string;
  onAction: () => void;
}) {
  return (
    <Card className="p-6 sm:p-7 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${iconColor}`}>
        <Icon className="w-9 h-9" strokeWidth={2.5} />
      </div>
      <h2 className="text-2xl font-extrabold text-ink">{title}</h2>
      <p className="mt-2 text-muted font-semibold">{subtitle}</p>
      <div className="mt-6">
        <Button size="xl" variant="primary" full onClick={onAction}>
          {buttonLabel}
        </Button>
      </div>
    </Card>
  );
}

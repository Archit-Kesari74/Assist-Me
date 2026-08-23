import { useEffect, useState } from 'react';
import { Phone, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CallChildModalProps {
  name: string;
  relation: string;
  onClose: () => void;
}

export function CallChildModal({ name, relation, onClose }: CallChildModalProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 animate-soften p-6">
      <div className="bg-white rounded-3xl shadow-soft p-8 w-full max-w-sm text-center animate-fadeUp">
        <p className="text-muted font-bold text-sm uppercase tracking-wide">
          Calling {name}...
        </p>
        <div className="my-8 relative inline-flex items-center justify-center">
          <span className="absolute w-28 h-28 rounded-full bg-primary/15 animate-pulseRing" />
          <span className="relative w-24 h-24 rounded-full bg-primary flex items-center justify-center shadow-mic">
            <Phone className="w-10 h-10 text-white" strokeWidth={2.5} fill="white" />
          </span>
        </div>
        <h2 className="text-2xl font-extrabold text-ink">{name}</h2>
        <p className="text-muted font-bold mt-1">{relation}</p>
        <p className="text-muted font-semibold mt-2 tabular-nums">
          {mm}:{ss}
        </p>

        <div className="mt-8">
          <Button size="lg" variant="danger" full onClick={onClose}>
            <PhoneOff className="w-5 h-5 mr-2" strokeWidth={2.5} />
            End Call
          </Button>
        </div>
      </div>
    </div>
  );
}

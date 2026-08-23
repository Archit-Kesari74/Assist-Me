import { useEffect } from 'react';
import { Search, CheckCircle2, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FamilyApprovingProps {
  onDone: () => void;
}

export function FamilyApproving({ onDone }: FamilyApprovingProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-12 text-center animate-fadeUp">
      <div className="w-20 h-20 rounded-full bg-successLight flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-11 h-11 text-success" strokeWidth={2.5} />
      </div>
      <h1 className="text-3xl font-extrabold text-ink">Request approved</h1>
      <p className="mt-4 text-xl text-muted font-bold flex items-center justify-center gap-2">
        <Search className="w-5 h-5 text-primary animate-pulse" strokeWidth={2.5} />
        Finding a trusted helper...
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm font-bold text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Truck className="w-4 h-4" strokeWidth={2.5} /> Matching nearby
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Package className="w-4 h-4" strokeWidth={2.5} /> Verified helpers
        </span>
      </div>
    </div>
  );
}

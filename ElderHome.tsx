import { useState } from 'react';
import { Mic, Volume2, Phone, ArrowRight, CheckCircle2, XCircle, ShoppingBag, Car, Home as HomeIcon, Pill, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSpeechSynthesis } from '@/hooks/useSpeech';
import { CallChildModal } from '@/components/elder/CallChildModal';
import { ElderHistory } from '@/components/elder/ElderHistory';
import type { HelpRequest } from '@/types';
import { StatusTracker } from '@/components/StatusTracker';

interface ElderHomeProps {
  request: HelpRequest | null;
  history: HelpRequest[];
  onSpeak: () => void;
  onType: () => void;
  onReadAloud: () => void;
  onNewRequest: () => void;
  onQuickHelp: (text: string) => void;
  onRepeat: (request: HelpRequest) => void;
}

const QUICK_HELP = [
  { icon: ShoppingBag, label: 'Groceries', text: 'I need groceries' },
  { icon: Car, label: 'A ride', text: 'I need a ride' },
  { icon: HomeIcon, label: 'Help at home', text: 'I need help at home' },
  { icon: Pill, label: 'Medicine', text: 'I need my medicine' },
];

export function ElderHome({
  request,
  history,
  onSpeak,
  onType,
  onReadAloud,
  onNewRequest,
  onQuickHelp,
  onRepeat,
}: ElderHomeProps) {
  const [calling, setCalling] = useState(false);
  const { speak, speaking, cancel } = useSpeechSynthesis();

  const handleReadAloud = () => {
    if (speaking) {
      cancel();
      onReadAloud();
      return;
    }
    const text = request
      ? `Your request: ${request.description}. Status: ${request.status.replace(/_/g, ' ')}`
      : 'Good morning Mary. What do you need help with? Just tap the microphone and tell me.';
    speak(text);
    onReadAloud();
  };

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  // Completed state — special celebratory screen
  if (request && request.status === 'completed') {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 animate-fadeUp">
        <div className="bg-white rounded-3xl shadow-soft border border-black/[0.04] p-8 sm:p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-successLight flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-success" strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
            Your request has arrived
          </h2>
          <p className="mt-4 text-xl text-ink font-bold leading-relaxed">
            {request.description}
          </p>
          <p className="mt-2 text-base text-muted font-semibold">
            It was delivered and your family has been notified.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 text-success bg-successLight px-4 py-2 rounded-full text-sm font-bold">
            <Heart className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />
            Delivered by {request.helper}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <TrustPill>Family approved</TrustPill>
            <TrustPill>Trusted helper</TrustPill>
            <TrustPill>Delivery confirmed</TrustPill>
          </div>

          <div className="mt-8">
            <Button size="xl" full onClick={onNewRequest}>
              Need something else? Tap here
            </Button>
          </div>
        </div>
        {calling && (
          <CallChildModal name="Sarah" relation="Daughter" onClose={() => setCalling(false)} />
        )}
      </div>
    );
  }

  // Rejected state
  if (request && request.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 animate-fadeUp">
        <div className="bg-white rounded-3xl shadow-soft border border-black/[0.04] p-8 sm:p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-errorLight flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-error" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
            Sarah has declined this request.
          </h2>
          {request.rejectReason && (
            <p className="mt-3 text-lg text-muted font-semibold">{request.rejectReason}</p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant="primary" full onClick={() => setCalling(true)}>
              <Phone className="w-5 h-5 mr-2" strokeWidth={2.5} />
              Call My Child
            </Button>
            <Button size="lg" variant="secondary" full onClick={onNewRequest}>
              Ask for something else
            </Button>
          </div>
        </div>
        {calling && (
          <CallChildModal name="Sarah" relation="Daughter" onClose={() => setCalling(false)} />
        )}
      </div>
    );
  }

  // Active request status
  if (request) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8 animate-fadeUp">
        <div className="bg-white rounded-3xl shadow-soft border border-black/[0.04] p-7 sm:p-9">
          <p className="text-sm font-bold text-muted uppercase tracking-wide">
            Your request
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-ink leading-tight">
            {request.description}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-primary bg-primary-light px-3 py-1 rounded-full">
              {request.title}
            </span>
            <span className="text-base font-bold text-muted">
              Estimated ₹{request.estimatedCost}
            </span>
          </div>

          <div className="mt-7 pt-6 border-t border-black/[0.06]">
            <StatusTracker status={request.status} />
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <Button size="lg" variant="secondary" full onClick={handleReadAloud}>
            <Volume2 className="w-5 h-5 mr-2" strokeWidth={2.5} />
            {speaking ? 'Stop Reading' : 'Read Aloud'}
          </Button>
          <Button size="lg" variant="ghost" full onClick={() => setCalling(true)}>
            <Phone className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Call My Child
          </Button>
        </div>
        {calling && (
          <CallChildModal name="Sarah" relation="Daughter" onClose={() => setCalling(false)} />
        )}
      </div>
    );
  }

  // Default — no active request
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-8">
      <div className="text-center animate-fadeUp">
        <p className="text-xl sm:text-2xl font-bold text-muted">{greeting}, Mary</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
          What do you need help with?
        </h1>
      </div>

      {/* Microphone */}
      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={onSpeak}
          aria-label="Tap to speak"
          className="relative group focus:outline-none"
        >
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulseRing group-hover:scale-105 transition-transform" />
          <span className="absolute inset-[-14px] rounded-full bg-primary/10" />
          <span className="relative w-[120px] h-[120px] rounded-full bg-primary flex items-center justify-center shadow-mic group-hover:bg-primary-dark group-active:scale-95 transition-all duration-200">
            <Mic className="w-12 h-12 text-white" strokeWidth={2.5} fill="white" />
          </span>
        </button>
        <p className="mt-6 text-xl font-extrabold text-ink">Tap to Speak</p>
      </div>

      {/* Quick help buttons — tap instead of speak */}
      <div className="mt-9">
        <p className="text-center font-bold text-muted text-sm uppercase tracking-wide mb-3">
          Or tap what you need:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_HELP.map(({ icon: Icon, label, text }) => (
            <button
              key={label}
              onClick={() => onQuickHelp(text)}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-soft border border-black/[0.04] hover:border-primary/30 hover:bg-primary-light/40 transition-all active:scale-[0.98] min-h-[64px]"
            >
              <span className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-primary" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold text-ink text-left">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-8 bg-white rounded-3xl shadow-soft border border-black/[0.04] p-6 sm:p-7">
        <p className="font-bold text-muted text-sm uppercase tracking-wide">
          You can say things like:
        </p>
        <ul className="mt-3 space-y-2.5">
          {['I need groceries.', 'I need help at home.', 'I need a ride.'].map((s) => (
            <li key={s} className="flex items-center gap-3 text-lg font-bold text-ink">
              <ArrowRight className="w-5 h-5 text-primary shrink-0" strokeWidth={2.5} />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Past help — tap to request again */}
      <ElderHistory history={history} onRepeat={onRepeat} />

      {/* Actions */}
      <div className="mt-5 grid sm:grid-cols-2 gap-3">
        <Button size="lg" variant="secondary" full onClick={handleReadAloud}>
          <Volume2 className="w-5 h-5 mr-2" strokeWidth={2.5} />
          {speaking ? 'Stop Reading' : 'Read Aloud'}
        </Button>
        <Button size="lg" variant="ghost" full onClick={() => setCalling(true)}>
          <Phone className="w-5 h-5 mr-2" strokeWidth={2.5} />
          Call My Child
        </Button>
      </div>

      {/* Fallback type entry */}
      <div className="mt-5 text-center">
        <button
          onClick={onType}
          className="text-primary font-bold text-base hover:underline underline-offset-4"
        >
          Or type what you need instead
        </button>
      </div>

      {calling && (
        <CallChildModal name="Sarah" relation="Daughter" onClose={() => setCalling(false)} />
      )}
    </div>
  );
}

function TrustPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-success bg-successLight px-4 py-2 rounded-full text-sm font-bold">
      <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
      {children}
    </span>
  );
}

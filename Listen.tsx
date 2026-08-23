import { useEffect, useState } from 'react';
import { Mic, Keyboard, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSpeechRecognition } from '@/hooks/useSpeech';

interface ListenProps {
  onResult: (transcript: string) => void;
  onTypeInstead: () => void;
  onBack: () => void;
}

export function Listen({ onResult, onTypeInstead, onBack }: ListenProps) {
  const [hadError, setHadError] = useState(false);
  const { supported, listening, interim, start, stop } = useSpeechRecognition({
    onResult: (t) => onResult(t),
    onError: () => setHadError(true),
  });

  const handleMic = () => {
    setHadError(false);
    if (listening) {
      stop();
    } else {
      start();
    }
  };

  // Auto-start listening when the screen opens (one less step for the elder)
  useEffect(() => {
    if (supported) {
      const t = setTimeout(() => start(), 500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [supported, start]);

  // If speech recognition unsupported, immediately offer typing
  if (!supported) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 text-center animate-fadeUp">
        <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-6">
          <Keyboard className="w-10 h-10 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-ink">Type what you need</h1>
        <p className="mt-3 text-lg text-muted font-semibold">
          Voice typing isn't available on this device, but you can still ask for
          help.
        </p>
        <div className="mt-8">
          <Button size="xl" full onClick={onTypeInstead}>
            Continue
          </Button>
        </div>
        <div className="mt-4">
          <Button size="md" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Error fallback — never show technical errors, just a friendly retry
  if (hadError && !listening) {
    return (
      <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10 text-center animate-fadeUp">
        <div className="w-20 h-20 rounded-full bg-errorLight flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-error" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-ink leading-tight">
          I couldn't hear you.
        </h1>
        <p className="mt-3 text-lg text-muted font-semibold">
          That's okay. Let's try again, or you can type it instead.
        </p>
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          <Button size="xl" variant="primary" full onClick={handleMic}>
            <Mic className="w-6 h-6 mr-2" strokeWidth={2.5} />
            Try Again
          </Button>
          <Button size="xl" variant="secondary" full onClick={onTypeInstead}>
            <Keyboard className="w-6 h-6 mr-2" strokeWidth={2.5} />
            Type Instead
          </Button>
        </div>
        <div className="mt-4">
          <Button size="md" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-6 py-10">
      <div className="text-center animate-fadeUp">
        <p className="text-xl font-bold text-primary">
          {listening ? "I'm listening..." : 'Tap the microphone'}
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-ink leading-tight">
          {listening ? 'Tell me what you need.' : 'I am ready when you are'}
        </h1>
      </div>

      {/* Microphone */}
      <div className="mt-10 flex flex-col items-center">
        <button
          onClick={handleMic}
          aria-label={listening ? 'Stop listening' : 'Start listening'}
          className="relative group focus:outline-none"
        >
          {listening && (
            <>
              <span className="absolute inset-0 rounded-full bg-error/25 animate-pulseRing" />
              <span className="absolute inset-[-18px] rounded-full bg-error/10 animate-pulseRing" style={{ animationDelay: '0.6s' }} />
            </>
          )}
          <span className="absolute inset-[-14px] rounded-full bg-primary/10" />
          <span
            className={`relative w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-mic transition-all duration-200 group-active:scale-95 ${
              listening ? 'bg-error' : 'bg-primary group-hover:bg-primary-dark'
            }`}
          >
            <Mic className="w-12 h-12 text-white" strokeWidth={2.5} fill="white" />
          </span>
        </button>
        <p className="mt-6 text-xl font-extrabold text-ink">
          {listening ? 'Listening... tap to stop' : 'Tap to Speak'}
        </p>
      </div>

      {/* Interim transcript */}
      {interim && (
        <div className="mt-8 bg-white rounded-3xl shadow-soft border border-black/[0.04] p-6 animate-soften">
          <p className="text-sm font-bold text-muted uppercase tracking-wide mb-2">
            I'm hearing:
          </p>
          <p className="text-xl font-bold text-ink leading-relaxed">{interim}</p>
        </div>
      )}

      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <Button size="lg" variant="secondary" full onClick={onTypeInstead}>
          <Keyboard className="w-5 h-5 mr-2" strokeWidth={2.5} />
          Type Instead
        </Button>
        <Button size="lg" variant="ghost" full onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
          Back
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState, useCallback } from 'react';

// Minimal typings for the Web Speech API (not in lib.dom by default)
interface SpeechRecognitionEventLike {
  results: {
    length: number;
    [index: number]: { 0: { transcript: string }; isFinal: boolean };
  };
  resultIndex: number;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getCtor() !== null;
}

export interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onError?: () => void;
}

export function useSpeechRecognition(opts: UseSpeechRecognitionOptions = {}) {
  const { onResult, onError } = opts;
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState('');
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  });

  const supported = getCtor() !== null;

  const start = useCallback(() => {
    const Ctor = getCtor();
    if (!Ctor) {
      onErrorRef.current?.();
      return;
    }
    try {
      const rec = new Ctor();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      rec.onstart = () => setListening(true);
      rec.onerror = () => {
        setListening(false);
        setInterim('');
        onErrorRef.current?.();
      };
      rec.onend = () => {
        setListening(false);
      };
      rec.onresult = (e) => {
        let text = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          text += r[0].transcript;
          if (r.isFinal) {
            const final = r[0].transcript.trim();
            setInterim('');
            if (final) {
              onResultRef.current?.(final);
            }
          } else {
            setInterim(text);
          }
        }
      };

      recRef.current = rec;
      rec.start();
    } catch {
      setListening(false);
      onErrorRef.current?.();
    }
  }, []);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  useEffect(() => {
    return () => {
      recRef.current?.abort();
    };
  }, []);

  return { supported, listening, interim, start, stop };
}

export interface UseSpeechSynthesisOptions {
  onEnd?: () => void;
}

export function useSpeechSynthesis(opts: UseSpeechSynthesisOptions = {}) {
  const [speaking, setSpeaking] = useState(false);
  const onEndRef = useRef(opts.onEnd);

  useEffect(() => {
    onEndRef.current = opts.onEnd;
  });

  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = 0.92;
        utter.pitch = 1;
        utter.onstart = () => setSpeaking(true);
        utter.onend = () => {
          setSpeaking(false);
          onEndRef.current?.();
        };
        utter.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utter);
      } catch {
        setSpeaking(false);
      }
    },
    [supported]
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
    setSpeaking(false);
  }, [supported]);

  return { supported, speaking, speak, cancel };
}

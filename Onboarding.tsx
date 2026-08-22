import { useState } from 'react'
import { Btn, PhoneShell } from '../components/UI'

interface Props { onDone: () => void }

export default function Onboarding({ onDone }: Props) {
  const [step, setStep] = useState(1)

  return (
    <div className="flex flex-col min-h-full">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-6 pb-2">
        {[1, 2, 3].map(n => (
          <div
            key={n}
            className={`h-2 rounded-full transition-all ${n === step ? 'w-8 bg-brand' : 'w-2 bg-border'}`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 animate-fade-up text-center">
          <div className="text-7xl mb-6">🫶</div>
          <h1 className="text-4xl font-bold text-ink mb-4">Welcome to Assist Me</h1>
          <p className="text-2xl text-ink-muted leading-relaxed mb-8">
            "Just tell us what you need."
          </p>
          <p className="text-xl text-ink-muted leading-relaxed mb-12">
            Speak your request. Your family approves. A trusted helper delivers.
          </p>
          <div className="w-full">
            <Btn onClick={() => setStep(2)} size="lg">
              Get Started
            </Btn>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col px-8 py-8 animate-fade-up">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">👨‍👩‍👧</div>
            <h2 className="text-3xl font-bold text-ink">Who helps you?</h2>
            <p className="text-xl text-ink-muted mt-2">Add a family member who approves your requests.</p>
          </div>

          <div className="bg-white border-2 border-border rounded-2xl p-5 mb-4">
            <p className="text-lg text-ink-muted mb-1">Your family member</p>
            <p className="text-2xl font-bold text-ink">Sarah — My Daughter</p>
          </div>

          <div className="bg-brand-soft border-2 border-brand/20 rounded-2xl p-5 mb-8 flex items-center gap-3">
            <span className="text-3xl">📱</span>
            <div>
              <p className="text-xl font-bold text-brand">Sarah gets notified</p>
              <p className="text-lg text-ink-muted">She'll approve or handle your requests.</p>
            </div>
          </div>

          <div className="mt-auto">
            <Btn onClick={() => setStep(3)} size="lg">
              That's My Family →
            </Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 animate-fade-up text-center">
          <div className="w-24 h-24 rounded-full bg-success-soft flex items-center justify-center mb-6 animate-check-pop">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <path d="M12 26L22 36L40 16" stroke="#18864B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-ink mb-4">You're ready!</h2>
          <p className="text-2xl text-ink-muted mb-3">
            Whenever you need something...
          </p>
          <div className="bg-brand-soft rounded-2xl px-6 py-4 mb-10">
            <p className="text-2xl font-bold text-brand">Tap the microphone.</p>
          </div>
          <div className="w-full">
            <Btn onClick={onDone} size="lg">
              Start →
            </Btn>
          </div>
        </div>
      )}
    </div>
  )
}

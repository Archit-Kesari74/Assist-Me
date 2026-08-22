import { useState, useRef, useEffect } from 'react'
import {
  Btn, MicButton, StatusBadge, SpeakBtn, Card, ItemsList, ElderlyNav, Header,
} from '../components/UI'
import type { AppState } from '../App'

// ── ElderlyHome ───────────────────────────────────────────────────────────────

export function ElderlyHome({ state }: { state: AppState }) {
  const { setScreen, requestStatus } = state
  const hasActiveRequest = requestStatus !== 'none' && requestStatus !== 'delivered'
  const [tab, setTab] = useState<'home' | 'requests' | 'help'>('home')

  const handleTabChange = (t: 'home' | 'requests' | 'help') => {
    setTab(t)
    if (t === 'requests') setScreen('elderly-status')
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Top bar */}
      <div className="px-6 pt-8 pb-4 bg-white border-b border-border">
        <p className="text-xl text-ink-muted">Good morning,</p>
        <h1 className="text-4xl font-bold text-ink">Mary 👋</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        {/* Active request banner */}
        {hasActiveRequest && (
          <div
            className="bg-brand-soft border-2 border-brand/20 rounded-3xl p-5 animate-fade-up cursor-pointer"
            onClick={() => setScreen('elderly-status')}
          >
            <p className="text-xl font-bold text-brand mb-1">Your request is being handled.</p>
            <p className="text-xl text-ink-muted mb-2">Milk + Bread + Biscuits</p>
            <StatusBadge
              label={
                requestStatus === 'pending' ? 'Waiting for Sarah' :
                requestStatus === 'approved' ? 'Approved' :
                requestStatus === 'helper-assigned' ? 'Helper assigned' :
                requestStatus === 'picked-up' ? 'On the way' : 'Approved'
              }
              color={requestStatus === 'pending' ? 'yellow' : requestStatus === 'approved' || requestStatus === 'helper-assigned' || requestStatus === 'picked-up' ? 'green' : 'blue'}
            />
            <p className="text-brand font-bold mt-3">Tap to see your request →</p>
          </div>
        )}

        {/* What do you need */}
        {!hasActiveRequest && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ink mb-1">What do you need</h2>
            <h2 className="text-3xl font-bold text-ink">help with?</h2>
          </div>
        )}

        {/* Mic */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <MicButton isListening={false} onClick={() => setScreen('elderly-listening')} />
            <p className="text-2xl font-bold text-brand">Tap to Speak</p>
          </div>
        </div>

        {/* Examples */}
        {!hasActiveRequest && (
          <div className="bg-white rounded-3xl p-5 border border-border">
            <p className="text-xl font-bold text-ink mb-3">You can say things like:</p>
            <div className="space-y-2">
              {[
                '"I need groceries."',
                '"I need my medicine."',
                '"I need someone to fix my fan."',
                '"I need a ride to the doctor."',
              ].map(ex => (
                <p key={ex} className="text-xl text-ink-muted">{ex}</p>
              ))}
            </div>
          </div>
        )}

        {/* Order usual button */}
        {requestStatus === 'delivered' && (
          <div className="bg-warn-soft rounded-3xl p-5 border border-warn/20 animate-fade-up">
            <p className="text-xl font-bold text-warn mb-1">Need your usual groceries?</p>
            <Btn variant="ghost" size="md" onClick={() => {
              state.setTranscript('I need milk, bread and biscuits.')
              setScreen('elderly-transcription')
            }}>
              📦 Order My Usual
            </Btn>
          </div>
        )}

        {/* No requests */}
        {requestStatus === 'none' && (
          <div className="text-center py-2">
            <p className="text-xl text-ink-muted">You have no active requests</p>
          </div>
        )}

        {/* Urgent help */}
        <div className="border-2 border-danger/30 rounded-3xl p-4">
          <Btn variant="danger" size="md" onClick={() => setScreen('elderly-urgent')}>
            🚨 I NEED URGENT HELP
          </Btn>
        </div>

        {/* Call child */}
        <Btn variant="ghost" size="lg" onClick={() => setScreen('elderly-call')}>
          📞 Call My Child — Sarah
        </Btn>
      </div>

      <ElderlyNav tab={tab} onTab={handleTabChange} />
    </div>
  )
}

// ── ElderlyListening ──────────────────────────────────────────────────────────

const DEMO_RESPONSES: Record<string, { items: string[]; cost: string; clarify?: boolean }> = {
  default: { items: ['Milk', 'Bread', 'Biscuits'], cost: '₹300' },
  milk: { items: ['Milk', 'Bread', 'Biscuits'], cost: '₹300' },
  medicine: { items: ['Medicine'], cost: '₹150', clarify: true },
  fan: { items: ['Ceiling fan'], cost: '₹0 (repair)', clarify: false },
}

function detectRequest(text: string) {
  const lower = text.toLowerCase()
  if (lower.includes('medicine') || lower.includes('tablet') || lower.includes('pill')) return DEMO_RESPONSES.medicine
  if (lower.includes('fan') || lower.includes('repair') || lower.includes('fix')) return DEMO_RESPONSES.fan
  return DEMO_RESPONSES.default
}

export function ElderlyListening({ state }: { state: AppState }) {
  const { setScreen, setTranscript, setDemoItems, setEstimatedCost, setNeedsClarification } = state
  const [phase, setPhase] = useState<'idle' | 'listening' | 'processing'>('idle')
  const [liveText, setLiveText] = useState('')
  const liveTextRef = useRef('')
  const recognitionRef = useRef<any>(null)

  const finish = (text: string) => {
    setPhase('processing')
    const finalText = text.trim() || 'I need milk, bread and biscuits.'
    setTimeout(() => {
      const parsed = detectRequest(finalText)
      setTranscript(finalText)
      setDemoItems(parsed.items)
      setEstimatedCost(parsed.cost)
      setNeedsClarification(!!parsed.clarify)
      setScreen(parsed.clarify ? 'elderly-clarification' : 'elderly-transcription')
    }, 800)
  }

  const startListening = () => {
    setPhase('listening')
    setLiveText('')
    liveTextRef.current = ''

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SR) {
      const recognition = new SR()
      recognition.continuous = true   // keep listening until the user taps stop
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (e: any) => {
        const text = Array.from(e.results as any[])
          .map((r: any) => r[0].transcript)
          .join(' ')
        liveTextRef.current = text
        setLiveText(text)
      }

      recognition.onend = () => {
        finish(liveTextRef.current)
      }

      recognition.onerror = (e: any) => {
        // 'no-speech' fires if the user stays silent; treat it as an empty result
        if (e.error !== 'no-speech') recognition.stop()
      }

      recognition.start()
      recognitionRef.current = recognition
    } else {
      // Demo fallback — simulate typing the transcript in
      const demoText = 'I need milk, bread and biscuits.'
      let i = 0
      const interval = setInterval(() => {
        i++
        const partial = demoText.slice(0, Math.floor(demoText.length * (i / 12)))
        liveTextRef.current = partial
        setLiveText(partial)
        if (i >= 12) {
          clearInterval(interval)
          finish(demoText)
        }
      }, 250)
    }
  }

  const stopListening = () => {
    // Calling stop() triggers onend, which calls finish()
    recognitionRef.current?.stop()
  }

  return (
    <div className="flex flex-col min-h-full items-center justify-center px-6 py-8 bg-brand text-white animate-fade-in">
      <button
        onClick={() => state.setScreen('elderly-home')}
        className="absolute top-5 left-5 w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white"
        aria-label="Cancel"
      >
        ✕
      </button>

      {phase === 'idle' && (
        <div className="flex flex-col items-center gap-8 animate-fade-up text-center">
          <h2 className="text-4xl font-bold">Ready to listen</h2>
          <p className="text-2xl text-blue-200">Tell me what you need.</p>
          <MicButton isListening={false} onClick={startListening} />
          <p className="text-2xl font-bold">Tap to Speak</p>
        </div>
      )}

      {phase === 'listening' && (
        <div className="flex flex-col items-center gap-8 animate-fade-up text-center w-full">
          <h2 className="text-4xl font-bold">I'm listening...</h2>
          <MicButton isListening={true} onClick={stopListening} />
          {liveText ? (
            <p className="text-2xl font-bold text-white bg-white/20 rounded-2xl px-5 py-4 w-full">
              "{liveText}"
            </p>
          ) : (
            <p className="text-xl text-blue-200">Speak now...</p>
          )}
          <p className="text-xl font-bold text-blue-200">Tap the microphone to stop</p>
        </div>
      )}

      {phase === 'processing' && (
        <div className="flex flex-col items-center gap-6 animate-fade-up text-center">
          <div className="w-20 h-20 rounded-full border-4 border-white/40 border-t-white animate-spin-slow" />
          <p className="text-3xl font-bold">Understanding your request...</p>
          {liveText && <p className="text-xl text-blue-200 italic">"{liveText}"</p>}
        </div>
      )}
    </div>
  )
}

// ── ElderlyClarification ───────────────────────────────────────────────────────

export function ElderlyClarification({ state }: { state: AppState }) {
  const { setScreen, setDemoItems, setNeedsClarification } = state

  const handleChoice = (choice: string) => {
    if (choice === 'usual') {
      setDemoItems(['Medicine (usual)'])
      setNeedsClarification(false)
      setScreen('elderly-transcription')
    } else if (choice === 'other') {
      setDemoItems(['Medicine'])
      setNeedsClarification(false)
      setScreen('elderly-transcription')
    } else {
      setScreen('elderly-call')
    }
  }

  return (
    <div className="flex flex-col min-h-full px-6 py-8 animate-fade-up">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🤔</div>
        <h2 className="text-3xl font-bold text-ink">I want to make sure.</h2>
        <p className="text-2xl text-ink-muted mt-3">Which medicine do you mean?</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <Btn size="lg" onClick={() => handleChoice('usual')}>
          💊 My usual medicine
        </Btn>
        <Btn variant="secondary" size="lg" onClick={() => handleChoice('other')}>
          📋 Something else
        </Btn>
        <Btn variant="ghost" size="lg" onClick={() => handleChoice('call')}>
          📞 Call My Child
        </Btn>
      </div>

      <SpeakBtn text="I want to make sure. Which medicine do you mean?" />
    </div>
  )
}

// ── ElderlyTranscription ───────────────────────────────────────────────────────

export function ElderlyTranscription({ state }: { state: AppState }) {
  const { setScreen, transcript, demoItems, estimatedCost, setRequestStatus } = state

  const handleSend = () => {
    setRequestStatus('pending')
    setScreen('elderly-sent')
  }

  return (
    <div className="flex flex-col min-h-full px-6 py-8 animate-fade-up">
      <Header title="Your Request" onBack={() => setScreen('elderly-home')} />

      <div className="flex-1 pt-6 flex flex-col gap-5">
        <div>
          <p className="text-xl text-ink-muted mb-2">You said:</p>
          <p className="text-2xl text-ink italic bg-white border border-border rounded-2xl px-4 py-4">
            "{transcript || 'I need milk, bread and biscuits.'}"
          </p>
        </div>

        <div>
          <p className="text-xl font-bold text-ink mb-3">I understood:</p>
          <ItemsList items={demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']} />
        </div>

        <div className="bg-brand-soft rounded-2xl px-5 py-4 flex justify-between items-center">
          <span className="text-xl text-ink">Estimated cost</span>
          <span className="text-2xl font-bold text-brand">{estimatedCost || '₹300'}</span>
        </div>

        <SpeakBtn text={`I understood: ${(demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']).join(', ')}. Estimated cost ${estimatedCost || '₹300'}.`} />
      </div>

      <div className="pt-4 pb-2 flex flex-col gap-3">
        <p className="text-center text-xl font-bold text-ink">Did I understand you correctly?</p>
        <Btn size="lg" onClick={handleSend}>
          ✅ YES, SEND IT
        </Btn>
        <Btn variant="secondary" size="lg" onClick={() => setScreen('elderly-listening')}>
          🔄 NO, TRY AGAIN
        </Btn>
      </div>
    </div>
  )
}

// ── ElderlySent ───────────────────────────────────────────────────────────────

export function ElderlySent({ state }: { state: AppState }) {
  const { setScreen } = state

  return (
    <div className="flex flex-col min-h-full items-center justify-center px-6 py-8 animate-fade-up text-center">
      <div className="w-28 h-28 rounded-full bg-success-soft flex items-center justify-center mb-8 animate-check-pop">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M12 32L27 47L52 18" stroke="#18864B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-4xl font-bold text-ink mb-4">Request sent!</h2>
      <p className="text-2xl text-ink-muted mb-2">Your child has been notified.</p>
      <p className="text-xl text-ink-muted mb-10">We'll let you know when they respond.</p>

      <SpeakBtn text="Request sent! Your child has been notified. We'll let you know when they respond." />

      <div className="w-full flex flex-col gap-3 mt-8">
        <Btn size="lg" onClick={() => setScreen('elderly-home')}>
          🏠 Back Home
        </Btn>
        <Btn variant="ghost" size="lg" onClick={() => setScreen('elderly-call')}>
          📞 Call My Child
        </Btn>
      </div>
    </div>
  )
}

// ── ElderlyStatus ─────────────────────────────────────────────────────────────

export function ElderlyStatus({ state }: { state: AppState }) {
  const { setScreen, requestStatus, demoItems } = state

  const statusLabel =
    requestStatus === 'pending' ? 'Waiting for your child' :
    requestStatus === 'approved' ? 'Child approved' :
    requestStatus === 'helper-assigned' ? 'Helper found' :
    requestStatus === 'picked-up' ? 'On the way' :
    requestStatus === 'delivered' ? 'Delivered!' : 'Waiting'

  const statusColor: 'yellow' | 'blue' | 'green' | 'red' =
    requestStatus === 'pending' ? 'yellow' :
    requestStatus === 'delivered' ? 'green' : 'green'

  const steps = [
    { label: 'Request sent', done: true },
    { label: 'Child reviewing', done: requestStatus !== 'pending' },
    { label: 'Helper assigned', done: requestStatus === 'helper-assigned' || requestStatus === 'picked-up' || requestStatus === 'delivered' },
    { label: 'Delivered', done: requestStatus === 'delivered' },
  ]

  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Your Request" onBack={() => setScreen('elderly-home')} />

      <div className="flex-1 px-6 py-6 flex flex-col gap-6">
        <div className="bg-white rounded-3xl p-6 border border-border">
          <p className="text-xl text-ink-muted mb-2">Your request</p>
          <p className="text-2xl font-bold text-ink mb-4">
            {(demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']).join(' + ')}
          </p>
          <StatusBadge label={statusLabel} color={statusColor} />
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl p-6 border border-border">
          <p className="text-xl font-bold text-ink mb-5">Status</p>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${step.done ? 'bg-success text-white' : 'bg-border text-ink-muted'}`}>
                    {step.done ? '✓' : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 h-10 ${step.done ? 'bg-success' : 'bg-border'}`} />
                  )}
                </div>
                <p className={`text-xl pt-1 font-bold ${step.done ? 'text-ink' : 'text-ink-muted'}`}>
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {requestStatus === 'delivered' && (
          <div className="bg-success-soft rounded-3xl p-6 text-center animate-check-pop">
            <p className="text-3xl font-bold text-success">Your groceries have arrived! 🎉</p>
          </div>
        )}

        <SpeakBtn text={`Your request status: ${statusLabel}`} />
      </div>

      <div className="px-6 pb-6">
        <Btn variant="ghost" size="lg" onClick={() => setScreen('elderly-home')}>
          🏠 Back Home
        </Btn>
      </div>
    </div>
  )
}

// ── ElderlyCall ───────────────────────────────────────────────────────────────

export function ElderlyCall({ state }: { state: AppState }) {
  const { setScreen } = state
  const [calling, setCalling] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setCalling(true), 0)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col min-h-full items-center justify-center px-6 py-8 bg-ink text-white animate-fade-in text-center">
      <div className="text-8xl mb-6 animate-fade-up">📞</div>
      <h2 className="text-4xl font-bold mb-3">Calling Sarah...</h2>
      <p className="text-xl text-gray-400 mb-12">Your daughter</p>

      {/* Pulsing ring */}
      <div className="relative flex items-center justify-center mb-12">
        <div className="absolute w-32 h-32 rounded-full bg-green-500/20 animate-ping" />
        <div className="w-24 h-24 rounded-full bg-success/30 flex items-center justify-center text-5xl">
          👩
        </div>
      </div>

      <Btn
        variant="danger"
        size="lg"
        onClick={() => setScreen('elderly-home')}
      >
        📵 End Call
      </Btn>
    </div>
  )
}

// ── ElderlyUrgent ─────────────────────────────────────────────────────────────

export function ElderlyUrgent({ state }: { state: AppState }) {
  const { setScreen } = state

  return (
    <div className="flex flex-col min-h-full px-6 py-8 animate-fade-up">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🚨</div>
        <h2 className="text-4xl font-bold text-ink">Are you in immediate danger?</h2>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <a
          href="tel:112"
          className="w-full min-h-[68px] flex items-center justify-center gap-2 text-xl font-bold bg-danger text-white rounded-2xl shadow-md shadow-danger/25"
        >
          🆘 YES — CALL FOR HELP (112)
        </a>
        <Btn variant="ghost" size="lg" onClick={() => setScreen('elderly-transcription')}>
          ⚡ NO — I JUST NEED SOMETHING URGENT
        </Btn>
        <Btn variant="secondary" size="md" onClick={() => setScreen('elderly-call')}>
          📞 Call Sarah
        </Btn>
        <Btn variant="ghost" size="md" onClick={() => setScreen('elderly-home')}>
          ← Back
        </Btn>
      </div>
    </div>
  )
}

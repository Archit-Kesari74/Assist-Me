import { useState } from 'react'
import { Btn, StatusBadge, Card, TrustRow, FamilyNav, Header, ItemsList, SpeakBtn } from '../components/UI'
import type { AppState } from '../App'

// ── FamilyHome ─────────────────────────────────────────────────────────────

export function FamilyHome({ state }: { state: AppState }) {
  const { setScreen, requestStatus } = state
  const [tab, setTab] = useState<'requests' | 'track' | 'profile'>('requests')

  const hasPendingRequest = requestStatus === 'pending'
  const hasActiveRequest = requestStatus !== 'none' && requestStatus !== 'pending'

  const handleTab = (t: 'requests' | 'track' | 'profile') => {
    setTab(t)
    if (t === 'track') setScreen('family-track')
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 pt-8 pb-4 bg-white border-b border-border">
        <p className="text-xl text-ink-muted">Hello,</p>
        <h1 className="text-3xl font-bold text-ink">Sarah 👩</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        {hasPendingRequest && (
          <div
            className="bg-warn-soft border-2 border-warn/30 rounded-3xl p-5 animate-fade-up cursor-pointer"
            onClick={() => setScreen('family-detail')}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xl font-bold text-ink">🔔 Mom needs your help</p>
                <p className="text-xl text-ink-muted mt-1">Milk, Bread, Biscuits</p>
              </div>
              <span className="bg-warn text-white text-sm font-bold px-3 py-1 rounded-full">NEW</span>
            </div>
            <p className="text-warn font-bold text-lg mt-3">Tap to approve or reject →</p>
          </div>
        )}

        {!hasPendingRequest && !hasActiveRequest && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😌</div>
            <p className="text-2xl font-bold text-ink">Nothing to worry about.</p>
            <p className="text-xl text-ink-muted mt-2">You'll be notified when Mom needs something.</p>
          </div>
        )}

        {hasActiveRequest && (
          <div
            className="bg-success-soft border-2 border-success/30 rounded-3xl p-5 cursor-pointer"
            onClick={() => setScreen('family-track')}
          >
            <p className="text-xl font-bold text-success mb-1">✓ Request approved</p>
            <p className="text-xl text-ink-muted">Milk + Bread + Biscuits</p>
            <div className="mt-3">
              <StatusBadge
                label={
                  requestStatus === 'approved' ? 'Finding helper' :
                  requestStatus === 'helper-assigned' ? 'Helper on the way' :
                  requestStatus === 'picked-up' ? 'Groceries picked up' :
                  'Delivered!'
                }
                color={requestStatus === 'delivered' ? 'green' : 'blue'}
              />
            </div>
            <p className="text-success font-bold mt-3">Tap to track →</p>
          </div>
        )}

        {/* Past requests */}
        <div>
          <p className="text-xl font-bold text-ink mb-3">Recent</p>
          <div className="space-y-3">
            {[
              { item: 'Medicines', status: 'Delivered', date: 'Yesterday' },
              { item: 'Groceries', status: 'Delivered', date: '3 days ago' },
            ].map(r => (
              <div key={r.item} className="bg-white rounded-2xl p-4 border border-border flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold text-ink">{r.item}</p>
                  <p className="text-lg text-ink-muted">{r.date}</p>
                </div>
                <span className="text-success font-bold text-lg">✓ {r.status}</span>
              </div>
            ))}
          </div>
        </div>

        <TrustRow />
      </div>

      <FamilyNav tab={tab} onTab={handleTab} />
    </div>
  )
}

// ── FamilyDetail ──────────────────────────────────────────────────────────────

export function FamilyDetail({ state }: { state: AppState }) {
  const { setScreen, demoItems, estimatedCost } = state

  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Mom's Request" onBack={() => setScreen('family-home')} />

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <div className="bg-warn-soft rounded-2xl px-5 py-4">
          <p className="text-2xl font-bold text-ink">Mom needs your help</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-border">
          <p className="text-xl text-ink-muted mb-1">Grocery request</p>
          <div className="flex gap-4 text-lg text-ink-muted mb-4">
            <span>📍 Home</span>
            <span>🕐 Just now</span>
          </div>
          <ItemsList items={demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']} />
        </div>

        <div className="bg-brand-soft rounded-2xl px-5 py-4 flex justify-between items-center">
          <span className="text-xl text-ink">Estimated cost</span>
          <span className="text-2xl font-bold text-brand">{estimatedCost || '₹300'}</span>
        </div>

        <SpeakBtn text={`Mom needs: ${(demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']).join(', ')}. Estimated cost ${estimatedCost || '₹300'}.`} />
      </div>

      <div className="px-6 pb-6 flex flex-col gap-3">
        <Btn variant="success" size="lg" onClick={() => setScreen('family-approve')}>
          🟢 Approve
        </Btn>
        <Btn variant="danger" size="lg" onClick={() => setScreen('family-reject')}>
          🔴 Reject
        </Btn>
        <Btn variant="ghost" size="md" onClick={() => state.setScreen('family-ask-mom')}>
          💬 Ask Mom
        </Btn>
      </div>
    </div>
  )
}

// ── FamilyApprove ─────────────────────────────────────────────────────────────

export function FamilyApprove({ state }: { state: AppState }) {
  const { setScreen, demoItems, estimatedCost, setRequestStatus } = state
  const [loading, setLoading] = useState(false)

  const handleApprove = () => {
    setLoading(true)
    setTimeout(() => {
      setRequestStatus('approved')
      setScreen('family-approved')
    }, 1200)
  }

  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Approve Request" onBack={() => setScreen('family-detail')} />

      <div className="flex-1 px-6 py-5 flex flex-col gap-5">
        <div className="bg-white rounded-3xl p-6 border border-border">
          <h3 className="text-2xl font-bold text-ink mb-4">Approve request?</h3>
          <p className="text-xl text-ink-muted mb-3">
            {(demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']).join(', ')}
          </p>
          <div className="flex justify-between items-center py-3 border-t border-border">
            <span className="text-xl text-ink">Estimated cost</span>
            <span className="text-2xl font-bold text-ink">{estimatedCost || '₹300'}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-t border-border">
            <span className="text-xl text-ink">Payment</span>
            <span className="text-xl font-bold text-ink-muted">Pay helper</span>
          </div>
        </div>

        <TrustRow />
      </div>

      <div className="px-6 pb-6 flex flex-col gap-3">
        <Btn variant="success" size="lg" onClick={handleApprove} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
              Approving...
            </span>
          ) : '✓ Approve & Find Helper'}
        </Btn>
        <Btn variant="ghost" size="lg" onClick={() => setScreen('family-detail')}>
          Cancel
        </Btn>
      </div>
    </div>
  )
}

// ── FamilyApproved ────────────────────────────────────────────────────────────

export function FamilyApproved({ state }: { state: AppState }) {
  const { setScreen } = state

  return (
    <div className="flex flex-col min-h-full items-center justify-center px-6 py-8 text-center animate-fade-up">
      <div className="w-24 h-24 rounded-full bg-success-soft flex items-center justify-center mb-6 animate-check-pop">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path d="M12 26L22 36L40 16" stroke="#18864B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-4xl font-bold text-ink mb-4">Request approved!</h2>

      <div className="bg-brand-soft rounded-2xl px-6 py-4 mb-6 w-full">
        <p className="text-2xl font-bold text-brand">Finding a trusted helper nearby...</p>
      </div>

      <p className="text-xl text-ink-muted mb-2">Mom has been notified.</p>
      <p className="text-xl text-ink-muted mb-8">You'll be updated when the helper accepts.</p>

      <div className="w-full flex flex-col gap-3">
        <Btn size="lg" onClick={() => setScreen('family-track')}>
          📍 Track Request
        </Btn>
        <Btn variant="ghost" size="lg" onClick={() => setScreen('family-home')}>
          🏠 Back Home
        </Btn>
      </div>
    </div>
  )
}

// ── FamilyReject ──────────────────────────────────────────────────────────────

export function FamilyReject({ state }: { state: AppState }) {
  const { setScreen, setRequestStatus } = state
  const [selected, setSelected] = useState<string | null>(null)

  const handleReject = (reason: string) => {
    setSelected(reason)
    setTimeout(() => {
      setRequestStatus('none')
      setScreen('family-home')
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Reject Request" onBack={() => setScreen('family-detail')} />

      <div className="flex-1 px-6 py-6 flex flex-col gap-4">
        <p className="text-2xl font-bold text-ink">Why are you rejecting this?</p>
        <p className="text-xl text-ink-muted">Mom will be notified.</p>

        {[
          { label: '💰 Too expensive', value: 'expensive' },
          { label: '🙅 Not needed right now', value: 'not-needed' },
          { label: '🤝 I\'ll handle it myself', value: 'self' },
          { label: '🎤 Send a voice message', value: 'voice' },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => handleReject(opt.label)}
            className={`w-full text-left text-xl font-bold px-6 py-5 rounded-2xl border-2 transition-all ${
              selected === opt.label
                ? 'bg-brand text-white border-brand'
                : 'bg-white text-ink border-border hover:border-brand/30'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── FamilyTrack ───────────────────────────────────────────────────────────────

export function FamilyTrack({ state }: { state: AppState }) {
  const { setScreen, requestStatus, demoItems, setRequestStatus } = state
  const [tab] = useState<'requests' | 'track' | 'profile'>('track')

  const steps = [
    { label: 'Request sent by Mom', done: true, time: 'Just now' },
    { label: '✓ Approved by you', done: requestStatus !== 'pending' && requestStatus !== 'none', time: 'Just now' },
    { label: 'Helper assigned', done: requestStatus === 'helper-assigned' || requestStatus === 'picked-up' || requestStatus === 'delivered', time: requestStatus === 'helper-assigned' ? 'Now' : '' },
    { label: 'Groceries picked up', done: requestStatus === 'picked-up' || requestStatus === 'delivered', time: '' },
    { label: 'Delivered to Mom', done: requestStatus === 'delivered', time: '' },
  ]

  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Track Request" onBack={() => setScreen('family-home')} />

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <div className="bg-white rounded-3xl p-5 border border-border">
          <p className="text-xl text-ink-muted mb-1">Mom's request</p>
          <p className="text-2xl font-bold text-ink mb-3">
            {(demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']).join(' + ')}
          </p>
          <StatusBadge
            label={
              requestStatus === 'approved' ? 'Finding helper' :
              requestStatus === 'helper-assigned' ? 'Helper on the way' :
              requestStatus === 'picked-up' ? 'Picked up' :
              requestStatus === 'delivered' ? 'Delivered!' : 'Approved'
            }
            color={requestStatus === 'delivered' ? 'green' : 'blue'}
          />
        </div>

        <div className="bg-white rounded-3xl p-5 border border-border">
          <p className="text-xl font-bold text-ink mb-5">Timeline</p>
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
                <div className="pt-1 pb-4">
                  <p className={`text-lg font-bold ${step.done ? 'text-ink' : 'text-ink-muted'}`}>{step.label}</p>
                  {step.time && <p className="text-base text-ink-muted">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {requestStatus === 'delivered' && (
          <div className="bg-success-soft rounded-3xl p-6 text-center animate-check-pop">
            <p className="text-2xl font-bold text-success">Mom's groceries were delivered. 🎉</p>
          </div>
        )}
      </div>

      <FamilyNav tab={tab} onTab={(t) => {
        if (t === 'requests') setScreen('family-home')
      }} />
    </div>
  )
}

// ── FamilyAskMom ──────────────────────────────────────────────────────────────

export function FamilyAskMom({ state }: { state: AppState }) {
  const { setScreen } = state
  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Ask Mom" onBack={() => setScreen('family-detail')} />
      <div className="flex-1 px-6 py-6 flex flex-col gap-4">
        <p className="text-2xl font-bold text-ink">Send a message to Mom</p>
        <div className="bg-white border-2 border-brand/20 rounded-2xl p-4 text-xl text-ink-muted min-h-[120px]">
          Type your message here...
        </div>
        <Btn size="lg" onClick={() => setScreen('family-home')}>
          📤 Send to Mom
        </Btn>
        <Btn variant="ghost" size="md" onClick={() => setScreen('family-detail')}>
          Cancel
        </Btn>
      </div>
    </div>
  )
}

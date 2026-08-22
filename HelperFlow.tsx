import { useState } from 'react'
import { Btn, Card, StatusBadge, TrustRow, HelperNav, Header, ItemsList } from '../components/UI'
import type { AppState } from '../App'

// ── HelperHome ────────────────────────────────────────────────────────────────

export function HelperHome({ state }: { state: AppState }) {
  const { setScreen, requestStatus } = state
  const [tab, setTab] = useState<'tasks' | 'history' | 'profile'>('tasks')

  const showTask = requestStatus === 'approved' || requestStatus === 'helper-assigned' || requestStatus === 'picked-up'

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-6 pt-8 pb-4 bg-white border-b border-border">
        <p className="text-xl text-ink-muted">Good morning,</p>
        <h1 className="text-3xl font-bold text-ink">Raj 🧑</h1>
        <p className="text-lg text-ink-muted">Verified helper ✓</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <p className="text-2xl font-bold text-ink">Available Tasks</p>

        {showTask && (
          <div
            className="bg-white rounded-3xl border-2 border-border p-5 cursor-pointer hover:border-brand/30 transition-colors animate-fade-up"
            onClick={() => setScreen('helper-task')}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-xl font-bold text-ink">🛒 Grocery pickup</p>
                <p className="text-xl text-ink-muted">Milk + Bread + Biscuits</p>
              </div>
              <span className="bg-brand-soft text-brand text-base font-bold px-3 py-1 rounded-full">NEW</span>
            </div>
            <div className="flex gap-5 text-lg text-ink-muted mb-4">
              <span>📍 1.2 km</span>
              <span>💰 ₹300</span>
            </div>
            <div className="flex items-center gap-2 text-lg text-ink-muted mb-4">
              <span className="text-success font-bold text-base">✓ Approved by</span>
              <span className="text-ink font-bold">Mary's daughter</span>
            </div>
            <Btn size="md" onClick={() => setScreen('helper-task')}>
              View Task →
            </Btn>
          </div>
        )}

        {!showTask && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-ink">No tasks available.</p>
            <p className="text-xl text-ink-muted mt-2">Check back soon.</p>
          </div>
        )}

        {/* Completed today */}
        <div>
          <p className="text-xl font-bold text-ink mb-3">Completed Today</p>
          <div className="bg-white rounded-2xl p-4 border border-border flex justify-between items-center">
            <div>
              <p className="text-xl font-bold text-ink">Medicine pickup</p>
              <p className="text-lg text-ink-muted">This morning</p>
            </div>
            <span className="text-success font-bold text-lg">✓ Done</span>
          </div>
        </div>
      </div>

      <HelperNav tab={tab} onTab={setTab} />
    </div>
  )
}

// ── HelperTask ────────────────────────────────────────────────────────────────

export function HelperTask({ state }: { state: AppState }) {
  const { setScreen, demoItems, estimatedCost, setRequestStatus } = state

  const handleAccept = () => {
    setRequestStatus('helper-assigned')
    setScreen('helper-progress')
  }

  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Task Details" onBack={() => setScreen('helper-home')} />

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <div className="bg-brand-soft rounded-2xl px-5 py-4">
          <p className="text-xl font-bold text-brand">Grocery pickup</p>
          <p className="text-lg text-ink-muted">Approved by Mary's daughter, Sarah</p>
        </div>

        <div>
          <p className="text-xl font-bold text-ink mb-3">What to get</p>
          <ItemsList items={demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']} />
        </div>

        <div className="bg-white rounded-3xl p-5 border border-border space-y-3">
          <div className="flex justify-between">
            <span className="text-xl text-ink-muted">Approx. value</span>
            <span className="text-xl font-bold text-ink">{estimatedCost || '₹300'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xl text-ink-muted">Distance</span>
            <span className="text-xl font-bold text-ink">1.2 km</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xl text-ink-muted">Approved by</span>
            <span className="text-xl font-bold text-ink">Mary's daughter</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xl text-ink-muted">Deliver to</span>
            <span className="text-xl font-bold text-ink">Mary's Home</span>
          </div>
        </div>

        <TrustRow />
      </div>

      <div className="px-6 pb-6 flex flex-col gap-3">
        <Btn size="lg" onClick={handleAccept}>
          ✓ Accept Task
        </Btn>
        <Btn variant="ghost" size="md" onClick={() => setScreen('helper-home')}>
          Skip for now
        </Btn>
      </div>
    </div>
  )
}

// ── HelperProgress ────────────────────────────────────────────────────────────

const STEPS = [
  { label: "I'm on my way", icon: '🚶', doneLabel: 'On the way', statusUpdate: 'helper-assigned' as const },
  { label: "I've picked it up", icon: '🛒', doneLabel: 'Groceries picked up', statusUpdate: 'picked-up' as const },
  { label: "I've delivered it", icon: '🏠', doneLabel: 'Delivered!', statusUpdate: 'delivered' as const },
]

export function HelperProgress({ state }: { state: AppState }) {
  const { setScreen, requestStatus, setRequestStatus, demoItems } = state
  const [currentStep, setCurrentStep] = useState(
    requestStatus === 'helper-assigned' ? 0 :
    requestStatus === 'picked-up' ? 1 :
    requestStatus === 'delivered' ? 2 : 0
  )
  const [doneSteps, setDoneSteps] = useState<number[]>(
    requestStatus === 'picked-up' ? [0] :
    requestStatus === 'delivered' ? [0, 1, 2] : []
  )

  const handleStep = () => {
    const step = STEPS[currentStep]
    setRequestStatus(step.statusUpdate)
    setDoneSteps(prev => [...prev, currentStep])
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      setScreen('helper-delivered')
    }
  }

  return (
    <div className="flex flex-col min-h-full animate-fade-up">
      <Header title="Your Task" onBack={() => setScreen('helper-home')} />

      <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
        <div className="bg-white rounded-3xl p-5 border border-border">
          <p className="text-xl text-ink-muted mb-1">Pick up groceries for Mary</p>
          <p className="text-2xl font-bold text-ink">
            {(demoItems.length ? demoItems : ['Milk', 'Bread', 'Biscuits']).join(' + ')}
          </p>
          <div className="mt-3 flex gap-4 text-lg text-ink-muted">
            <span>📍 1.2 km</span>
            <span>🏠 Mary's Home</span>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-3xl p-5 border border-border">
          <p className="text-xl font-bold text-ink mb-5">Progress</p>
          <div className="space-y-0">
            {STEPS.map((step, i) => {
              const isDone = doneSteps.includes(i)
              const isCurrent = i === currentStep && !isDone
              return (
                <div key={step.label} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 border-2 ${
                      isDone ? 'bg-success border-success text-white' :
                      isCurrent ? 'border-brand bg-brand-soft text-brand' :
                      'border-border bg-white text-ink-muted'
                    }`}>
                      {isDone ? '✓' : step.icon}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-0.5 h-12 ${isDone ? 'bg-success' : 'bg-border'}`} />
                    )}
                  </div>
                  <div className="pt-2 pb-4">
                    <p className={`text-xl font-bold ${isDone ? 'text-success' : isCurrent ? 'text-brand' : 'text-ink-muted'}`}>
                      {isDone ? step.doneLabel : step.label}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Btn size="lg" onClick={handleStep}>
          {STEPS[currentStep]?.icon} {STEPS[currentStep]?.label}
        </Btn>
      </div>
    </div>
  )
}

// ── HelperDelivered ───────────────────────────────────────────────────────────

export function HelperDelivered({ state }: { state: AppState }) {
  const { setScreen } = state

  return (
    <div className="flex flex-col min-h-full items-center justify-center px-6 py-8 text-center animate-fade-up">
      <div className="w-28 h-28 rounded-full bg-success-soft flex items-center justify-center mb-6 animate-check-pop">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <path d="M12 32L27 47L52 18" stroke="#18864B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-4xl font-bold text-ink mb-4">Delivered!</h2>
      <p className="text-2xl text-ink-muted mb-2">Your request has been completed.</p>
      <p className="text-xl text-ink-muted mb-4">Photo confirmation received.</p>

      <div className="bg-success-soft rounded-2xl px-6 py-4 mb-8 w-full">
        <p className="text-xl font-bold text-success">Mom's groceries have been delivered.</p>
        <p className="text-lg text-success/80 mt-1">The family has been notified.</p>
      </div>

      <div className="w-full">
        <Btn size="lg" onClick={() => setScreen('helper-home')}>
          🏠 Back to Tasks
        </Btn>
      </div>
    </div>
  )
}

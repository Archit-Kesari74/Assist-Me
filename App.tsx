import { useState } from 'react'
import { PhoneShell, RoleSwitcher } from './components/UI'
import Landing from './screens/Landing'
import Onboarding from './screens/Onboarding'
import {
  ElderlyHome, ElderlyListening, ElderlyClarification, ElderlyTranscription,
  ElderlySent, ElderlyStatus, ElderlyCall, ElderlyUrgent,
} from './screens/ElderlyFlow'
import {
  FamilyHome, FamilyDetail, FamilyApprove, FamilyApproved,
  FamilyReject, FamilyTrack, FamilyAskMom,
} from './screens/FamilyFlow'
import {
  HelperHome, HelperTask, HelperProgress, HelperDelivered,
} from './screens/HelperFlow'

// ── Types ────────────────────────────────────────────────────────────────────

export type Role = 'elderly' | 'family' | 'helper'
export type RequestStatus = 'none' | 'pending' | 'approved' | 'helper-assigned' | 'picked-up' | 'delivered'
export type Screen =
  | 'landing' | 'onboarding' | 'elderly-home'
  | 'elderly-listening' | 'elderly-clarification' | 'elderly-transcription'
  | 'elderly-sent' | 'elderly-status' | 'elderly-call' | 'elderly-urgent'
  | 'family-home' | 'family-detail' | 'family-approve' | 'family-approved'
  | 'family-reject' | 'family-track' | 'family-ask-mom'
  | 'helper-home' | 'helper-task' | 'helper-progress' | 'helper-delivered'

export interface AppState {
  screen: Screen
  setScreen: (s: Screen) => void
  role: Role
  setRole: (r: Role) => void
  requestStatus: RequestStatus
  setRequestStatus: (s: RequestStatus) => void
  transcript: string
  setTranscript: (t: string) => void
  demoItems: string[]
  setDemoItems: (items: string[]) => void
  estimatedCost: string
  setEstimatedCost: (c: string) => void
  needsClarification: boolean
  setNeedsClarification: (b: boolean) => void
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [role, setRole] = useState<Role>('elderly')
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('none')
  const [transcript, setTranscript] = useState('')
  const [demoItems, setDemoItems] = useState<string[]>([])
  const [estimatedCost, setEstimatedCost] = useState('₹300')
  const [needsClarification, setNeedsClarification] = useState(false)

  const state: AppState = {
    screen, setScreen,
    role, setRole,
    requestStatus, setRequestStatus,
    transcript, setTranscript,
    demoItems, setDemoItems,
    estimatedCost, setEstimatedCost,
    needsClarification, setNeedsClarification,
  }

  const handleRoleSwitch = (r: Role) => {
    setRole(r)
    if (r === 'elderly') setScreen('elderly-home')
    if (r === 'family') setScreen('family-home')
    if (r === 'helper') setScreen('helper-home')
  }

  const handleDemoStart = () => {
    setRole('elderly')
    setScreen('elderly-home')
  }

  const handleLandingStart = () => {
    setScreen('onboarding')
  }

  // Show role switcher for app screens
  const showRoleSwitcher = screen !== 'landing' && screen !== 'onboarding'

  return (
    <PhoneShell>
      {showRoleSwitcher && (
        <RoleSwitcher role={role} onSwitch={handleRoleSwitch} />
      )}

      <div className="flex flex-col" style={{ minHeight: showRoleSwitcher ? 'calc(100svh - 46px)' : '100svh' }}>
        {screen === 'landing' && (
          <Landing onStart={handleLandingStart} onDemo={handleDemoStart} />
        )}

        {screen === 'onboarding' && (
          <Onboarding onDone={() => { setRole('elderly'); setScreen('elderly-home') }} />
        )}

        {/* ── Elderly ── */}
        {screen === 'elderly-home' && <ElderlyHome state={state} />}
        {screen === 'elderly-listening' && <ElderlyListening state={state} />}
        {screen === 'elderly-clarification' && <ElderlyClarification state={state} />}
        {screen === 'elderly-transcription' && <ElderlyTranscription state={state} />}
        {screen === 'elderly-sent' && <ElderlySent state={state} />}
        {screen === 'elderly-status' && <ElderlyStatus state={state} />}
        {screen === 'elderly-call' && <ElderlyCall state={state} />}
        {screen === 'elderly-urgent' && <ElderlyUrgent state={state} />}

        {/* ── Family ── */}
        {screen === 'family-home' && <FamilyHome state={state} />}
        {screen === 'family-detail' && <FamilyDetail state={state} />}
        {screen === 'family-approve' && <FamilyApprove state={state} />}
        {screen === 'family-approved' && <FamilyApproved state={state} />}
        {screen === 'family-reject' && <FamilyReject state={state} />}
        {screen === 'family-track' && <FamilyTrack state={state} />}
        {screen === 'family-ask-mom' && <FamilyAskMom state={state} />}

        {/* ── Helper ── */}
        {screen === 'helper-home' && <HelperHome state={state} />}
        {screen === 'helper-task' && <HelperTask state={state} />}
        {screen === 'helper-progress' && <HelperProgress state={state} />}
        {screen === 'helper-delivered' && <HelperDelivered state={state} />}
      </div>
    </PhoneShell>
  )
}

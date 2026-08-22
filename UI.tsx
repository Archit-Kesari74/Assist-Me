import { ReactNode } from 'react'

// ── Button ────────────────────────────────────────────────────────────────────

interface BtnProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
  size?: 'lg' | 'md' | 'sm'
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

export function Btn({
  children, onClick, variant = 'primary', size = 'lg',
  fullWidth = true, disabled, className = '',
}: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all active:scale-95 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-brand cursor-pointer select-none'

  const variants: Record<string, string> = {
    primary: 'bg-brand text-white hover:bg-brand-dark active:bg-brand-dark shadow-md shadow-brand/25',
    secondary: 'bg-brand-soft text-brand hover:bg-blue-100 border-2 border-brand/20',
    danger: 'bg-danger text-white hover:bg-red-800 shadow-md shadow-danger/25',
    ghost: 'bg-white text-ink border-2 border-border hover:bg-gray-50',
    success: 'bg-success text-white hover:bg-green-800 shadow-md shadow-success/20',
  }

  const sizes: Record<string, string> = {
    lg: 'text-xl px-8 py-5 min-h-[68px]',
    md: 'text-lg px-6 py-4 min-h-[56px]',
    sm: 'text-base px-4 py-3 min-h-[44px]',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}

// ── MicButton ────────────────────────────────────────────────────────────────

interface MicBtnProps {
  isListening: boolean
  onClick: () => void
}

export function MicButton({ isListening, onClick }: MicBtnProps) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-brand/20 listening-ring-1" />
          <span className="absolute inset-0 rounded-full bg-brand/10 listening-ring-2" />
        </>
      )}
      <button
        onClick={onClick}
        aria-label={isListening ? 'Stop listening' : 'Tap to speak'}
        className={`relative z-10 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-95 focus-visible:outline-4 focus-visible:outline-brand focus-visible:outline-offset-4 ${
          isListening
            ? 'bg-brand shadow-2xl shadow-brand/40'
            : 'bg-brand animate-mic-idle shadow-2xl shadow-brand/35'
        }`}
        style={{ width: 160, height: 160 }}
      >
        {isListening ? (
          <SoundWave />
        ) : (
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden>
            <rect x="26" y="8" width="20" height="36" rx="10" fill="white" />
            <path d="M16 36C16 47.046 24.954 56 36 56C47.046 56 56 47.046 56 36" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <line x1="36" y1="56" x2="36" y2="66" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <line x1="26" y1="66" x2="46" y2="66" stroke="white" strokeWidth="4" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  )
}

function SoundWave() {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className="sound-bar block rounded-full bg-white"
          style={{ width: 6, height: 32 }}
        />
      ))}
    </div>
  )
}

// ── StatusBadge ────────────────────────────────────────────────────────────

interface BadgeProps { label: string; color: 'yellow' | 'blue' | 'green' | 'red' }

export function StatusBadge({ label, color }: BadgeProps) {
  const colors: Record<string, string> = {
    yellow: 'bg-warn-soft text-warn border-warn/20',
    blue: 'bg-brand-soft text-brand border-brand/20',
    green: 'bg-success-soft text-success border-success/20',
    red: 'bg-danger-soft text-danger border-danger/20',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-lg font-bold border ${colors[color]}`}>
      {color === 'yellow' && '🟡'}
      {color === 'blue' && '🔵'}
      {color === 'green' && '🟢'}
      {color === 'red' && '🔴'}
      {label}
    </span>
  )
}

// ── TrustRow ──────────────────────────────────────────────────────────────────

export function TrustRow() {
  return (
    <div className="bg-success-soft rounded-2xl p-4 space-y-2">
      <p className="text-lg font-bold text-success">Safety</p>
      {['Approved by family', 'Helper verified', 'Delivery tracked', 'Family notified'].map(item => (
        <div key={item} className="flex items-center gap-2 text-success text-lg">
          <span className="text-base">✓</span>
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

// ── SpeakBtn ─────────────────────────────────────────────────────────────────

interface SpeakBtnProps { text: string }

export function SpeakBtn({ text }: SpeakBtnProps) {
  const speak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.85
      window.speechSynthesis.speak(u)
    }
  }
  return (
    <button
      onClick={speak}
      className="flex items-center gap-2 text-ink-muted text-base py-2 px-3 rounded-xl hover:bg-brand-soft transition-colors"
    >
      🔊 <span>Read this to me</span>
    </button>
  )
}

// ── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-3xl p-6 shadow-sm border border-border ${className}`}>
      {children}
    </div>
  )
}

// ── PhoneShell ────────────────────────────────────────────────────────────────

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex justify-center items-start bg-app md:py-8 px-0 md:px-4">
      <div
        className="w-full relative bg-surface overflow-hidden app-shell"
        style={{
          maxWidth: 460,
          minHeight: '100svh',
          boxShadow: '0 28px 90px rgba(15, 23, 42, 0.22)',
          borderRadius: 'clamp(0px, 2.5vw, 32px)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  title: string
  onBack?: () => void
  right?: ReactNode
}

export function Header({ title, onBack, right }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/80 bg-white/95 backdrop-blur-xl sticky top-0 z-20">
      <div className="w-11">
        {onBack && (
          <button onClick={onBack} className="icon-btn" aria-label="Go back">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>
      <span className="text-xl font-extrabold tracking-tight text-ink">{title}</span>
      <div className="w-11 flex justify-end">{right}</div>
    </div>
  )
}

// ── RoleSwitcher ─────────────────────────────────────────────────────────────

type Role = 'elderly' | 'family' | 'helper'

export function RoleSwitcher({ role, onSwitch }: { role: Role; onSwitch: (r: Role) => void }) {
  const roles: { id: Role; label: string; short: string; icon: string }[] = [
    { id: 'elderly', label: 'Mary', short: 'Elder', icon: '👵' },
    { id: 'family', label: 'Sarah', short: 'Family', icon: '👩' },
    { id: 'helper', label: 'Raj', short: 'Helper', icon: '🧑' },
  ]
  return (
    <div className="role-bar">
      <div className="flex items-center gap-2 min-w-0">
        <div className="brand-mark brand-mark-sm">✦</div>
        <span className="role-title">Assist Me</span>
      </div>
      <div className="role-pills">
        {roles.map(r => (
          <button
            key={r.id}
            onClick={() => onSwitch(r.id)}
            aria-label={`Switch to ${r.label} ${r.short}`}
            className={`role-pill ${role === r.id ? 'role-pill-active' : ''}`}
          >
            <span>{r.icon}</span>
            <span className="hidden min-[390px]:inline">{r.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── BottomNav ─────────────────────────────────────────────────────────────────

type ElderlyTab = 'home' | 'requests' | 'help'
type FamilyTab = 'requests' | 'track' | 'profile'
type HelperTab = 'tasks' | 'history' | 'profile'

function NavItem({ active, icon, label, onClick, badge }: { active: boolean; icon: string; label: string; onClick: () => void; badge?: string }) {
  return (
    <button onClick={onClick} className={`nav-item ${active ? 'nav-item-active' : ''}`}>
      <span className="nav-icon-wrap">
        <span className="text-[21px] leading-none">{icon}</span>
        {badge && <span className="nav-badge">{badge}</span>}
      </span>
      <span>{label}</span>
    </button>
  )
}

export function ElderlyNav({ tab, onTab }: { tab: ElderlyTab; onTab: (t: ElderlyTab) => void }) {
  return (
    <div className="bottom-nav">
      <NavItem active={tab === 'home'} icon="⌂" label="Home" onClick={() => onTab('home')} />
      <NavItem active={tab === 'requests'} icon="✓" label="Requests" onClick={() => onTab('requests')} />
      <NavItem active={tab === 'help'} icon="?" label="Help" onClick={() => onTab('help')} />
    </div>
  )
}

export function FamilyNav({ tab, onTab }: { tab: FamilyTab; onTab: (t: FamilyTab) => void }) {
  return (
    <div className="bottom-nav">
      <NavItem active={tab === 'requests'} icon="⌁" label="Requests" onClick={() => onTab('requests')} badge="1" />
      <NavItem active={tab === 'track'} icon="⌖" label="Track" onClick={() => onTab('track')} />
      <NavItem active={tab === 'profile'} icon="◯" label="Profile" onClick={() => onTab('profile')} />
    </div>
  )
}

export function HelperNav({ tab, onTab }: { tab: HelperTab; onTab: (t: HelperTab) => void }) {
  return (
    <div className="bottom-nav">
      <NavItem active={tab === 'tasks'} icon="✓" label="Tasks" onClick={() => onTab('tasks')} badge="1" />
      <NavItem active={tab === 'history'} icon="↺" label="History" onClick={() => onTab('history')} />
      <NavItem active={tab === 'profile'} icon="◯" label="Profile" onClick={() => onTab('profile')} />
    </div>
  )
}

// ── ItemsList ─────────────────────────────────────────────────────────────────

const ITEM_EMOJIS: Record<string, string> = {
  Milk: '🥛',
  Bread: '🍞',
  Biscuits: '🍪',
  Medicine: '💊',
  'Ceiling fan': '🔧',
}

export function ItemsList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map(item => (
        <div key={item} className="flex items-center gap-3 bg-surface rounded-2xl px-4 py-3">
          <span className="text-3xl">{ITEM_EMOJIS[item] ?? '📦'}</span>
          <span className="text-xl font-bold text-ink">{item}</span>
        </div>
      ))}
    </div>
  )
}

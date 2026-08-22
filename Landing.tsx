import { Btn } from '../components/UI'

interface Props {
  onStart: () => void
  onDemo: () => void
}

export default function Landing({ onStart, onDemo }: Props) {
  return (
    <div className="flex flex-col min-h-full bg-white">
      <section className="gradient-hero px-6 pt-8 pb-8 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-24 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute right-8 top-24 w-20 h-20 rounded-full bg-white/5 blur-xl" />

        <div className="flex items-center justify-between mb-9">
          <div className="flex items-center gap-2.5">
            <div className="brand-mark !bg-white !text-brand !shadow-none">✦</div>
            <div>
              <div className="text-xl font-extrabold tracking-tight">Assist Me</div>
              <div className="text-xs font-bold text-blue-100">CARE, MADE SIMPLE</div>
            </div>
          </div>
          <div className="glass rounded-full px-3 py-1.5 text-xs font-bold">Trusted • Family-first</div>
        </div>

        <div className="max-w-[380px]">
          <p className="text-blue-100 text-sm font-extrabold uppercase tracking-[.14em] mb-3">Everyday help, without the hassle</p>
          <h1 className="text-[42px] leading-[1.02] font-extrabold tracking-tight mb-5">
            Help is one<br />conversation away.
          </h1>
          <p className="text-lg text-blue-50/90 leading-relaxed mb-7">
            Speak naturally. Your family stays in control. A trusted helper gets it done.
          </p>
        </div>

        <div className="glass rounded-[28px] p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative w-[82px] h-[82px] shrink-0 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/10 animate-ping" style={{ animationDuration:'3s' }} />
              <div className="relative w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center shadow-xl">
                <svg width="34" height="34" viewBox="0 0 72 72" fill="none">
                  <rect x="26" y="8" width="20" height="36" rx="10" fill="#315CFF"/>
                  <path d="M16 36C16 47.046 24.954 56 36 56C47.046 56 56 47.046 56 36" stroke="#315CFF" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="36" y1="56" x2="36" y2="66" stroke="#315CFF" strokeWidth="4" strokeLinecap="round"/>
                  <line x1="26" y1="66" x2="46" y2="66" stroke="#315CFF" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            <div>
              <p className="font-extrabold text-lg">Just say what you need.</p>
              <p className="text-blue-100 text-sm mt-1">No typing • No searching • No confusion</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Btn onClick={onDemo} variant="ghost" size="lg" className="!bg-white !text-ink !border-0 shadow-xl">
            Try the live demo <span>→</span>
          </Btn>
          <button onClick={onStart} className="text-white/85 font-bold py-2 hover:text-white transition-colors">
            See how Assist Me works ↓
          </button>
        </div>
      </section>

      <section className="px-6 py-8 flex-1">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="section-kicker mb-1">Simple by design</p>
            <h2 className="text-3xl font-extrabold text-ink tracking-tight">Three steps. One goal.</h2>
          </div>
          <span className="text-2xl">✨</span>
        </div>

        <div className="space-y-3">
          {[
            ['01','🎙️','Speak','Tell Assist Me what you need in your own words.'],
            ['02','🛡️','Family approves','Your family reviews the request before help is sent.'],
            ['03','🤝','Help arrives','A verified helper completes the task and keeps everyone updated.'],
          ].map(([num, icon, title, desc]) => (
            <div key={num} className="flex gap-4 p-4 rounded-3xl border border-border bg-white shadow-[0_6px_24px_rgba(16,24,40,.04)]">
              <div className="w-11 h-11 rounded-2xl bg-brand-soft text-brand flex items-center justify-center font-extrabold shrink-0">{num}</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5"><span className="text-xl">{icon}</span><span className="text-lg font-extrabold text-ink">{title}</span></div>
                <p className="text-base text-ink-muted leading-snug">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl p-5 bg-[#F0FDF4] border border-[#D1FADF]">
          <p className="text-xs font-extrabold uppercase tracking-widest text-success mb-2">Why families choose it</p>
          <p className="text-xl font-extrabold text-ink leading-snug">More independence for parents. More peace of mind for families.</p>
          <div className="grid grid-cols-3 gap-2 mt-5">
            {[['100%','Family approved'],['8 min','Avg. approval'],['24/7','Help network']].map(([n,l]) => (
              <div key={l} className="bg-white rounded-2xl p-3 text-center border border-[#D1FADF]">
                <div className="text-xl font-extrabold text-success">{n}</div>
                <div className="text-[11px] font-bold text-ink-muted mt-1 leading-tight">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Btn onClick={onDemo} size="lg">Start with a request →</Btn>
          <p className="text-center text-xs text-ink-muted font-bold mt-3">Demo data only • No account required</p>
        </div>
      </section>
    </div>
  )
}

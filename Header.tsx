import type { Role } from '@/types';
import { useState } from 'react';
import { Heart, Mic, Users, Package, Type, ChevronDown } from 'lucide-react';

interface HeaderProps {
  role: Role;
  onRoleChange: (r: Role) => void;
  textSize: 'normal' | 'large' | 'xlarge';
  onTextSizeChange: (t: 'normal' | 'large' | 'xlarge') => void;
}

const ROLES: { id: Role; label: string; icon: typeof Mic }[] = [
  { id: 'elder', label: 'Elder', icon: Mic },
  { id: 'family', label: 'Family', icon: Users },
  { id: 'helper', label: 'Helper', icon: Package },
];

const TEXT_SIZES: { id: 'normal' | 'large' | 'xlarge'; label: string }[] = [
  { id: 'normal', label: 'A' },
  { id: 'large', label: 'A' },
  { id: 'xlarge', label: 'A' },
];

export function Header({ role, onRoleChange, textSize, onTextSizeChange }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-soft">
            <Heart className="w-5 h-5 text-white" fill="white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-lg text-ink">Assist Me</div>
            <div className="text-[11px] text-muted font-semibold -mt-0.5 hidden sm:block">
              Just ask. We'll help.
            </div>
          </div>
        </div>

        {/* Role switcher */}
        <div className="flex items-center gap-2">
          <div
            className="flex bg-bg rounded-2xl p-1 border border-black/[0.06]"
            role="tablist"
            aria-label="Switch role"
          >
            {ROLES.map(({ id, label, icon: Icon }) => {
              const active = role === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onRoleChange(id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? 'bg-primary text-white shadow-soft'
                      : 'text-muted hover:text-ink hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Text size control */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Change text size"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="w-10 h-10 rounded-2xl bg-bg border border-black/[0.06] flex items-center justify-center text-ink hover:bg-white transition-colors"
            >
              <Type className="w-5 h-5" strokeWidth={2.5} />
              <ChevronDown className="w-3.5 h-3.5 -ml-0.5" strokeWidth={2.5} />
            </button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                  aria-hidden
                />
                <div
                  role="menu"
                  className="absolute right-0 mt-2 z-20 bg-white rounded-2xl shadow-soft border border-black/[0.06] p-1.5 min-w-[170px] animate-soften"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wide">
                    Text size
                  </div>
                  {TEXT_SIZES.map((ts, i) => (
                    <button
                      key={ts.id}
                      role="menuitemradio"
                      aria-checked={textSize === ts.id}
                      onClick={() => {
                        onTextSizeChange(ts.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-bold transition-colors ${
                        textSize === ts.id
                          ? 'bg-primary-light text-primary'
                          : 'text-ink hover:bg-bg'
                      }`}
                    >
                      <span>
                        {i === 0 ? 'Normal' : i === 1 ? 'Large' : 'Extra Large'}
                      </span>
                      <span
                        className={`font-extrabold ${
                          i === 0 ? 'text-sm' : i === 1 ? 'text-base' : 'text-lg'
                        }`}
                      >
                        A
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

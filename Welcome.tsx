import { Mic, Users, PackageCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface WelcomeProps {
  onStart: () => void;
}

export function Welcome({ onStart }: WelcomeProps) {
  const steps = [
    {
      icon: Mic,
      title: '1. Speak',
      desc: 'Tell us what you need.',
    },
    {
      icon: Users,
      title: '2. Family approves',
      desc: 'Your family stays in control.',
    },
    {
      icon: PackageCheck,
      title: '3. Helper helps',
      desc: 'A trusted helper completes the task.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-0px)] flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto w-full">
        <div className="animate-fadeUp text-center">
          {/* Mic badge */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute w-28 h-28 rounded-full bg-primary/10 animate-pulseRing" />
            <div className="absolute w-24 h-24 rounded-full bg-primary/15" />
            <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-mic">
              <Mic className="w-9 h-9 text-white" strokeWidth={2.5} fill="white" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-ink tracking-tight">
            Assist Me
          </h1>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-primary">
            Just ask. We'll help.
          </p>
          <p className="mt-5 text-lg text-muted max-w-xl mx-auto leading-relaxed">
            Helping older adults stay independent while keeping their families
            connected.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl animate-fadeUp">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="bg-white rounded-3xl p-6 shadow-soft border border-black/[0.04] text-center"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-primary" strokeWidth={2.5} />
              </div>
              <h3 className="font-extrabold text-lg text-ink">{title}</h3>
              <p className="mt-1.5 text-muted text-sm font-semibold leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 animate-fadeUp">
          <Button size="xl" onClick={onStart} className="px-12">
            Start Demo
            <ArrowRight className="w-6 h-6 ml-2 inline" strokeWidth={2.5} />
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-bold text-success">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" /> Family approved
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" /> Trusted helper
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" /> Delivery confirmed
          </span>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from 'react';
import type { Role } from '@/types';
import { useAppState } from '@/hooks/useAppState';
import { Header } from '@/components/Header';
import { Welcome } from '@/components/Welcome';
import { ElderHome } from '@/components/elder/ElderHome';
import { Listen } from '@/components/elder/Listen';
import { TypeRequest } from '@/components/elder/TypeRequest';
import { ConfirmRequest } from '@/components/elder/ConfirmRequest';
import { RequestSent } from '@/components/elder/RequestSent';
import { MedicineSafety, MedicineSomethingElse } from '@/components/elder/MedicineSafety';
import type { HelpRequest } from '@/types';
import { FamilyHome } from '@/components/family/FamilyHome';
import { FamilyApproving } from '@/components/family/FamilyApproving';
import { HelperHome } from '@/components/helper/HelperHome';
import { HelperDelivered } from '@/components/helper/HelperDelivered';
import { parseRequest, isMedicine, tidyTranscript } from '@/lib/parseRequest';

type ElderStep =
  | 'home'
  | 'listening'
  | 'typing'
  | 'medicine_safety'
  | 'medicine_else'
  | 'confirm'
  | 'sent';

type FamilyStep = 'home' | 'approving';
type HelperStep = 'home' | 'delivered';

export default function App() {
  const { state, setRole, setTextSize, createRequest, updateRequest, setStatus, clearRequest } =
    useAppState();
  const [started, setStarted] = useState(false);

  const [elderStep, setElderStep] = useState<ElderStep>('home');
  const [familyStep, setFamilyStep] = useState<FamilyStep>('home');
  const [helperStep, setHelperStep] = useState<HelperStep>('home');

  // Pending parsed request being confirmed by elder
  const [pending, setPending] = useState<{
    title: string;
    description: string;
    category: ReturnType<typeof parseRequest>['category'];
    estimatedCost: number;
    raw: string;
  } | null>(null);

  // Apply text size to <html>
  useEffect(() => {
    document.documentElement.dataset.textsize = state.textSize;
  }, [state.textSize]);

  // Reset local step when role changes (avoid stale screens)
  useEffect(() => {
    if (state.role === 'elder') setElderStep('home');
    if (state.role === 'family') setFamilyStep('home');
    if (state.role === 'helper') setHelperStep('home');
  }, [state.role]);

  if (!started) {
    return (
      <div className="min-h-screen bg-bg">
        <Welcome onStart={() => setStarted(true)} />
      </div>
    );
  }

  const handleTranscript = (text: string) => {
    const raw = text.trim();
    if (isMedicine(raw)) {
      setPending({
        ...parseRequest(raw),
        description: tidyTranscript(raw),
        raw,
      });
      setElderStep('medicine_safety');
      return;
    }
    const parsed = parseRequest(raw);
    setPending({
      ...parsed,
      description: tidyTranscript(raw),
      raw,
    });
    setElderStep('confirm');
  };

  const sendRequest = (overrideDescription?: string) => {
    if (!pending) return;
    createRequest({
      title: pending.title,
      description: overrideDescription ?? pending.description,
      category: pending.category,
      estimatedCost: pending.estimatedCost,
      status: 'pending_family',
    });
    setElderStep('sent');
  };

  const renderRole = () => {
    if (state.role === 'elder') {
      switch (elderStep) {
        case 'home':
          return (
            <ElderHome
              request={state.activeRequest}
              history={state.history}
              onSpeak={() => setElderStep('listening')}
              onType={() => setElderStep('typing')}
              onReadAloud={() => {}}
              onNewRequest={() => {
                clearRequest();
                setPending(null);
                setElderStep('home');
              }}
              onQuickHelp={(text) => handleTranscript(text)}
              onRepeat={(req) => {
                setPending({
                  title: req.title,
                  description: req.description,
                  category: req.category,
                  estimatedCost: req.estimatedCost,
                  raw: req.description,
                });
                setElderStep('confirm');
              }}
            />
          );
        case 'listening':
          return (
            <Listen
              onResult={handleTranscript}
              onTypeInstead={() => setElderStep('typing')}
              onBack={() => setElderStep('home')}
            />
          );
        case 'typing':
          return (
            <TypeRequest
              onSubmit={handleTranscript}
              onBack={() => setElderStep('home')}
            />
          );
        case 'medicine_safety':
          return pending ? (
            <MedicineSafety
              transcript={pending.raw}
              onSelectUsual={() => setElderStep('confirm')}
              onSelectSomethingElse={() => setElderStep('medicine_else')}
              onSelectAskChild={() => setElderStep('medicine_else')}
            />
          ) : null;
        case 'medicine_else':
          return (
            <MedicineSomethingElse
              onBack={() => setElderStep('medicine_safety')}
              onSubmit={() => sendRequest('I need my medicine — please confirm with Sarah')}
            />
          );
        case 'confirm':
          return pending ? (
            <ConfirmRequest
              title={pending.title}
              description={pending.description}
              category={pending.category}
              estimatedCost={pending.estimatedCost}
              onConfirm={(desc) => sendRequest(desc)}
              onRetry={() => {
                setPending(null);
                setElderStep('home');
              }}
            />
          ) : null;
        case 'sent':
          return (
            <RequestSent
              familyName={state.activeRequest?.family ?? 'Sarah'}
              onBackHome={() => setElderStep('home')}
            />
          );
        default:
          return null;
      }
    }

    if (state.role === 'family') {
      if (familyStep === 'approving') {
        return (
          <FamilyApproving
            onDone={() => {
              setStatus('approved');
              setFamilyStep('home');
            }}
          />
        );
      }
      return (
        <FamilyHome
          request={state.activeRequest}
          onApprove={() => setFamilyStep('approving')}
          onReject={(reason) => {
            setStatus('rejected', reason);
          }}
        />
      );
    }

    // helper
    if (helperStep === 'delivered') {
      return (
        <HelperDelivered
          onContinue={() => {
            setHelperStep('home');
          }}
          elderName={state.activeRequest?.elder ?? 'Mary'}
        />
      );
    }
    return (
      <HelperHome
        request={state.activeRequest}
        deliveries={state.history.filter((h) => h.status === 'completed').length}
        onAccept={() => setStatus('accepted')}
        onOnMyWay={() => setStatus('on_the_way')}
        onPickedUp={() => setStatus('picked_up')}
        onDelivered={() => {
          setStatus('completed');
          setHelperStep('delivered');
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header
        role={state.role}
        onRoleChange={setRole}
        textSize={state.textSize}
        onTextSizeChange={setTextSize}
      />
      <main className="flex-1 py-6 sm:py-10">{renderRole()}</main>
      <footer className="text-center text-xs text-muted font-semibold py-4">
        Assist Me · Just ask. We'll help.
      </footer>
    </div>
  );
}

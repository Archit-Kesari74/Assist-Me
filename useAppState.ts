import { useEffect, useState, useCallback } from 'react';
import type { AppState, HelpRequest, Role } from '@/types';
import { loadState, saveState } from '@/lib/storage';
import { api } from '@/lib/api';

const STORAGE_KEY = 'assist-me-state-v1';

function makeRequest(partial: Partial<HelpRequest>): HelpRequest {
  const now = Date.now();
  return {
    id: partial.id || `req_${now}_${Math.random().toString(36).slice(2, 8)}`,
    title: partial.title || 'Help',
    description: partial.description || '',
    category: partial.category || 'other',
    status: partial.status || 'pending_family',
    elder: partial.elder || 'Mary',
    family: partial.family || 'Sarah',
    helper: partial.helper || 'Alex',
    estimatedCost: partial.estimatedCost ?? 0,
    createdAt: partial.createdAt || now,
    updatedAt: partial.updatedAt || now,
    location: partial.location || "Mary's home",
    ...partial,
  };
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState(STORAGE_KEY));

  // Sync state to local storage
  useEffect(() => {
    saveState(STORAGE_KEY, state);
  }, [state]);

  // Initial load from backend API if available
  useEffect(() => {
    let mounted = true;
    async function syncFromBackend() {
      try {
        const [active, history] = await Promise.all([
          api.getActiveRequest(),
          api.getHistory(),
        ]);
        if (mounted) {
          setState((s) => ({
            ...s,
            activeRequest: active,
            history: history && history.length > 0 ? history : s.history,
          }));
        }
      } catch {
        // Backend offline or unreachable: continue with localStorage cache
      }
    }
    syncFromBackend();
    return () => {
      mounted = false;
    };
  }, []);

  const setRole = useCallback((role: Role) => {
    setState((s) => ({ ...s, role }));
  }, []);

  const setTextSize = useCallback(
    (textSize: AppState['textSize']) => setState((s) => ({ ...s, textSize })),
    []
  );

  const createRequest = useCallback(async (data: Partial<HelpRequest>) => {
    const newReq = makeRequest(data);
    setState((s) => ({ ...s, activeRequest: newReq }));

    try {
      const serverReq = await api.createRequest(newReq);
      setState((s) => ({ ...s, activeRequest: serverReq }));
    } catch {
      // Offline fallback: already in local state
    }
  }, []);

  const updateRequest = useCallback(
    async (patch: Partial<HelpRequest>) => {
      setState((s) =>
        s.activeRequest
          ? {
              ...s,
              activeRequest: {
                ...s.activeRequest,
                ...patch,
                updatedAt: Date.now(),
              },
            }
          : s
      );

      if (state.activeRequest?.id) {
        try {
          const updated = await api.updateRequest(state.activeRequest.id, patch);
          setState((s) => ({ ...s, activeRequest: updated }));
        } catch {
          // Offline fallback
        }
      }
    },
    [state.activeRequest?.id]
  );

  const setStatus = useCallback(
    async (status: HelpRequest['status'], rejectReason?: string) => {
      const targetId = state.activeRequest?.id;
      const now = Date.now();

      setState((s) => {
        if (!s.activeRequest) return s;
        const updated: HelpRequest = {
          ...s.activeRequest,
          status,
          rejectReason: rejectReason || s.activeRequest.rejectReason,
          updatedAt: now,
        };
        const isTerminal = status === 'completed' || status === 'rejected';
        if (isTerminal) {
          const history = [updated, ...s.history.filter((h) => h.id !== updated.id)].slice(0, 20);
          return { ...s, activeRequest: updated, history };
        }
        return { ...s, activeRequest: updated };
      });

      if (targetId) {
        try {
          const serverUpdated = await api.updateStatus(
            targetId,
            status,
            rejectReason,
            state.role === 'family' ? 'Sarah' : state.role === 'helper' ? 'Alex' : 'Mary'
          );
          const isTerminal = status === 'completed' || status === 'rejected';
          setState((s) => ({
            ...s,
            activeRequest: serverUpdated,
            history: isTerminal
              ? [serverUpdated, ...s.history.filter((h) => h.id !== serverUpdated.id)].slice(0, 20)
              : s.history,
          }));
        } catch {
          // Offline fallback
        }
      }
    },
    [state.activeRequest?.id, state.role]
  );

  const clearRequest = useCallback(async () => {
    setState((s) => ({ ...s, activeRequest: null }));
    try {
      await api.clearActiveRequest();
    } catch {
      // Offline fallback
    }
  }, []);

  return {
    state,
    setRole,
    setTextSize,
    createRequest,
    updateRequest,
    setStatus,
    clearRequest,
  };
}

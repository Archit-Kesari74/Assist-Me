import type { AppState } from '@/types';

export function loadState(key: string): AppState {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        activeRequest: parsed.activeRequest ?? null,
        history: parsed.history ?? [],
        role: parsed.role ?? 'elder',
        textSize: parsed.textSize ?? 'normal',
      };
    }
  } catch {
    /* ignore */
  }
  return { activeRequest: null, history: [], role: 'elder', textSize: 'normal' };
}

export function saveState(key: string, state: AppState): void {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

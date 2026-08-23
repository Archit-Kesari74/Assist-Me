import type { HelpRequest, RequestCategory } from '@/types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `HTTP error! status: ${res.status}`);
  }

  return res.json();
}

export interface ParseResult {
  category: RequestCategory;
  title: string;
  description: string;
  raw: string;
  estimatedCost: number;
  isMedicine: boolean;
  needsSafetyReview: boolean;
}

export interface AppStats {
  totalRequests: number;
  activeCount: number;
  completedDeliveries: number;
  pendingFamily: number;
  pendingHelper: number;
  rejectedCount: number;
  totalDeliveredValue: number;
}

export const api = {
  /** Check if the Python backend is running and reachable */
  async isHealthy(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },

  /** Get active help request */
  async getActiveRequest(): Promise<HelpRequest | null> {
    return fetchJson<HelpRequest | null>('/api/requests/active');
  },

  /** Get request history */
  async getHistory(): Promise<HelpRequest[]> {
    return fetchJson<HelpRequest[]>('/api/requests/history');
  },

  /** Create a new help request */
  async createRequest(data: Partial<HelpRequest>): Promise<HelpRequest> {
    return fetchJson<HelpRequest>('/api/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /** Update request fields */
  async updateRequest(id: string, patch: Partial<HelpRequest>): Promise<HelpRequest> {
    return fetchJson<HelpRequest>(`/api/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
  },

  /** Update status (e.g. approve, accept, on_the_way, picked_up, completed, rejected) */
  async updateStatus(
    id: string,
    status: HelpRequest['status'],
    rejectReason?: string,
    performedBy?: string
  ): Promise<HelpRequest> {
    return fetchJson<HelpRequest>(`/api/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejectReason, performedBy }),
    });
  },

  /** Clear/archive active request */
  async clearActiveRequest(): Promise<void> {
    await fetchJson('/api/requests/clear', { method: 'POST' });
  },

  /** Natural language parsing of speech or text */
  async parseTranscript(text: string): Promise<ParseResult> {
    return fetchJson<ParseResult>('/api/parse', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  /** Get app dashboard stats */
  async getStats(): Promise<AppStats> {
    return fetchJson<AppStats>('/api/stats');
  },
};

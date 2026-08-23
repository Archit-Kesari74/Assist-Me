import type { RequestStatus } from '@/types';

interface StatusConfig {
  label: string;
  tone: 'waiting' | 'active' | 'done' | 'error';
  icon: string;
}

export const STATUS_FLOW: RequestStatus[] = [
  'pending_family',
  'approved',
  'accepted',
  'on_the_way',
  'picked_up',
  'completed',
];

export function statusConfig(status: RequestStatus): StatusConfig {
  switch (status) {
    case 'pending_family':
      return { label: 'Waiting for family', tone: 'waiting', icon: 'clock' };
    case 'approved':
      return { label: 'Approved', tone: 'active', icon: 'check' };
    case 'accepted':
      return { label: 'Helper found', tone: 'active', icon: 'user' };
    case 'on_the_way':
      return { label: 'On the way', tone: 'active', icon: 'truck' };
    case 'picked_up':
      return { label: 'Picked up', tone: 'active', icon: 'package' };
    case 'completed':
      return { label: 'Delivered', tone: 'done', icon: 'check' };
    case 'rejected':
      return { label: 'Declined by family', tone: 'error', icon: 'x' };
    default:
      return { label: 'Sent', tone: 'waiting', icon: 'clock' };
  }
}

export function statusStepIndex(status: RequestStatus): number {
  const idx = STATUS_FLOW.indexOf(status);
  return idx === -1 ? 0 : idx;
}

import { PantryItem, Category } from '../types';

export function getDaysUntilExpiry(item: PantryItem): number | null {
  if (!item.expiryDate) return null;
  const expiry = new Date(item.expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isLowStock(item: PantryItem): boolean {
  return item.quantity <= item.lowStockThreshold;
}

export function isExpiringSoon(item: PantryItem): boolean {
  const days = getDaysUntilExpiry(item);
  return days !== null && days <= 7;
}

export function getExpiryStatus(item: PantryItem): 'expired' | 'critical' | 'warning' | 'safe' {
  const days = getDaysUntilExpiry(item);
  if (days === null) return 'safe';
  if (days < 0) return 'expired';
  if (days <= 7) return 'critical';
  if (days <= 14) return 'warning';
  return 'safe';
}

export function getExpiryColor(status: 'expired' | 'critical' | 'warning' | 'safe'): string {
  switch (status) {
    case 'expired':
    case 'critical':
      return 'text-red-600';
    case 'warning':
      return 'text-amber-600';
    default:
      return 'text-green-600';
  }
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatDateLong(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export const categoryColors: Record<Category, { bg: string; text: string }> = {
  Food: { bg: 'bg-green-100', text: 'text-green-700' },
  Beverages: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Cleaning: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  'Personal Care': { bg: 'bg-pink-100', text: 'text-pink-700' },
  Medicines: { bg: 'bg-red-100', text: 'text-red-700' },
  Other: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export function generateAITip(items: PantryItem[]): string {
  if (items.length === 0) {
    return "Your pantry is empty! Start by adding some items to track.";
  }

  const lowStockItems = items.filter(isLowStock);
  const expiringSoon = items.filter(isExpiringSoon);
  const expiredItems = items.filter(item => {
    const days = getDaysUntilExpiry(item);
    return days !== null && days < 0;
  });

  if (expiredItems.length > 0) {
    const names = expiredItems.slice(0, 2).map(i => i.name).join(' and ');
    return `${expiredItems.length > 1 ? 'Some items have' : 'An item has'} expired! Check ${names}${expiredItems.length > 2 ? ' and others' : ''}.`;
  }

  if (expiringSoon.length > 0) {
    const item = expiringSoon[0];
    const days = getDaysUntilExpiry(item);
    return `${item.name} ${days === 0 ? 'expires today' : days === 1 ? 'expires tomorrow' : `expires in ${days} days`}. Use it soon!`;
  }

  if (lowStockItems.length > 0) {
    const item = lowStockItems[0];
    return `${item.name} is running low (${item.quantity} ${item.unit} left). Consider restocking.`;
  }

  return "Your pantry looks well-stocked! Keep tracking your items for smarter insights.";
}

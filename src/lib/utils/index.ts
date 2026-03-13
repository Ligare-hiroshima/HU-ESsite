import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'yyyy/MM/dd', { locale: ja });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'yyyy/MM/dd HH:mm', { locale: ja });
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ja });
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

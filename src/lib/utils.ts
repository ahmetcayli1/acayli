import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function calculateDiscount(listPrice: number, discountPercent: number): number {
  return Math.round(listPrice * (1 - discountPercent / 100))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getLanguageFlag(language: string): string {
  const flags: Record<string, string> = {
    EN: '🇬🇧',
    DE: '🇩🇪',
    IT: '🇮🇹',
    PL: '🇵🇱',
    FR: '🇫🇷',
    ES: '🇪🇸',
    PT: '🇵🇹',
    NL: '🇳🇱',
  }
  return flags[language.toUpperCase()] || '🌍'
}

export function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    germany: '🇩🇪',
    italy: '🇮🇹',
    poland: '🇵🇱',
    france: '🇫🇷',
    spain: '🇪🇸',
    portugal: '🇵🇹',
    netherlands: '🇳🇱',
    uk: '🇬🇧',
    usa: '🇺🇸',
    canada: '🇨🇦',
    australia: '🇦🇺',
    austria: '🇦🇹',
    switzerland: '🇨🇭',
  }
  return flags[country.toLowerCase()] || '🌍'
}

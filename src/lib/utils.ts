import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format tanggal ke format Indonesia
 * @param date Tanggal yang akan diformat
 * @returns String tanggal dalam format Indonesia
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

/**
 * Format tanggal ke format hanya tanggal (tanpa waktu)
 * @param date Tanggal yang akan diformat
 * @returns String tanggal dalam format Indonesia (tanggal bulan tahun)
 */
export function formatDateOnly(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('id-ID', options).format(date);
}

/**
 * Format waktu saja
 * @param date Tanggal yang akan diformat
 * @returns String waktu dalam format HH:MM
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

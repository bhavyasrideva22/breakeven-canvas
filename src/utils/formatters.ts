
/**
 * Format a number as Indian Rupee
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date in Indian format (DD/MM/YYYY)
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a number with comma separators in Indian format
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

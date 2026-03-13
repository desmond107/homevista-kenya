/**
 * Format price to Kenyan Shilling format with option for USD conversion
 * @param price - Price in KES
 * @param currency - 'KES' or 'USD' (default: 'KES')
 * @param exchangeRate - USD to KES rate (default: 130)
 */
export function formatPrice(
  price: number,
  currency: 'KES' | 'USD' = 'KES',
  exchangeRate: number = 130
): string {
  if (currency === 'USD') {
    const usdPrice = Math.floor(price / exchangeRate);
    return `$${usdPrice.toLocaleString('en-US')}`;
  }

  return `KES ${price.toLocaleString('en-KE')}`;
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2592000000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

  return formatDate(dateString);
}

/**
 * Mask phone number
 */
export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 4) {
    return cleaned.slice(0, -4).replace(/./g, '*') + cleaned.slice(-4);
  }
  return phone;
}

/**
 * Mask email address
 */
export function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}*`;
  return `${maskedName}@${domain}`;
}

/**
 * Mask location or address
 */
export function maskLocation(location: string): string {
  if (!location) return 'Hidden for privacy';
  const visible = location.split(',')[0] || location;
  return `${visible} • Exact location hidden`;
}

/**
 * Format area in square meters
 */
export function formatArea(area: number): string {
  return `${area.toLocaleString('en-KE')} m²`;
}

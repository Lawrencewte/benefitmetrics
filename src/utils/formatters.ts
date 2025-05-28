/**
 * Format a number as currency
 * 
 * @param value Number to format
 * @param currency Currency code (default: 'USD')
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | null | undefined,
  currency = 'USD',
  locale = 'en-US'
): string => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number with thousands separators
 * 
 * @param value Number to format
 * @param decimals Number of decimal places (default: 0)
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined,
  decimals = 0,
  locale = 'en-US'
): string => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a percentage
 * 
 * @param value Number to format as percentage (e.g., 0.75 for 75%)
 * @param decimals Number of decimal places (default: 0)
 * @param locale Locale for formatting (default: 'en-US')
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number | null | undefined,
  decimals = 0,
  locale = 'en-US'
): string => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a phone number in US format
 * 
 * @param phoneNumber Phone number string
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid US phone number
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phoneNumber;
};

/**
 * Truncate text to a maximum length with ellipsis
 * 
 * @param text Text to truncate
 * @param maxLength Maximum length (default: 100)
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength = 100): string => {
  if (!text) return '';
  
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

/**
 * Format a name (first and last)
 * 
 * @param firstName First name
 * @param lastName Last name
 * @param includeLastName Whether to include last name (default: true)
 * @returns Formatted name
 */
export const formatName = (
  firstName: string,
  lastName: string,
  includeLastName = true
): string => {
  if (!firstName && !lastName) return '';
  
  if (!includeLastName) return firstName || '';
  
  if (!firstName) return lastName || '';
  if (!lastName) return firstName || '';
  
  return `${firstName} ${lastName}`;
};

/**
 * Format file size
 * 
 * @param bytes Size in bytes
 * @param decimals Number of decimal places (default: 2)
 * @returns Human-readable file size
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Format a duration in minutes
 * 
 * @param minutes Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30m")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 0) return '';
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  
  return `${hours}h ${remainingMinutes}m`;
};

/**
 * Get initials from name
 * 
 * @param name Full name
 * @param maxLength Maximum number of initials (default: 2)
 * @returns Initials
 */
export const getInitials = (name: string, maxLength = 2): string => {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return parts
    .slice(0, maxLength)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
};

/**
 * Format a list of items as a string
 * 
 * @param items Array of items
 * @param conjunction Conjunction to use (default: 'and')
 * @returns Formatted list string
 */
export const formatList = (items: string[], conjunction = 'and'): string => {
  if (!items || items.length === 0) return '';
  
  if (items.length === 1) return items[0];
  
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1);
  
  return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};

/**
 * Format a score as a tier
 * 
 * @param score Score value (0-100)
 * @returns Tier string
 */
export const formatScoreAsTier = (score: number): string => {
  if (score >= 90) return 'Platinum';
  if (score >= 80) return 'Gold';
  if (score >= 60) return 'Silver';
  return 'Bronze';
};

/**
 * Format a score color based on value
 * 
 * @param score Score value (0-100) or status string
 * @returns Color hex code
 */
export const getScoreColor = (score: number | string): string => {
  if (typeof score === 'string') {
    switch (score.toLowerCase()) {
      case 'excellent':
        return '#10B981'; // green-500
      case 'good':
        return '#3B82F6'; // blue-500
      case 'fair':
        return '#F59E0B'; // amber-500
      case 'poor':
        return '#EF4444'; // red-500
      default:
        return '#6B7280'; // gray-500
    }
  }
  
  if (score >= 80) return '#10B981'; // green-500
  if (score >= 60) return '#3B82F6'; // blue-500
  if (score >= 40) return '#F59E0B'; // amber-500
  return '#EF4444'; // red-500
};
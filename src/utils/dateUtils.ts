import { addDays, differenceInDays, differenceInYears, format, formatDistanceToNow, isAfter, isBefore, isValid, parse } from 'date-fns';

/**
 * Format a date with the specified format string
 * 
 * @param date The date to format
 * @param formatString The format string (default: 'MMM d, yyyy')
 * @returns Formatted date string or empty string if date is invalid
 */
export const formatDate = (date: Date | string | number | null | undefined, formatString = 'MMM d, yyyy'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, formatString);
};

/**
 * Format a date as a relative time (e.g., "2 days ago", "in 3 months")
 * 
 * @param date The date to format
 * @returns Relative time string or empty string if date is invalid
 */
export const formatRelativeTime = (date: Date | string | number | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return '';
  
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Parse a date string with the specified format
 * 
 * @param dateString The date string to parse
 * @param formatString The format string (default: 'yyyy-MM-dd')
 * @returns Parsed Date object or null if invalid
 */
export const parseDate = (dateString: string, formatString = 'yyyy-MM-dd'): Date | null => {
  if (!dateString) return null;
  
  const parsedDate = parse(dateString, formatString, new Date());
  
  return isValid(parsedDate) ? parsedDate : null;
};

/**
 * Calculate age from birthdate
 * 
 * @param birthDate The birth date
 * @returns Age in years or null if birthDate is invalid
 */
export const calculateAge = (birthDate: Date | string | number | null | undefined): number | null => {
  if (!birthDate) return null;
  
  const dateObj = typeof birthDate === 'string' || typeof birthDate === 'number' ? new Date(birthDate) : birthDate;
  
  if (!isValid(dateObj)) return null;
  
  return differenceInYears(new Date(), dateObj);
};

/**
 * Check if a date is in the past
 * 
 * @param date The date to check
 * @returns True if date is in the past, false otherwise
 */
export const isPastDate = (date: Date | string | number | null | undefined): boolean => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return false;
  
  return isBefore(dateObj, new Date());
};

/**
 * Check if a date is in the future
 * 
 * @param date The date to check
 * @returns True if date is in the future, false otherwise
 */
export const isFutureDate = (date: Date | string | number | null | undefined): boolean => {
  if (!date) return false;
  
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return false;
  
  return isAfter(dateObj, new Date());
};

/**
 * Calculate days between two dates
 * 
 * @param startDate The start date
 * @param endDate The end date (default: current date)
 * @returns Number of days between dates or null if either date is invalid
 */
export const daysBetween = (
  startDate: Date | string | number | null | undefined, 
  endDate: Date | string | number | null | undefined = new Date()
): number | null => {
  if (!startDate || !endDate) return null;
  
  const startObj = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
  const endObj = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;
  
  if (!isValid(startObj) || !isValid(endObj)) return null;
  
  return differenceInDays(endObj, startObj);
};

/**
 * Add days to a date
 * 
 * @param date The starting date
 * @param days Number of days to add
 * @returns New date with days added or null if date is invalid
 */
export const addDaysToDate = (
  date: Date | string | number | null | undefined, 
  days: number
): Date | null => {
  if (!date) return null;
  
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return null;
  
  return addDays(dateObj, days);
};

/**
 * Format time from 24-hour format to 12-hour format
 * 
 * @param time Time string in 24-hour format (HH:MM)
 * @returns Time string in 12-hour format (h:MM A)
 */
export const formatTime = (time: string): string => {
  if (!time || !time.includes(':')) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Generate time slots for a day with specified interval
 * 
 * @param startHour Starting hour (0-23)
 * @param endHour Ending hour (0-23)
 * @param intervalMinutes Interval in minutes
 * @returns Array of time strings in 24-hour format (HH:MM)
 */
export const generateTimeSlots = (
  startHour = 8, 
  endHour = 17, 
  intervalMinutes = 30
): string[] => {
  const slots: string[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      // Stop at exact end hour
      if (hour === endHour && minute > 0) break;
      
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  
  return slots;
};

/**
 * Get calendar weeks for a month view
 * 
 * @param year Year
 * @param month Month (0-11)
 * @param firstDayOfWeek First day of week (0 = Sunday, 1 = Monday, etc.)
 * @returns Array of weeks, each containing array of day objects
 */
export const getCalendarWeeks = (
  year: number,
  month: number,
  firstDayOfWeek = 0
): { date: Date; isCurrentMonth: boolean; isToday: boolean; }[][] => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const today = new Date();
  
  // Get the day of week for the first day of month
  let firstDayOfMonthWeekday = firstDayOfMonth.getDay() - firstDayOfWeek;
  if (firstDayOfMonthWeekday < 0) firstDayOfMonthWeekday += 7;
  
  // Get the day of week for the last day of month
  let lastDayOfMonthWeekday = lastDayOfMonth.getDay() - firstDayOfWeek;
  if (lastDayOfMonthWeekday < 0) lastDayOfMonthWeekday += 7;
  
  // Calculate days to include from previous month
  const daysFromPrevMonth = firstDayOfMonthWeekday;
  
  // Calculate days to include from next month
  const daysFromNextMonth = 6 - lastDayOfMonthWeekday;
  
  // Get the first date to display (might be from previous month)
  const firstDateToDisplay = new Date(year, month, 1 - daysFromPrevMonth);
  
  // Calculate total number of days to display
  const totalDays = daysFromPrevMonth + lastDayOfMonth.getDate() + daysFromNextMonth;
  
  // Calculate number of weeks
  const numberOfWeeks = Math.ceil(totalDays / 7);
  
  // Generate calendar data
  const weeks: { date: Date; isCurrentMonth: boolean; isToday: boolean; }[][] = [];
  let currentDate = new Date(firstDateToDisplay);
  
  for (let weekIndex = 0; weekIndex < numberOfWeeks; weekIndex++) {
    const week: { date: Date; isCurrentMonth: boolean; isToday: boolean; }[] = [];
    
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const date = new Date(currentDate);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getDate() === today.getDate() &&
                     date.getMonth() === today.getMonth() &&
                     date.getFullYear() === today.getFullYear();
      
      week.push({ date, isCurrentMonth, isToday });
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    weeks.push(week);
  }
  
  return weeks;
};

/**
 * Get day name
 * 
 * @param day Day of week (0-6, where 0 is Sunday)
 * @param short Whether to return short name
 * @returns Day name
 */
export const getDayName = (day: number, short = false): string => {
  const days = short
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
  return days[day % 7];
};

/**
 * Get month name
 * 
 * @param month Month (0-11, where 0 is January)
 * @param short Whether to return short name
 * @returns Month name
 */
export const getMonthName = (month: number, short = false): string => {
  const months = short
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
  return months[month % 12];
};
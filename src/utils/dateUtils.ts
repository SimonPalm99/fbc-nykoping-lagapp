// Date and time utilities for FBC Nyköping app

/**
 * Formats a date to Swedish locale
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats a date with weekday
 */
export const formatDateWithWeekday = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats time to Swedish format (HH:mm)
 */
export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const safeHours = hours || '00';
  const safeMinutes = minutes || '00';
  return `${safeHours.padStart(2, '0')}:${safeMinutes.padStart(2, '0')}`;
};

/**
 * Gets relative time (e.g., "om 2 dagar", "för 3 timmar sedan")
 */
export const getRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffMs / (1000 * 60));

  if (Math.abs(diffDays) > 7) {
    return formatDate(d);
  } else if (diffDays > 1) {
    return `om ${diffDays} dagar`;
  } else if (diffDays === 1) {
    return 'imorgon';
  } else if (diffDays === 0) {
    if (diffHours > 1) {
      return `om ${diffHours} timmar`;
    } else if (diffHours === 1) {
      return 'om en timme';
    } else if (diffMinutes > 0) {
      return `om ${diffMinutes} minuter`;
    } else if (diffMinutes === 0) {
      return 'nu';
    } else if (diffMinutes > -60) {
      return `för ${Math.abs(diffMinutes)} minuter sedan`;
    } else {
      return 'tidigare idag';
    }
  } else if (diffDays === -1) {
    return 'igår';
  } else {
    return `för ${Math.abs(diffDays)} dagar sedan`;
  }
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

/**
 * Checks if a date is this week
 */
export const isThisWeek = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // Monday
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7)); // Sunday
  
  return d >= startOfWeek && d <= endOfWeek;
};

/**
 * Gets the start of the current season (August 1st)
 */
export const getSeasonStart = (year?: number): Date => {
  const currentYear = year || new Date().getFullYear();
  const seasonStart = new Date(currentYear, 7, 1); // August 1st
  
  // If we're before August, use previous year's season
  if (new Date().getMonth() < 7) {
    seasonStart.setFullYear(currentYear - 1);
  }
  
  return seasonStart;
};

/**
 * Gets the end of the current season (July 31st next year)
 */
export const getSeasonEnd = (year?: number): Date => {
  const seasonStart = getSeasonStart(year);
  return new Date(seasonStart.getFullYear() + 1, 6, 31); // July 31st next year
};

/**
 * Formats duration in minutes to human readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
};

/**
 * Parses time string to minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  const safeHours = hours || 0;
  const safeMinutes = minutes || 0;
  return safeHours * 60 + safeMinutes;
};

/**
 * Converts minutes since midnight to time string
 */
export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Gets the current season string (e.g., "2024/25")
 */
export const getCurrentSeason = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  
  // Season runs from August to July
  if (now.getMonth() >= 7) { // August or later
    return `${year}/${(year + 1).toString().slice(-2)}`;
  } else { // Before August
    return `${year - 1}/${year.toString().slice(-2)}`;
  }
};

/**
 * Calculates age from birth date
 */
export const calculateAge = (birthDate: Date | string): number => {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Gets week number (ISO week)
 */
export const getWeekNumber = (date: Date | string): number => {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

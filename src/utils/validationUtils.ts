// Validation utilities for forms and data

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Email validation
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('E-postadress är obligatorisk');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Ogiltig e-postadress');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Password validation
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Lösenord är obligatoriskt');
  } else {
    if (password.length < 8) {
      errors.push('Lösenordet måste vara minst 8 tecken långt');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Lösenordet måste innehålla minst en liten bokstav');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Lösenordet måste innehålla minst en stor bokstav');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Lösenordet måste innehålla minst en siffra');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Phone number validation (Swedish format)
 */
export const validatePhoneNumber = (phone: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!phone) {
    errors.push('Telefonnummer är obligatoriskt');
  } else {
    const digits = phone.replace(/\D/g, '');
    if (!/^07\d{8}$/.test(digits)) {
      errors.push('Ogiltigt svenskt mobilnummer (ska börja med 07 och ha 10 siffror)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Name validation
 */
export const validateName = (name: string, fieldName: string = 'Namn'): ValidationResult => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push(`${fieldName} är obligatoriskt`);
  } else {
    if (name.trim().length < 2) {
      errors.push(`${fieldName} måste vara minst 2 tecken långt`);
    }
    if (name.trim().length > 50) {
      errors.push(`${fieldName} får inte vara längre än 50 tecken`);
    }
    if (!/^[a-zA-ZåäöÅÄÖ\s-']+$/.test(name)) {
      errors.push(`${fieldName} får endast innehålla bokstäver, mellanslag, bindestreck och apostrofer`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Jersey number validation
 */
export const validateJerseyNumber = (number: number | string): ValidationResult => {
  const errors: string[] = [];
  const num = typeof number === 'string' ? parseInt(number, 10) : number;
  
  if (isNaN(num)) {
    errors.push('Tröjnummer måste vara ett nummer');
  } else {
    if (num < 1 || num > 99) {
      errors.push('Tröjnummer måste vara mellan 1 och 99');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Date validation
 */
export const validateDate = (date: string | Date, fieldName: string = 'Datum'): ValidationResult => {
  const errors: string[] = [];
  
  if (!date) {
    errors.push(`${fieldName} är obligatoriskt`);
  } else {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) {
      errors.push(`Ogiltigt ${fieldName.toLowerCase()}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Birth date validation (must be reasonable age for floorball)
 */
export const validateBirthDate = (birthDate: string | Date): ValidationResult => {
  const errors: string[] = [];
  
  if (!birthDate) {
    errors.push('Födelsedatum är obligatoriskt');
  } else {
    const d = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
    if (isNaN(d.getTime())) {
      errors.push('Ogiltigt födelsedatum');
    } else {
      const today = new Date();
      const age = today.getFullYear() - d.getFullYear();
      const monthDiff = today.getMonth() - d.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < d.getDate())) {
        // age--;
      }
      
      if (age < 5) {
        errors.push('Ålder måste vara minst 5 år');
      }
      if (age > 100) {
        errors.push('Ålder kan inte vara över 100 år');
      }
      if (d > today) {
        errors.push('Födelsedatum kan inte vara i framtiden');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Activity title validation
 */
export const validateActivityTitle = (title: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!title) {
    errors.push('Aktivitetstitel är obligatorisk');
  } else {
    if (title.trim().length < 3) {
      errors.push('Aktivitetstitel måste vara minst 3 tecken lång');
    }
    if (title.trim().length > 100) {
      errors.push('Aktivitetstitel får inte vara längre än 100 tecken');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Activity date validation (must be in the future for new activities)
 */
export const validateActivityDate = (date: string | Date, isEdit: boolean = false): ValidationResult => {
  const errors: string[] = [];
  
  if (!date) {
    errors.push('Aktivitetsdatum är obligatoriskt');
  } else {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) {
      errors.push('Ogiltigt aktivitetsdatum');
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to compare dates only
      d.setHours(0, 0, 0, 0);
      
      if (!isEdit && d < today) {
        errors.push('Aktivitetsdatum kan inte vara i det förflutna');
      }
      
      // Check if date is too far in the future (1 year)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      if (d > maxDate) {
        errors.push('Aktivitetsdatum kan inte vara mer än ett år i framtiden');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Time validation (HH:mm format)
 */
export const validateTime = (time: string, fieldName: string = 'Tid'): ValidationResult => {
  const errors: string[] = [];
  
  if (!time) {
    errors.push(`${fieldName} är obligatorisk`);
  } else {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      errors.push(`${fieldName} måste vara i formatet HH:mm`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate that end time is after start time
 */
export const validateTimeRange = (startTime: string, endTime: string): ValidationResult => {
  const errors: string[] = [];
  
  const startValid = validateTime(startTime, 'Starttid');
  const endValid = validateTime(endTime, 'Sluttid');
  
  errors.push(...startValid.errors, ...endValid.errors);
  
  if (startValid.isValid && endValid.isValid) {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const safeStartHour = startHour || 0;
    const safeStartMin = startMin || 0;
    const safeEndHour = endHour || 0;
    const safeEndMin = endMin || 0;
    
    const startMinutes = safeStartHour * 60 + safeStartMin;
    const endMinutes = safeEndHour * 60 + safeEndMin;
    
    if (endMinutes <= startMinutes) {
      errors.push('Sluttid måste vara efter starttid');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * URL validation
 */
export const validateUrl = (url: string, fieldName: string = 'URL'): ValidationResult => {
  const errors: string[] = [];
  
  if (url) { // Optional field
    try {
      new URL(url);
    } catch {
      errors.push(`${fieldName} måste vara en giltig webbadress`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * File validation
 */
export const validateFile = (
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    required?: boolean;
  } = {}
): ValidationResult => {
  const errors: string[] = [];
  const { maxSize = 5 * 1024 * 1024, allowedTypes = [], required = false } = options;
  
  if (!file) {
    if (required) {
      errors.push('Fil är obligatorisk');
    }
    return { isValid: !required, errors };
  }
  
  if (file.size > maxSize) {
    errors.push(`Filen är för stor. Maximal storlek är ${Math.round(maxSize / (1024 * 1024))} MB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`Filtyp inte tillåten. Tillåtna typer: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Composite validation for user registration
 */
export const validateUserRegistration = (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  jerseyNumber: number;
  birthDate: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  // Validate each field
  const nameValidation = validateName(userData.name);
  const emailValidation = validateEmail(userData.email);
  const passwordValidation = validatePassword(userData.password);
  const phoneValidation = validatePhoneNumber(userData.phone);
  const jerseyValidation = validateJerseyNumber(userData.jerseyNumber);
  const birthDateValidation = validateBirthDate(userData.birthDate);
  
  // Collect all errors
  errors.push(
    ...nameValidation.errors,
    ...emailValidation.errors,
    ...passwordValidation.errors,
    ...phoneValidation.errors,
    ...jerseyValidation.errors,
    ...birthDateValidation.errors
  );
  
  // Check password confirmation
  if (userData.password !== userData.confirmPassword) {
    errors.push('Lösenorden matchar inte');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

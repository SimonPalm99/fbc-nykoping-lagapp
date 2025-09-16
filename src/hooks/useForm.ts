/**
 * Enhanced form hook with validation, error handling, and async support
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface FormField {
  value: any;
  error?: string | undefined;
  touched: boolean;
  validating?: boolean | undefined;
}

export interface FormState {
  [key: string]: FormField;
}

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => string | undefined;
  asyncValidator?: (value: any) => Promise<string | undefined>;
}

export interface FormOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule>>;
  onSubmit?: (values: T) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  resetOnSubmit?: boolean;
}

export interface UseFormReturn<T> {
  values: T;
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]?: boolean };
  isSubmitting: boolean;
  isValidating: boolean;
  isValid: boolean;
  isDirty: boolean;
  setValue: (field: keyof T, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (field: keyof T, error: string) => void;
  clearError: (field: keyof T) => void;
  clearErrors: () => void;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
  validate: (field?: keyof T) => Promise<boolean>;
  getFieldProps: (field: keyof T) => {
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    error: string | undefined;
    touched: boolean;
  };
}

export function useForm<T extends Record<string, any>>(
  options: FormOptions<T>
): UseFormReturn<T> {
  const {
    initialValues,
    validationRules = {} as Partial<Record<keyof T, ValidationRule>>,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    resetOnSubmit = false
  } = options;

  // Form state
  const [formState, setFormState] = useState<FormState>(() => {
    const state: FormState = {};
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        touched: false,
        validating: false,
        error: undefined
      };
    });
    return state;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

  // Computed values
  const values = Object.keys(formState).reduce((acc, key) => {
    const field = formState[key];
    if (field) {
      acc[key as keyof T] = field.value;
    }
    return acc;
  }, {} as T);

  const errors = Object.keys(formState).reduce((acc, key) => {
    const field = formState[key];
    if (field?.error) {
      acc[key as keyof T] = field.error;
    }
    return acc;
  }, {} as { [K in keyof T]?: string });

  const touched = Object.keys(formState).reduce((acc, key) => {
    const field = formState[key];
    if (field) {
      acc[key as keyof T] = field.touched;
    }
    return acc;
  }, {} as { [K in keyof T]?: boolean });

  const isValidating = Object.values(formState).some(field => field?.validating === true);
  const isValid = Object.values(formState).every(field => !field?.error);
  const isDirty = Object.keys(formState).some(key => {
    const field = formState[key];
    return field && field.value !== initialValues[key as keyof T];
  });

  // Validation function
  const validateField = useCallback(async (field: keyof T, value: any): Promise<string | undefined> => {
    const rules = validationRules[field];
    if (!rules) return undefined;

    // Required validation
    if (rules.required && (value === undefined || value === null || value === '')) {
      return 'Detta fält är obligatoriskt';
    }

    // Skip other validations if field is empty and not required
    if (!rules.required && (value === undefined || value === null || value === '')) {
      return undefined;
    }

    // Type-specific validations
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Minst ${rules.minLength} tecken krävs`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `Maximalt ${rules.maxLength} tecken tillåtet`;
      }
      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Ogiltig e-postadress';
      }
      if (rules.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value)) {
        return 'Ogiltigt telefonnummer';
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Ogiltigt format';
      }
    }

    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `Minsta värde är ${rules.min}`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `Högsta värde är ${rules.max}`;
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    // Async validation
    if (rules.asyncValidator) {
      try {
        const asyncError = await rules.asyncValidator(value);
        if (asyncError) return asyncError;
      } catch (error) {
        return 'Validering misslyckades';
      }
    }

    return undefined;
  }, [validationRules]);

  // Set field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field as string],
        value,
        touched: true,
        error: prev[field as string]?.error,
        validating: prev[field as string]?.validating
      }
    }));

    // Validate on change if enabled
    if (validateOnChange) {
      // Debounce validation
      if (validationTimeouts.current[field as string]) {
        clearTimeout(validationTimeouts.current[field as string]);
      }
      
      validationTimeouts.current[field as string] = setTimeout(async () => {
        setFormState(prev => ({
          ...prev,
          [field]: {
            ...prev[field as string],
            validating: true,
            value: prev[field as string]?.value,
            touched: prev[field as string]?.touched ?? false,
            error: prev[field as string]?.error
          }
        }));

        const error = await validateField(field, value);
        
        setFormState(prev => ({
          ...prev,
          [field]: {
            ...prev[field as string],
            error,
            validating: false,
            value: prev[field as string]?.value,
            touched: prev[field as string]?.touched ?? false
          }
        }));
      }, 300);
    }
  }, [validateField, validateOnChange]);

  // Set multiple values
  const setValues = useCallback((newValues: Partial<T>) => {
    setFormState(prev => {
      const updated = { ...prev };
      Object.keys(newValues).forEach(key => {
        const existingField = updated[key];
        updated[key] = {
          value: newValues[key as keyof T],
          touched: true,
          error: existingField?.error,
          validating: existingField?.validating
        };
      });
      return updated;
    });
  }, []);

  // Set field error
  const setError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field as string],
        error,
        value: prev[field as string]?.value,
        touched: prev[field as string]?.touched ?? false,
        validating: prev[field as string]?.validating
      }
    }));
  }, []);

  // Clear field error
  const clearError = useCallback((field: keyof T) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...prev[field as string],
        error: undefined,
        value: prev[field as string]?.value,
        touched: prev[field as string]?.touched ?? false,
        validating: prev[field as string]?.validating
      }
    }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setFormState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        const existingField = updated[key];
        updated[key] = {
          value: existingField?.value,
          touched: existingField?.touched ?? false,
          error: undefined,
          validating: existingField?.validating
        };
      });
      return updated;
    });
  }, []);

  // Handle input change
  const handleChange = useCallback((field: keyof T) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = e.target;
      let value: any = target.value;

      // Handle different input types
      if (target.type === 'checkbox') {
        value = (target as HTMLInputElement).checked;
      } else if (target.type === 'number') {
        value = target.value === '' ? '' : Number(target.value);
      } else if (target.type === 'file') {
        value = (target as HTMLInputElement).files;
      }

      setValue(field, value);
    };
  }, [setValue]);

  // Handle input blur
  const handleBlur = useCallback((field: keyof T) => {
    return async () => {
      setFormState(prev => ({
        ...prev,
        [field]: {
          ...prev[field as string],
          touched: true,
          value: prev[field as string]?.value,
          error: prev[field as string]?.error,
          validating: prev[field as string]?.validating
        }
      }));

      if (validateOnBlur) {
        const fieldValue = formState[field as string]?.value;
        const error = await validateField(field, fieldValue);
        setFormState(prev => ({
          ...prev,
          [field]: {
            ...prev[field as string],
            error,
            value: prev[field as string]?.value,
            touched: prev[field as string]?.touched ?? false,
            validating: prev[field as string]?.validating
          }
        }));
      }
    };
  }, [validateField, validateOnBlur, formState]);

  // Validate single field or all fields
  const validate = useCallback(async (field?: keyof T): Promise<boolean> => {
    if (field) {
      const fieldValue = formState[field as string]?.value;
      const error = await validateField(field, fieldValue);
      setFormState(prev => ({
        ...prev,
        [field]: {
          ...prev[field as string],
          error,
          value: prev[field as string]?.value,
          touched: prev[field as string]?.touched ?? false,
          validating: prev[field as string]?.validating
        }
      }));
      return !error;
    }

    // Validate all fields
    const validationPromises = Object.keys(formState).map(async key => {
      const fieldValue = formState[key]?.value;
      const error = await validateField(key as keyof T, fieldValue);
      return { key, error };
    });

    const results = await Promise.all(validationPromises);
    
    setFormState(prev => {
      const updated = { ...prev };
      results.forEach(({ key, error }) => {
        const existingField = updated[key];
        updated[key] = {
          value: existingField?.value,
          touched: existingField?.touched ?? false,
          error,
          validating: existingField?.validating
        };
      });
      return updated;
    });

    return results.every(({ error }) => !error);
  }, [validateField, formState]);

  // Handle form submission
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate all fields
      const isFormValid = await validate();
      
      if (!isFormValid) {
        return;
      }

      // Call onSubmit if provided
      if (onSubmit) {
        await onSubmit(values);
      }

      // Reset form if requested
      if (resetOnSubmit) {
        reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validate, onSubmit, values, resetOnSubmit]);

  // Reset form
  const reset = useCallback(() => {
    setFormState(() => {
      const state: FormState = {};
      Object.keys(initialValues).forEach(key => {
        state[key] = {
          value: initialValues[key],
          touched: false,
          validating: false,
          error: undefined
        };
      });
      return state;
    });
  }, [initialValues]);

  // Get field props for easy integration
  const getFieldProps = useCallback((field: keyof T) => {
    return {
      value: formState[field as string]?.value ?? '',
      onChange: handleChange(field),
      onBlur: handleBlur(field),
      error: formState[field as string]?.error,
      touched: formState[field as string]?.touched ?? false
    };
  }, [formState, handleChange, handleBlur]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(validationTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    isDirty,
    setValue,
    setValues,
    setError,
    clearError,
    clearErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validate,
    getFieldProps
  };
}

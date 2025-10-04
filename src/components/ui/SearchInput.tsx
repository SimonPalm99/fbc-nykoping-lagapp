/**
 * Advanced SearchInput component with debouncing, suggestions, and filters
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import './SearchInput.css';

export interface SearchSuggestion {
  id: string;
  text: string;
  category?: string;
  icon?: React.ReactNode;
  data?: any;
}

export interface SearchFilter {
  key: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    count?: number;
  }>;
}

export interface SearchInputProps {
  value?: string;
  placeholder?: string;
  onSearch: (query: string, filters?: Record<string, string[]>) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  
  // Suggestions
  suggestions?: SearchSuggestion[];
  showSuggestions?: boolean;
  maxSuggestions?: number;
  
  // Filters
  filters?: SearchFilter[];
  selectedFilters?: Record<string, string[]>;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  
  // Behavior
  debounceMs?: number;
  minQueryLength?: number;
  searchOnType?: boolean;
  clearOnSelect?: boolean;
  
  // Styling
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  className?: string;
  
  // Loading and states
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  
  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value = '',
  placeholder = 'Sök...',
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  showSuggestions = true,
  maxSuggestions = 8,
  filters = [],
  selectedFilters = {},
  onFiltersChange,
  debounceMs = 300,
  minQueryLength = 1,
  searchOnType = true,
  clearOnSelect = false,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  className = '',
  loading = false,
  disabled = false,
  error,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showFilters, setShowFilters] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        if (searchQuery.length >= minQueryLength) {
          onSearch(searchQuery, selectedFilters);
        }
      }, debounceMs);
    },
    [onSearch, selectedFilters, debounceMs, minQueryLength]
  );

  // Handle query change
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setActiveIndex(-1);
    
    if (searchOnType) {
      debouncedSearch(newQuery);
    }
    
    if (newQuery.length >= minQueryLength && showSuggestions) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchOnType, debouncedSearch, minQueryLength, showSuggestions]);

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, selectedFilters);
    setIsOpen(false);
  }, [query, selectedFilters, onSearch]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    onSuggestionSelect?.(suggestion);
    
    if (clearOnSelect) {
      setQuery('');
    } else {
      setQuery(suggestion.text);
    }
    
    setIsOpen(false);
    setActiveIndex(-1);
    
    if (!searchOnType) {
      onSearch(suggestion.text, selectedFilters);
    }
  }, [onSuggestionSelect, clearOnSelect, searchOnType, onSearch, selectedFilters]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterKey: string, optionValue: string, checked: boolean) => {
    const currentValues = selectedFilters[filterKey] || [];
    let newValues: string[];
    
    if (checked) {
      newValues = [...currentValues, optionValue];
    } else {
      newValues = currentValues.filter(v => v !== optionValue);
    }
    
    const newFilters = {
      ...selectedFilters,
      [filterKey]: newValues
    };
    
    // Remove empty filter arrays
    if (newValues.length === 0) {
      delete newFilters[filterKey];
    }
    
    onFiltersChange?.(newFilters);
  }, [selectedFilters, onFiltersChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    const visibleSuggestions = suggestions.slice(0, maxSuggestions);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < visibleSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < visibleSuggestions.length) {
          const selectedSuggestion = visibleSuggestions[activeIndex];
          if (selectedSuggestion) {
            handleSuggestionSelect(selectedSuggestion);
          }
        } else {
          handleSubmit(e);
        }
        break;
      
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        inputRef.current?.blur();
        break;
      
      case 'Tab':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }, [isOpen, suggestions, maxSuggestions, activeIndex, handleSuggestionSelect, handleSubmit]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowFilters(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Group suggestions by category
  const groupedSuggestions = useMemo(() => {
    const visible = suggestions.slice(0, maxSuggestions);
    const groups: Record<string, SearchSuggestion[]> = {};
    
    visible.forEach(suggestion => {
      const category = suggestion.category || 'Allmänt';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category]?.push(suggestion);
    });
    
    return groups;
  }, [suggestions, maxSuggestions]);

  // Active filter count
  const activeFilterCount = Object.values(selectedFilters).reduce(
    (sum, values) => sum + values.length, 
    0
  );

  const containerClasses = [
    'search-input-container',
    `search-input-${size}`,
    `search-input-${variant}`,
    fullWidth && 'search-input-full-width',
    disabled && 'search-input-disabled',
    error && 'search-input-error',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <form onSubmit={handleSubmit} className="search-input-form">
        <div className="search-input-wrapper">
          <div className="search-input-icon search-input-icon-left">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.length >= minQueryLength && showSuggestions) {
                setIsOpen(true);
              }
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="search-input-field"
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
            aria-autocomplete="list"
            title={ariaLabel || placeholder}
          />
          
          <div className="search-input-actions">
            {loading && (
              <div className="search-input-icon search-input-loading">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2v4M8 10v4M14 8h-4M6 8H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            
            {query && !loading && (
              <button
                type="button"
                className="search-input-clear"
                onClick={() => handleQueryChange('')}
                aria-label="Rensa sökning"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M12 4L4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
            
            {filters.length > 0 && (
              <button
                type="button"
                className={`search-input-filter ${showFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Filter"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 4h12M4 8h8M6 12h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {activeFilterCount > 0 && (
                  <span className="search-input-filter-badge">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="search-input-error-message">
            {error}
          </div>
        )}
      </form>
      
      {/* Suggestions dropdown */}
      {isOpen && showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="search-suggestions"
          role="listbox"
          title="Sökförslag"
        >
          {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
            <div key={category} className="search-suggestions-group">
              {Object.keys(groupedSuggestions).length > 1 && (
                <div className="search-suggestions-category">
                  {category}
                </div>
              )}
              {categorySuggestions.map((suggestion, _index) => {
                const globalIndex = suggestions.indexOf(suggestion);
                const isActive = globalIndex === activeIndex;
                
                return (
                  <button
                    key={suggestion.id}
                    id={`suggestion-${globalIndex}`}
                    className={`search-suggestion ${isActive ? 'active' : ''}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    role="option"
                    aria-selected={isActive}
                  >
                    {suggestion.icon && (
                      <div className="search-suggestion-icon">
                        {suggestion.icon}
                      </div>
                    )}
                    <div className="search-suggestion-text">
                      {suggestion.text}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
      
      {/* Filters dropdown */}
      {showFilters && filters.length > 0 && (
        <div
          ref={filtersRef}
          className="search-filters"
        >
          <div className="search-filters-header">
            <h3>Filter</h3>
            {activeFilterCount > 0 && (
              <button
                type="button"
                className="search-filters-clear"
                onClick={() => onFiltersChange?.({})}
              >
                Rensa alla
              </button>
            )}
          </div>
          
          {filters.map(filter => (
            <div key={filter.key} className="search-filter-group">
              <h4 className="search-filter-title">{filter.label}</h4>
              <div className="search-filter-options">
                {filter.options.map(option => {
                  const isChecked = selectedFilters[filter.key]?.includes(option.value) || false;
                  
                  return (
                    <label
                      key={option.value}
                      className="search-filter-option"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => handleFilterChange(filter.key, option.value, e.target.checked)}
                      />
                      <span className="search-filter-option-text">
                        {option.label}
                        {option.count !== undefined && (
                          <span className="search-filter-option-count">
                            ({option.count})
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

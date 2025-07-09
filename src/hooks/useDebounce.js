/**
 * Custom React hook that debounces a value by a specified delay.
 *
 * Useful for delaying actions such as API calls or filtering until
 * the user has stopped typing or interacting for a certain period.
 *
 * @param {*} value - The value to debounce.
 * @param {number} [delay=500] - The debounce delay in milliseconds.
 * @returns {*} The debounced value.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 *
 * useEffect(() => {
 *   // Trigger API call or filtering with debouncedSearch
 * }, [debouncedSearch]);
 */


import { useState, useEffect } from 'react';

export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}

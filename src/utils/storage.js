/**
 * Utility functions for safely interacting with localStorage.
 */

export function loadFromLocalStorage(key, defaultValue) {
  try {
    const item = window.localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
  }
  return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
}

export function saveToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}


/**
 * Accessibility Utilities
 * Helper functions and constants for improved accessibility
 */

// Keyboard event handling
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
} as const

// ARIA live region announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.setAttribute('class', 'sr-only')
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

// Focus management
export const focusElement = (selector: string | HTMLElement, options?: FocusOptions) => {
  const element = typeof selector === 'string' ? document.querySelector(selector) : selector
  if (element && element instanceof HTMLElement) {
    element.focus(options)
    return true
  }
  return false
}

// Focus trap for modals and drawers
export const createFocusTrap = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEYBOARD_KEYS.TAB) {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }
    
    if (e.key === KEYBOARD_KEYS.ESCAPE) {
      // Let parent handle escape
      return
    }
  }
  
  container.addEventListener('keydown', handleKeyDown)
  firstElement?.focus()
  
  return () => {
    container.removeEventListener('keydown', handleKeyDown)
  }
}

// Keyboard navigation helper
export const handleKeyboardNavigation = (
  e: React.KeyboardEvent,
  onActivate: () => void,
  options: {
    preventDefaultOnSpace?: boolean
    preventDefaultOnEnter?: boolean
  } = {}
) => {
  const { preventDefaultOnSpace = true, preventDefaultOnEnter = true } = options
  
  if (e.key === KEYBOARD_KEYS.ENTER) {
    if (preventDefaultOnEnter) e.preventDefault()
    onActivate()
  } else if (e.key === KEYBOARD_KEYS.SPACE) {
    if (preventDefaultOnSpace) e.preventDefault()
    onActivate()
  }
}

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In production, you'd want a more comprehensive implementation
  const getLuminance = (color: string) => {
    // Basic luminance calculation for hex colors
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const gamma = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    
    return 0.2126 * gamma(r) + 0.7152 * gamma(g) + 0.0722 * gamma(b)
  }
  
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

// ARIA helpers
export const generateId = (prefix: string = 'element'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Form accessibility helpers
export const getFieldErrorId = (fieldName: string): string => `${fieldName}-error`
export const getFieldDescriptionId = (fieldName: string): string => `${fieldName}-description`

// Loading state announcements
export const announceLoadingState = (isLoading: boolean, context: string) => {
  if (isLoading) {
    announceToScreenReader(`Loading ${context}`, 'polite')
  }
}

// Validation announcement
export const announceValidationError = (fieldName: string, error: string) => {
  announceToScreenReader(`${fieldName}: ${error}`, 'assertive')
}

// Success announcements
export const announceSuccess = (message: string) => {
  announceToScreenReader(message, 'polite')
}

// Error announcements
export const announceError = (message: string) => {
  announceToScreenReader(`Error: ${message}`, 'assertive')
}

// Mobile accessibility helpers
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Skip link utilities
export const createSkipLink = (targetId: string, label: string): HTMLElement => {
  const skipLink = document.createElement('a')
  skipLink.href = `#${targetId}`
  skipLink.textContent = label
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded'
  return skipLink
}

// Screen reader only text utility
export const srOnly = 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0'

// Focus visible utilities for keyboard navigation
export const focusRingClasses = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
export const focusRingInsetClasses = 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset'

// High contrast mode detection
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches
}

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Font size preferences
export const getPreferredFontSize = (): string => {
  return getComputedStyle(document.documentElement).fontSize
}

export default {
  KEYBOARD_KEYS,
  announceToScreenReader,
  focusElement,
  createFocusTrap,
  handleKeyboardNavigation,
  getContrastRatio,
  generateId,
  getFieldErrorId,
  getFieldDescriptionId,
  announceLoadingState,
  announceValidationError,
  announceSuccess,
  announceError,
  isTouchDevice,
  createSkipLink,
  srOnly,
  focusRingClasses,
  focusRingInsetClasses,
  prefersHighContrast,
  prefersReducedMotion,
  getPreferredFontSize,
}
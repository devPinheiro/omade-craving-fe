/**
 * Accessibility Test Component
 * This component helps test and validate accessibility implementations
 */
import { useEffect, useState } from 'react'
import { 
  announceToScreenReader,
  handleKeyboardNavigation,
  getContrastRatio,
  prefersReducedMotion,
  prefersHighContrast 
} from '../../utils/accessibility'

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info'
  element: string
  description: string
  fix?: string
}

export const AccessibilityTest = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([])
  const [isScanning, setIsScanning] = useState(false)
  
  const scanForIssues = () => {
    setIsScanning(true)
    const foundIssues: AccessibilityIssue[] = []
    
    // Check for images without alt text
    const images = document.querySelectorAll('img')
    images.forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        foundIssues.push({
          type: 'error',
          element: `Image ${index + 1}`,
          description: 'Missing alt text',
          fix: 'Add descriptive alt attribute'
        })
      }
    })
    
    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button')
    buttons.forEach((btn, index) => {
      const hasText = btn.textContent?.trim()
      const hasAriaLabel = btn.getAttribute('aria-label')
      const hasAriaLabelledBy = btn.getAttribute('aria-labelledby')
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
        foundIssues.push({
          type: 'error',
          element: `Button ${index + 1}`,
          description: 'No accessible name',
          fix: 'Add text content, aria-label, or aria-labelledby'
        })
      }
    })
    
    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input, textarea, select')
    inputs.forEach((input, index) => {
      const hasLabel = document.querySelector(`label[for="${input.id}"]`)
      const hasAriaLabel = input.getAttribute('aria-label')
      const hasAriaLabelledBy = input.getAttribute('aria-labelledby')
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && input.id) {
        foundIssues.push({
          type: 'error',
          element: `Input ${index + 1} (${input.id})`,
          description: 'No associated label',
          fix: 'Add label element or aria-label'
        })
      }
    })
    
    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    let previousLevel = 0
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1))
      if (index === 0 && level !== 1) {
        foundIssues.push({
          type: 'warning',
          element: `${heading.tagName} ${index + 1}`,
          description: 'Page should start with h1',
          fix: 'Use h1 for main page heading'
        })
      } else if (level > previousLevel + 1) {
        foundIssues.push({
          type: 'warning',
          element: `${heading.tagName} ${index + 1}`,
          description: 'Heading level skipped',
          fix: 'Use sequential heading levels'
        })
      }
      previousLevel = level
    })
    
    // Check for focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]')
    let elementsWithoutFocus = 0
    focusableElements.forEach((element) => {
      const styles = window.getComputedStyle(element, ':focus')
      if (styles.outline === 'none' && styles.boxShadow === 'none') {
        elementsWithoutFocus++
      }
    })
    
    if (elementsWithoutFocus > 0) {
      foundIssues.push({
        type: 'warning',
        element: `${elementsWithoutFocus} focusable elements`,
        description: 'No visible focus indicators',
        fix: 'Add focus styles with outline or box-shadow'
      })
    }
    
    // Check for skip links
    const skipLinks = document.querySelectorAll('.skip-link, [href="#main-content"]')
    if (skipLinks.length === 0) {
      foundIssues.push({
        type: 'warning',
        element: 'Page structure',
        description: 'No skip links found',
        fix: 'Add skip links for keyboard navigation'
      })
    }
    
    setIssues(foundIssues)
    setIsScanning(false)
    
    // Announce results
    announceToScreenReader(
      `Accessibility scan complete. Found ${foundIssues.length} issues.`,
      'polite'
    )
  }
  
  const testScreenReaderAnnouncement = () => {
    announceToScreenReader('This is a test announcement for screen readers', 'polite')
  }
  
  const testKeyboardNavigation = (e: React.KeyboardEvent) => {
    handleKeyboardNavigation(e, () => {
      alert('Keyboard navigation test successful!')
    })
  }
  
  const getAccessibilityInfo = () => {
    return {
      reducedMotion: prefersReducedMotion(),
      highContrast: prefersHighContrast(),
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
  }
  
  const [userPrefs, setUserPrefs] = useState(getAccessibilityInfo())
  
  useEffect(() => {
    setUserPrefs(getAccessibilityInfo())
  }, [])
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accessibility Testing Dashboard</h2>
        <p className="text-gray-600">Test and validate accessibility implementations across the application.</p>
      </header>
      
      {/* User Preferences */}
      <section className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">User Preferences Detected</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className={`p-3 rounded ${userPrefs.reducedMotion ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <strong>Motion:</strong> {userPrefs.reducedMotion ? 'Reduced' : 'Normal'}
          </div>
          <div className={`p-3 rounded ${userPrefs.highContrast ? 'bg-yellow-100' : 'bg-green-100'}`}>
            <strong>Contrast:</strong> {userPrefs.highContrast ? 'High' : 'Normal'}
          </div>
          <div className="p-3 rounded bg-blue-100">
            <strong>Color Scheme:</strong> {userPrefs.colorScheme}
          </div>
        </div>
      </section>
      
      {/* Testing Controls */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Testing Tools</h3>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={scanForIssues}
            disabled={isScanning}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 focus-enhanced"
          >
            {isScanning ? 'Scanning...' : 'Scan for Issues'}
          </button>
          
          <button
            type="button"
            onClick={testScreenReaderAnnouncement}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus-enhanced"
          >
            Test Screen Reader
          </button>
          
          <button
            type="button"
            onKeyDown={testKeyboardNavigation}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus-enhanced"
            aria-label="Test keyboard navigation - press Enter or Space"
          >
            Test Keyboard Nav
          </button>
        </div>
      </section>
      
      {/* Results */}
      {issues.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Accessibility Issues Found ({issues.length})
          </h3>
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  issue.type === 'error' 
                    ? 'bg-red-50 border-red-400' 
                    : issue.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${
                      issue.type === 'error' ? 'text-red-800' : 
                      issue.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                    }`}>
                      {issue.element}
                    </h4>
                    <p className={`text-sm ${
                      issue.type === 'error' ? 'text-red-700' : 
                      issue.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {issue.description}
                    </p>
                    {issue.fix && (
                      <p className={`text-xs mt-1 ${
                        issue.type === 'error' ? 'text-red-600' : 
                        issue.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`}>
                        Fix: {issue.fix}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    issue.type === 'error' 
                      ? 'bg-red-100 text-red-800' 
                      : issue.type === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {issue.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {issues.length === 0 && !isScanning && (
        <section className="text-center py-8">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Test</h3>
          <p className="text-gray-600">Click "Scan for Issues" to start accessibility testing.</p>
        </section>
      )}
      
      {/* Keyboard Navigation Help */}
      <aside className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-md font-semibold text-gray-900 mb-2">Keyboard Testing Guide</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li><strong>Tab:</strong> Navigate forward through interactive elements</li>
          <li><strong>Shift + Tab:</strong> Navigate backward through interactive elements</li>
          <li><strong>Enter/Space:</strong> Activate buttons and links</li>
          <li><strong>Arrow keys:</strong> Navigate within components (menus, tabs, etc.)</li>
          <li><strong>Escape:</strong> Close modals and dropdown menus</li>
          <li><strong>Home/End:</strong> Navigate to first/last item in lists</li>
        </ul>
      </aside>
    </div>
  )
}
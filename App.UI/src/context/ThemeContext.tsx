import { createContext, useContext, useEffect, useState } from 'react'

export interface ThemeContextType {
  appearance: 'light' | 'dark' | 'system'
  setAppearance: (appearance: 'light' | 'dark' | 'system') => void
  resolvedAppearance: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const THEME_STORAGE_KEY = 'sorter-theme-preferences'

type ThemePreferences = {
  appearance: 'light' | 'dark' | 'system'
}

type ThemeProviderProps = {
  children: (theme: ThemeContextType) => React.ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Load saved preferences or use defaults
  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Validate the parsed preferences
        if (parsed && typeof parsed === 'object' && 
            ['light', 'dark', 'system'].includes(parsed.appearance)) {
          return parsed
        }
      }
    } catch (error) {
      console.warn('Failed to parse theme preferences from localStorage:', error)
    }
    return { appearance: 'system' }
  })

  const [resolvedAppearance, setResolvedAppearance] = useState<'light' | 'dark'>(() => {
    try {
      if (preferences.appearance === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      return preferences.appearance
    } catch (error) {
      console.warn('Failed to detect initial system theme, falling back to light:', error)
      return 'light'
    }
  })

  // Update localStorage when preferences change
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(preferences))
    } catch (error) {
      console.warn('Failed to save theme preferences to localStorage:', error)
    }
  }, [preferences])

  // Apply theme to document
  useEffect(() => {
    try {
      // Update data-theme attribute for theme system
      document.documentElement.setAttribute('data-theme', resolvedAppearance)
    } catch (error) {
      console.warn('Failed to apply theme to document:', error)
    }
  }, [resolvedAppearance])

  // Listen for system theme changes
  useEffect(() => {
    if (preferences.appearance !== 'system') return

    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        try {
          const newAppearance = e.matches ? 'dark' : 'light'
          setResolvedAppearance(newAppearance)
          document.documentElement.setAttribute('data-theme', newAppearance)
        } catch (error) {
          console.warn('Failed to handle system theme change:', error)
        }
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } catch (error) {
      console.warn('Failed to set up system theme listener:', error)
    }
  }, [preferences.appearance])

  const value: ThemeContextType = {
    appearance: preferences.appearance,
    setAppearance: (appearance) => {
      try {
        setPreferences((prev: ThemePreferences) => ({ ...prev, appearance }))
        if (appearance !== 'system') {
          setResolvedAppearance(appearance)
        } else {
          const systemAppearance = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          setResolvedAppearance(systemAppearance)
        }
      } catch (error) {
        console.warn('Failed to set appearance:', error)
      }
    },
    resolvedAppearance,
  }

  return <ThemeContext.Provider value={value}>{children(value)}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    console.error('useTheme must be used within a ThemeProvider')
    // Return a safe fallback instead of throwing
    return {
      appearance: 'light' as const,
      setAppearance: () => {},
      resolvedAppearance: 'light' as const,
    }
  }
  return context
}
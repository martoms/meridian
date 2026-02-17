export type ThemeMode = 'light' | 'dark'

export const useTheme = () => {
  const mode = useState<ThemeMode>('meridian-color-mode', () => 'light')

  const applyMode = (nextMode: ThemeMode) => {
    mode.value = nextMode

    if (import.meta.client) {
      document.documentElement.dataset.mode = nextMode
      localStorage.setItem('meridian-color-mode', nextMode)
    }
  }

  const initializeMode = () => {
    if (!import.meta.client) {
      return
    }

    const storedMode = localStorage.getItem('meridian-color-mode')
    const systemMode: ThemeMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    applyMode(storedMode === 'dark' || storedMode === 'light' ? storedMode : systemMode)
  }

  const toggleMode = () => applyMode(mode.value === 'dark' ? 'light' : 'dark')

  return {
    initializeMode,
    mode,
    toggleMode
  }
}

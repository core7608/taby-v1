import { useEffect } from 'react'
import { useBrowserStore } from './stores/browserStore'
import BrowserChrome from './components/Browser/BrowserChrome'
import CommandPalette from './components/Browser/CommandPalette'
import AutoUpdater from './components/Browser/AutoUpdater'

export default function App() {
  const { theme } = useBrowserStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    const handler = (e) => {
      const { addTab, closeTab, activeTabId, toggleCommandPalette, toggleDevTools } = useBrowserStore.getState()
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 't') { e.preventDefault(); addTab() }
        if (e.key === 'w') { e.preventDefault(); closeTab(activeTabId) }
        if (e.key === 'k') { e.preventDefault(); toggleCommandPalette() }
        if (e.key === 'F12' || (e.shiftKey && e.key === 'I')) { e.preventDefault(); toggleDevTools() }
        if (e.key === '1') { e.preventDefault(); useBrowserStore.getState().addTab('taby://apps') }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <BrowserChrome />
      <CommandPalette />
      <AutoUpdater />
    </>
  )
}

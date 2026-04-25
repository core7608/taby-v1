import { useState, useEffect, useRef, useMemo } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import {
  Search, Plus, X, Settings, Code2, Shield, Moon, Sun,
  Bookmark, History, Download, Globe, Lock, Wifi, BedDouble,
  Command, CornerDownLeft, Hash, Star
} from 'lucide-react'

const COMMANDS = [
  { id: 'new-tab', label: 'New Tab', icon: Plus, shortcut: 'Ctrl+T', category: 'Navigation' },
  { id: 'close-tab', label: 'Close Tab', icon: X, shortcut: 'Ctrl+W', category: 'Navigation' },
  { id: 'devtools', label: 'Open DevTools', icon: Code2, shortcut: 'F12', category: 'Developer' },
  { id: 'bookmarks', label: 'Show Bookmarks', icon: Bookmark, category: 'Navigation' },
  { id: 'history', label: 'Show History', icon: History, category: 'Navigation' },
  { id: 'downloads', label: 'Show Downloads', icon: Download, category: 'Navigation' },
  { id: 'settings', label: 'Open Settings', icon: Settings, category: 'Browser' },
  { id: 'toggle-adblock', label: 'Toggle Ad Blocker', icon: Shield, category: 'Privacy' },
  { id: 'toggle-vpn', label: 'Toggle VPN', icon: Wifi, category: 'Privacy' },
  { id: 'toggle-private', label: 'Toggle Private Mode', icon: Lock, category: 'Privacy' },
  { id: 'toggle-theme', label: 'Toggle Dark/Light Mode', icon: Moon, category: 'Appearance' },
  { id: 'hibernate-all', label: 'Hibernate All Background Tabs', icon: BedDouble, category: 'Performance' },
  { id: 'new-private-tab', label: 'New Private Tab', icon: Lock, category: 'Navigation' },
]

export default function CommandPalette() {
  const {
    commandPaletteOpen, toggleCommandPalette, addTab, closeTab,
    activeTabId, toggleDevTools, toggleSidebar, toggleAdBlock,
    toggleVPN, togglePrivateMode, theme, setTheme, tabs, hibernateTab
  } = useBrowserStore()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  const filtered = useMemo(() => {
    if (!query) return COMMANDS
    const q = query.toLowerCase()
    return COMMANDS.filter(c =>
      c.label.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => { setSelectedIndex(0) }, [filtered])

  const execute = (cmd) => {
    toggleCommandPalette()
    switch (cmd.id) {
      case 'new-tab': addTab(); break
      case 'close-tab': closeTab(activeTabId); break
      case 'devtools': toggleDevTools(); break
      case 'bookmarks': toggleSidebar('bookmarks'); break
      case 'history': toggleSidebar('history'); break
      case 'downloads': toggleSidebar('downloads'); break
      case 'settings': toggleSidebar('settings'); break
      case 'toggle-adblock': toggleAdBlock(); break
      case 'toggle-vpn': toggleVPN(); break
      case 'toggle-private': togglePrivateMode(); break
      case 'toggle-theme': setTheme(theme === 'dark' ? 'light' : 'dark'); break
      case 'hibernate-all':
        tabs.filter(t => t.id !== activeTabId).forEach(t => hibernateTab(t.id)); break
      case 'new-private-tab': addTab('taby://newtab', { stealth: true }); break
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { toggleCommandPalette(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[selectedIndex]) execute(filtered[selectedIndex])
  }

  if (!commandPaletteOpen) return null

  const categories = [...new Set(filtered.map(c => c.category))]

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={toggleCommandPalette}
      >
        <div
          className="panel w-full max-w-xl overflow-hidden animate-scale-in"
          onClick={e => e.stopPropagation()}
          style={{ maxHeight: '70vh' }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3.5"
            style={{ borderBottom: '1px solid var(--border)' }}>
            <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: 'var(--text-primary)', fontFamily: 'inherit' }}
            />
            <kbd className="px-1.5 py-0.5 rounded text-xs font-mono"
              style={{ background: 'var(--surface-3)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
              ESC
            </kbd>
          </div>

          {/* Commands */}
          <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: 400 }}>
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <Hash size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No commands found</p>
              </div>
            ) : (
              categories.map(cat => (
                <div key={cat}>
                  <div className="px-4 py-2 sticky top-0" style={{ background: 'var(--surface)' }}>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                      {cat}
                    </span>
                  </div>
                  {filtered.filter(c => c.category === cat).map((cmd) => {
                    const globalIdx = filtered.indexOf(cmd)
                    const isSelected = globalIdx === selectedIndex
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => execute(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        style={{ background: isSelected ? 'var(--surface-2)' : 'transparent' }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: isSelected ? 'var(--accent)' + '20' : 'var(--surface-3)' }}>
                          <cmd.icon size={14} style={{ color: isSelected ? 'var(--accent)' : 'var(--text-secondary)' }} />
                        </div>
                        <span className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>{cmd.label}</span>
                        {cmd.shortcut && (
                          <kbd className="px-1.5 py-0.5 rounded text-xs font-mono"
                            style={{ background: 'var(--surface-3)', color: 'var(--text-tertiary)', border: '1px solid var(--border)' }}>
                            {cmd.shortcut}
                          </kbd>
                        )}
                        {isSelected && <CornerDownLeft size={13} style={{ color: 'var(--text-tertiary)' }} />}
                      </button>
                    )
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2.5"
            style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <kbd className="px-1 py-0.5 rounded" style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}>↑↓</kbd>
              <span>Navigate</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <kbd className="px-1 py-0.5 rounded" style={{ background: 'var(--surface-3)', border: '1px solid var(--border)' }}>↵</kbd>
              <span>Execute</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

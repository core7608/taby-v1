import { useState, useRef, useEffect } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import {
  ChevronLeft, ChevronRight, RotateCw, X, Shield,
  Star, StarOff, Code2, Wifi, WifiOff, Sun, Moon,
  Bookmark, MoreHorizontal, Globe, Lock, LayoutGrid
} from 'lucide-react'
import OmniboxDropdown from './OmniboxDropdown'

export default function Toolbar() {
  const {
    tabs, activeTabId, updateTab, getActiveTab,
    addBookmark, removeBookmark, isBookmarked,
    adBlockEnabled, toggleAdBlock,
    vpnEnabled, toggleVPN, theme, setTheme,
    urlBarFocused, setUrlBarFocused, setOmniboxQuery,
    toggleDevTools, toggleSidebar, addTab,
  } = useBrowserStore()

  const activeTab = getActiveTab()
  const [localUrl, setLocalUrl] = useState(activeTab?.url || '')
  const [showOmnibox, setShowOmnibox] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const url = activeTab?.url || ''
    setLocalUrl(url.startsWith('taby://') ? '' : url)
  }, [activeTabId, activeTab?.url])

  const navigate = (url) => {
    let final = url.trim()
    if (!final) return
    if (final.startsWith('taby://')) {
      updateTab(activeTabId, { url: final, title: final.replace('taby://', 'Taby ') })
      setShowOmnibox(false); return
    }
    if (!final.includes('.') && !final.includes('://')) {
      const engines = { google: `https://www.google.com/search?q=`, duckduckgo: `https://duckduckgo.com/?q=`, bing: `https://www.bing.com/search?q=` }
      final = (engines[useBrowserStore.getState().settings.searchEngine] || engines.google) + encodeURIComponent(final)
    } else if (!final.startsWith('http')) {
      final = 'https://' + final
    }
    updateTab(activeTabId, { url: final, isLoading: true, title: '' })
    setLocalUrl(final)
    setShowOmnibox(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') navigate(localUrl)
    if (e.key === 'Escape') { setShowOmnibox(false); inputRef.current?.blur() }
  }

  const isSecure = activeTab?.url?.startsWith('https://')
  const isTaby = activeTab?.url?.startsWith('taby://')
  const bookmarked = activeTab ? isBookmarked(activeTab.url) : false

  return (
    <div className="flex items-center gap-1 px-2 py-1.5" style={{ borderTop: '1px solid var(--border)' }}>
      {/* Navigation */}
      <div className="flex items-center gap-0">
        <button className="btn-ghost p-1.5 rounded-lg" style={{ opacity: activeTab?.canGoBack ? 1 : 0.3 }}>
          <ChevronLeft size={16} />
        </button>
        <button className="btn-ghost p-1.5 rounded-lg" style={{ opacity: activeTab?.canGoForward ? 1 : 0.3 }}>
          <ChevronRight size={16} />
        </button>
        <button className="btn-ghost p-1.5 rounded-lg"
          onClick={() => updateTab(activeTabId, { isLoading: !activeTab?.isLoading })}>
          {activeTab?.isLoading ? <X size={14} /> : <RotateCw size={13} />}
        </button>
      </div>

      {/* URL Bar */}
      <div className="flex-1 relative">
        <div className="url-bar" onClick={() => { setShowOmnibox(true); setUrlBarFocused(true); inputRef.current?.select() }}>
          <div className="flex-shrink-0">
            {isTaby
              ? <div className="w-3 h-3 rounded flex items-center justify-center" style={{ background: 'var(--accent)' }}><span style={{ fontSize: 8, color: 'white', fontWeight: 900 }}>T</span></div>
              : isSecure
                ? <Lock size={11} style={{ color: '#16a34a' }} />
                : <Globe size={11} style={{ color: 'var(--text-tertiary)' }} />
            }
          </div>
          <input
            ref={inputRef}
            type="text"
            value={localUrl}
            onChange={e => { setLocalUrl(e.target.value); setOmniboxQuery(e.target.value) }}
            onFocus={() => { setShowOmnibox(true); setUrlBarFocused(true) }}
            onBlur={() => setTimeout(() => { setShowOmnibox(false); setUrlBarFocused(false) }, 150)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
            style={{ color: urlBarFocused ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'inherit' }}
            placeholder={isTaby ? (activeTab?.title || 'Taby App') : 'Search or enter URL...'}
            spellCheck={false}
          />
          <div className="flex items-center gap-1 flex-shrink-0">
            {adBlockEnabled && <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(22,163,74,0.12)', color: '#16a34a', padding: '1px 4px', borderRadius: 3 }}>AD-FREE</span>}
            {!isTaby && (
              <button className="btn-ghost p-0.5 rounded" onClick={(e) => { e.stopPropagation(); if (activeTab) { if (bookmarked) removeBookmark(activeTab.url); else addBookmark({ url: activeTab.url, title: activeTab.title, favicon: activeTab.favicon, addedAt: Date.now() }) } }}>
                <Star size={12} fill={bookmarked ? 'currentColor' : 'none'} style={{ color: bookmarked ? '#f59e0b' : 'var(--text-tertiary)' }} />
              </button>
            )}
          </div>
        </div>
        {showOmnibox && <OmniboxDropdown query={localUrl} onNavigate={navigate} />}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-0">
        {/* Apps hub */}
        <button className="btn-ghost p-1.5 rounded-lg" title="Taby Apps (Ctrl+1)"
          onClick={() => addTab('taby://apps')}
          style={{ color: 'var(--accent)' }}>
          <LayoutGrid size={15} />
        </button>
        <button className="btn-ghost p-1.5 rounded-lg" onClick={toggleDevTools} title="DevTools (F12)">
          <Code2 size={15} />
        </button>
        <button className="btn-ghost p-1.5 rounded-lg" onClick={toggleAdBlock}
          title={adBlockEnabled ? 'Ad Blocker ON' : 'Ad Blocker OFF'}
          style={{ color: adBlockEnabled ? '#16a34a' : 'var(--text-tertiary)' }}>
          <Shield size={15} />
        </button>
        <button className="btn-ghost p-1.5 rounded-lg" onClick={toggleVPN}
          style={{ color: vpnEnabled ? '#2a8bff' : 'var(--text-tertiary)' }}>
          {vpnEnabled ? <Wifi size={15} /> : <WifiOff size={15} />}
        </button>
        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => toggleSidebar('bookmarks')}>
          <Bookmark size={15} />
        </button>
        <button className="btn-ghost p-1.5 rounded-lg" onClick={() => toggleSidebar('settings')}>
          <MoreHorizontal size={15} />
        </button>
      </div>
    </div>
  )
}

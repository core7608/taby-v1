import { useState } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import {
  Bookmark, History, Download, FileText, Settings,
  X, Search, ExternalLink, Trash2, Globe, Code2,
  Shield, Wifi, Lock, QrCode, Database, Palette,
  ChevronRight, Star
} from 'lucide-react'

const PANELS = [
  { id: 'bookmarks', icon: Bookmark, label: 'Bookmarks' },
  { id: 'history', icon: History, label: 'History' },
  { id: 'downloads', icon: Download, label: 'Downloads' },
  { id: 'notes', icon: FileText, label: 'Notes' },
  { id: 'settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarView, toggleSidebar } = useBrowserStore()

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-hidden animate-slide-in"
      style={{
        width: 280,
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
    >
      {/* Panel tabs */}
      <div className="flex items-center gap-0.5 p-2 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        {PANELS.map(p => (
          <button
            key={p.id}
            onClick={() => toggleSidebar(p.id)}
            className="flex-1 flex flex-col items-center gap-1 py-1.5 rounded-lg transition-all"
            style={{
              background: sidebarView === p.id ? 'var(--surface)' : 'transparent',
              color: sidebarView === p.id ? 'var(--accent)' : 'var(--text-tertiary)',
            }}
            title={p.label}
          >
            <p.icon size={15} />
            <span style={{ fontSize: 9, fontWeight: 600 }}>{p.label}</span>
          </button>
        ))}
        <button onClick={() => toggleSidebar(sidebarView)} className="btn-ghost p-1.5 rounded-lg ml-1">
          <X size={14} />
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {sidebarView === 'bookmarks' && <BookmarksPanel />}
        {sidebarView === 'history' && <HistoryPanel />}
        {sidebarView === 'downloads' && <DownloadsPanel />}
        {sidebarView === 'notes' && <NotesPanel />}
        {sidebarView === 'settings' && <SettingsPanel />}
      </div>
    </div>
  )
}

function BookmarksPanel() {
  const { bookmarks, removeBookmark, updateTab, activeTabId } = useBrowserStore()
  const [search, setSearch] = useState('')
  const filtered = bookmarks.filter(b =>
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.url?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-3 flex flex-col gap-2">
      <input className="input text-sm" placeholder="Search bookmarks..." value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.length === 0 ? (
        <div className="text-center py-8">
          <Star size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No bookmarks yet</p>
        </div>
      ) : filtered.map((bm, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded-lg group hover:bg-[var(--surface-2)] transition-colors">
          <Globe size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <button
            className="flex-1 text-left min-w-0"
            onClick={() => updateTab(activeTabId, { url: bm.url, title: bm.title, isLoading: true })}
          >
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{bm.title || bm.url}</p>
            <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{bm.url}</p>
          </button>
          <button onClick={() => removeBookmark(bm.url)} className="opacity-0 group-hover:opacity-100 btn-ghost p-1 rounded">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}

function HistoryPanel() {
  const { history, updateTab, activeTabId } = useBrowserStore()
  const [search, setSearch] = useState('')
  const filtered = history.filter(h =>
    h.title?.toLowerCase().includes(search.toLowerCase()) ||
    h.url?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-3 flex flex-col gap-2">
      <input className="input text-sm" placeholder="Search history..." value={search} onChange={e => setSearch(e.target.value)} />
      {filtered.slice(0, 50).map((h, i) => (
        <button key={i} onClick={() => updateTab(activeTabId, { url: h.url, title: h.title, isLoading: true })}
          className="flex items-center gap-2 p-2 rounded-lg text-left hover:bg-[var(--surface-2)] transition-colors">
          <Globe size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate" style={{ color: 'var(--text-primary)' }}>{h.title || h.url}</p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              {h.visitedAt ? new Date(h.visitedAt).toLocaleString() : ''}
            </p>
          </div>
        </button>
      ))}
      {filtered.length === 0 && (
        <div className="text-center py-8">
          <History size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No history yet</p>
        </div>
      )}
    </div>
  )
}

function DownloadsPanel() {
  const { downloads } = useBrowserStore()
  return (
    <div className="p-3">
      {downloads.length === 0 ? (
        <div className="text-center py-8">
          <Download size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No downloads yet</p>
        </div>
      ) : downloads.map((d, i) => (
        <div key={i} className="p-3 rounded-lg mb-2" style={{ background: 'var(--surface-2)' }}>
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{d.filename}</p>
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${d.progress || 0}%`, background: 'var(--accent)' }} />
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{d.status}</p>
        </div>
      ))}
    </div>
  )
}

function NotesPanel() {
  const [notes, setNotes] = useState('# My Notes\n\nStart typing here...\n\n- Note 1\n- Note 2')
  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
          Quick Notes (Markdown)
        </span>
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'JetBrains Mono, monospace',
          minHeight: 400,
        }}
      />
    </div>
  )
}

function SettingsPanel() {
  const {
    settings, updateSettings, theme, setTheme,
    adBlockEnabled, toggleAdBlock, fingerprintMaskEnabled,
    vpnEnabled, toggleVPN, togglePrivateMode, isPrivateMode,
  } = useBrowserStore()

  const Toggle = ({ label, icon: Icon, value, onToggle, color }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--surface-2)]">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: value ? (color || 'var(--accent)') + '20' : 'var(--surface-3)' }}>
        <Icon size={15} style={{ color: value ? (color || 'var(--accent)') : 'var(--text-tertiary)' }} />
      </div>
      <span className="flex-1 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
      <button
        onClick={onToggle}
        className="w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0"
        style={{ background: value ? 'var(--accent)' : 'var(--surface-3)' }}
      >
        <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
          style={{ left: value ? '22px' : '2px' }} />
      </button>
    </div>
  )

  return (
    <div className="p-3 flex flex-col gap-1">
      <p className="text-xs font-bold uppercase tracking-wider px-3 mb-2" style={{ color: 'var(--text-tertiary)' }}>Privacy & Security</p>
      <Toggle label="Ad Blocker Max" icon={Shield} value={adBlockEnabled} onToggle={toggleAdBlock} color="#16a34a" />
      <Toggle label="Fingerprint Masking" icon={Lock} value={fingerprintMaskEnabled} onToggle={() => {}} color="#8b5cf6" />
      <Toggle label="Built-in VPN" icon={Wifi} value={vpnEnabled} onToggle={toggleVPN} color="#2a8bff" />
      <Toggle label="Private Mode" icon={Lock} value={isPrivateMode} onToggle={togglePrivateMode} color="#9333ea" />

      <div className="my-2 h-px" style={{ background: 'var(--border)' }} />
      <p className="text-xs font-bold uppercase tracking-wider px-3 mb-2" style={{ color: 'var(--text-tertiary)' }}>Appearance</p>

      <div className="flex items-center gap-3 p-3 rounded-xl">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--surface-3)' }}>
          <Palette size={15} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <span className="flex-1 text-sm font-medium">Theme</span>
        <div className="flex gap-1">
          {['light', 'dark'].map(t => (
            <button key={t} onClick={() => setTheme(t)}
              className="px-2 py-1 rounded-md text-xs font-medium capitalize transition-all"
              style={{
                background: theme === t ? 'var(--accent)' : 'var(--surface-3)',
                color: theme === t ? 'white' : 'var(--text-secondary)',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="my-2 h-px" style={{ background: 'var(--border)' }} />
      <p className="text-xs font-bold uppercase tracking-wider px-3 mb-2" style={{ color: 'var(--text-tertiary)' }}>Search Engine</p>
      <div className="flex gap-1 px-3">
        {['google', 'duckduckgo', 'bing'].map(e => (
          <button key={e} onClick={() => updateSettings({ searchEngine: e })}
            className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all"
            style={{
              background: settings.searchEngine === e ? 'var(--accent)' : 'var(--surface-2)',
              color: settings.searchEngine === e ? 'white' : 'var(--text-secondary)',
            }}>
            {e}
          </button>
        ))}
      </div>
    </div>
  )
}

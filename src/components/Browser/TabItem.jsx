import { useState, useRef } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import { X, Volume2, VolumeX, Pin, Copy, BedDouble, Globe, Lock } from 'lucide-react'

export default function TabItem({ tab }) {
  const { activeTabId, setActiveTab, closeTab, updateTab, duplicateTab, hibernateTab, wakeTab } = useBrowserStore()
  const [contextMenu, setContextMenu] = useState(null)
  const isActive = tab.id === activeTabId

  const handleClick = () => {
    if (tab.isHibernated) wakeTab(tab.id)
    else setActiveTab(tab.id)
  }

  const handleClose = (e) => {
    e.stopPropagation()
    closeTab(tab.id)
  }

  const handleContextMenu = (e) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }

  const menuAction = (fn) => {
    fn()
    setContextMenu(null)
  }

  const FaviconEl = () => {
    if (tab.isStealth) return <Lock size={12} style={{ color: '#9333ea' }} />
    if (tab.favicon) return <img src={tab.favicon} className="w-4 h-4 rounded-sm" alt="" />
    if (tab.url === 'taby://newtab') return (
      <div className="w-4 h-4 rounded-sm flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #2a8bff, #0d6bff)' }}>
        <span className="text-white font-bold" style={{ fontSize: 9 }}>T</span>
      </div>
    )
    return <Globe size={12} style={{ color: 'var(--text-tertiary)' }} />
  }

  return (
    <>
      <div
        className={`tab-item ${isActive ? 'active' : ''} ${tab.isPinned ? 'pinned' : ''} ${tab.isHibernated ? 'opacity-60' : ''} animate-tab-in group`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        title={tab.title || tab.url}
      >
        {/* Loading indicator */}
        {tab.isLoading && (
          <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0"
            style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        )}
        {!tab.isLoading && <div className="flex-shrink-0"><FaviconEl /></div>}

        {/* Title (hidden when pinned) */}
        {!tab.isPinned && (
          <span className="truncate flex-1 text-xs" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {tab.title || new URL(tab.url.startsWith('http') ? tab.url : 'https://newtab').hostname || 'New Tab'}
          </span>
        )}

        {/* Audio indicator */}
        {tab.isMuted && !tab.isPinned && (
          <VolumeX size={11} className="flex-shrink-0 opacity-70" onClick={(e) => { e.stopPropagation(); updateTab(tab.id, { isMuted: false }) }} />
        )}

        {/* Close button */}
        {!tab.isPinned && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 opacity-0 group-hover:opacity-100 rounded-sm p-0.5 transition-opacity hover:bg-red-500/20"
          >
            <X size={11} />
          </button>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div
            className="panel fixed z-50 py-1 min-w-48 animate-scale-in"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            {[
              { label: 'Duplicate Tab', icon: Copy, fn: () => menuAction(() => duplicateTab(tab.id)) },
              { label: tab.isPinned ? 'Unpin Tab' : 'Pin Tab', icon: Pin, fn: () => menuAction(() => updateTab(tab.id, { isPinned: !tab.isPinned })) },
              { label: tab.isMuted ? 'Unmute Tab' : 'Mute Tab', icon: tab.isMuted ? Volume2 : VolumeX, fn: () => menuAction(() => updateTab(tab.id, { isMuted: !tab.isMuted })) },
              { label: 'Hibernate Tab', icon: BedDouble, fn: () => menuAction(() => hibernateTab(tab.id)) },
              { divider: true },
              { label: 'Close Tab', icon: X, danger: true, fn: () => menuAction(() => closeTab(tab.id)) },
            ].map((item, i) => item.divider ? (
              <div key={i} className="my-1" style={{ height: 1, background: 'var(--border)' }} />
            ) : (
              <button
                key={i}
                onClick={item.fn}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-[var(--surface-2)] transition-colors text-left"
                style={{ color: item.danger ? '#ef4444' : 'var(--text-primary)' }}
              >
                <item.icon size={13} />
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  )
}

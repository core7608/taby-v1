import { useRef, useState } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import TabItem from './TabItem'
import {
  Plus, ChevronLeft, ChevronRight, LayoutGrid,
  Lock, Globe
} from 'lucide-react'

export default function TabBar() {
  const { tabs, activeTabId, addTab, setActiveTab, isPrivateMode } = useBrowserStore()
  const scrollRef = useRef(null)

  const pinnedTabs = tabs.filter(t => t.isPinned)
  const normalTabs = tabs.filter(t => !t.isPinned)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex items-center h-10 px-2 gap-1 select-none">
      {/* Private mode indicator */}
      {isPrivateMode && (
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-md mr-1"
          style={{ background: 'rgba(168,85,247,0.15)', color: '#9333ea' }}>
          <Lock size={11} />
          <span className="text-xs font-semibold">Private</span>
        </div>
      )}

      {/* Pinned tabs */}
      {pinnedTabs.length > 0 && (
        <div className="flex items-center gap-0.5">
          {pinnedTabs.map(tab => (
            <TabItem key={tab.id} tab={tab} />
          ))}
          <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />
        </div>
      )}

      {/* Scrollable normal tabs */}
      <div className="flex items-center flex-1 overflow-hidden relative">
        <div
          ref={scrollRef}
          className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-thin pb-0.5"
          style={{ scrollbarWidth: 'none' }}
        >
          {normalTabs.map(tab => (
            <TabItem key={tab.id} tab={tab} />
          ))}
        </div>
        <div className="tab-bar-fade-right" />
      </div>

      {/* Add tab button */}
      <button
        onClick={() => addTab()}
        className="btn-ghost rounded-lg p-1.5 flex-shrink-0"
        title="New Tab (Ctrl+T)"
      >
        <Plus size={15} />
      </button>

      {/* Tab overview button */}
      <button
        className="btn-ghost rounded-lg p-1.5 flex-shrink-0"
        title="All Tabs"
      >
        <LayoutGrid size={14} />
      </button>
    </div>
  )
}

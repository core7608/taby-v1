import { useState } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import TabBar from './TabBar'
import Toolbar from './Toolbar'
import WebContent from './WebContent'
import Sidebar from './Sidebar'
import DevToolsPanel from '../DevTools/DevToolsPanel'
import StatusBar from './StatusBar'

export default function BrowserChrome() {
  const { devToolsOpen, sidebarOpen, theme } = useBrowserStore()

  return (
    <div
      className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
    >
      {/* Title bar + tabs (draggable region on desktop) */}
      <div
        data-tauri-drag-region
        className="flex flex-col flex-shrink-0"
        style={{
          background: 'var(--surface-2)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <TabBar />
        <Toolbar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && <Sidebar />}

        {/* Browser content + devtools */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className={`flex flex-1 overflow-hidden ${devToolsOpen ? 'flex-col' : ''}`}>
            <WebContent />
            {devToolsOpen && <DevToolsPanel />}
          </div>
        </div>
      </div>

      <StatusBar />
    </div>
  )
}

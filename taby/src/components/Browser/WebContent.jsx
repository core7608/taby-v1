import { useState, useEffect } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import NewTabPage from './NewTabPage'
import UniversalViewer from './UniversalViewer'
import TabyAppsHub, { APPS } from '../Apps/TabyAppsHub'

// Map taby:// URLs to components
const APP_ROUTES = Object.fromEntries(APPS.map(a => [a.id, a.component]))

const VIEWER_EXTS = ['pdf','zip','rar','docx','xlsx','pptx','py','js','ts','rs','go','cpp','c','java','md','txt','csv','json','xml','svg','toml','yaml','yml','sh','sql']

const getExt = (url) => {
  try { return new URL(url).pathname.split('.').pop().toLowerCase() } catch { return '' }
}

export default function WebContent() {
  const { tabs, activeTabId, addTab } = useBrowserStore()

  const openApp = (app) => {
    const existing = tabs.find(t => t.url === app.id)
    if (existing) { useBrowserStore.getState().setActiveTab(existing.id); return }
    addTab(app.id)
    // update title after add
    setTimeout(() => {
      const { tabs: newTabs } = useBrowserStore.getState()
      const t = newTabs.find(t => t.url === app.id)
      if (t) useBrowserStore.getState().updateTab(t.id, { title: app.nameAr, favicon: app.icon })
    }, 50)
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {tabs.map(tab => {
        const isActive = tab.id === activeTabId
        const ext = getExt(tab.url)
        const AppComponent = APP_ROUTES[tab.url]
        const needsViewer = VIEWER_EXTS.includes(ext) && !tab.url.startsWith('taby://')

        return (
          <div
            key={tab.id}
            className="absolute inset-0"
            style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none', transition: 'opacity 0.1s' }}
          >
            {tab.url === 'taby://newtab' || !tab.url
              ? <NewTabPage tabId={tab.id} onOpenApp={openApp} />
              : tab.url === 'taby://apps'
                ? <TabyAppsHub onOpenApp={openApp} />
                : AppComponent
                  ? <AppComponent />
                  : needsViewer
                    ? <UniversalViewer url={tab.url} ext={ext} />
                    : tab.isHibernated
                      ? <HibernatedTab tab={tab} />
                      : <WebViewFrame tab={tab} />
            }
          </div>
        )
      })}
    </div>
  )
}

function WebViewFrame({ tab }) {
  return (
    <div className="webview-container w-full h-full flex flex-col">
      {tab.isLoading && <div className="webview-loading" />}
      <iframe
        src={tab.url}
        className="flex-1 w-full border-none"
        title={tab.title || 'Web Content'}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-downloads"
      />
    </div>
  )
}

function HibernatedTab({ tab }) {
  const { wakeTab } = useBrowserStore()
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: 'var(--surface-2)' }}>
      <div className="text-5xl">💤</div>
      <div className="text-center">
        <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{tab.title || 'Tab Hibernated'}</p>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>هذا التاب نائم لتوفير الذاكرة</p>
      </div>
      <button className="btn-primary px-6 py-2" onClick={() => wakeTab(tab.id)}>تنشيط التاب</button>
    </div>
  )
}

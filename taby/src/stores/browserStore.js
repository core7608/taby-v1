import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let tabIdCounter = 1

const createTab = (url = 'taby://newtab', title = 'New Tab') => ({
  id: tabIdCounter++,
  url,
  title,
  favicon: null,
  isLoading: false,
  canGoBack: false,
  canGoForward: false,
  isPinned: false,
  isMuted: false,
  isHibernated: false,
  isStealth: false,
  scrollPosition: 0,
  zoom: 100,
  createdAt: Date.now(),
})

export const useBrowserStore = create(
  persist(
    (set, get) => ({
      // ── Tabs ──────────────────────────────────────────────────────────
      tabs: [createTab()],
      activeTabId: 1,
      tabGroups: [],

      addTab: (url, options = {}) => {
        const tab = createTab(url)
        if (options.pinned) tab.isPinned = true
        if (options.stealth) tab.isStealth = true
        set(s => ({ tabs: [...s.tabs, tab], activeTabId: tab.id }))
        return tab.id
      },

      closeTab: (id) => {
        const { tabs, activeTabId } = get()
        if (tabs.length === 1) { set({ tabs: [createTab()], activeTabId: tabIdCounter - 1 }); return }
        const idx = tabs.findIndex(t => t.id === id)
        const newTabs = tabs.filter(t => t.id !== id)
        let newActive = activeTabId
        if (activeTabId === id) {
          newActive = newTabs[Math.min(idx, newTabs.length - 1)].id
        }
        set({ tabs: newTabs, activeTabId: newActive })
      },

      updateTab: (id, updates) => {
        set(s => ({ tabs: s.tabs.map(t => t.id === id ? { ...t, ...updates } : t) }))
      },

      setActiveTab: (id) => set({ activeTabId: id }),

      moveTab: (fromId, toId) => {
        const { tabs } = get()
        const from = tabs.findIndex(t => t.id === fromId)
        const to = tabs.findIndex(t => t.id === toId)
        const newTabs = [...tabs]
        const [moved] = newTabs.splice(from, 1)
        newTabs.splice(to, 0, moved)
        set({ tabs: newTabs })
      },

      duplicateTab: (id) => {
        const tab = get().tabs.find(t => t.id === id)
        if (!tab) return
        const newTab = { ...createTab(tab.url, tab.title), favicon: tab.favicon }
        set(s => ({ tabs: [...s.tabs, newTab], activeTabId: newTab.id }))
      },

      hibernateTab: (id) => {
        set(s => ({ tabs: s.tabs.map(t => t.id === id ? { ...t, isHibernated: true } : t) }))
      },

      wakeTab: (id) => {
        set(s => ({ tabs: s.tabs.map(t => t.id === id ? { ...t, isHibernated: false } : t) }))
        set({ activeTabId: id })
      },

      getActiveTab: () => {
        const { tabs, activeTabId } = get()
        return tabs.find(t => t.id === activeTabId)
      },

      // ── UI State ──────────────────────────────────────────────────────
      theme: 'dark',
      sidebarOpen: false,
      sidebarView: 'bookmarks', // bookmarks | history | downloads | notes
      devToolsOpen: false,
      devToolsTab: 'console',
      urlBarFocused: false,
      omniboxQuery: '',
      commandPaletteOpen: false,

      setTheme: (t) => set({ theme: t }),
      toggleSidebar: (view) => set(s => ({
        sidebarOpen: s.sidebarView === view ? !s.sidebarOpen : true,
        sidebarView: view,
      })),
      toggleDevTools: () => set(s => ({ devToolsOpen: !s.devToolsOpen })),
      setDevToolsTab: (t) => set({ devToolsTab: t }),
      setUrlBarFocused: (v) => set({ urlBarFocused: v }),
      setOmniboxQuery: (q) => set({ omniboxQuery: q }),
      toggleCommandPalette: () => set(s => ({ commandPaletteOpen: !s.commandPaletteOpen })),

      // ── Browsing State ────────────────────────────────────────────────
      isPrivateMode: false,
      adBlockEnabled: true,
      fingerprintMaskEnabled: true,
      vpnEnabled: false,
      currentZoom: 100,

      togglePrivateMode: () => set(s => ({ isPrivateMode: !s.isPrivateMode })),
      toggleAdBlock: () => set(s => ({ adBlockEnabled: !s.adBlockEnabled })),
      toggleFingerprintMask: () => set(s => ({ fingerprintMaskEnabled: !s.fingerprintMaskEnabled })),
      toggleVPN: () => set(s => ({ vpnEnabled: !s.vpnEnabled })),

      // ── Downloads ────────────────────────────────────────────────────
      downloads: [],
      addDownload: (dl) => set(s => ({ downloads: [dl, ...s.downloads] })),
      updateDownload: (id, updates) => set(s => ({
        downloads: s.downloads.map(d => d.id === id ? { ...d, ...updates } : d)
      })),

      // ── History ──────────────────────────────────────────────────────
      history: [],
      addToHistory: (entry) => set(s => ({
        history: [{ ...entry, visitedAt: Date.now() }, ...s.history].slice(0, 5000)
      })),

      // ── Bookmarks ────────────────────────────────────────────────────
      bookmarks: [],
      addBookmark: (bm) => set(s => ({ bookmarks: [...s.bookmarks, bm] })),
      removeBookmark: (url) => set(s => ({ bookmarks: s.bookmarks.filter(b => b.url !== url) })),
      isBookmarked: (url) => get().bookmarks.some(b => b.url === url),

      // ── Settings ─────────────────────────────────────────────────────
      settings: {
        searchEngine: 'google',
        homePage: 'taby://newtab',
        tabHibernationDelay: 10,
        fontSize: 16,
        language: 'ar',
        showBookmarksBar: true,
        smoothScrolling: true,
        hardwareAcceleration: true,
        autoPlayMedia: false,
      },
      updateSettings: (updates) => set(s => ({ settings: { ...s.settings, ...updates } })),

      // ── Multi-device ─────────────────────────────────────────────────
      syncEnabled: false,
      syncDevices: [],
      setSyncEnabled: (v) => set({ syncEnabled: v }),
    }),
    {
      name: 'taby-state',
      partialize: (s) => ({
        theme: s.theme,
        bookmarks: s.bookmarks,
        history: s.history.slice(0, 100),
        settings: s.settings,
        adBlockEnabled: s.adBlockEnabled,
        fingerprintMaskEnabled: s.fingerprintMaskEnabled,
      })
    }
  )
)

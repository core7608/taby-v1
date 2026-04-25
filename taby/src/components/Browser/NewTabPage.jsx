import { useState, useEffect } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import { Search, Grid3x3, Globe, Star } from 'lucide-react'
import { APPS } from '../Apps/TabyAppsHub'

const SHORTCUTS = [
  { title: 'Google', url: 'https://google.com', icon: '🔍' },
  { title: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { title: 'Gmail', url: 'https://gmail.com', icon: '📧' },
  { title: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
  { title: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
  { title: 'MDN', url: 'https://developer.mozilla.org', icon: '📚' },
  { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '💬' },
]

export default function NewTabPage({ tabId, onOpenApp }) {
  const { updateTab, bookmarks, settings, theme } = useBrowserStore()
  const [q, setQ] = useState('')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const search = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    const engines = {
      google: `https://www.google.com/search?q=${encodeURIComponent(q)}`,
      duckduckgo: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`,
      bing: `https://www.bing.com/search?q=${encodeURIComponent(q)}`,
    }
    updateTab(tabId, { url: engines[settings.searchEngine] || engines.google, title: q, isLoading: true })
  }

  const h = time.getHours()
  const greeting = h < 5 ? 'ليلة سعيدة' : h < 12 ? 'صباح الخير' : h < 17 ? 'مساء النور' : h < 21 ? 'مساء الخير' : 'ليلة طيبة'
  const isDark = theme === 'dark'

  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto scrollbar-thin"
      style={{ background: isDark ? '#080a0f' : '#f8f9fa', position: 'relative' }}>
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:'absolute', top:'20%', left:'30%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(42,139,255,0.06), transparent 70%)' }} />
          <div style={{ position:'absolute', bottom:'20%', right:'20%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%)' }} />
        </div>
      )}

      <div className="flex flex-col items-center w-full max-w-2xl px-6 pt-14 pb-12 gap-10 relative z-10">
        {/* Clock */}
        <div className="text-center">
          <div className="font-black tracking-tight" style={{ fontSize: 80, lineHeight: 1, color: isDark ? 'white' : '#0f1117', fontVariantNumeric: 'tabular-nums' }}>
            {time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="mt-1 text-lg font-bold" style={{ color: 'var(--accent)' }}>{greeting} 👋</div>
        </div>

        {/* Search */}
        <form onSubmit={search} className="w-full">
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full"
            style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'white', border: '1.5px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
            <Search size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
            <input
              type="text" value={q} onChange={e => setQ(e.target.value)}
              placeholder="ابحث أو أدخل رابطاً..."
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: isDark ? 'white' : '#0f1117', fontFamily: 'inherit' }}
              autoFocus
            />
            {q && <button type="submit" className="btn-primary px-3 py-1 text-sm rounded-lg">Go</button>}
          </div>
        </form>

        {/* Built-in Apps */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              تطبيقات Taby المدمجة
            </span>
            <button
              onClick={() => onOpenApp?.({ id: 'taby://apps', nameAr: 'كل التطبيقات' })}
              className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              عرض الكل →
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {APPS.slice(0, 8).map(app => (
              <button key={app.id}
                onClick={() => onOpenApp?.(app)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all hover:scale-105"
                style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'white', border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#e5e7eb' }}>
                <span style={{ fontSize: 22 }}>{app.icon}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{app.nameAr}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Web shortcuts */}
        <div className="w-full">
          <span className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: 'var(--text-tertiary)' }}>الوصول السريع</span>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {SHORTCUTS.map((s, i) => (
              <button key={i}
                onClick={() => updateTab(tabId, { url: s.url, title: s.title, isLoading: true })}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all hover:scale-105"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'white', border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb' }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)', fontSize: 10 }}>{s.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent bookmarks */}
        {bookmarks.length > 0 && (
          <div className="w-full">
            <span className="text-xs font-bold uppercase tracking-wider mb-3 block" style={{ color: 'var(--text-tertiary)' }}>الإشارات المرجعية</span>
            <div className="flex flex-col gap-1.5">
              {bookmarks.slice(0, 4).map((bm, i) => (
                <button key={i}
                  onClick={() => updateTab(tabId, { url: bm.url, title: bm.title, isLoading: true })}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors"
                  style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'white', border: '1px solid var(--border)' }}>
                  <Star size={12} style={{ color: '#f59e0b', flexShrink: 0 }} />
                  <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-primary)' }}>{bm.title || bm.url}</span>
                  <span className="text-xs truncate max-w-36" style={{ color: 'var(--text-tertiary)' }}>{bm.url}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Taby brand */}
        <div className="flex items-center gap-2 mt-2 opacity-40">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2a8bff, #0d6bff)' }}>
            <span className="text-white font-black" style={{ fontSize: 10 }}>T</span>
          </div>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>Taby Browser v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

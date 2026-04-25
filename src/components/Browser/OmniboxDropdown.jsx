import { useMemo } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import { Globe, Clock, Star, Search, TrendingUp } from 'lucide-react'

const SUGGESTIONS = [
  { type: 'popular', title: 'Google', url: 'https://google.com', icon: '🔍' },
  { type: 'popular', title: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { type: 'popular', title: 'GitHub', url: 'https://github.com', icon: '🐙' },
  { type: 'popular', title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '💬' },
  { type: 'popular', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📚' },
]

export default function OmniboxDropdown({ query, onNavigate }) {
  const { history, bookmarks } = useBrowserStore()

  const items = useMemo(() => {
    if (!query || query === 'taby://newtab') {
      return SUGGESTIONS.slice(0, 5)
    }
    const q = query.toLowerCase()
    const histItems = history
      .filter(h => h.url?.toLowerCase().includes(q) || h.title?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(h => ({ ...h, type: 'history' }))
    const bmItems = bookmarks
      .filter(b => b.url?.toLowerCase().includes(q) || b.title?.toLowerCase().includes(q))
      .slice(0, 2)
      .map(b => ({ ...b, type: 'bookmark' }))
    const search = [{ type: 'search', title: `Search "${query}"`, url: `https://google.com/search?q=${encodeURIComponent(query)}` }]
    return [...search, ...bmItems, ...histItems, ...SUGGESTIONS.filter(s => s.title.toLowerCase().includes(q)).slice(0, 2)]
  }, [query, history, bookmarks])

  const typeIcon = (type) => {
    if (type === 'history') return <Clock size={13} style={{ color: 'var(--text-tertiary)' }} />
    if (type === 'bookmark') return <Star size={13} style={{ color: '#f59e0b' }} />
    if (type === 'search') return <Search size={13} style={{ color: 'var(--accent)' }} />
    return <Globe size={13} style={{ color: 'var(--text-tertiary)' }} />
  }

  return (
    <div
      className="panel absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden animate-slide-in"
      style={{ maxHeight: 360 }}
    >
      {items.map((item, i) => (
        <button
          key={i}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--surface-2)] transition-colors"
          onClick={() => onNavigate(item.url)}
        >
          <div className="flex-shrink-0 w-5 flex items-center justify-center">
            {item.icon ? <span style={{ fontSize: 14 }}>{item.icon}</span> : typeIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </div>
            <div className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
              {item.url}
            </div>
          </div>
          <span className="badge badge-blue text-xs flex-shrink-0" style={{ fontSize: 10 }}>
            {item.type}
          </span>
        </button>
      ))}
    </div>
  )
}

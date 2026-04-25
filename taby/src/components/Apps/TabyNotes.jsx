// TabyNotes.jsx
import { useState } from 'react'
import { Plus, Trash2, Search, FileText } from 'lucide-react'

const DEFAULT_NOTES = [
  { id: 1, title: 'أفكار مشروع Taby', content: '## أفكار رئيسية\n\n- دعم الـ WebRTC للمزامنة\n- تشفير AES-256 للخزنة\n- واجهة مشابهة لكروم\n\n### المميزات الرئيسية\n1. سريع وخفيف\n2. خصوصية تامة\n3. أدوات للمطورين', updatedAt: Date.now() },
  { id: 2, title: 'قائمة المهام', content: '- [ ] إضافة ميزة الـ AI\n- [x] بناء الواجهة\n- [ ] اختبار الأداء', updatedAt: Date.now() - 3600000 },
]

export default function TabyNotes() {
  const [notes, setNotes] = useState(DEFAULT_NOTES)
  const [activeId, setActiveId] = useState(1)
  const [search, setSearch] = useState('')

  const activeNote = notes.find(n => n.id === activeId)
  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))

  const addNote = () => {
    const n = { id: Date.now(), title: 'New Note', content: '', updatedAt: Date.now() }
    setNotes(prev => [n, ...prev])
    setActiveId(n.id)
  }

  const update = (field, val) => {
    setNotes(prev => prev.map(n => n.id === activeId ? { ...n, [field]: val, updatedAt: Date.now() } : n))
  }

  return (
    <div className="flex h-full" style={{ background: 'var(--surface)' }}>
      {/* Sidebar */}
      <div className="w-56 flex flex-col flex-shrink-0" style={{ borderRight: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="flex items-center gap-2 p-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#f59e0b' }}>
            <FileText size={12} className="text-white" />
          </div>
          <span className="font-bold text-sm flex-1" style={{ color: 'var(--text-primary)' }}>Notes</span>
          <button onClick={addNote} className="btn-ghost p-1 rounded"><Plus size={14} /></button>
        </div>
        <div className="px-2 py-2 flex-shrink-0">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="input text-xs pl-7" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {filtered.map(n => (
            <button key={n.id} onClick={() => setActiveId(n.id)}
              className="w-full text-left p-3 transition-colors border-l-2"
              style={{
                background: activeId === n.id ? 'var(--surface)' : 'transparent',
                borderLeftColor: activeId === n.id ? '#f59e0b' : 'transparent',
              }}>
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {new Date(n.updatedAt).toLocaleDateString('ar')}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      {activeNote && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <input
            value={activeNote.title}
            onChange={e => update('title', e.target.value)}
            className="px-6 pt-6 pb-2 text-2xl font-black bg-transparent outline-none"
            style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', fontFamily: 'inherit' }}
          />
          <textarea
            value={activeNote.content}
            onChange={e => update('content', e.target.value)}
            className="flex-1 px-6 py-4 bg-transparent outline-none resize-none text-sm leading-relaxed"
            style={{ color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}
          />
          <div className="px-6 py-2 flex-shrink-0 text-xs" style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border)' }}>
            {activeNote.content.trim().split(/\s+/).filter(Boolean).length} words · Markdown supported · Auto-saved
          </div>
        </div>
      )}
    </div>
  )
}

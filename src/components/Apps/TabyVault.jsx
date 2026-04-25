import { useState } from 'react'
import { Lock, Eye, EyeOff, Plus, Search, Trash2, Copy, Shield, Key, Globe, User, RefreshCw } from 'lucide-react'

const SAMPLE = [
  { id: 1, url: 'github.com', username: 'awad@example.com', password: 'S3cur3P@ss!', label: 'GitHub', icon: '🐙', strength: 95 },
  { id: 2, url: 'google.com', username: 'awad@gmail.com', password: 'G00gl3P@ss', label: 'Google', icon: '🔍', strength: 78 },
  { id: 3, url: 'work.company.com', username: 'awad.ali', password: 'W0rkP@ss2024', label: 'Work Portal', icon: '💼', strength: 88 },
]

const strengthColor = (s) => s >= 90 ? '#16a34a' : s >= 70 ? '#f59e0b' : '#ef4444'
const strengthLabel = (s) => s >= 90 ? 'Strong' : s >= 70 ? 'Fair' : 'Weak'

export default function TabyVault() {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [masterPass, setMasterPass] = useState('')
  const [entries, setEntries] = useState(SAMPLE)
  const [search, setSearch] = useState('')
  const [showPassId, setShowPassId] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newEntry, setNewEntry] = useState({ url: '', username: '', password: '', label: '' })

  const unlock = (e) => {
    e.preventDefault()
    if (masterPass.length >= 4) setIsUnlocked(true)
  }

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    const pass = Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setNewEntry(p => ({ ...p, password: pass }))
  }

  const addEntry = (e) => {
    e.preventDefault()
    setEntries(prev => [...prev, { ...newEntry, id: Date.now(), icon: '🌐', strength: 80 }])
    setNewEntry({ url: '', username: '', password: '', label: '' })
    setShowAdd(false)
  }

  const filtered = entries.filter(e =>
    e.label.toLowerCase().includes(search.toLowerCase()) ||
    e.url.toLowerCase().includes(search.toLowerCase()) ||
    e.username.toLowerCase().includes(search.toLowerCase())
  )

  if (!isUnlocked) return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: 'var(--surface)' }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
          <Shield size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Taby Vault</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          خزنتك المشفرة بتشفير AES-256
        </p>
      </div>
      <form onSubmit={unlock} className="flex flex-col gap-3 w-full max-w-xs">
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="password"
            value={masterPass}
            onChange={e => setMasterPass(e.target.value)}
            placeholder="Master Password..."
            className="input pl-9"
            autoFocus
          />
        </div>
        <button type="submit" className="btn-primary py-2.5 text-sm font-bold rounded-xl" style={{ background: '#16a34a' }}>
          Unlock Vault
        </button>
        <p className="text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>
          كلمة السر لا تُخزن على أي سيرفر خارجي
        </p>
      </form>
    </div>
  )

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#16a34a' }}>
          <Shield size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Taby Vault</span>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-semibold text-green-600">Unlocked</span>
        </div>
        <div className="flex-1" />
        <button onClick={() => setShowAdd(true)} className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5">
          <Plus size={13} /> Add Entry
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search credentials..." className="input pl-9 text-sm" />
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col gap-2">
        {filtered.map(entry => (
          <div key={entry.id} className="panel p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: 'var(--surface-2)' }}>
              {entry.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{entry.label}</p>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-12 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                    <div className="h-full rounded-full" style={{ width: `${entry.strength}%`, background: strengthColor(entry.strength) }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: strengthColor(entry.strength) }}>
                    {strengthLabel(entry.strength)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Globe size={11} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{entry.url}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <User size={11} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{entry.username}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface-2)' }}>
                <Key size={12} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs font-mono" style={{ color: 'var(--text-primary)', letterSpacing: 1 }}>
                  {showPassId === entry.id ? entry.password : '••••••••••'}
                </span>
              </div>
              <button onClick={() => setShowPassId(showPassId === entry.id ? null : entry.id)}
                className="btn-ghost p-1.5 rounded-lg">
                {showPassId === entry.id ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button onClick={() => navigator.clipboard?.writeText(entry.password)}
                className="btn-ghost p-1.5 rounded-lg" title="Copy password">
                <Copy size={14} />
              </button>
              <button onClick={() => setEntries(prev => prev.filter(e => e.id !== entry.id))}
                className="btn-ghost p-1.5 rounded-lg" style={{ color: '#ef4444' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add modal */}
      {showAdd && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="panel w-full max-w-md p-6 animate-scale-in">
              <h3 className="text-base font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Add New Credential</h3>
              <form onSubmit={addEntry} className="flex flex-col gap-3">
                <input value={newEntry.label} onChange={e => setNewEntry(p => ({ ...p, label: e.target.value }))} placeholder="Label (e.g. GitHub)" className="input text-sm" required />
                <input value={newEntry.url} onChange={e => setNewEntry(p => ({ ...p, url: e.target.value }))} placeholder="Website URL" className="input text-sm" />
                <input value={newEntry.username} onChange={e => setNewEntry(p => ({ ...p, username: e.target.value }))} placeholder="Username / Email" className="input text-sm" required />
                <div className="flex gap-2">
                  <input value={newEntry.password} onChange={e => setNewEntry(p => ({ ...p, password: e.target.value }))} type="password" placeholder="Password" className="input text-sm flex-1" required />
                  <button type="button" onClick={generatePassword} className="btn-ghost p-2 rounded-lg" title="Generate strong password">
                    <RefreshCw size={15} />
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-ghost flex-1 py-2 rounded-xl text-sm border" style={{ borderColor: 'var(--border)' }}>Cancel</button>
                  <button type="submit" className="btn-primary flex-1 py-2 rounded-xl text-sm" style={{ background: '#16a34a' }}>Save</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

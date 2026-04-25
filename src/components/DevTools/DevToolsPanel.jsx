import { useState, useRef, useEffect } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import {
  Terminal, Network, Code2, Layers, Database, Send,
  X, Trash2, ChevronRight, AlertCircle, Info, AlertTriangle,
  CheckCircle, Plus, Minus, Copy, Download, Wifi
} from 'lucide-react'

const TABS = [
  { id: 'console', icon: Terminal, label: 'Console' },
  { id: 'network', icon: Network, label: 'Network' },
  { id: 'elements', icon: Layers, label: 'Elements' },
  { id: 'api', icon: Send, label: 'API Tester' },
  { id: 'storage', icon: Database, label: 'Storage' },
]

const SAMPLE_LOGS = [
  { type: 'info', message: 'Taby DevTools initialized', time: '10:32:01' },
  { type: 'log', message: 'Page loaded in 342ms', time: '10:32:01' },
  { type: 'warn', message: 'Deprecated API: document.all', time: '10:32:02' },
  { type: 'error', message: 'TypeError: Cannot read property of undefined', time: '10:32:03', stack: 'at main.js:42' },
  { type: 'info', message: 'Ad Blocker: 12 requests blocked', time: '10:32:01' },
]

export default function DevToolsPanel() {
  const { devToolsTab, setDevToolsTab, toggleDevTools } = useBrowserStore()
  const [panelHeight, setPanelHeight] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(0)
  const dragStartH = useRef(0)

  const onDragStart = (e) => {
    setIsDragging(true)
    dragStartY.current = e.clientY
    dragStartH.current = panelHeight
  }

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging) return
      const delta = dragStartY.current - e.clientY
      setPanelHeight(Math.max(150, Math.min(600, dragStartH.current + delta)))
    }
    const onUp = () => setIsDragging(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [isDragging])

  return (
    <div
      className="flex flex-col flex-shrink-0"
      style={{
        height: panelHeight,
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
      }}
    >
      {/* Drag handle */}
      <div
        className="flex-shrink-0 cursor-row-resize flex items-center justify-center"
        style={{ height: 4, background: 'var(--surface-2)' }}
        onMouseDown={onDragStart}
      >
        <div className="w-12 h-1 rounded-full" style={{ background: 'var(--border)' }} />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0.5 px-2 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', height: 36 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setDevToolsTab(t.id)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-xs font-medium"
            style={{
              background: devToolsTab === t.id ? 'var(--surface)' : 'transparent',
              color: devToolsTab === t.id ? 'var(--accent)' : 'var(--text-secondary)',
              borderBottom: devToolsTab === t.id ? `2px solid var(--accent)` : '2px solid transparent',
              borderRadius: '4px 4px 0 0',
            }}
          >
            <t.icon size={13} />
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <button className="btn-ghost p-1.5 rounded" onClick={toggleDevTools}><X size={14} /></button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {devToolsTab === 'console' && <ConsoleTab />}
        {devToolsTab === 'network' && <NetworkTab />}
        {devToolsTab === 'elements' && <ElementsTab />}
        {devToolsTab === 'api' && <ApiTesterTab />}
        {devToolsTab === 'storage' && <StorageTab />}
      </div>
    </div>
  )
}

function ConsoleTab() {
  const [logs, setLogs] = useState(SAMPLE_LOGS)
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView() }, [logs])

  const run = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setLogs(l => [...l, { type: 'log', message: `> ${input}`, time: new Date().toLocaleTimeString() }])
    // Simulate AI error explanation
    if (input.toLowerCase().includes('explain')) {
      setLogs(l => [...l, { type: 'ai', message: '🤖 AI: This error typically occurs when you try to access a property on null or undefined. Check that your variable is initialized before use.', time: new Date().toLocaleTimeString() }])
    }
    setInput('')
  }

  const filtered = filter === 'all' ? logs : logs.filter(l => l.type === filter)

  const logColors = { error: '#ef4444', warn: '#f59e0b', info: '#3b82f6', log: 'var(--text-primary)', ai: '#8b5cf6' }
  const logIcons = { error: AlertCircle, warn: AlertTriangle, info: Info, log: ChevronRight, ai: null }

  return (
    <div className="flex flex-col h-full">
      {/* Filter bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        {['all', 'error', 'warn', 'info', 'log'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-2 py-0.5 rounded text-xs capitalize font-medium transition-all"
            style={{
              background: filter === f ? 'var(--accent)' : 'transparent',
              color: filter === f ? 'white' : 'var(--text-tertiary)',
            }}>
            {f}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => setLogs([])} className="btn-ghost p-1 rounded" title="Clear">
          <Trash2 size={12} />
        </button>
      </div>

      {/* Log output */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-1"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
        {filtered.map((log, i) => {
          const Icon = logIcons[log.type]
          return (
            <div key={i} className="flex items-start gap-2 py-1 px-2 rounded-md hover:bg-[var(--surface-2)] group">
              <span className="flex-shrink-0 opacity-50 text-xs" style={{ color: 'var(--text-tertiary)', minWidth: 56 }}>
                {log.time}
              </span>
              {Icon && <Icon size={12} style={{ color: logColors[log.type], flexShrink: 0, marginTop: 1 }} />}
              <div className="flex-1">
                <span style={{ color: logColors[log.type] || 'var(--text-primary)' }}>{log.message}</span>
                {log.stack && <div className="mt-0.5 opacity-60" style={{ color: 'var(--text-tertiary)' }}>{log.stack}</div>}
              </div>
              {log.type === 'error' && (
                <button className="opacity-0 group-hover:opacity-100 btn-ghost p-0.5 rounded text-xs flex-shrink-0"
                  style={{ color: '#8b5cf6', fontSize: 10 }}
                  onClick={() => setLogs(l => [...l, { type: 'ai', message: '🤖 AI Analysis: This TypeError usually happens when accessing .property on null. Add a null check before the line.', time: new Date().toLocaleTimeString() }])}>
                  AI Fix
                </button>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={run} className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)' }}>
        <ChevronRight size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='Type JS or "explain [error]" for AI help...'
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}
        />
      </form>
    </div>
  )
}

function NetworkTab() {
  const requests = [
    { method: 'GET', url: 'https://api.example.com/data', status: 200, type: 'fetch', size: '4.2 KB', time: '124ms' },
    { method: 'POST', url: 'https://api.example.com/login', status: 401, type: 'fetch', size: '0.8 KB', time: '89ms' },
    { method: 'GET', url: 'https://cdn.example.com/main.js', status: 200, type: 'script', size: '142 KB', time: '312ms' },
    { method: 'GET', url: 'https://example.com/style.css', status: 304, type: 'stylesheet', size: '0 B', time: '22ms' },
    { method: 'GET', url: 'https://img.example.com/hero.webp', status: 200, type: 'image', size: '89.4 KB', time: '201ms' },
  ]

  const statusColor = (s) => s >= 500 ? '#ef4444' : s >= 400 ? '#f59e0b' : s >= 300 ? '#3b82f6' : '#16a34a'

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <table className="w-full text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <thead className="sticky top-0" style={{ background: 'var(--surface-2)' }}>
          <tr>
            {['Method', 'URL', 'Status', 'Type', 'Size', 'Time'].map(h => (
              <th key={h} className="text-left px-3 py-2 font-semibold"
                style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {requests.map((r, i) => (
            <tr key={i} className="hover:bg-[var(--surface-2)] cursor-pointer transition-colors">
              <td className="px-3 py-1.5">
                <span className="badge" style={{ background: r.method === 'GET' ? 'rgba(22,163,74,0.1)' : 'rgba(234,88,12,0.1)', color: r.method === 'GET' ? '#16a34a' : '#ea580c' }}>
                  {r.method}
                </span>
              </td>
              <td className="px-3 py-1.5 max-w-48 truncate" style={{ color: 'var(--text-primary)' }}>{r.url}</td>
              <td className="px-3 py-1.5" style={{ color: statusColor(r.status) }}>{r.status}</td>
              <td className="px-3 py-1.5" style={{ color: 'var(--text-secondary)' }}>{r.type}</td>
              <td className="px-3 py-1.5" style={{ color: 'var(--text-secondary)' }}>{r.size}</td>
              <td className="px-3 py-1.5" style={{ color: 'var(--text-secondary)' }}>{r.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ElementsTab() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <Layers size={32} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>DOM Inspector</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>Available in full Tauri build with webview integration</p>
      </div>
    </div>
  )
}

function ApiTesterTab() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [body, setBody] = useState('{\n  "title": "Test",\n  "body": "Content"\n}')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'Authorization', value: 'Bearer YOUR_TOKEN', enabled: false },
  ])

  const send = async () => {
    setLoading(true)
    setResponse(null)
    try {
      const opts = { method, headers: {} }
      headers.filter(h => h.enabled && h.key).forEach(h => opts.headers[h.key] = h.value)
      if (['POST', 'PUT', 'PATCH'].includes(method)) opts.body = body
      const start = Date.now()
      const res = await fetch(url, opts)
      const data = await res.json()
      setResponse({ status: res.status, statusText: res.statusText, time: Date.now() - start, data })
    } catch (e) {
      setResponse({ error: e.message })
    }
    setLoading(false)
  }

  const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD']
  const methodColor = { GET: '#16a34a', POST: '#2563eb', PUT: '#d97706', PATCH: '#7c3aed', DELETE: '#dc2626', HEAD: '#6b7280' }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: request */}
      <div className="w-1/2 flex flex-col" style={{ borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 p-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            className="text-xs font-bold px-2 py-1 rounded outline-none cursor-pointer"
            style={{ background: 'transparent', color: methodColor[method], border: 'none', fontFamily: 'JetBrains Mono, monospace' }}
          >
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="flex-1 bg-transparent outline-none text-xs"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}
          />
          <button onClick={send} disabled={loading}
            className="btn-primary px-3 py-1 text-xs flex items-center gap-1 flex-shrink-0">
            <Send size={11} />
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Headers */}
        <div className="p-2 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>HEADERS</p>
          {headers.map((h, i) => (
            <div key={i} className="flex items-center gap-1 mb-1">
              <input type="checkbox" checked={h.enabled} onChange={e => {
                const nh = [...headers]; nh[i].enabled = e.target.checked; setHeaders(nh)
              }} className="w-3 h-3 flex-shrink-0" />
              <input value={h.key} onChange={e => { const nh = [...headers]; nh[i].key = e.target.value; setHeaders(nh) }}
                className="flex-1 bg-transparent outline-none text-xs px-1 py-0.5 rounded"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#f59e0b', background: 'var(--surface-2)' }}
                placeholder="Header key" />
              <input value={h.value} onChange={e => { const nh = [...headers]; nh[i].value = e.target.value; setHeaders(nh) }}
                className="flex-1 bg-transparent outline-none text-xs px-1 py-0.5 rounded"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', background: 'var(--surface-2)' }}
                placeholder="Value" />
            </div>
          ))}
          <button onClick={() => setHeaders([...headers, { key: '', value: '', enabled: true }])}
            className="btn-ghost text-xs flex items-center gap-1 mt-1">
            <Plus size={10} /> Add header
          </button>
        </div>

        {/* Body */}
        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div className="flex-1 p-2">
            <p className="text-xs font-bold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>BODY (JSON)</p>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full h-full bg-transparent outline-none resize-none text-xs"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', minHeight: 80 }}
            />
          </div>
        )}
      </div>

      {/* Right: response */}
      <div className="w-1/2 flex flex-col">
        <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>RESPONSE</span>
          {response && !response.error && (
            <>
              <span className="badge" style={{ background: response.status < 400 ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)', color: response.status < 400 ? '#16a34a' : '#ef4444', fontSize: 10 }}>
                {response.status} {response.statusText}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{response.time}ms</span>
            </>
          )}
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
          {!response && !loading && (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <Send size={24} className="mb-2" />
              <p className="text-xs">Send a request to see the response</p>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center h-full gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Sending request...</span>
            </div>
          )}
          {response?.error && (
            <div className="text-xs p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
              Error: {response.error}
            </div>
          )}
          {response?.data && (
            <pre className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}

function StorageTab() {
  const items = [
    { key: 'user_session', value: '{"id":123,"name":"Awad"}', type: 'localStorage' },
    { key: 'theme_pref', value: 'dark', type: 'localStorage' },
    { key: 'cart_items', value: '[{"id":1,"qty":2}]', type: 'sessionStorage' },
  ]
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <table className="w-full text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <thead className="sticky top-0" style={{ background: 'var(--surface-2)' }}>
          <tr>
            {['Type', 'Key', 'Value'].map(h => (
              <th key={h} className="text-left px-3 py-2 font-semibold"
                style={{ color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className="hover:bg-[var(--surface-2)] transition-colors">
              <td className="px-3 py-2">
                <span className="badge badge-blue" style={{ fontSize: 10 }}>{item.type}</span>
              </td>
              <td className="px-3 py-2" style={{ color: '#f59e0b' }}>{item.key}</td>
              <td className="px-3 py-2 max-w-48 truncate" style={{ color: 'var(--text-secondary)' }}>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

import { useState } from 'react'
import { Send, Plus, Trash2, FolderOpen, Save, History, Code2, Download } from 'lucide-react'

const COLLECTIONS = [
  {
    name: 'GitHub API',
    requests: [
      { name: 'Get User', method: 'GET', url: 'https://api.github.com/users/octocat' },
      { name: 'List Repos', method: 'GET', url: 'https://api.github.com/users/octocat/repos' },
    ]
  },
  {
    name: 'JSONPlaceholder',
    requests: [
      { name: 'Get Posts', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts' },
      { name: 'Create Post', method: 'POST', url: 'https://jsonplaceholder.typicode.com/posts' },
    ]
  }
]

const methodColor = { GET: '#16a34a', POST: '#2563eb', PUT: '#d97706', PATCH: '#7c3aed', DELETE: '#dc2626', HEAD: '#6b7280' }

export default function TabyApiTester() {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1')
  const [body, setBody] = useState('{\n  "title": "Test Post",\n  "body": "Content here",\n  "userId": 1\n}')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('body')
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'Accept', value: 'application/json', enabled: true },
  ])
  const [history, setHistory] = useState([])
  const [showCollections, setShowCollections] = useState(true)

  const send = async () => {
    if (!url) return
    setLoading(true)
    const start = Date.now()
    try {
      const opts = { method }
      const hdrs = {}
      headers.filter(h => h.enabled && h.key).forEach(h => hdrs[h.key] = h.value)
      opts.headers = hdrs
      if (['POST', 'PUT', 'PATCH'].includes(method)) opts.body = body
      const res = await fetch(url, opts)
      const ct = res.headers.get('content-type') || ''
      const text = await res.text()
      let parsed = null
      try { parsed = JSON.parse(text) } catch {}
      const elapsed = Date.now() - start
      setResponse({ status: res.status, statusText: res.statusText, time: elapsed, body: text, parsed, size: text.length })
      setHistory(h => [{ method, url, status: res.status, time: elapsed, at: new Date().toLocaleTimeString() }, ...h].slice(0, 20))
    } catch (e) {
      setResponse({ error: e.message, time: Date.now() - start })
    }
    setLoading(false)
  }

  return (
    <div className="flex h-full" style={{ background: 'var(--surface)' }}>
      {/* Collections sidebar */}
      {showCollections && (
        <div className="w-52 flex flex-col flex-shrink-0" style={{ borderRight: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
            <FolderOpen size={13} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>COLLECTIONS</span>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
            {COLLECTIONS.map((col, i) => (
              <div key={i}>
                <div className="px-3 py-1.5 text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>{col.name}</div>
                {col.requests.map((req, j) => (
                  <button key={j} onClick={() => { setMethod(req.method); setUrl(req.url) }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-[var(--surface-3)] transition-colors">
                    <span className="text-xs font-bold w-10 text-right" style={{ color: methodColor[req.method] }}>{req.method}</span>
                    <span className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{req.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="p-2 flex-shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs font-bold mb-1 px-1" style={{ color: 'var(--text-tertiary)' }}>HISTORY</p>
            {history.slice(0, 5).map((h, i) => (
              <button key={i} onClick={() => { setMethod(h.method); setUrl(h.url) }}
                className="w-full flex items-center gap-1.5 px-1 py-1 text-left hover:bg-[var(--surface-3)] rounded transition-colors">
                <span className="text-xs font-bold" style={{ color: methodColor[h.method], minWidth: 32 }}>{h.method}</span>
                <span className="text-xs truncate flex-1" style={{ color: 'var(--text-secondary)' }}>{h.url.replace('https://', '')}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* URL bar */}
        <div className="flex items-center gap-2 p-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <select value={method} onChange={e => setMethod(e.target.value)}
            className="text-xs font-black px-2 py-1.5 rounded-lg outline-none cursor-pointer"
            style={{ background: methodColor[method] + '20', color: methodColor[method], border: `1px solid ${methodColor[method]}40`, fontFamily: 'JetBrains Mono, monospace' }}>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}
            placeholder="Enter request URL..." />
          <button onClick={send} disabled={loading}
            className="btn-primary px-4 py-1.5 text-sm flex items-center gap-2 flex-shrink-0">
            {loading ? <div className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} /> : <Send size={13} />}
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Request / Response split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Request panel */}
          <div className="w-1/2 flex flex-col overflow-hidden" style={{ borderRight: '1px solid var(--border)' }}>
            <div className="flex px-3 pt-2 gap-0 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
              {['body', 'headers', 'auth'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className="px-3 py-1.5 text-xs font-semibold capitalize transition-all"
                  style={{
                    color: activeTab === t ? 'var(--accent)' : 'var(--text-tertiary)',
                    borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent',
                  }}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto p-3">
              {activeTab === 'body' && (
                <textarea value={body} onChange={e => setBody(e.target.value)}
                  className="w-full h-full bg-transparent outline-none resize-none text-xs leading-relaxed"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', minHeight: 200 }}
                  placeholder={method === 'GET' ? 'GET requests have no body' : 'Request body (JSON)'} />
              )}
              {activeTab === 'headers' && (
                <div className="flex flex-col gap-2">
                  {headers.map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input type="checkbox" checked={h.enabled} onChange={e => { const nh = [...headers]; nh[i].enabled = e.target.checked; setHeaders(nh) }} />
                      <input value={h.key} onChange={e => { const nh = [...headers]; nh[i].key = e.target.value; setHeaders(nh) }}
                        className="flex-1 text-xs px-2 py-1 rounded outline-none"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace' }} />
                      <input value={h.value} onChange={e => { const nh = [...headers]; nh[i].value = e.target.value; setHeaders(nh) }}
                        className="flex-1 text-xs px-2 py-1 rounded outline-none"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }} />
                    </div>
                  ))}
                  <button onClick={() => setHeaders([...headers, { key: '', value: '', enabled: true }])}
                    className="btn-ghost text-xs flex items-center gap-1"><Plus size={11} /> Add Header</button>
                </div>
              )}
              {activeTab === 'auth' && (
                <div className="flex flex-col gap-3">
                  <select className="input text-xs">
                    <option>No Auth</option>
                    <option>Bearer Token</option>
                    <option>Basic Auth</option>
                    <option>API Key</option>
                  </select>
                  <input placeholder="Token..." className="input text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }} />
                </div>
              )}
            </div>
          </div>

          {/* Response panel */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>RESPONSE</span>
              {response && !response.error && (
                <>
                  <span className="badge text-xs" style={{
                    background: response.status < 400 ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)',
                    color: response.status < 400 ? '#16a34a' : '#ef4444',
                  }}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{response.time}ms</span>
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{(response.size / 1024).toFixed(1)}KB</span>
                </>
              )}
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin p-3">
              {!response && !loading && (
                <div className="flex flex-col items-center justify-center h-full opacity-30 gap-2">
                  <Send size={28} />
                  <p className="text-sm">Send a request to see the response</p>
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center h-full gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sending...</span>
                </div>
              )}
              {response?.error && (
                <div className="p-3 rounded-lg text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                  ❌ {response.error}
                </div>
              )}
              {response?.parsed && (
                <pre className="text-xs leading-relaxed" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(response.parsed, null, 2)}
                </pre>
              )}
              {response?.body && !response.parsed && (
                <pre className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                  {response.body}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

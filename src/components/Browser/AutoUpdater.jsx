import { useState, useEffect } from 'react'
import { Download, X, RefreshCw, CheckCircle, ArrowUp, Zap } from 'lucide-react'

// Safe Tauri import - works in browser preview too
const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

async function getTauriUpdater() {
  if (!isTauri) return null
  try {
    const { check } = await import('@tauri-apps/plugin-updater')
    const { relaunch } = await import('@tauri-apps/plugin-process')
    return { check, relaunch }
  } catch { return null }
}

export default function AutoUpdater() {
  const [update, setUpdate]       = useState(null)   // null | UpdateInfo object
  const [status, setStatus]       = useState('idle') // idle|checking|available|downloading|ready|error
  const [progress, setProgress]   = useState(0)
  const [downloaded, setDownloaded] = useState(0)
  const [total, setTotal]         = useState(0)
  const [error, setError]         = useState('')
  const [dismissed, setDismissed] = useState(false)
  const [changelog, setChangelog] = useState('')

  /* ── Check on mount + every 4h ─────────────────────────────────────── */
  useEffect(() => {
    checkUpdate()
    const id = setInterval(checkUpdate, 4 * 60 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  /* ── Listen for manual check trigger from main.rs ───────────────────── */
  useEffect(() => {
    if (!isTauri) return
    let unlisten
    import('@tauri-apps/api/event').then(({ listen }) => {
      listen('check-update', () => checkUpdate()).then(fn => unlisten = fn)
    })
    return () => unlisten?.()
  }, [])

  const checkUpdate = async () => {
    setStatus('checking')
    const tauri = await getTauriUpdater()

    if (!tauri) {
      // Browser mode: simulate no update
      setStatus('idle')
      return
    }

    try {
      const u = await tauri.check()
      if (u?.available) {
        setUpdate(u)
        setChangelog(u.body || 'Bug fixes and performance improvements.')
        setStatus('available')
        setDismissed(false)
      } else {
        setStatus('idle')
      }
    } catch (e) {
      setStatus('error')
      setError(e.message || 'Failed to check for updates')
    }
  }

  const startDownload = async () => {
    if (!update) return
    setStatus('downloading')
    setProgress(0)

    try {
      let downloadedBytes = 0
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started') {
          setTotal(event.data.contentLength || 0)
        } else if (event.event === 'Progress') {
          downloadedBytes += event.data.chunkLength
          setDownloaded(downloadedBytes)
          if (total > 0) setProgress(Math.round((downloadedBytes / total) * 100))
        } else if (event.event === 'Finished') {
          setStatus('ready')
          setProgress(100)
        }
      })
    } catch (e) {
      setStatus('error')
      setError(e.message)
    }
  }

  const restartNow = async () => {
    const tauri = await getTauriUpdater()
    if (tauri) await tauri.relaunch()
  }

  const fmt = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Don't show anything when idle or dismissed
  if (status === 'idle' || status === 'checking' || dismissed) return null
  if (status === 'error') return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in">
      <div className="panel flex items-center gap-3 px-4 py-3 max-w-sm"
        style={{ borderLeft: '3px solid #ef4444' }}>
        <span className="text-sm" style={{ color: '#ef4444' }}>⚠️ Update error: {error}</span>
        <button onClick={() => setStatus('idle')} className="btn-ghost p-1 rounded ml-auto"><X size={13} /></button>
      </div>
    </div>
  )

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-in" style={{ width: 360 }}>
      <div className="panel overflow-hidden" style={{ borderLeft: `3px solid ${status === 'ready' ? '#16a34a' : 'var(--accent)'}` }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3"
          style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: status === 'ready' ? 'rgba(22,163,74,0.15)' : 'rgba(42,139,255,0.15)' }}>
            {status === 'ready'
              ? <CheckCircle size={16} style={{ color: '#16a34a' }} />
              : status === 'downloading'
                ? <Download size={16} className="animate-bounce" style={{ color: 'var(--accent)' }} />
                : <ArrowUp size={16} style={{ color: 'var(--accent)' }} />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {status === 'ready' ? '✅ Update Ready!' : status === 'downloading' ? 'Downloading update...' : '🆕 Taby Update Available'}
            </p>
            {update && (
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {isTauri ? `v${update.currentVersion}` : 'v1.0.0'} → <strong style={{ color: 'var(--accent)' }}>{update.version || 'v1.1.0'}</strong>
              </p>
            )}
          </div>
          {status !== 'downloading' && (
            <button onClick={() => setDismissed(true)} className="btn-ghost p-1 rounded flex-shrink-0">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Changelog */}
        {(status === 'available') && changelog && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-tertiary)' }}>WHAT'S NEW</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{changelog}</p>
          </div>
        )}

        {/* Download progress */}
        {status === 'downloading' && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{fmt(downloaded)} / {fmt(total)}</span>
              <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #2a8bff, #0d6bff)',
                  boxShadow: '0 0 8px rgba(42,139,255,0.5)',
                }}
              />
            </div>
            <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--text-tertiary)' }}>
              Downloading securely... please don't close Taby
            </p>
          </div>
        )}

        {/* Ready to restart */}
        {status === 'ready' && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(22,163,74,0.08)' }}>
              <Zap size={14} style={{ color: '#16a34a' }} />
              <p className="text-xs" style={{ color: '#16a34a' }}>
                Update downloaded! Restart Taby to apply changes.
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 px-4 py-3">
          {status === 'available' && (
            <>
              <button
                onClick={() => setDismissed(true)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                Remind Later
              </button>
              <button
                onClick={startDownload}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #2a8bff, #0d6bff)' }}>
                <Download size={14} />
                Update Now
              </button>
            </>
          )}

          {status === 'downloading' && (
            <button disabled
              className="flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              style={{ background: 'var(--surface-2)', color: 'var(--text-tertiary)', cursor: 'not-allowed' }}>
              <RefreshCw size={13} className="animate-spin" />
              Downloading {progress}%...
            </button>
          )}

          {status === 'ready' && (
            <>
              <button
                onClick={() => setDismissed(true)}
                className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                Later
              </button>
              <button
                onClick={restartNow}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                <RefreshCw size={14} />
                Restart & Update
              </button>
            </>
          )}
        </div>

        {/* Security note */}
        <div className="px-4 pb-3 flex items-center gap-1.5">
          <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
            🔐 Updates are signed and verified — safe to install
          </span>
        </div>
      </div>
    </div>
  )
}

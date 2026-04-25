// TabyDownloadManager.jsx
import { useState } from 'react'
import { Download, Pause, Play, X, FolderOpen, CheckCircle, AlertCircle, Clock } from 'lucide-react'

const MOCK_DOWNLOADS = [
  { id: 1, filename: 'ubuntu-24.04.iso', size: '2.1 GB', progress: 67, speed: '12.4 MB/s', status: 'downloading', url: 'https://ubuntu.com/download', type: 'iso' },
  { id: 2, filename: 'project-report.pdf', size: '4.2 MB', progress: 100, speed: null, status: 'done', url: 'https://work.com/report.pdf', type: 'pdf' },
  { id: 3, filename: 'node-v20.js', size: '68.5 MB', progress: 34, speed: '8.1 MB/s', status: 'paused', url: 'https://nodejs.org/dist', type: 'pkg' },
  { id: 4, filename: 'design-assets.zip', size: '156 MB', progress: 0, speed: null, status: 'queued', url: 'https://figma.com/assets.zip', type: 'zip' },
  { id: 5, filename: 'video-tutorial.mp4', size: '890 MB', progress: 100, speed: null, status: 'done', url: 'https://youtube.com', type: 'mp4' },
]

const statusIcon = (s) => ({
  downloading: <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />,
  done: <CheckCircle size={14} style={{ color: '#16a34a' }} />,
  paused: <Pause size={14} style={{ color: '#f59e0b' }} />,
  queued: <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />,
  error: <AlertCircle size={14} style={{ color: '#ef4444' }} />,
}[s])

const statusColor = (s) => ({
  downloading: '#2a8bff', done: '#16a34a', paused: '#f59e0b', queued: 'var(--text-tertiary)', error: '#ef4444'
}[s])

export default function TabyDownloadManager() {
  const [downloads, setDownloads] = useState(MOCK_DOWNLOADS)
  const [filter, setFilter] = useState('all')

  const togglePause = (id) => {
    setDownloads(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'paused' ? 'downloading' : 'paused' } : d))
  }

  const filtered = filter === 'all' ? downloads : downloads.filter(d => d.status === filter)
  const active = downloads.filter(d => d.status === 'downloading').length
  const totalSpeed = downloads.filter(d => d.status === 'downloading').reduce((a, d) => a + parseFloat(d.speed), 0)

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#8b5cf6' }}>
          <Download size={14} className="text-white" />
        </div>
        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Downloads</span>
        {active > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(42,139,255,0.1)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold" style={{ color: '#2a8bff' }}>
              {active} active · {totalSpeed.toFixed(1)} MB/s
            </span>
          </div>
        )}
        <div className="flex-1" />
        <div className="flex gap-1">
          {['all', 'downloading', 'done', 'paused'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all"
              style={{ background: filter === f ? '#8b5cf6' : 'var(--surface-3)', color: filter === f ? 'white' : 'var(--text-secondary)' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Downloads list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 flex flex-col gap-2">
        {filtered.map(d => (
          <div key={d.id} className="panel p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: 'var(--surface-2)' }}>
                {d.type === 'pdf' ? '📄' : d.type === 'zip' ? '📦' : d.type === 'mp4' ? '🎬' : d.type === 'iso' ? '💿' : '📁'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{d.filename}</p>
                  {statusIcon(d.status)}
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{d.size}</span>
                  {d.speed && <span className="text-xs font-medium" style={{ color: statusColor(d.status) }}>{d.speed}</span>}
                  <span className="text-xs capitalize" style={{ color: statusColor(d.status) }}>{d.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {(d.status === 'downloading' || d.status === 'paused') && (
                  <button onClick={() => togglePause(d.id)} className="btn-ghost p-1.5 rounded-lg">
                    {d.status === 'paused' ? <Play size={13} /> : <Pause size={13} />}
                  </button>
                )}
                {d.status === 'done' && (
                  <button className="btn-ghost p-1.5 rounded-lg" title="Show in folder"><FolderOpen size={13} /></button>
                )}
                <button onClick={() => setDownloads(prev => prev.filter(dl => dl.id !== d.id))}
                  className="btn-ghost p-1.5 rounded-lg" style={{ color: '#ef4444' }}>
                  <X size={13} />
                </button>
              </div>
            </div>
            {d.status !== 'done' && (
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${d.progress}%`, background: statusColor(d.status) }} />
              </div>
            )}
            {d.status !== 'done' && (
              <div className="flex justify-between mt-1">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{d.progress}%</span>
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{d.url}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats footer */}
      <div className="flex items-center gap-6 px-4 py-2 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        <span>{downloads.filter(d => d.status === 'done').length} completed</span>
        <span>{downloads.filter(d => d.status === 'downloading').length} active</span>
        <span>{downloads.filter(d => d.status === 'queued').length} queued</span>
      </div>
    </div>
  )
}

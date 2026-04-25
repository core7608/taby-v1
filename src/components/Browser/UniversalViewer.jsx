import { useState, useEffect } from 'react'
import { FileText, Archive, Code2, Table, Image, File, Download } from 'lucide-react'

const LANGUAGE_MAP = {
  js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript',
  py: 'python', rs: 'rust', go: 'go', cpp: 'cpp', c: 'c', java: 'java',
  html: 'html', css: 'css', json: 'json', xml: 'xml', yaml: 'yaml', yml: 'yaml',
  md: 'markdown', txt: 'text', csv: 'csv', sh: 'bash', sql: 'sql', php: 'php',
  rb: 'ruby', kt: 'kotlin', swift: 'swift', dart: 'dart',
}

const FILE_ICONS = {
  pdf: { icon: FileText, color: '#ef4444', label: 'PDF Document' },
  zip: { icon: Archive, color: '#f59e0b', label: 'ZIP Archive' },
  rar: { icon: Archive, color: '#f59e0b', label: 'RAR Archive' },
  docx: { icon: FileText, color: '#2563eb', label: 'Word Document' },
  xlsx: { icon: Table, color: '#16a34a', label: 'Excel Spreadsheet' },
  pptx: { icon: FileText, color: '#ea580c', label: 'PowerPoint' },
  md: { icon: FileText, color: '#8b5cf6', label: 'Markdown' },
  csv: { icon: Table, color: '#16a34a', label: 'CSV File' },
}

export default function UniversalViewer({ url, ext }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('preview') // preview | raw | hex

  useEffect(() => {
    setLoading(true)
    // In production, Tauri commands would fetch and decode the file
    // Here we simulate with a placeholder
    setTimeout(() => {
      setContent(`// File: ${url}\n// Extension: ${ext}\n\n// In the full Tauri build, this content is loaded\n// via the Rust backend using the universal_open command.\n// The Rust layer decodes the file format and passes\n// structured content to this React component.\n\nconst greeting = "Hello from Taby Universal Viewer!"`)
      setLoading(false)
    }, 800)
  }, [url])

  const fileInfo = FILE_ICONS[ext] || { icon: File, color: 'var(--accent)', label: ext.toUpperCase() + ' File' }
  const isCode = !!LANGUAGE_MAP[ext]
  const Icon = fileInfo.icon

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--surface)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: fileInfo.color + '20' }}>
          <Icon size={18} style={{ color: fileInfo.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {url.split('/').pop() || url}
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{fileInfo.label}</p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg" style={{ background: 'var(--surface-3)' }}>
          {['preview', 'raw'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className="px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-all"
              style={{
                background: viewMode === mode ? 'var(--surface)' : 'transparent',
                color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-tertiary)',
                boxShadow: viewMode === mode ? 'var(--shadow)' : 'none',
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        <button className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1.5">
          <Download size={13} />
          Save
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Loading file via Taby Universal Viewer...
            </p>
          </div>
        ) : isCode || viewMode === 'raw' ? (
          <pre className="p-6 text-sm leading-relaxed overflow-auto"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)', margin: 0 }}>
            <code>{content}</code>
          </pre>
        ) : (
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              <div className="panel p-6">
                <pre className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                  {content}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

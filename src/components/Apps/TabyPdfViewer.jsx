import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download,
  Search, Bookmark, MessageSquare, Highlighter, Pen,
  RotateCw, Columns, FileText, X, Plus, Minus,
  AlignJustify, Maximize2, Menu, Hash
} from 'lucide-react'

const MOCK_PAGES = 12
const HIGHLIGHT_COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fecaca', '#e9d5ff']

export default function TabyPdfViewer({ url }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(MOCK_PAGES)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showThumbnails, setShowThumbnails] = useState(true)
  const [showAnnotations, setShowAnnotations] = useState(false)
  const [activeTool, setActiveTool] = useState('cursor') // cursor | highlight | pen | text
  const [highlightColor, setHighlightColor] = useState('#fef08a')
  const [annotations, setAnnotations] = useState([
    { id: 1, page: 1, type: 'highlight', text: 'Important section', color: '#fef08a', x: 20, y: 30 },
    { id: 2, page: 2, type: 'comment', text: 'Review this part', x: 60, y: 50 },
  ])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [layout, setLayout] = useState('single') // single | double

  const pageInputRef = useRef(null)

  const goToPage = (p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))

  const Tool = ({ id, icon: Icon, label, color }) => (
    <button
      onClick={() => setActiveTool(id)}
      title={label}
      className="flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all"
      style={{
        background: activeTool === id ? 'rgba(42,139,255,0.15)' : 'transparent',
        color: activeTool === id ? '#2a8bff' : 'var(--text-secondary)',
      }}>
      <Icon size={15} />
      <span style={{ fontSize: 9 }}>{label}</span>
    </button>
  )

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{ background: 'var(--surface)' }}>
      {/* Header toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
            <FileText size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Taby PDF</span>
        </div>

        <div className="h-4 w-px mx-1" style={{ background: 'var(--border)' }} />

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <button onClick={() => goToPage(currentPage - 1)} className="btn-ghost p-1.5 rounded"
            disabled={currentPage === 1} style={{ opacity: currentPage === 1 ? 0.3 : 1 }}>
            <ChevronLeft size={15} />
          </button>
          <div className="flex items-center gap-1">
            <input
              ref={pageInputRef}
              type="number"
              value={currentPage}
              onChange={e => goToPage(parseInt(e.target.value) || 1)}
              className="w-10 text-center text-xs rounded outline-none"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '2px 4px' }}
            />
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>/ {totalPages}</span>
          </div>
          <button onClick={() => goToPage(currentPage + 1)} className="btn-ghost p-1.5 rounded"
            disabled={currentPage === totalPages} style={{ opacity: currentPage === totalPages ? 0.3 : 1 }}>
            <ChevronRight size={15} />
          </button>
        </div>

        <div className="h-4 w-px mx-1" style={{ background: 'var(--border)' }} />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.max(25, z - 10))} className="btn-ghost p-1.5 rounded">
            <ZoomOut size={14} />
          </button>
          <select
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="text-xs px-1 py-0.5 rounded outline-none"
            style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)', width: 60 }}>
            {[25, 50, 75, 100, 125, 150, 175, 200].map(v => (
              <option key={v} value={v}>{v}%</option>
            ))}
          </select>
          <button onClick={() => setZoom(z => Math.min(300, z + 10))} className="btn-ghost p-1.5 rounded">
            <ZoomIn size={14} />
          </button>
        </div>

        <div className="h-4 w-px mx-1" style={{ background: 'var(--border)' }} />

        {/* Tools */}
        <button onClick={() => setRotation(r => (r + 90) % 360)} className="btn-ghost p-1.5 rounded" title="Rotate">
          <RotateCw size={14} />
        </button>
        <button onClick={() => setShowSearch(!showSearch)} className="btn-ghost p-1.5 rounded" title="Search">
          <Search size={14} />
        </button>
        <button onClick={() => setLayout(l => l === 'single' ? 'double' : 'single')} className="btn-ghost p-1.5 rounded" title="Layout">
          <Columns size={14} />
        </button>
        <button onClick={() => setIsFullscreen(!isFullscreen)} className="btn-ghost p-1.5 rounded" title="Fullscreen">
          <Maximize2 size={14} />
        </button>

        <div className="flex-1" />

        <button className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1.5">
          <Download size={13} />
          Save
        </button>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className="flex items-center gap-2 px-3 py-2 flex-shrink-0 animate-slide-in"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <Search size={13} style={{ color: 'var(--text-tertiary)' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search in document..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
            autoFocus
          />
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>0 results</span>
          <button onClick={() => setShowSearch(false)} className="btn-ghost p-1 rounded"><X size={13} /></button>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails panel */}
        {showThumbnails && (
          <div className="w-28 flex-shrink-0 overflow-y-auto scrollbar-thin py-2 px-1.5 flex flex-col gap-1.5"
            style={{ borderRight: '1px solid var(--border)', background: 'var(--surface-2)' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => goToPage(i + 1)}
                className="rounded-lg overflow-hidden transition-all"
                style={{
                  border: currentPage === i + 1 ? '2px solid #ef4444' : '2px solid var(--border)',
                  aspectRatio: '210/297',
                  background: 'white',
                  flexShrink: 0,
                }}>
                <div className="w-full h-full flex flex-col" style={{ padding: '4px 3px' }}>
                  {/* Fake page content */}
                  <div className="h-1.5 rounded mb-1" style={{ background: '#ccc', width: '80%' }} />
                  <div className="h-0.5 rounded mb-0.5" style={{ background: '#e5e5e5', width: '100%' }} />
                  <div className="h-0.5 rounded mb-0.5" style={{ background: '#e5e5e5', width: '90%' }} />
                  <div className="h-0.5 rounded mb-0.5" style={{ background: '#e5e5e5', width: '95%' }} />
                  <div className="h-0.5 rounded mb-1.5" style={{ background: '#e5e5e5', width: '70%' }} />
                  <div className="h-3 rounded mb-1" style={{ background: '#f0f0f0', width: '100%' }} />
                  <div className="h-0.5 rounded mb-0.5" style={{ background: '#e5e5e5', width: '85%' }} />
                  <div className="h-0.5 rounded mb-0.5" style={{ background: '#e5e5e5', width: '100%' }} />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* PDF view area */}
        <div className="flex-1 overflow-auto scrollbar-thin flex items-start justify-center py-6"
          style={{ background: '#525659' }}>
          <div className={`flex gap-4 ${layout === 'double' ? 'flex-row' : 'flex-col items-center'}`}>
            {(layout === 'double' ? [currentPage, currentPage + 1] : [currentPage]).map(pageNum => (
              pageNum <= totalPages && (
                <PdfPage
                  key={pageNum}
                  pageNum={pageNum}
                  zoom={zoom}
                  rotation={rotation}
                  activeTool={activeTool}
                  highlightColor={highlightColor}
                  annotations={annotations.filter(a => a.page === pageNum)}
                  onAddAnnotation={(ann) => setAnnotations(prev => [...prev, { ...ann, id: Date.now(), page: pageNum }])}
                />
              )
            ))}
          </div>
        </div>

        {/* Annotation tools panel */}
        <div className="w-12 flex-shrink-0 flex flex-col items-center py-3 gap-1"
          style={{ borderLeft: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <Tool id="cursor" icon={Hash} label="Select" />
          <Tool id="highlight" icon={Highlighter} label="Mark" />
          <Tool id="pen" icon={Pen} label="Draw" />
          <Tool id="comment" icon={MessageSquare} label="Note" />
          <Tool id="bookmark" icon={Bookmark} label="Mark" />

          {activeTool === 'highlight' && (
            <div className="flex flex-col gap-1 mt-2">
              {HIGHLIGHT_COLORS.map(c => (
                <button key={c} onClick={() => setHighlightColor(c)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                  style={{ background: c, border: highlightColor === c ? '2px solid var(--accent)' : '2px solid transparent' }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom status */}
      <div className="flex items-center justify-between px-4 py-1 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        <div className="flex items-center gap-3">
          <span>Page {currentPage} of {totalPages}</span>
          <span>PDF · {(Math.random() * 2 + 0.5).toFixed(1)} MB</span>
        </div>
        <div className="flex items-center gap-3">
          <span>{annotations.length} annotations</span>
          <button className="flex items-center gap-1" onClick={() => setShowThumbnails(!showThumbnails)}>
            <Menu size={11} />
            {showThumbnails ? 'Hide' : 'Show'} thumbnails
          </button>
        </div>
      </div>
    </div>
  )
}

function PdfPage({ pageNum, zoom, rotation, activeTool, highlightColor, annotations, onAddAnnotation }) {
  const canvasRef = useRef(null)
  const scale = zoom / 100

  const handleClick = (e) => {
    if (activeTool === 'highlight') {
      const rect = e.currentTarget.getBoundingClientRect()
      onAddAnnotation({
        type: 'highlight',
        text: 'Highlighted text',
        color: highlightColor,
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }
    if (activeTool === 'comment') {
      const rect = e.currentTarget.getBoundingClientRect()
      const text = prompt('Add comment:')
      if (text) {
        onAddAnnotation({
          type: 'comment',
          text,
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        })
      }
    }
  }

  const width = Math.round(595 * scale)
  const height = Math.round(842 * scale)

  return (
    <div
      className="relative shadow-2xl"
      onClick={handleClick}
      style={{
        width,
        height,
        background: 'white',
        transform: `rotate(${rotation}deg)`,
        cursor: activeTool !== 'cursor' ? 'crosshair' : 'default',
        flexShrink: 0,
      }}>
      {/* Simulated PDF content */}
      <div style={{ padding: `${40 * scale}px`, height: '100%', display: 'flex', flexDirection: 'column', gap: 8 * scale }}>
        <div style={{ height: 24 * scale, background: '#f0f0f0', borderRadius: 2, width: '70%' }} />
        <div style={{ height: 1.5 * scale, background: '#e0e0e0', width: '100%' }} />
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} style={{ height: 10 * scale, background: i % 5 === 0 ? '#f8f8f8' : '#ebebeb', borderRadius: 1, width: `${70 + Math.random() * 30}%` }} />
        ))}
        <div style={{ height: 120 * scale, background: '#f5f5f5', borderRadius: 4, marginTop: 8 * scale }} />
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ height: 10 * scale, background: '#ebebeb', borderRadius: 1, width: `${60 + Math.random() * 40}%` }} />
        ))}
        <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: 10 * scale, color: '#aaa' }}>
          {pageNum}
        </div>
      </div>

      {/* Annotations overlay */}
      {annotations.map((ann, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${ann.x}%`,
          top: `${ann.y}%`,
          transform: 'translate(-50%, -50%)',
        }}>
          {ann.type === 'highlight' && (
            <div style={{ width: 80 * scale, height: 14 * scale, background: ann.color, opacity: 0.6, borderRadius: 2 }} />
          )}
          {ann.type === 'comment' && (
            <div style={{
              background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 4,
              padding: `${3 * scale}px ${6 * scale}px`, fontSize: 10 * scale,
              maxWidth: 120 * scale, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              💬 {ann.text}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

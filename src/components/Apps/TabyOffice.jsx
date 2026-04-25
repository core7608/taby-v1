import { useState, useRef, useEffect, useCallback } from 'react'
import {
  FileText, Table2, PresentationIcon, Plus, Save, Download,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Image, Link, Undo, Redo, Type, Palette,
  ChevronDown, FolderOpen, File, X, Search, ZoomIn, ZoomOut,
  Share2, Printer, Lock, Columns, Rows, Strikethrough
} from 'lucide-react'

const APPS = [
  { id: 'writer', icon: FileText, label: 'Writer', color: '#2563eb', desc: 'Word processor' },
  { id: 'sheets', icon: Table2, label: 'Sheets', color: '#16a34a', desc: 'Spreadsheet' },
  { id: 'slides', icon: '📊', label: 'Slides', color: '#ea580c', desc: 'Presentations' },
]

export default function TabyOffice() {
  const [activeApp, setActiveApp] = useState('writer')
  const [fileName, setFileName] = useState('Untitled Document')

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--surface)' }}>
      {/* App selector header */}
      <div className="flex items-center gap-0 flex-shrink-0"
        style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
            <FileText size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Taby Office</span>
        </div>
        <div className="h-5 w-px mx-1" style={{ background: 'var(--border)' }} />
        {APPS.map(app => (
          <button key={app.id} onClick={() => setActiveApp(app.id)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-all"
            style={{
              color: activeApp === app.id ? app.color : 'var(--text-secondary)',
              borderBottom: activeApp === app.id ? `2px solid ${app.color}` : '2px solid transparent',
            }}>
            {typeof app.icon === 'string' ? <span>{app.icon}</span> : <app.icon size={14} />}
            {app.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{ background: '#2a8bff', color: 'white' }}>
            <Save size={13} />
            Save
          </button>
          <button className="btn-ghost p-2 rounded-lg"><Share2 size={14} /></button>
          <button className="btn-ghost p-2 rounded-lg"><Download size={14} /></button>
          <button className="btn-ghost p-2 rounded-lg"><Printer size={14} /></button>
        </div>
      </div>

      {activeApp === 'writer' && <WriterApp fileName={fileName} setFileName={setFileName} />}
      {activeApp === 'sheets' && <SheetsApp />}
      {activeApp === 'slides' && <SlidesApp />}
    </div>
  )
}

// ── Writer ────────────────────────────────────────────────────────────────────

function WriterApp({ fileName, setFileName }) {
  const editorRef = useRef(null)
  const [zoom, setZoom] = useState(100)
  const [wordCount, setWordCount] = useState(0)

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
  }

  const updateWordCount = () => {
    const text = editorRef.current?.innerText || ''
    setWordCount(text.trim().split(/\s+/).filter(Boolean).length)
  }

  const ToolBtn = ({ cmd, icon: Icon, title, val }) => (
    <button
      onMouseDown={e => { e.preventDefault(); exec(cmd, val) }}
      className="p-1.5 rounded transition-colors hover:bg-[var(--surface-3)]"
      title={title}
      style={{ color: 'var(--text-secondary)' }}>
      <Icon size={14} />
    </button>
  )

  const Separator = () => <div className="w-px h-5 mx-1" style={{ background: 'var(--border)' }} />

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-1.5 flex-shrink-0 flex-wrap"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <button className="btn-ghost p-1.5 rounded" title="Undo"><Undo size={14} /></button>
        <button className="btn-ghost p-1.5 rounded" title="Redo"><Redo size={14} /></button>
        <Separator />

        {/* Font family */}
        <select className="text-xs px-2 py-1 rounded outline-none cursor-pointer"
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          onChange={e => exec('fontName', e.target.value)}>
          {['Plus Jakarta Sans', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'JetBrains Mono'].map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {/* Font size */}
        <select className="text-xs px-1.5 py-1 rounded outline-none cursor-pointer w-14"
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          onChange={e => exec('fontSize', e.target.value)}>
          {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="4" selected>16</option>
        </select>
        <Separator />

        <ToolBtn cmd="bold" icon={Bold} title="Bold (Ctrl+B)" />
        <ToolBtn cmd="italic" icon={Italic} title="Italic (Ctrl+I)" />
        <ToolBtn cmd="underline" icon={Underline} title="Underline (Ctrl+U)" />
        <ToolBtn cmd="strikeThrough" icon={Strikethrough} title="Strikethrough" />
        <Separator />

        <ToolBtn cmd="justifyLeft" icon={AlignLeft} title="Align Left" />
        <ToolBtn cmd="justifyCenter" icon={AlignCenter} title="Align Center" />
        <ToolBtn cmd="justifyRight" icon={AlignRight} title="Align Right" />
        <Separator />

        <ToolBtn cmd="insertUnorderedList" icon={List} title="Bullet List" />
        <ToolBtn cmd="insertOrderedList" icon={ListOrdered} title="Numbered List" />
        <Separator />

        {/* Heading levels */}
        <select className="text-xs px-2 py-1 rounded outline-none cursor-pointer"
          style={{ background: 'var(--surface-3)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          onChange={e => exec('formatBlock', e.target.value)}>
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Quote</option>
          <option value="pre">Code</option>
        </select>

        <Separator />
        {/* Text color */}
        <div className="flex items-center gap-0.5">
          <Type size={13} style={{ color: 'var(--text-secondary)' }} />
          <input type="color" defaultValue="#000000"
            onChange={e => exec('foreColor', e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border-0 p-0"
            title="Text color" />
        </div>
        <div className="flex items-center gap-0.5">
          <Palette size={13} style={{ color: 'var(--text-secondary)' }} />
          <input type="color" defaultValue="#ffff00"
            onChange={e => exec('hiliteColor', e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border-0 p-0"
            title="Highlight color" />
        </div>

        <Separator />
        {/* Zoom */}
        <div className="flex items-center gap-1 ml-auto">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="btn-ghost p-1 rounded">
            <ZoomOut size={13} />
          </button>
          <span className="text-xs w-10 text-center" style={{ color: 'var(--text-secondary)' }}>{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="btn-ghost p-1 rounded">
            <ZoomIn size={13} />
          </button>
        </div>
      </div>

      {/* Document area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-8"
        style={{ background: 'var(--surface-2)' }}>
        <div
          className="mx-auto bg-white shadow-lg"
          style={{
            width: `calc(210mm * ${zoom / 100})`,
            minHeight: `calc(297mm * ${zoom / 100})`,
            padding: `${20 * zoom / 100}mm ${25 * zoom / 100}mm`,
            fontSize: `${16 * zoom / 100}px`,
            transform: 'none',
          }}>
          {/* Document title */}
          <input
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            className="w-full text-2xl font-bold mb-4 outline-none border-none bg-transparent"
            style={{ color: '#111', fontFamily: 'inherit', borderBottom: '2px solid transparent' }}
            onFocus={e => e.target.style.borderBottomColor = '#2a8bff'}
            onBlur={e => e.target.style.borderBottomColor = 'transparent'}
          />
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={updateWordCount}
            className="outline-none min-h-96"
            style={{
              color: '#111',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 16,
              lineHeight: 1.8,
            }}
            dangerouslySetInnerHTML={{ __html: '<p>ابدأ الكتابة هنا...</p>' }}
          />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        <span>{wordCount} words</span>
        <span>A4 · Arabic · Auto-saved</span>
      </div>
    </div>
  )
}

// ── Sheets ────────────────────────────────────────────────────────────────────

function SheetsApp() {
  const ROWS = 30, COLS = 12
  const [cells, setCells] = useState({})
  const [selected, setSelected] = useState({ r: 0, c: 0 })
  const [formula, setFormula] = useState('')

  const colLabel = (i) => String.fromCharCode(65 + i)
  const cellId = (r, c) => `${colLabel(c)}${r + 1}`

  const getVal = (r, c) => cells[cellId(r, c)] || ''

  const setCell = (r, c, val) => {
    setCells(prev => ({ ...prev, [cellId(r, c)]: val }))
  }

  const evalFormula = (val) => {
    if (!val.startsWith('=')) return val
    try {
      const expr = val.slice(1)
        .replace(/SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/gi, (_, from, to) => {
          // Simple SUM evaluation
          return '0'
        })
      return eval(expr) // simplified - use formula parser in production
    } catch { return '#ERROR!' }
  }

  const handleKey = (e, r, c) => {
    if (e.key === 'ArrowDown' && r < ROWS - 1) setSelected({ r: r + 1, c })
    if (e.key === 'ArrowUp' && r > 0) setSelected({ r: r - 1, c })
    if (e.key === 'ArrowRight' && c < COLS - 1) setSelected({ r, c: c + 1 })
    if (e.key === 'ArrowLeft' && c > 0) setSelected({ r, c: c - 1 })
    if (e.key === 'Tab') { e.preventDefault(); if (c < COLS - 1) setSelected({ r, c: c + 1 }) }
    if (e.key === 'Enter') { if (r < ROWS - 1) setSelected({ r: r + 1, c }) }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Formula bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 flex-shrink-0"
        style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        <div className="px-2 py-1 rounded text-xs font-mono font-bold min-w-14 text-center"
          style={{ background: 'var(--surface-3)', color: 'var(--accent)' }}>
          {cellId(selected.r, selected.c)}
        </div>
        <div className="h-4 w-px" style={{ background: 'var(--border)' }} />
        <input
          value={formula}
          onChange={e => { setFormula(e.target.value); setCell(selected.r, selected.c, e.target.value) }}
          placeholder="Enter value or formula (e.g. =A1+B1)"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="border-collapse" style={{ fontSize: 12 }}>
          <thead>
            <tr>
              <th className="sticky top-0 left-0 z-20 w-10"
                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', minWidth: 40 }} />
              {Array.from({ length: COLS }, (_, c) => (
                <th key={c} className="sticky top-0 z-10 font-semibold"
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    minWidth: 100, padding: '4px 8px',
                    color: 'var(--text-secondary)',
                  }}>
                  {colLabel(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROWS }, (_, r) => (
              <tr key={r}>
                <td className="sticky left-0 z-10 text-center text-xs font-semibold"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '2px 4px', color: 'var(--text-tertiary)', minWidth: 40 }}>
                  {r + 1}
                </td>
                {Array.from({ length: COLS }, (_, c) => {
                  const isSelected = selected.r === r && selected.c === c
                  return (
                    <td key={c} onClick={() => { setSelected({ r, c }); setFormula(getVal(r, c)) }}
                      style={{
                        border: isSelected ? '2px solid #2a8bff' : '1px solid var(--border)',
                        background: isSelected ? 'rgba(42,139,255,0.05)' : 'var(--surface)',
                        padding: 0, minWidth: 100,
                      }}>
                      <input
                        value={getVal(r, c)}
                        onChange={e => { setCell(r, c, e.target.value); setFormula(e.target.value) }}
                        onFocus={() => { setSelected({ r, c }); setFormula(getVal(r, c)) }}
                        onKeyDown={e => handleKey(e, r, c)}
                        className="w-full outline-none bg-transparent px-2"
                        style={{
                          height: 24,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: 12,
                          color: 'var(--text-primary)',
                          textAlign: getVal(r, c).startsWith('=') || !isNaN(Number(getVal(r, c))) ? 'right' : 'left',
                        }}
                      />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sheet tabs */}
      <div className="flex items-center gap-1 px-3 py-1 flex-shrink-0"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        {['Sheet1', 'Sheet2', 'Sheet3'].map((s, i) => (
          <button key={i} className="px-3 py-0.5 rounded text-xs font-medium transition-all"
            style={{
              background: i === 0 ? 'var(--surface)' : 'transparent',
              color: i === 0 ? '#16a34a' : 'var(--text-tertiary)',
              border: '1px solid',
              borderColor: i === 0 ? '#16a34a' : 'transparent',
            }}>
            {s}
          </button>
        ))}
        <button className="p-0.5 rounded btn-ghost ml-1"><Plus size={12} /></button>
      </div>
    </div>
  )
}

// ── Slides ────────────────────────────────────────────────────────────────────

const DEFAULT_SLIDES = [
  { id: 1, type: 'title', title: 'عنوان العرض', subtitle: 'اسم المقدِّم · التاريخ', bg: 'linear-gradient(135deg, #0f1117, #1a2744)', textColor: 'white' },
  { id: 2, type: 'content', title: 'النقاط الرئيسية', bullets: ['النقطة الأولى', 'النقطة الثانية', 'النقطة الثالثة'], bg: 'var(--surface)', textColor: 'var(--text-primary)' },
  { id: 3, type: 'image', title: 'صورة توضيحية', bg: 'linear-gradient(135deg, #1a2744, #0a0c10)', textColor: 'white' },
  { id: 4, type: 'content', title: 'الخلاصة', bullets: ['الاستنتاج الأول', 'الاستنتاج الثاني'], bg: 'linear-gradient(135deg, #0d2818, #052e0f)', textColor: 'white' },
]

function SlidesApp() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES)
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPresenting, setIsPresenting] = useState(false)

  const slide = slides[activeSlide]

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Slide panel */}
      <div className="w-44 flex-shrink-0 overflow-y-auto scrollbar-thin p-2 flex flex-col gap-2"
        style={{ borderRight: '1px solid var(--border)', background: 'var(--surface-2)' }}>
        {slides.map((s, i) => (
          <button key={s.id} onClick={() => setActiveSlide(i)}
            className="rounded-lg overflow-hidden flex-shrink-0 transition-all"
            style={{
              border: activeSlide === i ? '2px solid #ea580c' : '2px solid var(--border)',
              aspectRatio: '16/9',
              background: s.bg,
            }}>
            <div className="flex flex-col items-center justify-center h-full p-2 gap-1">
              <p className="text-center font-bold leading-tight" style={{ fontSize: 7, color: s.textColor }}>{s.title}</p>
            </div>
          </button>
        ))}
        <button onClick={() => setSlides(sl => [...sl, { id: Date.now(), type: 'content', title: 'New Slide', bullets: ['...'], bg: 'var(--surface)', textColor: 'var(--text-primary)' }])}
          className="flex items-center justify-center gap-1 rounded-lg py-2 transition-all text-xs"
          style={{ border: '2px dashed var(--border)', color: 'var(--text-tertiary)' }}>
          <Plus size={12} /> Add Slide
        </button>
      </div>

      {/* Main editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Slide {activeSlide + 1} of {slides.length}
          </span>
          <div className="flex-1" />
          <button
            onClick={() => setIsPresenting(true)}
            className="btn-primary px-4 py-1.5 text-sm flex items-center gap-1.5">
            ▶ Present
          </button>
        </div>

        {/* Slide canvas */}
        <div className="flex-1 flex items-center justify-center overflow-auto p-8"
          style={{ background: 'var(--surface-3)' }}>
          <div className="rounded-xl overflow-hidden shadow-2xl"
            style={{ width: '100%', maxWidth: 800, aspectRatio: '16/9', background: slide.bg, position: 'relative' }}>
            {slide.type === 'title' && (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                <h1 className="font-black mb-4" style={{ fontSize: 42, color: slide.textColor, lineHeight: 1.2 }}>
                  {slide.title}
                </h1>
                <p className="text-lg" style={{ color: slide.textColor, opacity: 0.7 }}>{slide.subtitle}</p>
              </div>
            )}
            {slide.type === 'content' && (
              <div className="flex flex-col h-full p-12">
                <h2 className="font-bold mb-8" style={{ fontSize: 32, color: slide.textColor }}>{slide.title}</h2>
                <ul className="flex flex-col gap-4">
                  {slide.bullets?.map((b, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: '#2a8bff' }} />
                      <span style={{ fontSize: 20, color: slide.textColor, opacity: 0.9 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Slide decorations */}
            <div className="absolute bottom-4 right-4 text-xs font-mono"
              style={{ color: slide.textColor, opacity: 0.3 }}>{activeSlide + 1}</div>
          </div>
        </div>
      </div>

      {/* Presentation mode */}
      {isPresenting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: '#000' }}>
          <div style={{ width: '100vw', height: '56.25vw', maxHeight: '100vh', background: slides[activeSlide].bg, position: 'relative' }}>
            {slides[activeSlide].type === 'title' && (
              <div className="flex flex-col items-center justify-center h-full text-center p-24">
                <h1 style={{ fontSize: '6vw', color: slides[activeSlide].textColor, fontWeight: 900 }}>
                  {slides[activeSlide].title}
                </h1>
              </div>
            )}
            {slides[activeSlide].type === 'content' && (
              <div className="flex flex-col h-full" style={{ padding: '8vw' }}>
                <h2 style={{ fontSize: '4vw', color: slides[activeSlide].textColor, fontWeight: 800, marginBottom: '4vw' }}>
                  {slides[activeSlide].title}
                </h2>
                {slides[activeSlide].bullets?.map((b, i) => (
                  <div key={i} className="flex items-center gap-4 mb-4">
                    <div style={{ width: '1vw', height: '1vw', borderRadius: '50%', background: '#2a8bff', flexShrink: 0 }} />
                    <span style={{ fontSize: '2.5vw', color: slides[activeSlide].textColor }}>{b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="fixed bottom-6 flex items-center gap-4">
            <button onClick={() => setActiveSlide(i => Math.max(0, i - 1))}
              className="px-6 py-2 rounded-full font-bold text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>
              ← Prev
            </button>
            <span className="text-white font-mono">{activeSlide + 1} / {slides.length}</span>
            <button onClick={() => setActiveSlide(i => Math.min(slides.length - 1, i + 1))}
              className="px-6 py-2 rounded-full font-bold text-white" style={{ background: 'rgba(255,255,255,0.2)' }}>
              Next →
            </button>
            <button onClick={() => setIsPresenting(false)}
              className="px-4 py-2 rounded-full font-bold" style={{ background: '#ef4444', color: 'white' }}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

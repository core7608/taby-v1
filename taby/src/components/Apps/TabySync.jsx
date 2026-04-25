// TabySync.jsx
import { useState, useEffect } from 'react'
import { Smartphone, Monitor, RefreshCw, CheckCircle, QrCode, Wifi } from 'lucide-react'

export function TabySync() {
  const [step, setStep] = useState('qr') // qr | scanning | connected
  const [devices, setDevices] = useState([{ id: 1, name: 'iPhone 15 Pro', type: 'mobile', lastSync: Date.now() - 60000 }])
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setDots(d => (d + 1) % 4), 500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex flex-col h-full items-center justify-center gap-8 p-8" style={{ background: 'var(--surface)' }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)' }}>
          <Smartphone size={28} className="text-white" />
        </div>
        <h2 className="text-2xl font-black" style={{ color: 'var(--text-primary)' }}>Taby Sync</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>مزامنة فورية بدون حساب</p>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-2xl" style={{ background: 'white', border: '2px solid var(--border)' }}>
          {/* Simulated QR */}
          <div style={{ width: 160, height: 160, display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 1 }}>
            {Array.from({ length: 256 }, (_, i) => (
              <div key={i} style={{ background: Math.random() > 0.5 ? '#000' : 'transparent', borderRadius: 1 }} />
            ))}
          </div>
        </div>
        <p className="text-sm text-center max-w-56" style={{ color: 'var(--text-secondary)' }}>
          افتح Taby على موبايلك وامسح الكود للمزامنة الفورية
        </p>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
          <RefreshCw size={11} />
          الكود ينتهي خلال 5 دقائق
        </div>
      </div>

      {/* Connected devices */}
      {devices.length > 0 && (
        <div className="w-full max-w-sm">
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
            الأجهزة المتصلة
          </p>
          {devices.map(d => (
            <div key={d.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--surface-2)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(8,145,178,0.15)' }}>
                <Smartphone size={18} style={{ color: '#0891b2' }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  آخر مزامنة: {new Date(d.lastSync).toLocaleTimeString('ar')}
                </p>
              </div>
              <div className="flex items-center gap-1" style={{ color: '#16a34a' }}>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold">Live</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default TabySync

// ─────────────────────────────────────────────────────────────────────────────

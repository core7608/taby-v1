import { useBrowserStore } from '../../stores/browserStore'
import { Shield, Wifi, Lock, Zap, Globe, BedDouble } from 'lucide-react'

export default function StatusBar() {
  const { adBlockEnabled, vpnEnabled, fingerprintMaskEnabled, tabs, isPrivateMode } = useBrowserStore()
  const hibernated = tabs.filter(t => t.isHibernated).length
  const total = tabs.length

  return (
    <div
      className="flex items-center justify-between px-3 flex-shrink-0"
      style={{
        height: 22,
        borderTop: '1px solid var(--border)',
        background: 'var(--surface-2)',
        fontSize: 11,
        color: 'var(--text-tertiary)',
      }}
    >
      <div className="flex items-center gap-3">
        {adBlockEnabled && (
          <span className="flex items-center gap-1" style={{ color: '#16a34a' }}>
            <Shield size={10} />
            <span>Ad-Free</span>
          </span>
        )}
        {fingerprintMaskEnabled && (
          <span className="flex items-center gap-1" style={{ color: '#8b5cf6' }}>
            <Lock size={10} />
            <span>Masked</span>
          </span>
        )}
        {vpnEnabled && (
          <span className="flex items-center gap-1" style={{ color: '#2a8bff' }}>
            <Wifi size={10} />
            <span>VPN Active</span>
          </span>
        )}
        {isPrivateMode && (
          <span className="flex items-center gap-1" style={{ color: '#9333ea' }}>
            <Lock size={10} />
            <span>Private</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {hibernated > 0 && (
          <span className="flex items-center gap-1">
            <BedDouble size={10} />
            <span>{hibernated} hibernated</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <Globe size={10} />
          <span>{total} tabs</span>
        </span>
        <span className="flex items-center gap-1" style={{ color: '#16a34a' }}>
          <Zap size={10} />
          <span>Taby v1.0.0</span>
        </span>
      </div>
    </div>
  )
}

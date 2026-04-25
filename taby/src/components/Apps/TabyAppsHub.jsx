import { useState } from 'react'
import { useBrowserStore } from '../../stores/browserStore'
import TabyMeet from './TabyMeet'
import TabyOffice from './TabyOffice'
import TabyPdfViewer from './TabyPdfViewer'
import TabyVault from './TabyVault'
import TabySync from './TabySync'
import TabyNotes from './TabyNotes'
import TabyDownloadManager from './TabyDownloadManager'
import TabyApiTester from './TabyApiTester'

const APPS = [
  {
    id: 'taby://meet',
    name: 'Taby Meet',
    nameAr: 'تابي ميت',
    icon: '🎥',
    color: '#2a8bff',
    gradient: 'linear-gradient(135deg, #1a2744, #0a0c10)',
    desc: 'Video conferencing',
    descAr: 'مؤتمرات الفيديو',
    component: TabyMeet,
    badge: 'Built-in',
  },
  {
    id: 'taby://office',
    name: 'Taby Office',
    nameAr: 'تابي أوفيس',
    icon: '📝',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #1a1040, #0a0c20)',
    desc: 'Writer · Sheets · Slides',
    descAr: 'كاتب · جداول · عروض',
    component: TabyOffice,
    badge: 'Built-in',
  },
  {
    id: 'taby://pdf',
    name: 'Taby PDF',
    nameAr: 'تابي PDF',
    icon: '📄',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #3b0a0a, #1a0505)',
    desc: 'PDF viewer & editor',
    descAr: 'عارض ومحرر PDF',
    component: TabyPdfViewer,
    badge: 'Built-in',
  },
  {
    id: 'taby://vault',
    name: 'Taby Vault',
    nameAr: 'تابي فولت',
    icon: '🔐',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #052e16, #0a1a0d)',
    desc: 'Password manager',
    descAr: 'مدير كلمات السر',
    component: TabyVault,
    badge: 'Encrypted',
  },
  {
    id: 'taby://sync',
    name: 'Taby Sync',
    nameAr: 'تابي سينك',
    icon: '📱',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg, #0a2744, #051520)',
    desc: 'QR device sync',
    descAr: 'مزامنة الأجهزة',
    component: TabySync,
    badge: 'E2E',
  },
  {
    id: 'taby://notes',
    name: 'Taby Notes',
    nameAr: 'تابي نوتس',
    icon: '🗒️',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #2a1800, #1a0f00)',
    desc: 'Markdown notes',
    descAr: 'ملاحظات ماركداون',
    component: TabyNotes,
    badge: 'Offline',
  },
  {
    id: 'taby://downloads',
    name: 'Download Manager',
    nameAr: 'مدير التنزيلات',
    icon: '⬇️',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #1a0a30, #0d0518)',
    desc: 'All your downloads',
    descAr: 'كل تنزيلاتك',
    component: TabyDownloadManager,
    badge: 'Built-in',
  },
  {
    id: 'taby://api',
    name: 'API Tester Pro',
    nameAr: 'API Tester Pro',
    icon: '🔌',
    color: '#ea580c',
    gradient: 'linear-gradient(135deg, #2a1000, #1a0800)',
    desc: 'Postman-like API client',
    descAr: 'عميل API متكامل',
    component: TabyApiTester,
    badge: 'Dev',
  },
]

export { APPS }

export default function TabyAppsHub({ onOpenApp }) {
  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-auto scrollbar-thin py-12 px-6"
      style={{ background: 'var(--surface)' }}>
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #2a8bff, #0d6bff)' }}>
            <span style={{ fontSize: 28 }}>🌐</span>
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
            Taby Apps
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            تطبيقات مدمجة داخل المتصفح — لا تحتاج إلى تثبيت أي شيء
          </p>
        </div>

        {/* Apps grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {APPS.map(app => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-xl text-left relative overflow-hidden group"
              style={{
                background: app.gradient,
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Badge */}
              <div className="absolute top-2.5 right-2.5">
                <span className="px-1.5 py-0.5 rounded text-white font-bold"
                  style={{ fontSize: 9, background: 'rgba(255,255,255,0.15)' }}>
                  {app.badge}
                </span>
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: app.color + '25', border: `1px solid ${app.color}40` }}>
                <span style={{ fontSize: 28 }}>{app.icon}</span>
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="font-bold text-sm text-white leading-tight">{app.nameAr}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{app.descAr}</p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${app.color}15, transparent 70%)` }} />
            </button>
          ))}
        </div>

        {/* Quick stats */}
        <div className="mt-10 grid grid-cols-3 gap-4">
          {[
            { label: 'تطبيقات مدمجة', value: APPS.length, icon: '📦' },
            { label: 'ميزة للمستخدمين', value: '35+', icon: '✨' },
            { label: 'ميزة للمطورين', value: '15+', icon: '⚙️' },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-4 text-center"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

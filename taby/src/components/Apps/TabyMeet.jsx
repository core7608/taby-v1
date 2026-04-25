import { useState, useRef, useEffect } from 'react'
import {
  Video, VideoOff, Mic, MicOff, Phone, PhoneOff,
  Monitor, MonitorOff, MessageSquare, Users, Settings,
  Copy, Link, Camera, Volume2, VolumeX, Grid, Maximize2,
  Hand, Smile, Record, StopCircle, Share2
} from 'lucide-react'

const MOCK_PARTICIPANTS = [
  { id: 1, name: 'أنت', initials: 'أ', isMuted: false, isVideoOff: false, isSpeaking: true, isHost: true },
  { id: 2, name: 'Ahmed', initials: 'AH', isMuted: true, isVideoOff: false, isSpeaking: false },
  { id: 3, name: 'Sara', initials: 'SA', isMuted: false, isVideoOff: true, isSpeaking: false },
  { id: 4, name: 'Omar', initials: 'OM', isMuted: true, isVideoOff: true, isSpeaking: false },
]

const CHAT_MESSAGES = [
  { id: 1, sender: 'Ahmed', text: 'مرحباً بالجميع!', time: '10:01' },
  { id: 2, sender: 'أنت', text: 'أهلاً أحمد', time: '10:02' },
  { id: 3, sender: 'Sara', text: 'متى نبدأ العرض؟', time: '10:03' },
]

export default function TabyMeet() {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [layout, setLayout] = useState('grid') // grid | spotlight
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState(CHAT_MESSAGES)
  const [participants] = useState(MOCK_PARTICIPANTS)
  const [isInCall, setIsInCall] = useState(true)
  const [roomId] = useState('taby-' + Math.random().toString(36).slice(2, 9))
  const [handRaised, setHandRaised] = useState(false)
  const [timer, setTimer] = useState(0)
  const videoRef = useRef(null)

  useEffect(() => {
    // Request camera access
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream })
      .catch(() => setIsVideoOff(true))

    const t = setInterval(() => setTimer(s => s + 1), 1000)
    return () => { clearInterval(t); videoRef.current?.srcObject?.getTracks().forEach(t => t.stop()) }
  }, [])

  const sendMessage = (e) => {
    e.preventDefault()
    if (!chatMsg.trim()) return
    setMessages(m => [...m, { id: Date.now(), sender: 'أنت', text: chatMsg, time: new Date().toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' }) }])
    setChatMsg('')
  }

  const formatTime = (s) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const copyRoomLink = () => navigator.clipboard?.writeText(`https://meet.taby.app/${roomId}`)

  return (
    <div className="flex flex-col h-full" style={{ background: '#0a0c10', color: 'white' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2a8bff, #0d6bff)' }}>
              <Video size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm">Taby Meet</span>
          </div>
          <div className="h-4 w-px" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {formatTime(timer)}
          </span>
          {isRecording && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.2)' }}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-red-400 font-semibold">Recording</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyRoomLink}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Link size={12} />
            <span className="font-mono">{roomId}</span>
            <Copy size={11} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>
          <button
            onClick={() => setLayout(l => l === 'grid' ? 'spotlight' : 'grid')}
            className="btn-ghost p-2 rounded-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <Grid size={15} />
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video grid */}
        <div className="flex-1 p-3 overflow-auto">
          <div className={`h-full grid gap-2 ${layout === 'grid'
            ? participants.length <= 2 ? 'grid-cols-2' : participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'
            : 'grid-cols-1'}`}>
            {participants.map((p, i) => (
              <VideoTile
                key={p.id}
                participant={p}
                isYou={p.id === 1}
                videoRef={p.id === 1 ? videoRef : null}
                isVideoOff={p.id === 1 ? isVideoOff : p.isVideoOff}
                isMuted={p.id === 1 ? isMuted : p.isMuted}
                handRaised={p.id === 1 ? handRaised : false}
              />
            ))}
          </div>
        </div>

        {/* Side panel: chat or participants */}
        {(showChat || showParticipants) && (
          <div className="w-72 flex flex-col flex-shrink-0"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            {/* Panel header */}
            <div className="flex items-center px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <button onClick={() => { setShowChat(true); setShowParticipants(false) }}
                className="flex-1 py-1 text-sm font-semibold text-center rounded-lg transition-all"
                style={{ background: showChat ? 'rgba(42,139,255,0.2)' : 'transparent', color: showChat ? '#2a8bff' : 'rgba(255,255,255,0.5)' }}>
                Chat
              </button>
              <button onClick={() => { setShowParticipants(true); setShowChat(false) }}
                className="flex-1 py-1 text-sm font-semibold text-center rounded-lg transition-all"
                style={{ background: showParticipants ? 'rgba(42,139,255,0.2)' : 'transparent', color: showParticipants ? '#2a8bff' : 'rgba(255,255,255,0.5)' }}>
                Participants ({participants.length})
              </button>
            </div>

            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin">
                  {messages.map(m => (
                    <div key={m.id} className={`flex flex-col ${m.sender === 'أنت' ? 'items-end' : 'items-start'}`}>
                      <span className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{m.sender}</span>
                      <div className="px-3 py-2 rounded-xl text-sm max-w-56"
                        style={{ background: m.sender === 'أنت' ? '#2a8bff' : 'rgba(255,255,255,0.08)' }}>
                        {m.text}
                      </div>
                      <span className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.time}</span>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="p-3 flex gap-2 flex-shrink-0"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <input
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    placeholder="اكتب رسالة..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontFamily: 'inherit' }}
                  />
                  <button type="submit" className="p-2 rounded-lg" style={{ background: '#2a8bff' }}>
                    <Share2 size={14} />
                  </button>
                </form>
              </>
            )}

            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 scrollbar-thin">
                {participants.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2a8bff, #8b5cf6)' }}>
                      {p.initials}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      {p.isHost && <span className="text-xs" style={{ color: '#2a8bff' }}>Host</span>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {p.isMuted ? <MicOff size={13} style={{ color: '#ef4444' }} /> : <Mic size={13} style={{ color: '#16a34a' }} />}
                      {p.isVideoOff ? <VideoOff size={13} style={{ color: '#ef4444' }} /> : <Video size={13} style={{ color: '#16a34a' }} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-center gap-3 py-4 flex-shrink-0"
        style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <ControlBtn onClick={() => setIsMuted(!isMuted)} active={isMuted} danger={isMuted}
          icon={isMuted ? MicOff : Mic} label={isMuted ? 'Unmute' : 'Mute'} />
        <ControlBtn onClick={() => setIsVideoOff(!isVideoOff)} active={isVideoOff} danger={isVideoOff}
          icon={isVideoOff ? VideoOff : Video} label={isVideoOff ? 'Start Video' : 'Stop Video'} />
        <ControlBtn onClick={() => setIsSharing(!isSharing)} active={isSharing}
          icon={isSharing ? MonitorOff : Monitor} label={isSharing ? 'Stop Share' : 'Share Screen'}
          accent={isSharing} />
        <ControlBtn onClick={() => setHandRaised(!handRaised)} active={handRaised}
          icon={Hand} label={handRaised ? 'Lower Hand' : 'Raise Hand'} accent={handRaised} />
        <ControlBtn onClick={() => setIsRecording(!isRecording)} active={isRecording}
          icon={isRecording ? StopCircle : Record} label={isRecording ? 'Stop Rec' : 'Record'}
          accent={isRecording} accentColor="#ef4444" />
        <div className="w-px h-8 mx-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <ControlBtn onClick={() => { setShowChat(!showChat); setShowParticipants(false) }} active={showChat}
          icon={MessageSquare} label="Chat" />
        <ControlBtn onClick={() => { setShowParticipants(!showParticipants); setShowChat(false) }} active={showParticipants}
          icon={Users} label={`${participants.length}`} />
        <div className="w-px h-8 mx-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <button
          onClick={() => setIsInCall(false)}
          className="flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
          style={{ background: '#ef4444', minWidth: 80 }}>
          <PhoneOff size={20} />
          <span style={{ fontSize: 11 }}>Leave</span>
        </button>
      </div>
    </div>
  )
}

function VideoTile({ participant, isYou, videoRef, isVideoOff, isMuted, handRaised }) {
  return (
    <div className="relative rounded-2xl overflow-hidden flex items-center justify-center"
      style={{
        background: isVideoOff ? 'linear-gradient(135deg, #1a1d23, #22262f)' : '#000',
        border: participant.isSpeaking ? '2px solid #2a8bff' : '2px solid rgba(255,255,255,0.05)',
        minHeight: 120,
      }}>
      {!isVideoOff && isYou ? (
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl"
            style={{ background: 'linear-gradient(135deg, #2a8bff, #8b5cf6)' }}>
            {participant.initials}
          </div>
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {participant.name}
          </span>
        </div>
      )}

      {/* Overlays */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          {isMuted ? <MicOff size={11} style={{ color: '#ef4444' }} /> : <Mic size={11} style={{ color: '#16a34a' }} />}
          <span className="text-xs font-medium">{participant.name}{isYou ? ' (You)' : ''}</span>
        </div>
        {handRaised && (
          <div className="px-1.5 py-0.5 rounded-lg text-sm" style={{ background: 'rgba(0,0,0,0.6)' }}>✋</div>
        )}
      </div>

      {participant.isHost && (
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-xs font-bold"
          style={{ background: 'rgba(42,139,255,0.8)' }}>Host</div>
      )}
    </div>
  )
}

function ControlBtn({ onClick, active, danger, accent, accentColor, icon: Icon, label }) {
  const bg = danger ? 'rgba(239,68,68,0.2)' : accent ? `rgba(${accentColor || '42,139,255'},0.2)` : active ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)'
  const color = danger ? '#ef4444' : accent ? (accentColor || '#2a8bff') : 'white'
  return (
    <button onClick={onClick}
      className="flex flex-col items-center gap-1 p-3 rounded-2xl transition-all hover:brightness-125"
      style={{ background: bg, minWidth: 64 }}>
      <Icon size={20} style={{ color }} />
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
    </button>
  )
}

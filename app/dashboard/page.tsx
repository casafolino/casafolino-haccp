'use client'

const LINES = [
  { label: 'Linea Miele', status: 'ok' },
  { label: 'Creme Spalmabili', status: 'warning' },
  { label: 'Cantucci GF', status: 'ok' },
  { label: 'Cioccolato', status: 'ok' },
  { label: 'Crispy Chili', status: 'error' },
  { label: 'Risotto', status: 'ok' },
]

const MODULES = [
  { href: '/scheda-produzione/nuova', label: 'Nuova Scheda SP', bg: '#2D4A2D', color: 'white' },
  { href: '/materie-prime/nuova', label: 'Ricezione MP', bg: 'white', color: '#1A1A1A' },
  { href: '/non-conformita/nuova', label: 'Apri NC', bg: 'white', color: '#1A1A1A' },
  { href: '/scheda-produzione', label: 'Storico Schede', bg: 'white', color: '#1A1A1A' },
  { href: '/non-conformita', label: 'Non Conformità', bg: 'white', color: '#1A1A1A' },
  { href: '/materie-prime', label: 'Materie Prime', bg: 'white', color: '#1A1A1A' },
  { href: '/quarantena', label: 'Quarantena', bg: 'white', color: '#1A1A1A' },
  { href: '/calibrazione', label: 'Calibrazione', bg: 'white', color: '#1A1A1A' },
  { href: '/documenti', label: 'Documenti HACCP', bg: 'white', color: '#1A1A1A' },
]

export default function DashboardPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#2D4A2D', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '22px', fontFamily: 'serif', fontWeight: 600, margin: 0 }}>CasaFolino OS</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', margin: '2px 0 0' }}>HACCP Manager</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'white', fontSize: '14px', fontWeight: 500, margin: 0 }}>Antonio Folino</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: '2px 0 0' }}>Direzione</p>
        </div>
      </div>

      <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto' }}>

        {/* Semaforo linee */}
        <h2 style={{ fontFamily: 'serif', fontSize: '20px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Stato linee oggi</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '32px' }}>
          {LINES.map(line => (
            <div key={line.label} style={{
              borderRadius: '12px', padding: '14px', border: '1px solid',
              backgroundColor: line.status === 'ok' ? '#EBF2EB' : line.status === 'warning' ? '#FDF3E3' : '#FCECEA',
              borderColor: line.status === 'ok' ? '#3D6B3D' : line.status === 'warning' ? '#C8830A' : '#B53B2A',
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>{line.label}</div>
              <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 500, color: line.status === 'ok' ? '#2D4A2D' : line.status === 'warning' ? '#C8830A' : '#B53B2A' }}>
                {line.status === 'ok' ? 'Tutto OK' : line.status === 'warning' ? 'Da completare' : 'NC aperta'}
              </div>
            </div>
          ))}
        </div>

        {/* Tutti i moduli */}
        <h2 style={{ fontFamily: 'serif', fontSize: '20px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Moduli</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {MODULES.map(m => (
            <a key={m.href} href={m.href} style={{
              display: 'block', padding: '18px', borderRadius: '12px', textDecoration: 'none',
              background: m.bg, color: m.color,
              border: m.bg === 'white' ? '1px solid #E8E0D5' : 'none',
              fontWeight: 500, fontSize: '14px',
            }}>
              {m.label}
            </a>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '11px', color: '#6B6560', marginTop: '32px' }}>
          CasaFolino OS · HACCP Manager v1.0 · Pianopoli, Calabria
        </p>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CalibrazionePage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [location, setLocation] = useState('')
  const [frequency, setFrequency] = useState('')
  const [lastDate, setLastDate] = useState('')
  const [nextDate, setNextDate] = useState('')
  const [result, setResult] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('equipment_calibrations')
      .select('*')
      .order('next_due_date', { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setItems(data)
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    if (!name) { alert('Inserisci nome attrezzatura'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('equipment_calibrations').insert({
      equipment_name: name,
      equipment_code: code || null,
      location: location || null,
      frequency: frequency || null,
      last_calibration_date: lastDate || null,
      next_due_date: nextDate || null,
      result: result || null,
    })
    if (!error) {
      alert('Calibrazione registrata')
      window.location.reload()
    } else {
      alert('Errore: ' + error.message)
    }
    setSaving(false)
  }

  const isExpiring = (date: string) => {
    if (!date) return false
    const d = new Date(date)
    const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return diff < 30
  }

  const isExpired = (date: string) => {
    if (!date) return false
    return new Date(date) < new Date()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#2D4A2D', padding: '16px 24px' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Dashboard</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Calibrazione Attrezzature</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Piano calibrazione</h2>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#2D4A2D', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            {showForm ? 'Annulla' : '+ Aggiungi'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E0D5', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 600, margin: 0 }}>Nuova attrezzatura</h3>
            {[
              { label: 'Nome attrezzatura *', val: name, set: setName, placeholder: 'es. Bilancia Mettler Toledo' },
              { label: 'Codice interno', val: code, set: setCode, placeholder: 'es. BAL-001' },
              { label: 'Ubicazione', val: location, set: setLocation, placeholder: 'es. Linea Miele' },
              { label: 'Frequenza calibrazione', val: frequency, set: setFrequency, placeholder: 'es. Annuale' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>{f.label}</label>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Ultima calibrazione</label>
                <input type="date" value={lastDate} onChange={e => setLastDate(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Prossima scadenza</label>
                <input type="date" value={nextDate} onChange={e => setNextDate(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Esito ultima calibrazione</label>
              <select value={result} onChange={e => setResult(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', background: 'white' }}>
                <option value="">Seleziona...</option>
                <option value="pass">PASS — Conforme</option>
                <option value="fail">FAIL — Non conforme</option>
                <option value="adjusted">Regolata</option>
              </select>
            </div>
            <button onClick={handleSave} disabled={saving} style={{ height: '48px', borderRadius: '10px', border: 'none', background: '#2D4A2D', color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Salvataggio...' : 'Salva'}
            </button>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#6B6560' }}>Caricamento...</div>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #E8E0D5' }}>
            <p style={{ color: '#6B6560', fontSize: '15px' }}>Nessuna attrezzatura registrata</p>
          </div>
        )}

        {!loading && items.map(item => {
          const expired = isExpired(item.next_due_date)
          const expiring = !expired && isExpiring(item.next_due_date)
          return (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: `1px solid ${expired ? '#D44A37' : expiring ? '#D4940A' : '#E8E0D5'}`, marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>{item.equipment_name}</div>
                  <div style={{ fontSize: '13px', color: '#6B6560', marginTop: '4px' }}>
                    {item.equipment_code && `${item.equipment_code} · `}{item.location}
                  </div>
                  {item.next_due_date && (
                    <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 600, color: expired ? '#B53B2A' : expiring ? '#C8830A' : '#2D4A2D' }}>
                      {expired ? '⚠ SCADUTA — ' : expiring ? '⚠ In scadenza — ' : '✓ '}
                      Prossima: {new Date(item.next_due_date).toLocaleDateString('it-IT')}
                    </div>
                  )}
                </div>
                {item.result && (
                  <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: item.result === 'pass' ? '#EBF2EB' : '#FCECEA', color: item.result === 'pass' ? '#2D4A2D' : '#B53B2A' }}>
                    {item.result.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

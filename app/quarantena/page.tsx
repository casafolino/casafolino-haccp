'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function QuarantenaPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [productName, setProductName] = useState('')
  const [lotNumber, setLotNumber] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [reason, setReason] = useState('')
  const [location, setLocation] = useState('')
  const [blockedBy, setBlockedBy] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('quarantine_records')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setItems(data)
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    if (!productName || !reason) { alert('Compila prodotto e motivo'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('quarantine_records').insert({
      product_name: productName,
      lot_number: lotNumber || null,
      quantity: quantity ? parseFloat(quantity) : null,
      unit,
      reason,
      physical_location: location || null,
      blocked_by: blockedBy || null,
      blocked_at: new Date().toISOString(),
    })
    if (!error) {
      alert('Prodotto messo in quarantena')
      window.location.reload()
    } else {
      alert('Errore: ' + error.message)
    }
    setSaving(false)
  }

  async function handleDecision(id: string, decision: string) {
    const supabase = createClient()
    await supabase.from('quarantine_records').update({
      decision,
      decision_at: new Date().toISOString(),
      decision_by: 'Maria Mirabelli (RAQ)',
    }).eq('id', id)
    window.location.reload()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#C8830A', padding: '16px 24px' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Dashboard</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Prodotti in Quarantena</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Registro quarantena</h2>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#C8830A', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            {showForm ? 'Annulla' : '+ Blocca prodotto'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E0D5', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 600, margin: 0 }}>Blocca prodotto</h3>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Prodotto *</label>
              <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Nome prodotto" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Lotto</label>
                <input value={lotNumber} onChange={e => setLotNumber(e.target.value)} placeholder="N. lotto" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Quantità</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
                  <select value={unit} onChange={e => setUnit(e.target.value)} style={{ width: '60px', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', fontSize: '13px', background: 'white' }}>
                    <option>kg</option>
                    <option>pz</option>
                    <option>l</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Motivo blocco *</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Motivo della quarantena..." rows={3} style={{ width: '100%', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '12px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Ubicazione fisica</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="es. Area quarantena magazzino" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Bloccato da</label>
              <select value={blockedBy} onChange={e => setBlockedBy(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', background: 'white' }}>
                <option value="">Seleziona...</option>
                <option>Maria Mirabelli (RAQ)</option>
                <option>Antonio Folino</option>
                <option>Anna</option>
                <option>Martina</option>
              </select>
            </div>
            <button onClick={handleSave} disabled={saving} style={{ height: '48px', borderRadius: '10px', border: 'none', background: '#C8830A', color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Salvataggio...' : 'Blocca in quarantena'}
            </button>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#6B6560' }}>Caricamento...</div>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #E8E0D5' }}>
            <p style={{ color: '#2D4A2D', fontSize: '16px', fontWeight: 600 }}>Nessun prodotto in quarantena</p>
          </div>
        )}

        {!loading && items.map(item => (
          <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #D4940A', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#6B6560' }}>{item.quarantine_number}</div>
              <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: item.decision ? '#EBF2EB' : '#FDF3E3', color: item.decision ? '#2D4A2D' : '#C8830A' }}>
                {item.decision ? item.decision.toUpperCase() : 'In quarantena'}
              </span>
            </div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>{item.product_name}</div>
            {item.lot_number && <div style={{ fontSize: '13px', color: '#6B6560', marginTop: '2px' }}>Lotto: {item.lot_number}</div>}
            <div style={{ fontSize: '13px', color: '#6B6560', marginTop: '2px' }}>{item.reason}</div>
            {!item.decision && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button onClick={() => handleDecision(item.id, 'released')} style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', background: '#EBF2EB', color: '#2D4A2D', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Rilascia</button>
                <button onClick={() => handleDecision(item.id, 'destroyed')} style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', background: '#FCECEA', color: '#B53B2A', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Distruggi</button>
                <button onClick={() => handleDecision(item.id, 'reworked')} style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', background: '#FDF3E3', color: '#C8830A', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Rilavorazione</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

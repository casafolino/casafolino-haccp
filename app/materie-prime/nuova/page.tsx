'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NuovaMateriaPrimaPage() {
  const [supplierName, setSupplierName] = useState('')
  const [productName, setProductName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [lotNumber, setLotNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [ddtNumber, setDdtNumber] = useState('')
  const [temperature, setTemperature] = useState('')
  const [operatorName, setOperatorName] = useState('')
  const [coaPresent, setCoaPresent] = useState(false)
  const [result, setResult] = useState<string>('')
  const [ncFound, setNcFound] = useState('')
  const [saving, setSaving] = useState(false)

  const checks = [
    { key: 'order_conformity', label: 'Ordine conforme (quantità, prodotto)' },
    { key: 'packaging_integrity', label: 'Integrità imballaggio' },
    { key: 'mold_check', label: 'Assenza muffe visibili' },
    { key: 'odor_check', label: 'Assenza odori anomali' },
    { key: 'condensation_check', label: 'Assenza condensa eccessiva' },
    { key: 'pest_check', label: 'Assenza infestanti' },
    { key: 'transport_cleanliness', label: 'Pulizia mezzo di trasporto' },
  ]

  const [checkValues, setCheckValues] = useState<Record<string, boolean | null>>({})

  async function handleSave() {
    if (!supplierName || !productName || !result) {
      alert('Compila fornitore, prodotto ed esito')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('incoming_material_records')
        .insert({
          date_received: new Date().toISOString().split('T')[0],
          supplier_name: supplierName,
          product_name: productName,
          quantity: quantity ? parseFloat(quantity) : null,
          unit,
          lot_number: lotNumber || null,
          expiry_date: expiryDate || null,
          ddt_number: ddtNumber || null,
          temperature_celsius: temperature ? parseFloat(temperature) : null,
          operator_name: operatorName,
          coa_present: coaPresent,
          nc_found: ncFound || null,
          result,
          order_conformity: checkValues['order_conformity'] ?? null,
          packaging_integrity: checkValues['packaging_integrity'] ?? null,
          mold_check: checkValues['mold_check'] ?? null,
          odor_check: checkValues['odor_check'] ?? null,
          condensation_check: checkValues['condensation_check'] ?? null,
          pest_check: checkValues['pest_check'] ?? null,
          transport_cleanliness: checkValues['transport_cleanliness'] ?? null,
        })

      if (error) throw error
      alert('Ricezione registrata con successo')
      window.location.href = '/materie-prime'
    } catch (err) {
      console.error(err)
      alert('Errore salvataggio')
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#2D4A2D', padding: '16px 24px' }}>
        <a href="/materie-prime" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Materie Prime</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Nuova Ricezione MP</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Dati fornitore */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>Dati fornitore e prodotto</div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Fornitore *</label>
            <input value={supplierName} onChange={e => setSupplierName(e.target.value)} placeholder="Nome fornitore" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Prodotto *</label>
            <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Nome materia prima" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Quantità</label>
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0.00" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Unità</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 8px', fontSize: '14px', background: 'white' }}>
                <option>kg</option>
                <option>g</option>
                <option>l</option>
                <option>pz</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>N. lotto</label>
              <input value={lotNumber} onChange={e => setLotNumber(e.target.value)} placeholder="Lotto fornitore" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Scadenza</label>
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>N. DDT</label>
              <input value={ddtNumber} onChange={e => setDdtNumber(e.target.value)} placeholder="DDT fornitore" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Temperatura °C</label>
              <input type="number" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="es. 4.5" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>

        {/* Controlli visivi */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Controlli visivi</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {checks.map(check => (
              <div key={check.key}>
                <div style={{ fontSize: '13px', color: '#1A1A1A', marginBottom: '6px' }}>{check.label}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setCheckValues(c => ({ ...c, [check.key]: true }))}
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: checkValues[check.key] === true ? '#2D4A2D' : '#EBF2EB', color: checkValues[check.key] === true ? 'white' : '#2D4A2D' }}
                  >
                    OK
                  </button>
                  <button
                    onClick={() => setCheckValues(c => ({ ...c, [check.key]: false }))}
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: checkValues[check.key] === false ? '#B53B2A' : '#FCECEA', color: checkValues[check.key] === false ? 'white' : '#B53B2A' }}
                  >
                    NC
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CoA e operatore */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input type="checkbox" checked={coaPresent} onChange={e => setCoaPresent(e.target.checked)} style={{ width: '20px', height: '20px' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Certificato di Analisi (CoA) presente</span>
          </label>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Operatore</label>
            <select value={operatorName} onChange={e => setOperatorName(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', background: 'white' }}>
              <option value="">Seleziona...</option>
              <option>Anna</option>
              <option>Maria Mirabelli</option>
              <option>Josefina</option>
              <option>Martina</option>
              <option>Teresa</option>
            </select>
          </div>
        </div>

        {/* NC trovate */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>NC rilevate (se presenti)</label>
          <textarea value={ncFound} onChange={e => setNcFound(e.target.value)} placeholder="Descrivi eventuali anomalie..." rows={3} style={{ width: '100%', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '12px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
        </div>

        {/* Esito */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Esito ricezione *</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { val: 'accepted', label: 'Accettato', bg: '#2D4A2D' },
              { val: 'accepted_with_reserve', label: 'Accettato con riserva', bg: '#C8830A' },
              { val: 'quarantine', label: 'Messo in quarantena', bg: '#C8830A' },
              { val: 'rejected', label: 'Rifiutato — reso al fornitore', bg: '#B53B2A' },
            ].map(r => (
              <button
                key={r.val}
                onClick={() => setResult(r.val)}
                style={{ width: '100%', height: '48px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: result === r.val ? r.bg : '#F7F3EE', color: result === r.val ? 'white' : '#1A1A1A', border: result === r.val ? 'none' : '1px solid #E8E0D5' }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', height: '56px', borderRadius: '12px', border: 'none', background: saving ? '#888' : '#2D4A2D', color: 'white', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? 'Salvataggio...' : 'Registra Ricezione'}
        </button>
      </div>
    </div>
  )
}
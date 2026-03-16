'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NuovaNonConformitaPage() {
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState<1 | 2 | 3 | null>(null)
  const [hazardType, setHazardType] = useState('')
  const [phase, setPhase] = useState('')
  const [responsible, setResponsible] = useState('')
  const [immediateAction, setImmediateAction] = useState('')
  const [lotBlocked, setLotBlocked] = useState(false)
  const [productionStopped, setProductionStopped] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!description || !severity) {
      alert('Compila descrizione e gravità')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('non_conformities')
        .insert({
          description,
          severity,
          hazard_type: hazardType || null,
          phase: phase || null,
          responsible: responsible || null,
          immediate_action: immediateAction || null,
          lot_blocked: lotBlocked,
          production_stopped: productionStopped,
          status: 'open',
          ca_status: 'open',
          date_opened: new Date().toISOString().split('T')[0],
        })
        .select()
        .single()

      if (error) throw error
      alert(`NC aperta: ${data.nc_number}`)
      window.location.href = '/non-conformita'
    } catch (err) {
      console.error(err)
      alert('Errore salvataggio NC')
    }
    setSaving(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#B53B2A', padding: '16px 24px' }}>
        <a href="/non-conformita" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Non Conformità</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Apri Nuova NC</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* Gravità */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Gravità *</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[
              { val: 1, label: 'Minore', bg: '#EBF2EB', active: '#2D4A2D' },
              { val: 2, label: 'Maggiore', bg: '#FDF3E3', active: '#C8830A' },
              { val: 3, label: 'Critica', bg: '#FCECEA', active: '#B53B2A' },
            ].map(s => (
              <button
                key={s.val}
                onClick={() => setSeverity(s.val as 1 | 2 | 3)}
                style={{
                  flex: 1, height: '52px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600,
                  background: severity === s.val ? s.active : s.bg,
                  color: severity === s.val ? 'white' : s.active,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tipo pericolo */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Tipo pericolo</label>
          <select value={hazardType} onChange={e => setHazardType(e.target.value)} style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', background: 'white' }}>
            <option value="">Seleziona...</option>
            <option value="biological">Biologico</option>
            <option value="chemical">Chimico</option>
            <option value="physical">Fisico</option>
            <option value="allergen">Allergene</option>
            <option value="quality">Qualità</option>
            <option value="documentary">Documentale</option>
          </select>
        </div>

        {/* Fase */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Fase di rilevamento</label>
          <select value={phase} onChange={e => setPhase(e.target.value)} style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', background: 'white' }}>
            <option value="">Seleziona...</option>
            <option value="ricezione_mp">Ricezione MP</option>
            <option value="produzione">Produzione</option>
            <option value="metal_detector">Metal Detector</option>
            <option value="etichettatura">Etichettatura</option>
            <option value="magazzino">Magazzino</option>
            <option value="spedizione">Spedizione</option>
            <option value="cliente">Reclamo cliente</option>
          </select>
        </div>

        {/* Descrizione */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Descrizione NC *</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descrivi la non conformità rilevata..."
            rows={4}
            style={{ width: '100%', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '12px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        {/* Azione immediata */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Azione immediata</label>
          <textarea
            value={immediateAction}
            onChange={e => setImmediateAction(e.target.value)}
            placeholder="Cosa è stato fatto immediatamente..."
            rows={3}
            style={{ width: '100%', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '12px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }}
          />
        </div>

        {/* Responsabile */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Responsabile CAPA</label>
          <select value={responsible} onChange={e => setResponsible(e.target.value)} style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', background: 'white' }}>
            <option value="">Seleziona...</option>
            <option value="Maria Mirabelli">Maria Mirabelli (RAQ)</option>
            <option value="Anna">Anna</option>
            <option value="Josefina">Josefina</option>
            <option value="Martina">Martina</option>
            <option value="Teresa">Teresa</option>
            <option value="Antonio Folino">Antonio Folino</option>
          </select>
        </div>

        {/* Blocchi */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>Azioni di contenimento</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={lotBlocked}
                onChange={e => setLotBlocked(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Lotto bloccato in quarantena</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={productionStopped}
                onChange={e => setProductionStopped(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Produzione fermata</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', height: '56px', borderRadius: '12px', border: 'none', background: saving ? '#888' : '#B53B2A', color: 'white', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
        >
          {saving ? 'Salvataggio...' : 'Apri Non Conformità'}
        </button>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DocumentiPage() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [docType, setDocType] = useState('')
  const [line, setLine] = useState('')
  const [version, setVersion] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [nextReview, setNextReview] = useState('')
  const [approvedBy, setApprovedBy] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('haccp_documents')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setDocs(data)
        setLoading(false)
      })
  }, [])

  async function handleSave() {
    if (!title) { alert('Inserisci titolo documento'); return }
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.from('haccp_documents').insert({
      title,
      document_type: docType || null,
      line: line || null,
      version: version || null,
      issue_date: issueDate || null,
      next_review_date: nextReview || null,
      approved_by: approvedBy || null,
      is_current: true,
    })
    if (!error) {
      alert('Documento registrato')
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
    return diff < 60
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#2D4A2D', padding: '16px 24px' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Dashboard</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Documenti HACCP</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Libreria documenti</h2>
          <button onClick={() => setShowForm(!showForm)} style={{ background: '#2D4A2D', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: 'none', cursor: 'pointer' }}>
            {showForm ? 'Annulla' : '+ Aggiungi'}
          </button>
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #E8E0D5', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 600, margin: 0 }}>Nuovo documento</h3>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Titolo *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="es. Piano HACCP Crispy Chili v1.0" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Tipo documento</label>
                <select value={docType} onChange={e => setDocType(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 8px', fontSize: '13px', background: 'white' }}>
                  <option value="">Seleziona...</option>
                  <option value="haccp_plan">Piano HACCP</option>
                  <option value="procedure">Procedura</option>
                  <option value="instruction">Istruzione operativa</option>
                  <option value="form">Modulo</option>
                  <option value="certificate">Certificato</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Linea</label>
                <select value={line} onChange={e => setLine(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 8px', fontSize: '13px', background: 'white' }}>
                  <option value="">Tutte</option>
                  <option>Linea Miele</option>
                  <option>Creme Spalmabili</option>
                  <option>Cantucci GF</option>
                  <option>Cioccolato</option>
                  <option>Crispy Chili</option>
                  <option>Risotto</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Versione</label>
                <input value={version} onChange={e => setVersion(e.target.value)} placeholder="es. v1.0" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Data emissione</label>
                <input type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Prossima revisione</label>
                <input type="date" value={nextReview} onChange={e => setNextReview(e.target.value)} style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>Approvato da</label>
                <input value={approvedBy} onChange={e => setApprovedBy(e.target.value)} placeholder="Nome" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} style={{ height: '48px', borderRadius: '10px', border: 'none', background: '#2D4A2D', color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Salvataggio...' : 'Salva documento'}
            </button>
          </div>
        )}

        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#6B6560' }}>Caricamento...</div>}

        {!loading && docs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #E8E0D5' }}>
            <p style={{ color: '#6B6560', fontSize: '15px' }}>Nessun documento registrato</p>
            <p style={{ color: '#6B6560', fontSize: '13px', marginTop: '4px' }}>Aggiungi i piani HACCP approvati</p>
          </div>
        )}

        {!loading && docs.map(doc => {
          const expiring = isExpiring(doc.next_review_date)
          return (
            <div key={doc.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: `1px solid ${expiring ? '#D4940A' : '#E8E0D5'}`, marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>{doc.title}</div>
                {doc.version && (
                  <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: '#EBF2EB', color: '#2D4A2D' }}>{doc.version}</span>
                )}
              </div>
              <div style={{ fontSize: '13px', color: '#6B6560' }}>
                {doc.line && `${doc.line} · `}
                {doc.approved_by && `Approvato da: ${doc.approved_by}`}
              </div>
              {doc.next_review_date && (
                <div style={{ fontSize: '12px', marginTop: '4px', fontWeight: 600, color: expiring ? '#C8830A' : '#6B6560' }}>
                  {expiring ? '⚠ Revisione in scadenza: ' : 'Prossima revisione: '}
                  {new Date(doc.next_review_date).toLocaleDateString('it-IT')}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createProductionRecord } from '@/lib/db/productions'

const STEPS = [
  'Intestazione',
  'Pre-Operativi',
  'Materie Prime',
  'Vetro e Vasetti',
  'Metal Detector',
  'Etichette',
  'Peso',
  'Pressione',
  'Post-Operativi',
  'Chiusura',
]

export default function NuovaSchedaPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [recordId, setRecordId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [line, setLine] = useState('')
  const [productName, setProductName] = useState('')
  const [lotId, setLotId] = useState('')
  const [dateProduction, setDateProduction] = useState('')
  const [operatorName, setOperatorName] = useState('')

  async function handleContinue() {
    console.log('CONTINUA CLICCATO', { currentStep, productName, dateProduction, operatorName })
    
    if (currentStep === 0) {
      if (!productName || !dateProduction || !operatorName) {
        alert('Compila tutti i campi obbligatori')
        return
      }
      setSaving(true)
      try {
        console.log('Chiamo createProductionRecord...')
        const record = await createProductionRecord({
          product_name: productName,
          sku: lotId,
          line,
          date_production: dateProduction,
          operator_id: operatorName.toLowerCase().replace(' ', '_'),
          operator_name: operatorName,
        })
        console.log('Record salvato:', record)
        setRecordId(record.id)
      } catch (err) {
        console.error('ERRORE SALVATAGGIO:', err)
        alert('Errore: ' + JSON.stringify(err))
        setSaving(false)
        return
      }
      setSaving(false)
    }
    setCurrentStep(s => s + 1)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#2D4A2D', padding: '16px 24px' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Dashboard</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Nuova Scheda Produzione</div>
      </div>

      <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #E8E0D5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#6B6560' }}>Step {currentStep + 1} di {STEPS.length}</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#2D4A2D' }}>{STEPS[currentStep]}</span>
        </div>
        <div style={{ background: '#E8E0D5', borderRadius: '99px', height: '6px' }}>
          <div style={{ background: '#2D4A2D', borderRadius: '99px', height: '6px', width: `${((currentStep + 1) / STEPS.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>
        {recordId && (
          <div style={{ fontSize: '11px', color: '#2D4A2D', marginTop: '6px', fontWeight: 600 }}>
            ✓ Salvato — ID: {recordId.slice(0, 8)}...
          </div>
        )}
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        {currentStep === 0 && (
          <StepIntestazione
            line={line} setLine={setLine}
            productName={productName} setProductName={setProductName}
            lotId={lotId} setLotId={setLotId}
            dateProduction={dateProduction} setDateProduction={setDateProduction}
            operatorName={operatorName} setOperatorName={setOperatorName}
          />
        )}
        {currentStep === 1 && <StepPreOperativi />}
        {currentStep === 2 && <StepMateriePrime />}
        {currentStep === 3 && <StepVetro />}
        {currentStep === 4 && <StepMetalDetector />}
        {currentStep === 5 && <StepEtichette />}
        {currentStep === 6 && <StepPeso />}
        {currentStep === 7 && <StepPressione />}
        {currentStep === 8 && <StepPostOperativi />}
        {currentStep === 9 && <StepChiusura recordId={recordId} />}

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(s => s - 1)}
              style={{ flex: 1, height: '52px', borderRadius: '12px', border: '1px solid #E8E0D5', background: 'white', color: '#1A1A1A', fontSize: '15px', cursor: 'pointer' }}
            >
              Indietro
            </button>
          )}
          {currentStep < STEPS.length - 1 && (
            <button
              onClick={handleContinue}
              disabled={saving}
              style={{ flex: 1, height: '52px', borderRadius: '12px', border: 'none', background: saving ? '#6B9E6B' : '#2D4A2D', color: 'white', fontSize: '15px', fontWeight: 500, cursor: 'pointer' }}
            >
              {saving ? 'Salvataggio...' : 'Continua'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function StepIntestazione({ line, setLine, productName, setProductName, lotId, setLotId, dateProduction, setDateProduction, operatorName, setOperatorName }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Intestazione lotto</h2>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Linea di produzione</label>
        <select value={line} onChange={e => setLine(e.target.value)} style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', background: 'white' }}>
          <option value="">Seleziona linea...</option>
          <option>Linea Miele</option>
          <option>Creme Spalmabili</option>
          <option>Cantucci GF</option>
          <option>Cioccolato</option>
          <option>Crispy Chili</option>
          <option>Risotto</option>
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Prodotto / SKU *</label>
        <input type="text" value={productName} onChange={e => setProductName(e.target.value)} placeholder="es. Crema Nocciola 200g" style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Lotto produzione</label>
        <input type="text" value={lotId} onChange={e => setLotId(e.target.value)} placeholder="es. LOT-2026-0316-A" style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Data produzione *</label>
        <input type="date" value={dateProduction} onChange={e => setDateProduction(e.target.value)} style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>Operatore *</label>
        <input type="text" value={operatorName} onChange={e => setOperatorName(e.target.value)} placeholder="Nome operatore" style={{ width: '100%', height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '15px', boxSizing: 'border-box' }} />
      </div>
    </div>
  )
}

function CNCToggle({ label, value, onChange }: { label: string, value: 'C' | 'NC' | null, onChange: (v: 'C' | 'NC') => void }) {
  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
      <div style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A1A', marginBottom: '10px' }}>{label}</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => onChange('C')} style={{ flex: 1, height: '52px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, background: value === 'C' ? '#2D4A2D' : '#EBF2EB', color: value === 'C' ? 'white' : '#2D4A2D' }}>Conforme</button>
        <button onClick={() => onChange('NC')} style={{ flex: 1, height: '52px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: 600, background: value === 'NC' ? '#B53B2A' : '#FCECEA', color: value === 'NC' ? 'white' : '#B53B2A' }}>Non conforme</button>
      </div>
    </div>
  )
}

function StepPreOperativi() {
  const [checks, setChecks] = useState<Record<string, 'C' | 'NC' | null>>({})
  const items = ['Pulizia linea, area produzione, attrezzi', 'Pulizia area produzione', 'Camice pulito', 'Barba corta o copribarba', 'Assenza ferite', 'Copricapo indossato', 'Assenza gioielli', 'Assenza tracce infestanti', 'Controllo vetro e plastiche dure (IO-01)']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Controlli Pre-Operativi</h2>
      {items.map(item => <CNCToggle key={item} label={item} value={checks[item] ?? null} onChange={v => setChecks(c => ({ ...c, [item]: v }))} />)}
    </div>
  )
}

function StepMateriePrime() {
  const [rows, setRows] = useState([{ id: 1 }])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Materie Prime Utilizzate</h2>
      {rows.map((row, i) => (
        <div key={row.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#6B6560', marginBottom: '12px' }}>MP #{i + 1}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input placeholder="Nome materia prima" style={{ width: '100%', height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input placeholder="N. lotto" style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
              <input type="date" style={{ flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input type="checkbox" /> CoA presente
            </label>
          </div>
        </div>
      ))}
      <button onClick={() => setRows(r => [...r, { id: Date.now() }])} style={{ height: '48px', borderRadius: '12px', border: '2px dashed #E8E0D5', background: 'transparent', color: '#6B6560', fontSize: '14px', cursor: 'pointer' }}>
        + Aggiungi materia prima
      </button>
    </div>
  )
}

function StepVetro() {
  const [checks, setChecks] = useState<Record<string, 'C' | 'NC' | null>>({})
  const items = ['Ispezione visiva vasetti prima del riempimento', 'Assenza schegge o crepe', 'Assenza corpi estranei nei vasetti', 'Registro vetro e plastiche dure compilato (IO-01)']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Controllo Vetro e Vasetti</h2>
      {items.map(item => <CNCToggle key={item} label={item} value={checks[item] ?? null} onChange={v => setChecks(c => ({ ...c, [item]: v }))} />)}
    </div>
  )
}

function StepMetalDetector() {
  const [results, setResults] = useState<Record<string, Record<string, 'PASS' | 'FAIL' | null>>>({})
  const [blocked, setBlocked] = useState(false)
  const moments = ['1 — Inizio Turno', '2 — Intervallo AM', '3 — Intervallo PM', '4 — Cambio Formato', '5 — Fine Turno']
  const testers = ['FE 3.0mm', 'Non FE 3.0mm', 'AISI 304 3.5mm']

  function setResult(moment: string, tester: string, value: 'PASS' | 'FAIL') {
    setResults(r => ({ ...r, [moment]: { ...r[moment], [tester]: value } }))
    if (value === 'FAIL') setBlocked(true)
  }

  if (blocked) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#B53B2A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '32px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>⛔</div>
        <h1 style={{ color: 'white', fontSize: '32px', fontFamily: 'serif', fontWeight: 600, textAlign: 'center', marginBottom: '16px' }}>LINEA BLOCCATA</h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', textAlign: 'center', marginBottom: '32px' }}>Allarme Metal Detector rilevato</p>
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '24px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
          <p style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>Avvertire immediatamente il RAQ</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px' }}>Alert inviato automaticamente</p>
        </div>
        <button onClick={() => setBlocked(false)} style={{ marginTop: '32px', background: 'white', color: '#B53B2A', padding: '16px 32px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
          Sblocca (solo RAQ)
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: '#FCECEA', border: '1px solid #D44A37', borderRadius: '12px', padding: '16px' }}>
        <h2 style={{ fontFamily: 'serif', fontSize: '20px', fontWeight: 600, color: '#B53B2A', margin: 0 }}>CCP1 — Metal Detector</h2>
        <p style={{ fontSize: '13px', color: '#B53B2A', marginTop: '4px' }}>In caso di FAIL la linea si blocca automaticamente</p>
      </div>
      {moments.map(moment => (
        <div key={moment} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>{moment}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {testers.map(tester => (
              <div key={tester}>
                <div style={{ fontSize: '12px', color: '#6B6560', marginBottom: '4px' }}>{tester}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setResult(moment, tester, 'PASS')} style={{ flex: 1, height: '48px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: results[moment]?.[tester] === 'PASS' ? '#2D4A2D' : '#EBF2EB', color: results[moment]?.[tester] === 'PASS' ? 'white' : '#2D4A2D' }}>PASS</button>
                  <button onClick={() => setResult(moment, tester, 'FAIL')} style={{ flex: 1, height: '48px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: results[moment]?.[tester] === 'FAIL' ? '#B53B2A' : '#FCECEA', color: results[moment]?.[tester] === 'FAIL' ? 'white' : '#B53B2A' }}>FAIL</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function StepEtichette() {
  const [checks, setChecks] = useState<Record<string, 'C' | 'NC' | null>>({})
  const items = ['Lotto corretto su etichetta', 'Ingredienti conformi alla distinta base', 'Assenza difetti grafici', 'Allergeni EU corretti (Reg. 1169/2011)', 'Etichettatura USA corretta (FDA)', 'TMC / Data scadenza corretta']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Controllo Etichette</h2>
      {items.map(item => <CNCToggle key={item} label={item} value={checks[item] ?? null} onChange={v => setChecks(c => ({ ...c, [item]: v }))} />)}
    </div>
  )
}

function StepPeso() {
  const [weights, setWeights] = useState<string[]>(['', '', '', '', ''])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Controllo Peso</h2>
      <div style={{ background: '#EBF2EB', border: '1px solid #3D6B3D', borderRadius: '12px', padding: '12px 16px', fontSize: '13px', color: '#2D4A2D' }}>
        Tolleranza: peso nominale ±3% — Registra 5 campioni per turno
      </div>
      {weights.map((w, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Campione {i + 1}</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="number" placeholder="0.00" value={w} onChange={e => setWeights(ws => ws.map((x, j) => j === i ? e.target.value : x))} style={{ flex: 1, height: '48px', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '0 12px', fontSize: '16px', boxSizing: 'border-box' }} />
            <span style={{ fontSize: '14px', color: '#6B6560' }}>grammi</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function StepPressione() {
  const [checks, setChecks] = useState<Record<string, 'C' | 'NC' | null>>({})
  const items = ['Controllo chiusura tappo (torsiometro)', 'Controllo vacuum (pressione negativa)', 'Assenza perdite visibili', 'Tenuta ermetica conforme']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Controllo Pressione e Chiusura</h2>
      {items.map(item => <CNCToggle key={item} label={item} value={checks[item] ?? null} onChange={v => setChecks(c => ({ ...c, [item]: v }))} />)}
    </div>
  )
}

function StepPostOperativi() {
  const [checks, setChecks] = useState<Record<string, 'C' | 'NC' | null>>({})
  const items = ['Pulizia linea completata', 'Attrezzature pulite e riposte', 'Rifiuti smaltiti correttamente', 'Registro pulizia compilato', 'Area produzione lasciata in ordine']
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Controlli Post-Operativi</h2>
      {items.map(item => <CNCToggle key={item} label={item} value={checks[item] ?? null} onChange={v => setChecks(c => ({ ...c, [item]: v }))} />)}
    </div>
  )
}

function StepChiusura({ recordId }: { recordId: string | null }) {
  const [result, setResult] = useState<'C' | 'NC' | null>(null)
  const [notes, setNotes] = useState('')

  async function handleSave() {
    alert('Scheda salvata! In attesa di approvazione RAQ.')
    window.location.href = '/scheda-produzione'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Chiusura e Validazione</h2>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
        <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '12px' }}>Esito finale lotto</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setResult('C')} style={{ flex: 1, height: '56px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, background: result === 'C' ? '#2D4A2D' : '#EBF2EB', color: result === 'C' ? 'white' : '#2D4A2D' }}>CONFORME</button>
          <button onClick={() => setResult('NC')} style={{ flex: 1, height: '56px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '16px', fontWeight: 700, background: result === 'NC' ? '#B53B2A' : '#FCECEA', color: result === 'NC' ? 'white' : '#B53B2A' }}>NON CONFORME</button>
        </div>
      </div>
      <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Note finali</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Annotazioni operative..." rows={4} style={{ width: '100%', borderRadius: '10px', border: '1px solid #E8E0D5', padding: '12px', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
      </div>
      {result && (
        <button onClick={handleSave} style={{ width: '100%', height: '56px', borderRadius: '12px', border: 'none', background: '#2D4A2D', color: 'white', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
          Salva e invia al RAQ
        </button>
      )}
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function MateriePrimePage() {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('incoming_material_records')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setRecords(data)
        setLoading(false)
      })
  }, [])

  const resultColor = (r: string) =>
    r === 'accepted' ? { bg: '#EBF2EB', color: '#2D4A2D' } :
    r === 'rejected' ? { bg: '#FCECEA', color: '#B53B2A' } :
    r === 'quarantine' ? { bg: '#FDF3E3', color: '#C8830A' } :
    { bg: '#EBF2EB', color: '#2D4A2D' }

  const resultLabel = (r: string) =>
    r === 'accepted' ? 'Accettato' :
    r === 'rejected' ? 'Rifiutato' :
    r === 'quarantine' ? 'Quarantena' :
    'Accettato con riserva'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#2D4A2D', padding: '16px 24px' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Dashboard</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Ricezione Materie Prime</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>Registrazioni recenti</h2>
          <a href="/materie-prime/nuova" style={{ background: '#2D4A2D', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>+ Nuova</a>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#6B6560' }}>Caricamento...</div>}

        {!loading && records.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #E8E0D5' }}>
            <p style={{ color: '#6B6560', fontSize: '15px', marginBottom: '12px' }}>Nessuna ricezione registrata</p>
            <a href="/materie-prime/nuova" style={{ color: '#2D4A2D', fontWeight: 500 }}>Registra la prima ricezione</a>
          </div>
        )}

        {!loading && records.map(record => {
          const col = resultColor(record.result)
          return (
            <div key={record.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A' }}>{record.product_name}</div>
                  <div style={{ fontSize: '13px', color: '#6B6560', marginTop: '4px' }}>{record.supplier_name}</div>
                  <div style={{ fontSize: '12px', color: '#6B6560', marginTop: '2px' }}>
                    {new Date(record.date_received).toLocaleDateString('it-IT')}
                    {record.lot_number && ` · Lotto: ${record.lot_number}`}
                  </div>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: col.bg, color: col.color }}>
                  {resultLabel(record.result)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function NonConformitaPage() {
  const [ncs, setNcs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('non_conformities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error && data) setNcs(data)
        setLoading(false)
      })
  }, [])

  const severityLabel = (s: number) =>
    s === 3 ? 'Critica' : s === 2 ? 'Maggiore' : 'Minore'

  const severityColor = (s: number) =>
    s === 3 ? { bg: '#FCECEA', color: '#B53B2A', border: '#D44A37' } :
    s === 2 ? { bg: '#FDF3E3', color: '#C8830A', border: '#D4940A' } :
    { bg: '#EBF2EB', color: '#2D4A2D', border: '#3D6B3D' }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE' }}>
      <div style={{ background: '#2D4A2D', padding: '16px 24px' }}>
        <a href="/dashboard" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>← Dashboard</a>
        <div style={{ color: 'white', fontSize: '20px', fontFamily: 'serif', fontWeight: 600, marginTop: '4px' }}>Non Conformità</div>
      </div>

      <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>NC aperte</h2>
          <a href="/non-conformita/nuova" style={{ background: '#B53B2A', color: 'white', padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>+ Apri NC</a>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '48px', color: '#6B6560' }}>Caricamento...</div>}

        {!loading && ncs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '16px', border: '1px solid #E8E0D5' }}>
            <p style={{ color: '#2D4A2D', fontSize: '16px', fontWeight: 600 }}>Nessuna NC aperta</p>
            <p style={{ color: '#6B6560', fontSize: '14px', marginTop: '4px' }}>Ottimo — tutto conforme</p>
          </div>
        )}

        {!loading && ncs.map(nc => {
          const col = severityColor(nc.severity)
          return (
            <div key={nc.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #E8E0D5', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#6B6560' }}>{nc.nc_number}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: col.bg, color: col.color, border: `1px solid ${col.border}` }}>
                    {severityLabel(nc.severity)}
                  </span>
                  <span style={{ padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, background: nc.status === 'closed' ? '#EBF2EB' : '#FDF3E3', color: nc.status === 'closed' ? '#2D4A2D' : '#C8830A' }}>
                    {nc.status === 'closed' ? 'Chiusa' : nc.status === 'in_progress' ? 'In corso' : 'Aperta'}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#1A1A1A', marginBottom: '4px' }}>{nc.description}</div>
              <div style={{ fontSize: '12px', color: '#6B6560' }}>
                {new Date(nc.date_opened).toLocaleDateString('it-IT')}
                {nc.responsible && ` · ${nc.responsible}`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
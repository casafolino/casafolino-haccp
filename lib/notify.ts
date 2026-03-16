interface AlertPayload {
  type: 'ccp_alarm' | 'nc_gravity3' | 'lot_blocked' | 'glass_break'
  line: string
  product: string
  lot: string
  moment?: string
  description: string
  operator: string
  timestamp: string
  url: string
}

export async function sendAlert(payload: AlertPayload): Promise<void> {
  try {
    await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret': process.env.N8N_SECRET!,
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Alert notification failed:', err)
  }
}
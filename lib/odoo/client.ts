interface OdooCallParams {
  model: string
  method: string
  args?: unknown[]
  kwargs?: Record<string, unknown>
}

let sessionId: string | null = null

async function getSession(): Promise<string> {
  if (sessionId) return sessionId

  const res = await fetch(`${process.env.ODOO_BASE_URL}/web/session/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {
        db: process.env.ODOO_DB,
        login: process.env.ODOO_API_USER,
        password: process.env.ODOO_API_PASSWORD,
      },
    }),
  })

  const data = await res.json()
  if (!data.result?.uid) throw new Error('Odoo auth failed')

  const cookies = res.headers.get('set-cookie') || ''
  const match = cookies.match(/session_id=([^;]+)/)
  if (match) sessionId = match[1]

  return sessionId!
}

export async function odooCall<T>(params: OdooCallParams): Promise<T> {
  const sid = await getSession()

  const res = await fetch(`${process.env.ODOO_BASE_URL}/web/dataset/call_kw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `session_id=${sid}`,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'call',
      params: {
        model: params.model,
        method: params.method,
        args: params.args || [],
        kwargs: params.kwargs || {},
      },
    }),
  })

  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.result as T
}
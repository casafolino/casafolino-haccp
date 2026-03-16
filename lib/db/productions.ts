import { createClient } from '@/lib/supabase/client'

export interface NewProductionRecord {
  product_name: string
  sku?: string
  line?: string
  date_production: string
  operator_id: string
  operator_name: string
}

export async function createProductionRecord(data: NewProductionRecord) {
  const supabase = createClient()
  
  console.log('Tentativo salvataggio:', data)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  
  const { data: record, error } = await supabase
    .from('production_records')
    .insert({
      product_name: data.product_name,
      sku: data.sku,
      line: data.line,
      date_production: data.date_production,
      operator_id: data.operator_id,
      operator_name: data.operator_name,
      status: 'in_progress',
    })
    .select()
    .single()

  console.log('Risultato:', { record, error })

  if (error) throw error
  return record
}

export async function getProductionRecords() {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('production_records')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return data ?? []
}

export async function updateProductionRecord(id: string, updates: Partial<NewProductionRecord> & { status?: string, final_result?: string }) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('production_records')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('intentions')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json(data || [])
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    const { error } = await supabase.from('intentions').delete().eq('id', id)
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json({ success: true })
  }

  if (req.method === 'PUT') {
    const { id, status, lot_complete } = req.body
    const updates = {}
    if (status !== undefined) updates.status = status
    if (lot_complete !== undefined) updates.lot_complete = lot_complete
    
    const { error } = await supabase.from('intentions').update(updates).eq('id', id)
    
    if (error) {
      return res.status(500).json({ error: error.message })
    }
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}

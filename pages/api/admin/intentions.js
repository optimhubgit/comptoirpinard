import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from './auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  const { method } = req

  try {
    switch (method) {
      case 'GET':
        const { status, caisse } = req.query
        
        let query = supabase
          .from('intentions')
          .select('*')
          .order('created_at', { ascending: false })

        if (status) query = query.eq('status', status)
        if (caisse) query = query.eq('caisse', caisse)

        const { data: intentions, error: getError } = await query

        if (getError) {
          console.error('Erreur GET intentions:', getError)
          return res.status(200).json([])
        }
        return res.status(200).json(intentions || [])

      case 'PUT':
        const { id, ...updateData } = req.body
        const { data: updatedIntention, error: putError } = await supabase
          .from('intentions')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (putError) {
          console.error('Erreur PUT intention:', putError)
          return res.status(500).json({ error: putError.message })
        }
        return res.status(200).json(updatedIntention)

      case 'DELETE':
        const { id: deleteId } = req.body
        const { error: deleteError } = await supabase
          .from('intentions')
          .delete()
          .eq('id', deleteId)

        if (deleteError) {
          console.error('Erreur DELETE intention:', deleteError)
          return res.status(500).json({ error: deleteError.message })
        }
        return res.status(200).json({ success: true })

      default:
        return res.status(405).json({ error: `Méthode ${method} non autorisée` })
    }
  } catch (error) {
    console.error('Erreur API intentions:', error)
    return res.status(500).json({ error: error.message })
  }
}

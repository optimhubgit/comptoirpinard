import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  try {
    const { data: intentions } = await supabase.from('intentions').select('*')
    const { data: cartons } = await supabase.from('cartons').select('*')

    const cartonsMap = {}
    cartons?.forEach(c => { cartonsMap[c.slug] = c })

    const totalIntentions = intentions?.length || 0
    const lotsComplets = [...new Set(
      (intentions || [])
        .filter(i => i.lot_complete)
        .map(i => `${i.caisse}-${i.lot_number}`)
    )].length

    const totalCaisses = totalIntentions
    const ca = (intentions || []).reduce((sum, i) => {
      const carton = cartonsMap[i.caisse]
      return sum + (carton?.prix || 0)
    }, 0)

    res.status(200).json({
      totalIntentions,
      lotsComplets,
      totalCaisses,
      ca
    })
  } catch (error) {
    console.error('Erreur stats:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

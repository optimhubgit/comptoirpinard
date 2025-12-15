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
    const { data: cartons, error } = await supabase
      .from('cartons')
      .select('slug')
      .eq('active', true)

    if (error || !cartons) {
      console.error('Erreur cartons counts:', error)
      return res.status(200).json({})
    }

    const result = {}

    for (const carton of cartons) {
      // Compter les intentions du lot en cours (non complet)
      const { count: currentLotCount } = await supabase
        .from('intentions')
        .select('*', { count: 'exact', head: true })
        .eq('caisse', carton.slug)
        .eq('lot_complete', false)

      // Compter le nombre de lots complets
      const { data: completeLots } = await supabase
        .from('intentions')
        .select('lot_number')
        .eq('caisse', carton.slug)
        .eq('lot_complete', true)

      // Nombre de lots complets = nombre d'intentions complètes / 3
      const uniqueCompleteLots = [...new Set((completeLots || []).map(i => i.lot_number))]
      
      result[carton.slug] = {
        current: currentLotCount || 0,        // Intentions du lot en cours
        completeLots: uniqueCompleteLots.length  // Nombre de lots déjà complets
      }
    }

    res.status(200).json(result)

  } catch (error) {
    console.error('Erreur counts:', error)
    res.status(200).json({})
  }
}

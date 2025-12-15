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

    const countPromises = cartons.map(async (carton) => {
      const { count } = await supabase
        .from('intentions')
        .select('*', { count: 'exact', head: true })
        .eq('caisse', carton.slug)
      
      return { caisse: carton.slug, count: count || 0 }
    })

    const counts = await Promise.all(countPromises)
    
    const result = {}
    counts.forEach(({ caisse, count }) => {
      result[caisse] = count
    })

    res.status(200).json(result)

  } catch (error) {
    console.error('Erreur counts:', error)
    res.status(200).json({})
  }
}

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
    const { data: cartons, error: cartonsError } = await supabase
      .from('cartons')
      .select('*')
      .eq('active', true)
      .order('ordre')

    if (cartonsError) {
      console.error('Erreur cartons:', cartonsError)
      return res.status(200).json([])
    }

    const { data: vins, error: vinsError } = await supabase
      .from('carton_vins')
      .select('*')
      .order('ordre')

    if (vinsError) {
      console.error('Erreur vins:', vinsError)
    }

    const cartonsWithVins = (cartons || []).map(carton => ({
      ...carton,
      vins: (vins || []).filter(v => v.carton_id === carton.id),
      prixBouteille: `${(carton.prix / 6).toFixed(2)}€`
    }))

    res.status(200).json(cartonsWithVins)
  } catch (error) {
    console.error('Erreur GET cartons:', error)
    res.status(200).json([])
  }
}

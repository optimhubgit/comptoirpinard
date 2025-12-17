import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

function calculerPrixCarton(vins) {
  if (!vins || vins.length === 0) return 0
  const total = vins.reduce((sum, vin) => {
    const prix = parseFloat(vin.prix) || 0
    const quantite = parseInt(vin.quantite) || 2
    return sum + (prix * quantite)
  }, 0)
  return Math.ceil(total)
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data: cartons } = await supabase.from('cartons').select('*').order('ordre')
    const { data: vins } = await supabase.from('carton_vins').select('*').order('ordre')
    
    const result = (cartons || []).map(c => ({
      ...c,
      vins: (vins || []).filter(v => v.carton_id === c.id)
    }))
    return res.status(200).json(result)
  }

  if (req.method === 'POST') {
    const { nom, slug, region, type, badge, min_personnes, active, ordre, vins } = req.body
    const prix = calculerPrixCarton(vins)
    
    const { data: carton, error } = await supabase.from('cartons').insert({
      nom, slug, region, type, badge, prix, min_personnes: min_personnes || 3, active, ordre
    }).select().single()
    
    if (error) return res.status(400).json({ error: error.message })
    
    if (vins && vins.length > 0) {
      const vinsData = vins.map((v, i) => ({
        carton_id: carton.id,
        nom: v.nom,
        domaine: v.domaine || null,
        prix: parseFloat(v.prix) || 0,
        quantite: parseInt(v.quantite) || 2,
        ordre: i
      }))
      await supabase.from('carton_vins').insert(vinsData)
    }
    
    return res.status(200).json({ success: true, carton })
  }

  if (req.method === 'PUT') {
    const { id, nom, slug, region, type, badge, min_personnes, active, ordre, vins } = req.body
    const prix = calculerPrixCarton(vins)
    
    await supabase.from('cartons').update({
      nom, slug, region, type, badge, prix, min_personnes: min_personnes || 3, active, ordre
    }).eq('id', id)
    
    await supabase.from('carton_vins').delete().eq('carton_id', id)
    
    if (vins && vins.length > 0) {
      const vinsData = vins.map((v, i) => ({
        carton_id: id,
        nom: v.nom,
        domaine: v.domaine || null,
        prix: parseFloat(v.prix) || 0,
        quantite: parseInt(v.quantite) || 2,
        ordre: i
      }))
      await supabase.from('carton_vins').insert(vinsData)
    }
    
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    await supabase.from('cartons').delete().eq('id', id)
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}

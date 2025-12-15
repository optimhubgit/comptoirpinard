import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from './auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Fonction pour calculer le prix du carton à partir des vins
function calculerPrixCarton(vins) {
  if (!vins || vins.length === 0) return 0
  
  const total = vins.reduce((sum, vin) => {
    // Nettoyer le prix (enlever €, remplacer , par .)
    const prixStr = String(vin.prix || 0).replace('€', '').replace(',', '.').trim()
    const prix = parseFloat(prixStr) || 0
    const quantite = vin.quantite || 2 // Par défaut 2 bouteilles
    return sum + (prix * quantite)
  }, 0)
  
  // Arrondi supérieur
  return Math.ceil(total)
}

export default async function handler(req, res) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  const { method } = req

  try {
    switch (method) {
      case 'GET':
        const { data: cartons, error: getError } = await supabase
          .from('cartons')
          .select(`*, carton_vins (*)`)
          .order('ordre', { ascending: true })

        if (getError) {
          console.error('Erreur GET cartons:', getError)
          return res.status(200).json([])
        }
        
        const formattedCartons = (cartons || []).map(c => ({
          ...c,
          vins: (c.carton_vins || []).sort((a, b) => (a.ordre || 0) - (b.ordre || 0)).map(v => ({
            id: v.id,
            nom: v.nom,
            prix: v.prix,
            domaine: v.domaine || '',
            quantite: v.quantite || 2
          }))
        }))
        
        return res.status(200).json(formattedCartons)

      case 'POST':
        const { vins: newVins, ...cartonData } = req.body
        
        // Préparer les vins avec quantité par défaut
        const vinsAvecQuantite = (newVins || []).map(v => ({
          ...v,
          quantite: v.quantite || 2
        }))
        
        // Calculer le prix automatiquement à partir des vins
        const prixCalcule = calculerPrixCarton(vinsAvecQuantite)
        
        const { data: newCarton, error: postError } = await supabase
          .from('cartons')
          .insert({
            slug: cartonData.slug || cartonData.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            nom: cartonData.nom,
            region: cartonData.region,
            type: cartonData.type,
            badge: `${cartonData.type.charAt(0).toUpperCase() + cartonData.type.slice(1)} • ${cartonData.nom.includes('Prestige') ? 'Prestige' : 'Découverte'}`,
            prix: prixCalcule,
            active: true,
            ordre: cartonData.ordre || 99
          })
          .select()
          .single()

        if (postError) {
          console.error('Erreur POST carton:', postError)
          return res.status(500).json({ error: postError.message })
        }

        if (vinsAvecQuantite.length > 0) {
          const vinsToInsert = vinsAvecQuantite.map((vin, index) => ({
            carton_id: newCarton.id,
            nom: vin.nom,
            domaine: vin.domaine || null,
            prix: parseFloat(String(vin.prix).replace('€', '').replace(',', '.')) || 0,
            quantite: vin.quantite || 2,
            ordre: index + 1
          })).filter(v => v.nom)

          if (vinsToInsert.length > 0) {
            await supabase.from('carton_vins').insert(vinsToInsert)
          }
        }

        return res.status(201).json({ ...newCarton, prixCalcule })

      case 'PUT':
        const { id, vins: updateVins, carton_vins, ...updateData } = req.body
        
        // Préparer les vins avec quantité par défaut
        const vinsUpdateAvecQuantite = (updateVins || []).map(v => ({
          ...v,
          quantite: v.quantite || 2
        }))
        
        // Calculer le prix automatiquement à partir des vins
        const prixUpdate = calculerPrixCarton(vinsUpdateAvecQuantite)
        
        const { data: updatedCarton, error: putError } = await supabase
          .from('cartons')
          .update({
            slug: updateData.slug,
            nom: updateData.nom,
            region: updateData.region,
            type: updateData.type,
            badge: `${updateData.type.charAt(0).toUpperCase() + updateData.type.slice(1)} • ${updateData.nom.includes('Prestige') ? 'Prestige' : 'Découverte'}`,
            prix: prixUpdate,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()

        if (putError) {
          console.error('Erreur PUT carton:', putError)
          return res.status(500).json({ error: putError.message })
        }

        if (vinsUpdateAvecQuantite) {
          await supabase.from('carton_vins').delete().eq('carton_id', id)
          
          const vinsToInsert = vinsUpdateAvecQuantite.map((vin, index) => ({
            carton_id: id,
            nom: vin.nom,
            domaine: vin.domaine || null,
            prix: parseFloat(String(vin.prix).replace('€', '').replace(',', '.')) || 0,
            quantite: vin.quantite || 2,
            ordre: index + 1
          })).filter(v => v.nom)

          if (vinsToInsert.length > 0) {
            await supabase.from('carton_vins').insert(vinsToInsert)
          }
        }

        return res.status(200).json({ ...updatedCarton, prixCalcule: prixUpdate })

      case 'DELETE':
        const { id: deleteId } = req.body
        const { error: deleteError } = await supabase
          .from('cartons')
          .delete()
          .eq('id', deleteId)

        if (deleteError) {
          console.error('Erreur DELETE carton:', deleteError)
          return res.status(500).json({ error: deleteError.message })
        }
        return res.status(200).json({ success: true })

      default:
        return res.status(405).json({ error: `Méthode ${method} non autorisée` })
    }
  } catch (error) {
    console.error('Erreur API cartons:', error)
    return res.status(500).json({ error: error.message })
  }
}

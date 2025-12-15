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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  try {
    const { data: intentions, error: intentionsError } = await supabase
      .from('intentions')
      .select('*')

    const intentionsList = intentionsError ? [] : (intentions || [])

    const { data: cartons, error: cartonsError } = await supabase
      .from('cartons')
      .select(`*, carton_vins (*)`)
      .order('ordre', { ascending: true })

    const cartonsList = cartonsError ? [] : (cartons || [])

    const totalIntentions = intentionsList.length
    const paidIntentions = intentionsList.filter(i => i.status === 'paid').length
    const pendingIntentions = intentionsList.filter(i => i.status === 'pending').length
    
    const uniqueEmails = [...new Set(intentionsList.map(i => i.email))]
    const totalClients = uniqueEmails.length

    const statsByCaisse = {}
    cartonsList.forEach(carton => {
      const caisseIntentions = intentionsList.filter(i => i.caisse === carton.slug)
      statsByCaisse[carton.slug] = {
        carton: carton,
        total: caisseIntentions.length,
        paid: caisseIntentions.filter(i => i.status === 'paid').length,
        pending: caisseIntentions.filter(i => i.status === 'pending').length,
        readyToOrder: caisseIntentions.length >= 3,
        readyToBuy: caisseIntentions.filter(i => i.status === 'paid').length >= 3
      }
    })

    let potentialRevenue = 0
    let actualRevenue = 0
    intentionsList.forEach(i => {
      const carton = cartonsList.find(c => c.slug === i.caisse)
      if (carton) {
        potentialRevenue += carton.prix
        if (i.status === 'paid') {
          actualRevenue += carton.prix
        }
      }
    })

    const ordersReady = Object.values(statsByCaisse).filter(s => s.readyToBuy)

    res.status(200).json({
      totalIntentions,
      paidIntentions,
      pendingIntentions,
      totalClients,
      totalCartons: cartonsList.length,
      potentialRevenue,
      actualRevenue,
      statsByCaisse,
      ordersReady: ordersReady.length,
      cartons: cartonsList
    })

  } catch (error) {
    console.error('Erreur API stats:', error)
    return res.status(200).json({
      totalIntentions: 0,
      paidIntentions: 0,
      pendingIntentions: 0,
      totalClients: 0,
      totalCartons: 0,
      potentialRevenue: 0,
      actualRevenue: 0,
      statsByCaisse: {},
      ordersReady: 0,
      cartons: []
    })
  }
}

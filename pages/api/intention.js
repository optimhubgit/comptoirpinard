import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { name, email, phone, cartons, message } = req.body

  // cartons est maintenant un objet { slug: quantité }
  if (!name || !email || !cartons || typeof cartons !== 'object') {
    return res.status(400).json({ error: 'Données manquantes' })
  }

  // Convertir l'objet en liste avec quantités
  const cartonsWithQty = Object.entries(cartons)
    .filter(([_, qty]) => qty > 0)
    .map(([slug, qty]) => ({ slug, qty }))

  if (cartonsWithQty.length === 0) {
    return res.status(400).json({ error: 'Aucune caisse sélectionnée' })
  }

  try {
    // Récupérer les infos des cartons
    const slugs = cartonsWithQty.map(c => c.slug)
    const { data: cartonsData } = await supabase
      .from('cartons')
      .select('*')
      .in('slug', slugs)

    const caissesInfo = {}
    cartonsData?.forEach(c => {
      caissesInfo[c.slug] = { nom: c.nom, prix: c.prix, type: c.type }
    })

    const results = []
    const lotsCompleted = []

    // Traiter chaque caisse avec sa quantité
    for (const { slug: carton, qty } of cartonsWithQty) {
      // Pour chaque unité de cette caisse
      for (let i = 0; i < qty; i++) {
        // Trouver le numéro de lot en cours (non complet)
        const { data: currentLotIntentions } = await supabase
          .from('intentions')
          .select('lot_number')
          .eq('caisse', carton)
          .eq('lot_complete', false)
          .order('lot_number', { ascending: false })
          .limit(1)

        let lotNumber = 1
        if (currentLotIntentions && currentLotIntentions.length > 0) {
          lotNumber = currentLotIntentions[0].lot_number
        } else {
          // Vérifier s'il y a des lots complets pour commencer au bon numéro
          const { data: completeLots } = await supabase
            .from('intentions')
            .select('lot_number')
            .eq('caisse', carton)
            .eq('lot_complete', true)
            .order('lot_number', { ascending: false })
            .limit(1)
          
          if (completeLots && completeLots.length > 0) {
            lotNumber = completeLots[0].lot_number + 1
          }
        }

        // Insérer l'intention
        await supabase.from('intentions').insert({
          name,
          email,
          phone: phone || null,
          caisse: carton,
          lot_number: lotNumber,
          lot_complete: false,
          message: message || null,
          status: 'pending'
        })

        // Compter les intentions de ce lot
        const { count } = await supabase
          .from('intentions')
          .select('*', { count: 'exact', head: true })
          .eq('caisse', carton)
          .eq('lot_number', lotNumber)
          .eq('lot_complete', false)

        results.push({ carton, lotNumber, count, unit: i + 1 })

        // Si 3 personnes atteintes, marquer le lot comme complet
        if (count >= 3) {
          // Récupérer toutes les intentions de ce lot
          const { data: lotIntentions } = await supabase
            .from('intentions')
            .select('*')
            .eq('caisse', carton)
            .eq('lot_number', lotNumber)
            .eq('lot_complete', false)

          // Marquer le lot comme complet
          await supabase
            .from('intentions')
            .update({ lot_complete: true })
            .eq('caisse', carton)
            .eq('lot_number', lotNumber)

          const info = caissesInfo[carton]
          lotsCompleted.push({ carton, lotNumber, info, intentions: lotIntentions })
        }
      }
    }

    // Envoyer les emails pour les lots complétés
    for (const lot of lotsCompleted) {
      for (const intention of (lot.intentions || [])) {
        try {
          await transporter.sendMail({
            from: `"Le Club BonBouchon" <${process.env.GMAIL_USER}>`,
            to: intention.email,
            subject: `🎉 Lot #${lot.lotNumber} ${lot.info?.nom} complet ! 3 intéressés atteints`,
            html: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #4A1F24 0%, #722F37 100%); color: #FAF7F2; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1>🎉 Bonne nouvelle !</h1>
                </div>
                <div style="background: #FAF7F2; padding: 30px; border-radius: 0 0 8px 8px;">
                  <p>Bonjour <strong>${intention.name}</strong>,</p>
                  <div style="background: #d4edda; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <p style="font-size: 2rem; margin: 0;">🟢 🟢 🟢</p>
                    <p style="color: #28a745; font-weight: bold; margin: 10px 0 0;">Lot #${lot.lotNumber} complet pour ${lot.info?.nom} !</p>
                  </div>
                  <p>3 personnes sont maintenant intéressées par cette caisse. Nous allons vous envoyer très prochainement le lien de paiement.</p>
                  <p style="text-align: center; font-size: 1.5rem; color: #722F37; font-weight: bold;">${lot.info?.prix}€ TTC</p>
                  <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">Le Club BonBouchon — Sélection Noël 2025</p>
                </div>
              </div>
            `
          })
        } catch (emailError) {
          console.error('Erreur envoi email lot complet:', emailError)
        }
      }
    }

    // Préparer le récapitulatif pour l'email de confirmation
    const caissesRecap = cartonsWithQty.map(({ slug, qty }) => {
      const info = caissesInfo[slug] || { nom: slug, prix: 0 }
      return `• ${qty}× ${info.nom} - ${info.prix * qty}€ TTC`
    }).join('\n')

    const total = cartonsWithQty.reduce((sum, { slug, qty }) => {
      return sum + (caissesInfo[slug]?.prix || 0) * qty
    }, 0)

    const totalQty = cartonsWithQty.reduce((sum, { qty }) => sum + qty, 0)

    // Email de confirmation au client
    await transporter.sendMail({
      from: `"Le Club BonBouchon" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🍷 Intention enregistrée - Le Club BonBouchon',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4A1F24 0%, #722F37 100%); color: #FAF7F2; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1>🍷 Merci ${name} !</h1>
          </div>
          <div style="background: #FAF7F2; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Votre intention de commande a bien été enregistrée.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #C9A962;">
              <h3 style="margin-top: 0; color: #722F37;">Caisse(s) sélectionnée(s) :</h3>
              <pre style="font-family: Georgia, serif; white-space: pre-wrap;">${caissesRecap}</pre>
              <p style="font-size: 1.2rem; color: #722F37; font-weight: bold;">Total : ${totalQty} caisse${totalQty > 1 ? 's' : ''} — ${total}€ TTC</p>
            </div>
            <p><strong>📋 Prochaines étapes :</strong></p>
            <p>Dès que 3 personnes sont intéressées par un lot, vous recevrez un lien de paiement par email.</p>
            <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">Le Club BonBouchon — Sélection Noël 2025</p>
          </div>
        </div>
      `
    })

    // Email à l'admin
    await transporter.sendMail({
      from: `"Le Club BonBouchon" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `📝 Nouvelle intention - ${name} (${totalQty} caisse${totalQty > 1 ? 's' : ''})`,
      html: `
        <h2>Nouvelle intention de commande</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phone || 'Non renseigné'}</p>
        <p><strong>Caisse(s) :</strong></p>
        <pre>${caissesRecap}</pre>
        <p><strong>Total :</strong> ${totalQty} caisse${totalQty > 1 ? 's' : ''} — ${total}€</p>
        ${message ? `<p><strong>Message :</strong> ${message}</p>` : ''}
        <hr>
        <p><strong>Détails des lots :</strong></p>
        <ul>
          ${results.map(r => `<li>${r.carton} (unité ${r.unit}) : Lot #${r.lotNumber} - ${r.count}/3</li>`).join('')}
        </ul>
        ${lotsCompleted.length > 0 ? `<p style="color: green;"><strong>🎉 ${lotsCompleted.length} lot(s) complété(s) !</strong></p>` : ''}
      `
    })

    res.status(200).json({ success: true, results, lotsCompleted: lotsCompleted.length })

  } catch (error) {
    console.error('Erreur intention:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}

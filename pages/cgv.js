import Head from 'next/head'
import Link from 'next/link'

export default function CGV() {
  return (
    <>
      <Head>
        <title>Conditions Générales de Vente - Le Club BonBouchon</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #FAF7F2; color: #2D2D2D; line-height: 1.8; }
        .header { background: linear-gradient(135deg, #4A1F24 0%, #722F37 100%); color: white; padding: 2rem; text-align: center; }
        .header h1 { font-size: 1.75rem; margin-bottom: 0.5rem; }
        .header a { color: #C9A962; text-decoration: none; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
        h2 { color: #722F37; margin: 2rem 0 1rem; font-size: 1.25rem; border-bottom: 2px solid #C9A962; padding-bottom: 0.5rem; }
        p, ul, ol { margin-bottom: 1rem; }
        ul, ol { padding-left: 1.5rem; }
        li { margin-bottom: 0.5rem; }
        .footer { text-align: center; padding: 2rem; color: #666; font-size: 0.85rem; }
      `}</style>

      <div className="header">
        <h1>Conditions Générales de Vente</h1>
        <Link href="/">← Retour au site</Link>
      </div>

      <div className="container">
        <p><strong>Le Club BonBouchon — Sélection Noël 2025</strong></p>
        <p>Dernière mise à jour : Décembre 2025</p>

        <h2>Article 1 - Objet et champ d'application</h2>
        <p>Les présentes Conditions Générales de Vente (CGV) régissent les ventes de vins réalisées par Le Club BonBouchon dans le cadre de la sélection de Noël 2025. Toute commande implique l'acceptation sans réserve des présentes CGV.</p>

        <h2>Article 2 - Système d'achat groupé</h2>
        <p>Le Club BonBouchon fonctionne selon un système d'achat groupé :</p>
        <ol>
          <li><strong>Intention d'achat :</strong> Le client manifeste son intérêt pour une ou plusieurs caisses de vin via le formulaire en ligne.</li>
          <li><strong>Seuil de déclenchement :</strong> Pour certaines caisses, un nombre minimum de participants est requis (généralement 3 personnes). Les caisses de Champagne sont en commande directe (1 personne suffit).</li>
          <li><strong>Confirmation :</strong> Une fois le seuil atteint, les participants reçoivent un lien de paiement par email.</li>
          <li><strong>Retrait :</strong> Les caisses sont à retirer chez François à la date convenue.</li>
        </ol>
        <p><strong>Important :</strong> L'intention d'achat ne constitue pas une commande ferme. Aucun paiement n'est requis tant que le seuil n'est pas atteint.</p>

        <h2>Article 3 - Prix et paiement</h2>
        <p>Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée Stripe. La commande n'est définitive qu'après réception du paiement.</p>

        <h2>Article 4 - Livraison et retrait</h2>
        <p>Les caisses de vin sont à retirer exclusivement chez François, à l'adresse communiquée par email après confirmation de la commande. Aucune livraison n'est proposée. Le retrait doit s'effectuer aux dates indiquées (décembre 2025).</p>

        <h2>Article 5 - Droit de rétractation</h2>
        <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les vins, denrées périssables. Toutefois, tant que le seuil de participants n'est pas atteint et qu'aucun paiement n'a été effectué, le client peut annuler son intention d'achat en contactant Le Club BonBouchon.</p>

        <h2>Article 6 - Garanties et réclamations</h2>
        <p>Les vins bénéficient de la garantie légale de conformité. Toute réclamation concernant un défaut apparent doit être signalée dans les 14 jours suivant le retrait. Les bouteilles défectueuses seront échangées.</p>

        <h2>Article 7 - Responsabilité</h2>
        <p>Le Club BonBouchon s'engage à fournir des vins de qualité conformes à la description. La responsabilité est limitée au montant de la commande en cas de litige.</p>

        <h2>Article 8 - Protection des données</h2>
        <p>Les données personnelles collectées sont utilisées uniquement pour le traitement des commandes. Voir notre <Link href="/confidentialite">Politique de Confidentialité</Link> pour plus de détails.</p>

        <h2>Article 9 - Propriété intellectuelle</h2>
        <p>L'ensemble du contenu du site (textes, images, logos) est protégé par le droit de la propriété intellectuelle.</p>

        <h2>Article 10 - Litiges</h2>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront compétents.</p>

        <h2>Article 11 - Contact</h2>
        <p>Pour toute question concernant ces CGV ou votre commande, contactez Le Club BonBouchon via le formulaire du site.</p>
      </div>

      <div className="footer">
        <p>🍷 Le Club BonBouchon — Sélection Noël 2025</p>
        <p style={{ marginTop: '0.5rem' }}><Link href="/">Retour au site</Link> | <Link href="/confidentialite">Politique de Confidentialité</Link></p>
      </div>
    </>
  )
}

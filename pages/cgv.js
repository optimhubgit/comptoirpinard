import Head from 'next/head'
import Link from 'next/link'

export default function CGV() {
  return (
    <>
      <Head>
        <title>Conditions Générales de Vente | Le Club BonBouchon</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root { 
          --wine-dark: #4A1F24; 
          --wine: #722F37; 
          --gold: #C9A962; 
          --cream: #FAF7F2; 
          --text: #2D2D2D; 
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: var(--cream); color: var(--text); line-height: 1.8; }
        .header { 
          background: linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 100%); 
          color: white; 
          padding: 2rem 1.5rem; 
          text-align: center; 
        }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 0.5rem; }
        .header p { opacity: 0.9; }
        .container { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem 4rem; }
        .back-link { display: inline-block; margin-bottom: 2rem; color: var(--wine); text-decoration: none; font-weight: 500; }
        .back-link:hover { text-decoration: underline; }
        h2 { font-family: 'Playfair Display', serif; color: var(--wine-dark); font-size: 1.5rem; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--gold); }
        h3 { color: var(--wine); font-size: 1.1rem; margin: 1.5rem 0 0.75rem; }
        p { margin-bottom: 1rem; color: #444; }
        ul, ol { margin: 1rem 0 1rem 1.5rem; color: #444; }
        li { margin-bottom: 0.5rem; }
        .highlight { background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid var(--gold); margin: 1.5rem 0; }
        .highlight p { margin-bottom: 0.5rem; }
        .highlight p:last-child { margin-bottom: 0; }
        .date { font-size: 0.9rem; color: #666; margin-top: 2rem; font-style: italic; }
      `}</style>

      <header className="header">
        <h1>Conditions Générales de Vente</h1>
        <p>Le Club BonBouchon — Sélection Noël 2025</p>
      </header>

      <main className="container">
        <Link href="/" className="back-link">← Retour à l'accueil</Link>

        <h2>Article 1 — Objet et champ d'application</h2>
        <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Le Club BonBouchon (ci-après « le Vendeur ») et toute personne physique majeure effectuant une intention d'achat sur le site (ci-après « le Client »).</p>
        <p>Le Vendeur propose à la vente des caisses de vins selon un système d'achat groupé, dont les modalités sont décrites ci-après.</p>

        <h2>Article 2 — Système d'achat groupé</h2>
        
        <h3>2.1 — Principe de fonctionnement</h3>
        <p>Le Club BonBouchon fonctionne sur un système d'achat groupé qui nécessite un minimum de 3 participants par type de caisse pour déclencher la commande auprès du fournisseur.</p>
        
        <div className="highlight">
          <p><strong>Étape 1 — Intention d'achat :</strong> Le Client manifeste son intérêt pour un ou plusieurs types de caisses via le formulaire en ligne. Cette intention n'est pas un engagement ferme d'achat.</p>
          <p><strong>Étape 2 — Seuil atteint :</strong> Lorsque 3 personnes ont manifesté leur intérêt pour un même type de caisse, un email contenant le lien de paiement est envoyé à chaque participant.</p>
          <p><strong>Étape 3 — Paiement :</strong> Le Client dispose d'un délai de 7 jours pour procéder au paiement. Passé ce délai, son intention est annulée.</p>
          <p><strong>Étape 4 — Retrait :</strong> Une fois les paiements reçus, la commande est passée auprès du fournisseur. Le Client est informé de la date de retrait.</p>
        </div>

        <h3>2.2 — Annulation de l'intention</h3>
        <p>Le Client peut annuler son intention d'achat à tout moment avant de procéder au paiement, en contactant le Vendeur par email. Aucun frais ne sera facturé.</p>

        <h3>2.3 — Non-atteinte du seuil</h3>
        <p>Si le seuil de 3 participants n'est pas atteint dans un délai raisonnable (généralement 30 jours), le Vendeur se réserve le droit d'annuler les intentions en attente. Les Clients concernés en seront informés par email.</p>

        <h2>Article 3 — Prix et paiement</h2>
        
        <h3>3.1 — Prix</h3>
        <p>Les prix sont indiqués en euros, toutes taxes comprises (TTC). Le prix applicable est celui affiché au moment de la validation de l'intention d'achat.</p>

        <h3>3.2 — Modalités de paiement</h3>
        <p>Le paiement s'effectue en ligne par carte bancaire via la plateforme sécurisée Stripe. Le paiement n'est requis qu'une fois le seuil de 3 participants atteint pour le type de caisse concerné.</p>

        <h3>3.3 — Sécurité des transactions</h3>
        <p>Les transactions sont sécurisées par Stripe, prestataire certifié PCI-DSS. Le Vendeur n'a pas accès aux informations bancaires du Client.</p>

        <h2>Article 4 — Livraison et retrait</h2>
        
        <h3>4.1 — Mode de livraison</h3>
        <p>Les caisses sont à retirer exclusivement chez François, à l'adresse communiquée par email après confirmation de la commande. Aucune livraison à domicile n'est proposée.</p>

        <h3>4.2 — Délai de retrait</h3>
        <p>Le Client est informé par email de la disponibilité de sa commande et dispose d'un délai de 15 jours pour effectuer le retrait. Passé ce délai, des frais de garde pourront être facturés.</p>

        <h3>4.3 — Vérification à la réception</h3>
        <p>Le Client est invité à vérifier l'état des bouteilles lors du retrait. Toute anomalie devra être signalée immédiatement.</p>

        <h2>Article 5 — Droit de rétractation</h2>
        <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les contrats de fourniture de boissons alcoolisées dont le prix a été convenu au moment de la conclusion du contrat de vente.</p>
        <p>Toutefois, avant le paiement (étape 3), le Client peut librement annuler son intention sans frais ni justification.</p>

        <h2>Article 6 — Garanties et réclamations</h2>
        
        <h3>6.1 — Conformité des produits</h3>
        <p>Le Vendeur garantit que les vins livrés sont conformes à la description figurant sur le site. En cas de non-conformité ou de défaut avéré (bouchon défectueux, vin altéré), le Client dispose de 14 jours après le retrait pour formuler une réclamation.</p>

        <h3>6.2 — Traitement des réclamations</h3>
        <p>Toute réclamation doit être adressée par email avec photos à l'appui. Après vérification, le Vendeur procédera au remplacement de la bouteille concernée ou au remboursement.</p>

        <h2>Article 7 — Responsabilité</h2>
        <p>Le Vendeur ne saurait être tenu responsable des dommages résultant d'une mauvaise utilisation ou conservation des produits par le Client.</p>
        <p>L'abus d'alcool est dangereux pour la santé. Les produits sont destinés à des personnes majeures uniquement.</p>

        <h2>Article 8 — Données personnelles</h2>
        <p>Les données collectées sont nécessaires au traitement des commandes et sont traitées conformément à notre <Link href="/confidentialite">Politique de Confidentialité</Link>.</p>

        <h2>Article 9 — Propriété intellectuelle</h2>
        <p>L'ensemble des éléments du site (textes, images, logos) sont la propriété exclusive du Vendeur et ne peuvent être reproduits sans autorisation préalable.</p>

        <h2>Article 10 — Droit applicable et litiges</h2>
        <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée. À défaut, les tribunaux français seront compétents.</p>

        <h2>Article 11 — Contact</h2>
        <p>Pour toute question relative aux présentes CGV ou à une commande :</p>
        <ul>
          <li>Email : contact@leclubBonBouchon.fr</li>
          <li>Le Club BonBouchon — Sélection Noël 2025</li>
        </ul>

        <p className="date">Dernière mise à jour : Décembre 2025</p>
      </main>
    </>
  )
}

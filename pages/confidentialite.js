import Head from 'next/head'
import Link from 'next/link'

export default function Confidentialite() {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité - Le Club BonBouchon</title>
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
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { border: 1px solid #ddd; padding: 0.75rem; text-align: left; }
        th { background: #722F37; color: white; }
        .footer { text-align: center; padding: 2rem; color: #666; font-size: 0.85rem; }
      `}</style>

      <div className="header">
        <h1>Politique de Confidentialité</h1>
        <Link href="/">← Retour au site</Link>
      </div>

      <div className="container">
        <p><strong>Le Club BonBouchon — Sélection Noël 2025</strong></p>
        <p>Dernière mise à jour : Décembre 2025</p>
        <p>Le Club BonBouchon s'engage à protéger votre vie privée conformément au Règlement Général sur la Protection des Données (RGPD).</p>

        <h2>1. Données collectées</h2>
        <table>
          <thead>
            <tr><th>Donnée</th><th>Finalité</th><th>Base légale</th></tr>
          </thead>
          <tbody>
            <tr><td>Nom complet</td><td>Identification et retrait de commande</td><td>Exécution du contrat</td></tr>
            <tr><td>Adresse email</td><td>Communication et envoi des liens de paiement</td><td>Exécution du contrat</td></tr>
            <tr><td>Téléphone (optionnel)</td><td>Contact en cas de besoin</td><td>Intérêt légitime</td></tr>
            <tr><td>Sélection de caisses</td><td>Traitement de la commande</td><td>Exécution du contrat</td></tr>
          </tbody>
        </table>

        <h2>2. Utilisation des données</h2>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul>
          <li>Traiter vos intentions d'achat et commandes</li>
          <li>Vous informer de l'atteinte du seuil de participants</li>
          <li>Vous envoyer le lien de paiement</li>
          <li>Organiser le retrait de vos caisses</li>
        </ul>
        <p>Aucune donnée n'est utilisée à des fins commerciales ou publicitaires.</p>

        <h2>3. Destinataires des données</h2>
        <ul>
          <li><strong>Stripe :</strong> Traitement sécurisé des paiements (certifié PCI-DSS)</li>
          <li><strong>Vercel :</strong> Hébergement du site</li>
          <li><strong>Supabase :</strong> Base de données sécurisée</li>
        </ul>
        <p>Aucune donnée n'est vendue ou partagée avec des tiers à des fins commerciales.</p>

        <h2>4. Durée de conservation</h2>
        <ul>
          <li><strong>Intentions non concrétisées :</strong> 3 mois après la fin de l'opération</li>
          <li><strong>Commandes finalisées :</strong> 5 ans (obligations comptables)</li>
          <li><strong>Factures :</strong> 10 ans (obligations légales)</li>
        </ul>

        <h2>5. Sécurité des données</h2>
        <p>Nous mettons en œuvre des mesures de sécurité appropriées :</p>
        <ul>
          <li>Connexion HTTPS chiffrée</li>
          <li>Accès restreint aux données personnelles</li>
          <li>Paiements traités par Stripe (certifié PCI-DSS)</li>
          <li>Hébergement sécurisé sur des serveurs européens</li>
        </ul>

        <h2>6. Vos droits</h2>
        <p>Conformément au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données</li>
          <li><strong>Droit de rectification :</strong> Corriger vos données inexactes</li>
          <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données</li>
          <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
          <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
        </ul>
        <p>Pour exercer ces droits, contactez-nous via le formulaire du site.</p>

        <h2>7. Cookies</h2>
        <p>Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement (authentification admin). Aucun cookie de tracking ou publicitaire n'est utilisé.</p>

        <h2>8. Réclamation</h2>
        <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a></p>

        <h2>9. Contact</h2>
        <p>Pour toute question concernant cette politique de confidentialité ou vos données personnelles, contactez Le Club BonBouchon via le formulaire du site.</p>
      </div>

      <div className="footer">
        <p>🍷 Le Club BonBouchon — Sélection Noël 2025</p>
        <p style={{ marginTop: '0.5rem' }}><Link href="/">Retour au site</Link> | <Link href="/cgv">Conditions Générales de Vente</Link></p>
      </div>
    </>
  )
}

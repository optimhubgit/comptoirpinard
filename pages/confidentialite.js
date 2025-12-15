import Head from 'next/head'
import Link from 'next/link'

export default function Confidentialite() {
  return (
    <>
      <Head>
        <title>Politique de Confidentialité | Le Club BonBouchon</title>
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
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; background: white; border-radius: 8px; overflow: hidden; }
        th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
        th { background: var(--wine-dark); color: white; font-size: 0.85rem; font-weight: 600; }
        td { font-size: 0.9rem; }
        .date { font-size: 0.9rem; color: #666; margin-top: 2rem; font-style: italic; }
      `}</style>

      <header className="header">
        <h1>Politique de Confidentialité</h1>
        <p>Le Club BonBouchon — Protection de vos données</p>
      </header>

      <main className="container">
        <Link href="/" className="back-link">← Retour à l'accueil</Link>

        <h2>1. Introduction</h2>
        <p>Le Club BonBouchon (ci-après « nous », « notre », « nos ») s'engage à protéger la vie privée des utilisateurs de son site internet. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos données personnelles.</p>
        <p>En utilisant notre site et en soumettant vos informations, vous acceptez les pratiques décrites dans cette politique.</p>

        <h2>2. Responsable du traitement</h2>
        <div className="highlight">
          <p><strong>Le Club BonBouchon</strong></p>
          <p>Email : contact@leclubbonbouchon.fr</p>
          <p>Responsable : François</p>
        </div>

        <h2>3. Données collectées</h2>
        <p>Nous collectons uniquement les données nécessaires au bon fonctionnement du service d'achat groupé :</p>
        
        <table>
          <thead>
            <tr>
              <th>Donnée</th>
              <th>Finalité</th>
              <th>Base légale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nom complet</td>
              <td>Identification lors du retrait</td>
              <td>Exécution du contrat</td>
            </tr>
            <tr>
              <td>Adresse email</td>
              <td>Communications relatives à la commande</td>
              <td>Exécution du contrat</td>
            </tr>
            <tr>
              <td>Numéro de téléphone</td>
              <td>Contact en cas de besoin (optionnel)</td>
              <td>Consentement</td>
            </tr>
            <tr>
              <td>Choix de caisses</td>
              <td>Traitement de l'intention d'achat</td>
              <td>Exécution du contrat</td>
            </tr>
            <tr>
              <td>Message (optionnel)</td>
              <td>Questions ou commentaires</td>
              <td>Consentement</td>
            </tr>
          </tbody>
        </table>

        <h2>4. Utilisation des données</h2>
        <p>Vos données personnelles sont utilisées exclusivement pour :</p>
        <ul>
          <li>Gérer votre intention d'achat et suivre l'atteinte du seuil de participants</li>
          <li>Vous envoyer le lien de paiement lorsque le seuil est atteint</li>
          <li>Vous informer de la disponibilité de votre commande</li>
          <li>Vous contacter en cas de question ou problème</li>
          <li>Établir les factures et documents comptables</li>
        </ul>
        <p>Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers à des fins commerciales.</p>

        <h2>5. Destinataires des données</h2>
        <p>Vos données peuvent être transmises à :</p>
        <ul>
          <li><strong>Stripe</strong> : pour le traitement sécurisé des paiements (Stripe ne reçoit que les données nécessaires au paiement)</li>
          <li><strong>Notre hébergeur (Vercel)</strong> : pour l'hébergement technique du site</li>
          <li><strong>Notre base de données (Supabase)</strong> : pour le stockage sécurisé des intentions</li>
        </ul>
        <p>Ces prestataires sont soumis à des obligations de confidentialité et de sécurité.</p>

        <h2>6. Durée de conservation</h2>
        <table>
          <thead>
            <tr>
              <th>Type de données</th>
              <th>Durée de conservation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Intentions non concrétisées</td>
              <td>3 mois après la fin de l'opération</td>
            </tr>
            <tr>
              <td>Données des commandes effectuées</td>
              <td>5 ans (obligations comptables)</td>
            </tr>
            <tr>
              <td>Données de facturation</td>
              <td>10 ans (obligations légales)</td>
            </tr>
          </tbody>
        </table>

        <h2>7. Sécurité des données</h2>
        <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
        <ul>
          <li>Chiffrement des données en transit (HTTPS/TLS)</li>
          <li>Base de données sécurisée avec accès restreint</li>
          <li>Paiements traités par Stripe (certifié PCI-DSS)</li>
          <li>Mots de passe administrateur sécurisés</li>
        </ul>

        <h2>8. Vos droits</h2>
        <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
          <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
          <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
          <li><strong>Droit à la limitation :</strong> restreindre le traitement de vos données</li>
          <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
          <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
        </ul>
        <p>Pour exercer ces droits, contactez-nous à : contact@leclubbonbouchon.fr</p>
        <p>Nous répondrons à votre demande dans un délai d'un mois.</p>

        <h2>9. Cookies</h2>
        <p>Notre site utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du site. Ces cookies ne nécessitent pas votre consentement.</p>
        <p>Nous n'utilisons pas de cookies publicitaires ni de trackers tiers.</p>

        <h2>10. Modifications de la politique</h2>
        <p>Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entreront en vigueur dès leur publication sur le site. Nous vous encourageons à consulter régulièrement cette page.</p>

        <h2>11. Réclamation</h2>
        <p>Si vous estimez que le traitement de vos données personnelles constitue une violation de vos droits, vous pouvez introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :</p>
        <ul>
          <li>Site web : www.cnil.fr</li>
          <li>Adresse : 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</li>
        </ul>

        <h2>12. Contact</h2>
        <p>Pour toute question concernant cette politique de confidentialité ou vos données personnelles :</p>
        <div className="highlight">
          <p><strong>Email :</strong> contact@leclubbonbouchon.fr</p>
          <p><strong>Objet :</strong> Demande relative aux données personnelles</p>
        </div>

        <p className="date">Dernière mise à jour : Décembre 2025</p>
      </main>
    </>
  )
}

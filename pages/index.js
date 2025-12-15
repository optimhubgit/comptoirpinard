import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [counts, setCounts] = useState({})
  const [caissesData, setCaissesData] = useState([])
  const [loadingCartons, setLoadingCartons] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cartons: [], message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCartons()
    fetchCounts()
  }, [])

  const fetchCartons = async () => {
    try {
      const res = await fetch('/api/cartons')
      const data = await res.json()
      setCaissesData(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Erreur chargement cartons:', err)
      setCaissesData([])
    } finally {
      setLoadingCartons(false)
    }
  }

  const fetchCounts = async () => {
    try {
      const res = await fetch('/api/counts')
      const data = await res.json()
      setCounts(data || {})
    } catch (err) {
      console.error('Erreur chargement compteurs:', err)
    }
  }

  const handleCheckboxChange = (cartonSlug) => {
    setFormData(prev => ({
      ...prev,
      cartons: prev.cartons.includes(cartonSlug)
        ? prev.cartons.filter(slug => slug !== cartonSlug)
        : [...prev.cartons, cartonSlug]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/intention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', cartons: [], message: '' })
        fetchCounts()
      } else {
        setError(data.error || 'Une erreur est survenue')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const filteredCaisses = caissesData.filter(c => filter === 'all' || c.type === filter)

  return (
    <>
      <Head>
        <title>Sélection Pinard Noël 2024 | Club Vins Entre Amis</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root { 
          --wine-dark: #4A1F24; 
          --wine: #722F37; 
          --wine-light: #8B4049; 
          --gold: #C9A962; 
          --cream: #FAF7F2; 
          --text: #2D2D2D; 
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: var(--cream); color: var(--text); line-height: 1.6; }
        
        /* HERO */
        .hero { 
          background: linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 100%); 
          color: var(--cream); 
          padding: 3rem 1.5rem; 
          text-align: center; 
        }
        .hero h1 { 
          font-family: 'Playfair Display', serif; 
          font-size: clamp(1.75rem, 5vw, 3rem); 
          margin-bottom: 1rem; 
          line-height: 1.2;
        }
        .hero p { 
          font-size: clamp(0.9rem, 2.5vw, 1.1rem); 
          opacity: 0.9; 
          max-width: 600px; 
          margin: 0 auto 1.5rem; 
          line-height: 1.6;
        }
        .badge-hero { 
          display: inline-block; 
          background: var(--gold); 
          color: var(--wine-dark); 
          padding: 0.5rem 1.25rem; 
          border-radius: 30px; 
          font-weight: 600; 
          font-size: 0.85rem; 
        }
        
        /* CONTAINER */
        .container { 
          max-width: 1200px; 
          margin: 0 auto; 
          padding: 2rem 1rem; 
        }
        
        /* SECTIONS */
        .section-title { 
          font-family: 'Playfair Display', serif; 
          font-size: clamp(1.5rem, 4vw, 2rem); 
          text-align: center; 
          margin-bottom: 0.5rem; 
          color: var(--wine-dark); 
        }
        .section-subtitle { 
          text-align: center; 
          color: #666; 
          margin-bottom: 2rem; 
          font-size: clamp(0.85rem, 2vw, 1rem);
          padding: 0 1rem;
        }
        
        /* FILTERS */
        .filters { 
          display: flex; 
          justify-content: center; 
          gap: 0.75rem; 
          margin-bottom: 2rem; 
          flex-wrap: wrap; 
          padding: 0 0.5rem;
        }
        .filter-btn { 
          padding: 0.6rem 1.25rem; 
          border: 2px solid var(--wine); 
          background: transparent; 
          color: var(--wine); 
          border-radius: 30px; 
          cursor: pointer; 
          font-weight: 500; 
          transition: all 0.3s; 
          font-size: 0.9rem;
          font-family: inherit;
        }
        .filter-btn:hover, .filter-btn.active { 
          background: var(--wine); 
          color: white; 
        }
        
        /* GRID CAISSES */
        .caisses-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 1.5rem; 
        }
        
        /* CARTE CAISSE */
        .caisse-card { 
          background: white; 
          border-radius: 16px; 
          overflow: hidden; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
          transition: transform 0.3s, box-shadow 0.3s; 
          display: flex;
          flex-direction: column;
        }
        .caisse-card:hover { 
          transform: translateY(-5px); 
          box-shadow: 0 12px 40px rgba(0,0,0,0.12); 
        }
        
        /* HEADER CARTE */
        .caisse-header { 
          background: linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 100%); 
          color: white; 
          padding: 1.25rem; 
          padding-top: 2.5rem;
          position: relative; 
        }
        .caisse-header.blanc { 
          background: linear-gradient(135deg, #8B7355 0%, #A08060 100%); 
        }
        
        /* BADGE - CORRIGÉ */
        .caisse-badge { 
          position: absolute; 
          top: 0.75rem; 
          right: 0.75rem; 
          background: var(--gold); 
          color: var(--wine-dark); 
          padding: 0.2rem 0.6rem; 
          border-radius: 15px; 
          font-size: 0.7rem; 
          font-weight: 600; 
          white-space: nowrap;
          max-width: calc(100% - 1.5rem);
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .caisse-title { 
          font-family: 'Playfair Display', serif; 
          font-size: 1.25rem; 
          margin-bottom: 0.25rem; 
          line-height: 1.3;
          padding-right: 0.5rem;
        }
        .caisse-region { 
          opacity: 0.9; 
          font-size: 0.85rem; 
        }
        
        /* BODY CARTE */
        .caisse-body { 
          padding: 1.25rem; 
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .caisse-price { 
          font-size: 2rem; 
          font-weight: 700; 
          color: var(--wine); 
          margin-bottom: 0.25rem; 
        }
        .caisse-price span { 
          font-size: 0.9rem; 
          font-weight: 400; 
          color: #666; 
        }
        
        /* LISTE VINS */
        .caisse-vins { 
          margin: 1rem 0; 
          flex: 1;
        }
        .caisse-vins h4 { 
          font-size: 0.75rem; 
          text-transform: uppercase; 
          letter-spacing: 0.1em; 
          color: #888; 
          margin-bottom: 0.5rem; 
        }
        .vin-item { 
          display: flex; 
          justify-content: space-between; 
          align-items: flex-start;
          padding: 0.4rem 0; 
          border-bottom: 1px solid #eee; 
          font-size: 0.85rem; 
          gap: 0.5rem;
        }
        .vin-item:last-child { border-bottom: none; }
        .vin-name { 
          flex: 1; 
          min-width: 0;
        }
        .vin-domaine { 
          color: #888; 
          font-size: 0.75rem; 
          margin-top: 0.1rem;
        }
        .vin-price { 
          color: var(--wine); 
          font-weight: 500; 
          white-space: nowrap;
          flex-shrink: 0;
        }
        
        /* PROGRESS BAR */
        .progress-bar { 
          background: #eee; 
          border-radius: 10px; 
          height: 8px; 
          margin: 1rem 0 0.5rem; 
          overflow: hidden; 
        }
        .progress-fill { 
          height: 100%; 
          background: linear-gradient(90deg, var(--wine) 0%, var(--gold) 100%); 
          border-radius: 10px; 
          transition: width 0.5s; 
        }
        .progress-text { 
          display: flex; 
          justify-content: space-between; 
          font-size: 0.8rem; 
          color: #666; 
          margin-bottom: 1rem;
        }
        
        /* BOUTON SELECTION */
        .caisse-select { 
          width: 100%; 
          padding: 0.9rem; 
          background: var(--wine); 
          color: white; 
          border: none; 
          border-radius: 8px; 
          font-size: 0.95rem; 
          font-weight: 600; 
          cursor: pointer; 
          transition: background 0.3s; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 0.5rem; 
          font-family: inherit;
          margin-top: auto;
        }
        .caisse-select:hover { background: var(--wine-dark); }
        .caisse-select.selected { background: var(--gold); color: var(--wine-dark); }
        
        /* FORMULAIRE */
        .form-section { 
          background: white; 
          border-radius: 16px; 
          padding: 1.5rem; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
          margin-top: 2.5rem; 
        }
        .form-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
          gap: 1rem; 
        }
        .form-group { margin-bottom: 0.75rem; }
        .form-group label { 
          display: block; 
          font-weight: 500; 
          margin-bottom: 0.4rem; 
          color: var(--wine-dark); 
          font-size: 0.9rem;
        }
        .form-group input, .form-group textarea { 
          width: 100%; 
          padding: 0.85rem; 
          border: 2px solid #eee; 
          border-radius: 8px; 
          font-size: 1rem; 
          transition: border-color 0.3s; 
          font-family: inherit; 
        }
        .form-group input:focus, .form-group textarea:focus { 
          outline: none; 
          border-color: var(--wine); 
        }
        .submit-btn { 
          width: 100%; 
          padding: 1rem; 
          background: linear-gradient(135deg, var(--wine) 0%, var(--wine-dark) 100%); 
          color: white; 
          border: none; 
          border-radius: 8px; 
          font-size: 1rem; 
          font-weight: 600; 
          cursor: pointer; 
          transition: transform 0.2s, box-shadow 0.2s; 
          margin-top: 0.75rem;
          font-family: inherit;
        }
        .submit-btn:hover:not(:disabled) { 
          transform: translateY(-2px); 
          box-shadow: 0 8px 25px rgba(114, 47, 55, 0.3); 
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        /* MESSAGES */
        .success-message { 
          background: #d4edda; 
          color: #155724; 
          padding: 2rem; 
          border-radius: 8px; 
          text-align: center; 
        }
        .error-message { 
          background: #f8d7da; 
          color: #721c24; 
          padding: 1rem; 
          border-radius: 8px; 
          margin-bottom: 1rem; 
        }
        .selected-summary { 
          background: var(--cream); 
          padding: 1rem; 
          border-radius: 8px; 
          margin-bottom: 1rem; 
        }
        .selected-summary h4 { 
          color: var(--wine-dark); 
          margin-bottom: 0.5rem; 
          font-size: 0.95rem;
        }
        
        /* HOW IT WORKS */
        .how-it-works { 
          background: var(--wine-dark); 
          color: white; 
          padding: 3rem 1.5rem; 
          margin-top: 3rem; 
        }
        .steps { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 1.5rem; 
          max-width: 1000px; 
          margin: 2rem auto 0; 
        }
        .step { text-align: center; }
        .step-number { 
          width: 45px; 
          height: 45px; 
          background: var(--gold); 
          color: var(--wine-dark); 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 700; 
          font-size: 1.1rem; 
          margin: 0 auto 0.75rem; 
        }
        .step h3 { 
          margin-bottom: 0.4rem; 
          font-size: 1rem;
        }
        .step p { 
          opacity: 0.8; 
          font-size: 0.85rem; 
          line-height: 1.5;
        }
        
        /* FOOTER */
        footer { 
          text-align: center; 
          padding: 1.5rem; 
          color: #666; 
          font-size: 0.85rem; 
        }
        
        /* RESPONSIVE */
        @media (max-width: 600px) { 
          .hero { padding: 2rem 1rem; }
          .container { padding: 1.5rem 0.75rem; }
          .caisses-grid { 
            grid-template-columns: 1fr; 
            gap: 1rem;
          }
          .caisse-header {
            padding: 1rem;
            padding-top: 2.25rem;
          }
          .caisse-title { font-size: 1.1rem; }
          .caisse-body { padding: 1rem; }
          .caisse-price { font-size: 1.75rem; }
          .form-section { padding: 1.25rem; }
          .form-grid { grid-template-columns: 1fr; }
          .steps { grid-template-columns: 1fr 1fr; }
          .filter-btn { 
            padding: 0.5rem 1rem; 
            font-size: 0.85rem; 
          }
        }
        
        @media (max-width: 400px) {
          .steps { grid-template-columns: 1fr; }
          .badge-hero { 
            font-size: 0.75rem; 
            padding: 0.4rem 1rem; 
          }
        }
      `}</style>

      <header className="hero">
        <h1>🍷 Sélection Pinard Noël 2024</h1>
        <p>Caisses de 6 bouteilles sélectionnées par François, à partager entre amis. Système d'achat groupé : 3 personnes minimum par type de caisse.</p>
        <span className="badge-hero">Retrait chez François • Décembre 2024</span>
      </header>

      <main className="container">
        <h2 className="section-title">Nos Caisses</h2>
        <p className="section-subtitle">Sélectionnez un ou plusieurs types de caisse pour manifester votre intérêt</p>

        <div className="filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Toutes</button>
          <button className={`filter-btn ${filter === 'rouge' ? 'active' : ''}`} onClick={() => setFilter('rouge')}>🍷 Rouges</button>
          <button className={`filter-btn ${filter === 'blanc' ? 'active' : ''}`} onClick={() => setFilter('blanc')}>🥂 Blancs</button>
        </div>

        {loadingCartons ? (
          <p style={{ textAlign: 'center' }}>Chargement des caisses...</p>
        ) : filteredCaisses.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Aucune caisse disponible pour le moment.</p>
        ) : (
          <div className="caisses-grid">
            {filteredCaisses.map((caisse) => {
              const count = counts[caisse.slug] || 0
              const progress = Math.min((count / 3) * 100, 100)
              const isSelected = formData.cartons.includes(caisse.slug)

              return (
                <div key={caisse.slug} className="caisse-card">
                  <div className={`caisse-header ${caisse.type}`}>
                    <span className="caisse-badge">{caisse.badge}</span>
                    <h3 className="caisse-title">{caisse.nom}</h3>
                    <p className="caisse-region">{caisse.region}</p>
                  </div>
                  <div className="caisse-body">
                    <div className="caisse-price">{caisse.prix}€ <span>TTC la caisse</span></div>
                    
                    <div className="caisse-vins">
                      <h4>Composition (6 bouteilles)</h4>
                      {(caisse.vins || []).map((vin, i) => (
                        <div key={i} className="vin-item">
                          <div className="vin-name">
                            2× {vin.nom}
                            {vin.domaine && <div className="vin-domaine">{vin.domaine}</div>}
                          </div>
                          <div className="vin-price">{vin.prix}€</div>
                        </div>
                      ))}
                    </div>

                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className="progress-text">
                      <span>{count}/3 intéressés</span>
                      <span>{count >= 3 ? '✅ Objectif atteint !' : `${3 - count} de plus`}</span>
                    </div>

                    <button 
                      className={`caisse-select ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleCheckboxChange(caisse.slug)}
                    >
                      {isSelected ? '✓ Sélectionnée' : 'Je suis intéressé(e)'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {success ? (
          <div className="form-section success-message">
            <h3>🎉 Merci pour votre intention !</h3>
            <p>Vous recevrez un email de confirmation. Dès que 3 personnes seront intéressées par un type de caisse, nous vous enverrons le lien de paiement.</p>
            <button className="submit-btn" onClick={() => setSuccess(false)} style={{ marginTop: '1rem', maxWidth: '300px' }}>
              Nouvelle sélection
            </button>
          </div>
        ) : (
          <form className="form-section" onSubmit={handleSubmit} id="form">
            <h2 className="section-title">Valider mon intention</h2>
            <p className="section-subtitle">Remplissez vos coordonnées pour manifester votre intérêt</p>

            {error && <div className="error-message">{error}</div>}

            {formData.cartons.length > 0 && (
              <div className="selected-summary">
                <h4>Type(s) de caisse sélectionné(s) :</h4>
                {formData.cartons.map(slug => {
                  const caisse = caissesData.find(c => c.slug === slug)
                  return <div key={slug}>• {caisse?.nom} - {caisse?.prix}€</div>
                })}
                <strong style={{ display: 'block', marginTop: '0.5rem', color: 'var(--wine)' }}>
                  Total : {formData.cartons.reduce((sum, slug) => sum + (caissesData.find(c => c.slug === slug)?.prix || 0), 0)}€
                </strong>
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Nom complet *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Votre nom" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="votre@email.com" />
              </div>
              <div className="form-group">
                <label>Téléphone</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="06 12 34 56 78" />
              </div>
            </div>
            <div className="form-group">
              <label>Message (optionnel)</label>
              <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} placeholder="Une question ? Un commentaire ?"></textarea>
            </div>
            <button type="submit" className="submit-btn" disabled={loading || formData.cartons.length === 0}>
              {loading ? 'Envoi en cours...' : formData.cartons.length === 0 ? 'Sélectionnez au moins un type de caisse' : `Valider mon intention (${formData.cartons.length} caisse${formData.cartons.length > 1 ? 's' : ''})`}
            </button>
          </form>
        )}
      </main>

      <section className="how-it-works">
        <h2 className="section-title" style={{ color: 'white' }}>Comment ça marche ?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Choisissez</h3>
            <p>Sélectionnez les types de caisse qui vous intéressent et remplissez le formulaire.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Attendez</h3>
            <p>Dès que 3 personnes sont intéressées par un type de caisse, vous recevez le lien de paiement.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Payez</h3>
            <p>Réglez votre caisse en ligne. La commande est passée une fois les 3 paiements reçus.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Récupérez</h3>
            <p>Venez chercher votre caisse chez François en décembre. Santé !</p>
          </div>
        </div>
      </section>

      <footer>
        <p>🍷 Sélection Pinard Noël 2024 — Vins sélectionnés par François</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</p>
      </footer>
    </>
  )
}

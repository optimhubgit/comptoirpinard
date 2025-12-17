import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [filter, setFilter] = useState('all')
  const [counts, setCounts] = useState({})
  const [caissesData, setCaissesData] = useState([])
  const [loadingCartons, setLoadingCartons] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', cartons: {}, message: '', acceptCgv: false })
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

  const updateQuantity = (cartonSlug, delta) => {
    setFormData(prev => {
      const currentQty = prev.cartons[cartonSlug] || 0
      const newQty = Math.max(0, Math.min(10, currentQty + delta))
      const newCartons = { ...prev.cartons }
      if (newQty === 0) {
        delete newCartons[cartonSlug]
      } else {
        newCartons[cartonSlug] = newQty
      }
      return { ...prev, cartons: newCartons }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.acceptCgv) {
      setError('Veuillez accepter les Conditions Générales de Vente')
      return
    }
    const selectedCartons = Object.keys(formData.cartons).filter(k => formData.cartons[k] > 0)
    if (selectedCartons.length === 0) {
      setError('Veuillez sélectionner au moins une caisse')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/intention', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, cartons: formData.cartons })
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
        setFormData({ name: '', email: '', phone: '', cartons: {}, message: '', acceptCgv: false })
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
  const totalCaisses = Object.values(formData.cartons).reduce((sum, qty) => sum + qty, 0)
  const totalPrix = Object.entries(formData.cartons).reduce((sum, [slug, qty]) => {
    const caisse = caissesData.find(c => c.slug === slug)
    return sum + (caisse?.prix || 0) * qty
  }, 0)

  return (
    <>
      <Head>
        <title>Le Club BonBouchon | Sélection Vins Noël 2025</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Achat groupé de vins de qualité entre amis. Caisses de 6 bouteilles sélectionnées par François." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        :root { --wine-dark: #4A1F24; --wine: #722F37; --wine-light: #8B4049; --gold: #C9A962; --cream: #FAF7F2; --text: #2D2D2D; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: var(--cream); color: var(--text); line-height: 1.6; }
        .hero { background: linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 100%); color: var(--cream); padding: 3rem 1.5rem; text-align: center; }
        .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(1.75rem, 5vw, 3rem); margin-bottom: 1rem; line-height: 1.2; }
        .hero p { font-size: clamp(0.9rem, 2.5vw, 1.1rem); opacity: 0.9; max-width: 600px; margin: 0 auto 1.5rem; line-height: 1.6; }
        .badge-hero { display: inline-block; background: var(--gold); color: var(--wine-dark); padding: 0.5rem 1.25rem; border-radius: 30px; font-weight: 600; font-size: 0.85rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1rem; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 4vw, 2rem); text-align: center; margin-bottom: 0.5rem; color: var(--wine-dark); }
        .section-subtitle { text-align: center; color: #666; margin-bottom: 2rem; font-size: clamp(0.85rem, 2vw, 1rem); padding: 0 1rem; }
        .about-section { background: white; border-radius: 16px; padding: 2rem; margin-bottom: 2.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .about-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; }
        .about-text p { margin-bottom: 1rem; color: #555; font-size: 0.95rem; line-height: 1.7; }
        .about-text p:last-child { margin-bottom: 0; }
        .about-highlight { background: linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 100%); color: white; padding: 2rem; border-radius: 12px; text-align: center; }
        .about-highlight h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 1rem; }
        .about-highlight p { opacity: 0.9; font-size: 0.9rem; line-height: 1.6; }
        .domaines-list { margin-top: 1rem; font-size: 0.8rem; opacity: 0.8; }
        .filters { display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap; padding: 0 0.5rem; }
        .filter-btn { padding: 0.6rem 1.25rem; border: 2px solid var(--wine); background: transparent; color: var(--wine); border-radius: 30px; cursor: pointer; font-weight: 500; transition: all 0.3s; font-size: 0.9rem; font-family: inherit; }
        .filter-btn:hover, .filter-btn.active { background: var(--wine); color: white; }
        .caisses-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .caisse-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
        .caisse-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
        .caisse-header { background: linear-gradient(135deg, var(--wine-dark) 0%, var(--wine) 100%); color: white; padding: 1.25rem; padding-top: 2.5rem; position: relative; }
        .caisse-header.blanc { background: linear-gradient(135deg, #8B7355 0%, #A08060 100%); }
        .caisse-header.rose { background: linear-gradient(135deg, #B56576 0%, #E56B6F 100%); }
        .caisse-badge { position: absolute; top: 0.75rem; right: 0.75rem; background: var(--gold); color: var(--wine-dark); padding: 0.2rem 0.6rem; border-radius: 15px; font-size: 0.7rem; font-weight: 600; white-space: nowrap; }
        .caisse-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; margin-bottom: 0.25rem; line-height: 1.3; }
        .caisse-region { opacity: 0.9; font-size: 0.85rem; }
        .caisse-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
        .caisse-price { font-size: 2rem; font-weight: 700; color: var(--wine); margin-bottom: 0.25rem; }
        .caisse-price span { font-size: 0.9rem; font-weight: 400; color: #666; }
        .lots-info { background: #e8f5e9; color: #2e7d32; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.75rem; text-align: center; }
        .direct-order { background: #fff3e0; color: #e65100; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.75rem; text-align: center; }
        .caisse-vins { margin: 1rem 0; flex: 1; }
        .caisse-vins h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 0.5rem; }
        .vin-item { display: flex; justify-content: space-between; align-items: flex-start; padding: 0.4rem 0; border-bottom: 1px solid #eee; font-size: 0.85rem; gap: 0.5rem; }
        .vin-item:last-child { border-bottom: none; }
        .vin-name { flex: 1; min-width: 0; }
        .vin-domaine { color: #888; font-size: 0.75rem; margin-top: 0.1rem; }
        .vin-price { color: var(--wine); font-weight: 500; white-space: nowrap; flex-shrink: 0; }
        .progress-bar { background: #eee; border-radius: 10px; height: 8px; margin: 1rem 0 0.5rem; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, var(--wine) 0%, var(--gold) 100%); border-radius: 10px; transition: width 0.5s; }
        .progress-text { display: flex; justify-content: space-between; font-size: 0.8rem; color: #666; margin-bottom: 1rem; }
        .quantity-selector { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: auto; }
        .qty-btn { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--wine); background: white; color: var(--wine); font-size: 1.5rem; font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; font-family: inherit; line-height: 1; }
        .qty-btn:hover:not(:disabled) { background: var(--wine); color: white; }
        .qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .qty-display { min-width: 80px; text-align: center; font-size: 1.1rem; font-weight: 600; color: #888; padding: 0.5rem; }
        .qty-display.has-qty { background: var(--gold); color: var(--wine-dark); border-radius: 8px; font-weight: 700; }
        .form-section { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-top: 2.5rem; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
        .form-group { margin-bottom: 0.75rem; }
        .form-group label { display: block; font-weight: 500; margin-bottom: 0.4rem; color: var(--wine-dark); font-size: 0.9rem; }
        .form-group input, .form-group textarea { width: 100%; padding: 0.85rem; border: 2px solid #eee; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; font-family: inherit; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--wine); }
        .checkbox-group { display: flex; align-items: flex-start; gap: 0.75rem; margin: 1.25rem 0; padding: 1rem; background: #f9f9f9; border-radius: 8px; }
        .checkbox-group input[type="checkbox"] { width: 20px; height: 20px; margin-top: 0.1rem; cursor: pointer; accent-color: var(--wine); }
        .checkbox-group label { font-size: 0.9rem; color: #555; cursor: pointer; line-height: 1.5; }
        .checkbox-group a { color: var(--wine); text-decoration: underline; }
        .checkbox-group a:hover { color: var(--wine-dark); }
        .submit-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, var(--wine) 0%, var(--wine-dark) 100%); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; margin-top: 0.75rem; font-family: inherit; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(114, 47, 55, 0.3); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .success-message { background: #d4edda; color: #155724; padding: 2rem; border-radius: 8px; text-align: center; }
        .error-message { background: #f8d7da; color: #721c24; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
        .selected-summary { background: var(--cream); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; }
        .selected-summary h4 { color: var(--wine-dark); margin-bottom: 0.5rem; font-size: 0.95rem; }
        .selected-item { display: flex; justify-content: space-between; padding: 0.25rem 0; }
        .how-it-works { background: var(--wine-dark); color: white; padding: 3rem 1.5rem; margin-top: 3rem; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; max-width: 1000px; margin: 2rem auto 0; }
        .step { text-align: center; }
        .step-number { width: 45px; height: 45px; background: var(--gold); color: var(--wine-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; margin: 0 auto 0.75rem; }
        .step h3 { margin-bottom: 0.4rem; font-size: 1rem; }
        .step p { opacity: 0.8; font-size: 0.85rem; line-height: 1.5; }
        footer { text-align: center; padding: 2rem 1rem; color: #666; font-size: 0.85rem; background: white; }
        footer a { color: var(--wine); text-decoration: none; }
        footer a:hover { text-decoration: underline; }
        .footer-links { margin: 1rem 0; display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; }
        .footer-links a { font-size: 0.8rem; }
        @media (max-width: 768px) { .about-content { grid-template-columns: 1fr; } .about-highlight { order: -1; } }
        @media (max-width: 600px) { .hero { padding: 2rem 1rem; } .container { padding: 1.5rem 0.75rem; } .caisses-grid { grid-template-columns: 1fr; gap: 1rem; } .caisse-header { padding: 1rem; padding-top: 2.25rem; } .caisse-title { font-size: 1.1rem; } .caisse-body { padding: 1rem; } .caisse-price { font-size: 1.75rem; } .form-section { padding: 1.25rem; } .form-grid { grid-template-columns: 1fr; } .steps { grid-template-columns: 1fr 1fr; } .filter-btn { padding: 0.5rem 1rem; font-size: 0.85rem; } .about-section { padding: 1.25rem; } .footer-links { gap: 1rem; } }
        @media (max-width: 400px) { .steps { grid-template-columns: 1fr; } .badge-hero { font-size: 0.75rem; padding: 0.4rem 1rem; } }
      `}</style>

      <header className="hero">
        <h1>🍷 Le Club BonBouchon</h1>
        <p>Caisses de 6 bouteilles sélectionnées par François, à partager entre amis. Système d'achat groupé selon les caisses.</p>
        <span className="badge-hero">Sélection Noël 2025 • Retrait chez François</span>
      </header>

      <main className="container">
        <section className="about-section">
          <h2 className="section-title">Notre Sélection</h2>
          <p className="section-subtitle">Des vins d'exception sélectionnés avec passion</p>
          <div className="about-content">
            <div className="about-text">
              <p><strong>François</strong>, passionné de vins et amateur éclairé, a soigneusement composé cette sélection de Noël 2025 en collaboration avec des vignerons d'exception.</p>
              <p>Chaque bouteille provient de domaines soigneusement choisis pour leur savoir-faire et la qualité irréprochable de leurs cuvées.</p>
              <p>De Bordeaux à la Bourgogne, en passant par la Vallée du Rhône et la Champagne, découvrez des vins qui racontent une histoire.</p>
            </div>
            <div className="about-highlight">
              <h3>🏆 Domaines Partenaires</h3>
              <p>Notre sélection met à l'honneur des domaines reconnus pour leur excellence :</p>
              <p className="domaines-list">Domaine Perraud • Domaine Chantal Lescure • Domaine Chofflet • Domaine Marchand-Grillot • Domaine Charly Nicolle • Domaine Saumaize Michelin • Domaine Alex Gambal • Domaine Brintet • Emmanuel Roux • Domaine de l'Aurage • Domaine Alain Gras • Domaine Cristia • Domaine des Hauts Châssis • Domaine Pierre Jean Villa • Domaine Stéphane Pichat • Domaine Louis Chomel • Champagne Castelger</p>
            </div>
          </div>
        </section>

        <h2 className="section-title">Nos Caisses</h2>
        <p className="section-subtitle">Sélectionnez vos caisses et indiquez la quantité souhaitée</p>

        <div className="filters">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Toutes</button>
          <button className={`filter-btn ${filter === 'rouge' ? 'active' : ''}`} onClick={() => setFilter('rouge')}>🍷 Rouges</button>
          <button className={`filter-btn ${filter === 'blanc' ? 'active' : ''}`} onClick={() => setFilter('blanc')}>🥂 Blancs</button>
          <button className={`filter-btn ${filter === 'rose' ? 'active' : ''}`} onClick={() => setFilter('rose')}>🌸 Rosés</button>
        </div>

        {loadingCartons ? (
          <p style={{ textAlign: 'center' }}>Chargement des caisses...</p>
        ) : filteredCaisses.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Aucune caisse disponible pour le moment.</p>
        ) : (
          <div className="caisses-grid">
            {filteredCaisses.map((caisse) => {
              const countData = counts[caisse.slug] || { current: 0, completeLots: 0, minPersonnes: 3 }
              const currentCount = typeof countData === 'object' ? countData.current : countData
              const completeLots = typeof countData === 'object' ? countData.completeLots : 0
              const minPersonnes = caisse.min_personnes || countData.minPersonnes || 3
              const progress = Math.min((currentCount / minPersonnes) * 100, 100)
              const selectedQty = formData.cartons[caisse.slug] || 0
              const isDirectOrder = minPersonnes === 1

              return (
                <div key={caisse.slug} className="caisse-card">
                  <div className={`caisse-header ${caisse.type}`}>
                    <span className="caisse-badge">{caisse.badge}</span>
                    <h3 className="caisse-title">{caisse.nom}</h3>
                    <p className="caisse-region">{caisse.region}</p>
                  </div>
                  <div className="caisse-body">
                    <div className="caisse-price">{caisse.prix}€ <span>TTC la caisse</span></div>
                    {isDirectOrder && <div className="direct-order">⚡ Commande directe (pas de groupement)</div>}
                    {completeLots > 0 && !isDirectOrder && <div className="lots-info">✅ {completeLots} lot{completeLots > 1 ? 's' : ''} déjà complet{completeLots > 1 ? 's' : ''} !</div>}
                    {completeLots > 0 && isDirectOrder && <div className="lots-info">✅ {completeLots} commande{completeLots > 1 ? 's' : ''} confirmée{completeLots > 1 ? 's' : ''} !</div>}
                    <div className="caisse-vins">
                      <h4>Composition ({(caisse.vins || []).reduce((sum, v) => sum + (v.quantite || 2), 0)} bouteilles)</h4>
                      {(caisse.vins || []).map((vin, i) => (
                        <div key={i} className="vin-item">
                          <div className="vin-name">{vin.quantite || 2}× {vin.nom}{vin.domaine && <div className="vin-domaine">{vin.domaine}</div>}</div>
                          <div className="vin-price">{vin.prix}€</div>
                        </div>
                      ))}
                    </div>
                    {!isDirectOrder && (
                      <>
                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
                        <div className="progress-text"><span>Lot en cours : {currentCount}/{minPersonnes}</span><span>{currentCount >= minPersonnes ? '✅ Complet !' : `${minPersonnes - currentCount} de plus`}</span></div>
                      </>
                    )}
                    <div className="quantity-selector">
                      <button className="qty-btn" onClick={() => updateQuantity(caisse.slug, -1)} disabled={selectedQty === 0}>−</button>
                      <div className={`qty-display ${selectedQty > 0 ? 'has-qty' : ''}`}>{selectedQty > 0 ? `${selectedQty} caisse${selectedQty > 1 ? 's' : ''}` : '0'}</div>
                      <button className="qty-btn" onClick={() => updateQuantity(caisse.slug, 1)} disabled={selectedQty >= 10}>+</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {success ? (
          <div className="form-section success-message">
            <h3>🎉 Merci pour votre intention !</h3>
            <p>Vous recevrez un email de confirmation. Vous serez notifié dès que votre commande sera confirmée.</p>
            <button className="submit-btn" onClick={() => setSuccess(false)} style={{ marginTop: '1rem', maxWidth: '300px' }}>Nouvelle sélection</button>
          </div>
        ) : (
          <form className="form-section" onSubmit={handleSubmit} id="form">
            <h2 className="section-title">Valider mon intention</h2>
            <p className="section-subtitle">Remplissez vos coordonnées pour manifester votre intérêt</p>
            {error && <div className="error-message">{error}</div>}
            {totalCaisses > 0 && (
              <div className="selected-summary">
                <h4>Récapitulatif de votre sélection :</h4>
                {Object.entries(formData.cartons).filter(([_, qty]) => qty > 0).map(([slug, qty]) => {
                  const caisse = caissesData.find(c => c.slug === slug)
                  return <div key={slug} className="selected-item"><span>{qty}× {caisse?.nom}</span><span>{(caisse?.prix || 0) * qty}€</span></div>
                })}
                <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #ddd' }} />
                <div className="selected-item" style={{ fontWeight: 'bold', color: 'var(--wine)' }}><span>Total ({totalCaisses} caisse{totalCaisses > 1 ? 's' : ''})</span><span>{totalPrix}€</span></div>
              </div>
            )}
            <div className="form-grid">
              <div className="form-group"><label>Nom complet *</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required placeholder="Votre nom" /></div>
              <div className="form-group"><label>Email *</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="votre@email.com" /></div>
              <div className="form-group"><label>Téléphone</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="06 12 34 56 78" /></div>
            </div>
            <div className="form-group"><label>Message (optionnel)</label><textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} placeholder="Une question ? Un commentaire ?"></textarea></div>
            <div className="checkbox-group">
              <input type="checkbox" id="acceptCgv" checked={formData.acceptCgv} onChange={e => setFormData({...formData, acceptCgv: e.target.checked})} />
              <label htmlFor="acceptCgv">J'ai lu et j'accepte les <Link href="/cgv" target="_blank">Conditions Générales de Vente</Link> et la <Link href="/confidentialite" target="_blank">Politique de Confidentialité</Link>. Je comprends que mon intention ne constitue pas une commande ferme et que le paiement ne sera requis qu'une fois ma commande confirmée.</label>
            </div>
            <button type="submit" className="submit-btn" disabled={loading || totalCaisses === 0 || !formData.acceptCgv}>
              {loading ? 'Envoi en cours...' : totalCaisses === 0 ? 'Sélectionnez au moins une caisse' : !formData.acceptCgv ? 'Acceptez les CGV pour continuer' : `Valider mon intention (${totalCaisses} caisse${totalCaisses > 1 ? 's' : ''} • ${totalPrix}€)`}
            </button>
          </form>
        )}
      </main>

      <section className="how-it-works">
        <h2 className="section-title" style={{ color: 'white' }}>Comment ça marche ?</h2>
        <div className="steps">
          <div className="step"><div className="step-number">1</div><h3>Choisissez</h3><p>Sélectionnez les caisses et les quantités qui vous intéressent.</p></div>
          <div className="step"><div className="step-number">2</div><h3>Confirmez</h3><p>Pour certaines caisses, attendez que le minimum de participants soit atteint.</p></div>
          <div className="step"><div className="step-number">3</div><h3>Payez</h3><p>Recevez le lien de paiement et réglez vos caisses en ligne.</p></div>
          <div className="step"><div className="step-number">4</div><h3>Récupérez</h3><p>Venez chercher vos caisses chez François en décembre. Santé !</p></div>
        </div>
      </section>

      <footer>
        <p>🍷 Le Club BonBouchon — Sélection Noël 2025</p>
        <p style={{ marginTop: '0.5rem' }}>Vins sélectionnés par François</p>
        <div className="footer-links"><Link href="/cgv">Conditions Générales de Vente</Link><Link href="/confidentialite">Politique de Confidentialité</Link></div>
        <p style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.7 }}>L'abus d'alcool est dangereux pour la santé. À consommer avec modération.</p>
      </footer>
    </>
  )
}

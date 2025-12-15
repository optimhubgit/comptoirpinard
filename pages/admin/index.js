import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Admin() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [intentions, setIntentions] = useState([])
  const [cartons, setCartons] = useState([])
  const [editingCarton, setEditingCarton] = useState(null)
  const [showCartonModal, setShowCartonModal] = useState(false)
  const [token, setToken] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('admin_token')
      if (!storedToken) {
        router.push('/admin/login')
        return
      }
      setToken(storedToken)
      loadData(storedToken)
    }
  }, [])

  const loadData = async (authToken) => {
    setLoading(true)
    try {
      const headers = { 'Authorization': `Bearer ${authToken}` }
      
      const [statsRes, intentionsRes, cartonsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/intentions', { headers }),
        fetch('/api/admin/cartons', { headers })
      ])

      if (statsRes.status === 401 || intentionsRes.status === 401) {
        if (typeof window !== 'undefined') localStorage.removeItem('admin_token')
        router.push('/admin/login')
        return
      }

      const statsData = await statsRes.json()
      const intentionsData = await intentionsRes.json()
      const cartonsData = await cartonsRes.json()

      setStats(statsData)
      setIntentions(Array.isArray(intentionsData) ? intentionsData : [])
      setCartons(Array.isArray(cartonsData) ? cartonsData : [])
    } catch (error) {
      console.error('Erreur chargement:', error)
      setIntentions([])
      setCartons([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  const deleteIntention = async (id) => {
    if (!confirm('Supprimer cette intention ?')) return
    await fetch('/api/admin/intentions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    loadData(token)
  }

  const saveCarton = async (cartonData) => {
    const method = cartonData.id ? 'PUT' : 'POST'
    await fetch('/api/admin/cartons', {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(cartonData)
    })
    setShowCartonModal(false)
    setEditingCarton(null)
    loadData(token)
  }

  const deleteCarton = async (id) => {
    if (!confirm('Supprimer ce carton ?')) return
    await fetch('/api/admin/cartons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id })
    })
    loadData(token)
  }

  if (!mounted) return null

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Montserrat, sans-serif' }}>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Administration | Sélection Vins</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Montserrat', sans-serif; background: #f5f5f5; }
        .admin-container { display: flex; min-height: 100vh; }
        .sidebar { width: 250px; background: linear-gradient(180deg, #4A1F24 0%, #722F37 100%); color: white; padding: 2rem 0; position: fixed; height: 100vh; overflow-y: auto; }
        .sidebar-header { padding: 0 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .sidebar-header h1 { font-size: 1.2rem; margin-bottom: 0.25rem; }
        .sidebar-header p { font-size: 0.75rem; opacity: 0.7; }
        .nav-menu { padding: 1rem 0; }
        .nav-item { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; cursor: pointer; transition: background 0.2s; border: none; background: none; color: white; width: 100%; text-align: left; font-size: 0.9rem; font-family: inherit; }
        .nav-item:hover { background: rgba(255,255,255,0.1); }
        .nav-item.active { background: rgba(255,255,255,0.15); border-left: 3px solid #C9A962; }
        .nav-item span { font-size: 1.2rem; }
        .logout-btn { position: absolute; bottom: 1rem; left: 1rem; right: 1rem; padding: 0.75rem; background: rgba(255,255,255,0.1); border: none; color: white; border-radius: 8px; cursor: pointer; font-size: 0.85rem; font-family: inherit; }
        .logout-btn:hover { background: rgba(255,255,255,0.2); }
        .main-content { margin-left: 250px; padding: 2rem; flex: 1; }
        .page-header { margin-bottom: 2rem; }
        .page-header h2 { font-size: 1.75rem; color: #333; margin-bottom: 0.5rem; }
        .page-header p { color: #666; font-size: 0.9rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .stat-card h3 { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 2rem; font-weight: 700; color: #333; }
        .stat-card .value.success { color: #28a745; }
        .stat-card .value.warning { color: #ffc107; }
        .stat-card .value.primary { color: #722F37; }
        .card { background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
        .card-header { padding: 1.25rem 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .card-header h3 { font-size: 1rem; color: #333; }
        .card-body { padding: 1.5rem; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #eee; }
        th { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; }
        td { font-size: 0.9rem; color: #333; }
        tr:hover { background: #fafafa; }
        .badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 500; }
        .badge.pending { background: #fff3cd; color: #856404; }
        .badge.paid { background: #d4edda; color: #155724; }
        .badge.complete { background: #d4edda; color: #155724; }
        .badge.rouge { background: #722F37; color: white; }
        .badge.blanc { background: #f5e6c8; color: #333; }
        .btn { padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; font-family: inherit; }
        .btn-primary { background: #722F37; color: white; }
        .btn-primary:hover { background: #4A1F24; }
        .btn-secondary { background: #e0e0e0; color: #333; }
        .btn-secondary:hover { background: #d0d0d0; }
        .btn-danger { background: #dc3545; color: white; }
        .btn-danger:hover { background: #c82333; }
        .btn-sm { padding: 0.35rem 0.75rem; font-size: 0.8rem; }
        .actions { display: flex; gap: 0.5rem; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: white; border-radius: 16px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; margin: 1rem; }
        .modal-header { padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 1.25rem; }
        .modal-body { padding: 1.5rem; }
        .modal-footer { padding: 1rem 1.5rem; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 0.75rem; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { display: block; font-size: 0.8rem; font-weight: 500; color: #555; margin-bottom: 0.5rem; }
        .form-group input, .form-group textarea, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.95rem; font-family: inherit; }
        .form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: #722F37; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-row-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.75rem; }
        .caisse-card { border: 1px solid #eee; border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: flex-start; }
        .caisse-card:hover { border-color: #722F37; }
        .caisse-info h4 { font-size: 1rem; margin-bottom: 0.25rem; }
        .caisse-info p { font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
        .caisse-info .price { font-size: 1.25rem; font-weight: 700; color: #722F37; }
        .empty-state { text-align: center; padding: 3rem; color: #888; }
        .empty-state span { font-size: 3rem; display: block; margin-bottom: 1rem; }
        .prix-calcule { background: #d4edda; color: #155724; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; font-weight: 600; font-size: 1.1rem; }
        @media (max-width: 768px) { .sidebar { width: 100%; position: relative; height: auto; } .main-content { margin-left: 0; } .admin-container { flex-direction: column; } .form-row { grid-template-columns: 1fr; } .form-row-3 { grid-template-columns: 1fr; } }
      `}</style>

      <div className="admin-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>🍷 Admin</h1>
            <p>Le Club BonBouchon</p>
          </div>
          <nav className="nav-menu">
            <button className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><span>📊</span> Dashboard</button>
            <button className={`nav-item ${activeTab === 'intentions' ? 'active' : ''}`} onClick={() => setActiveTab('intentions')}><span>📝</span> Intentions</button>
            <button className={`nav-item ${activeTab === 'cartons' ? 'active' : ''}`} onClick={() => setActiveTab('cartons')}><span>📦</span> Cartons</button>
            <button className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`} onClick={() => setActiveTab('clients')}><span>👥</span> Clients</button>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>Se déconnecter</button>
        </aside>

        <main className="main-content">
          {activeTab === 'dashboard' && stats && (
            <>
              <div className="page-header"><h2>Dashboard</h2><p>Vue d'ensemble de l'activité</p></div>
              <div className="stats-grid">
                <div className="stat-card"><h3>Total Intentions</h3><div className="value">{stats.totalIntentions}</div></div>
                <div className="stat-card"><h3>Paiements reçus</h3><div className="value success">{stats.paidIntentions}</div></div>
                <div className="stat-card"><h3>En attente</h3><div className="value warning">{stats.pendingIntentions}</div></div>
                <div className="stat-card"><h3>Clients uniques</h3><div className="value">{stats.totalClients}</div></div>
                <div className="stat-card"><h3>CA Potentiel</h3><div className="value">{stats.potentialRevenue}€</div></div>
                <div className="stat-card"><h3>CA Réel</h3><div className="value success">{stats.actualRevenue}€</div></div>
                <div className="stat-card"><h3>Commandes prêtes</h3><div className="value primary">{stats.ordersReady}</div></div>
                <div className="stat-card"><h3>Cartons actifs</h3><div className="value">{stats.totalCartons}</div></div>
              </div>
              <div className="card">
                <div className="card-header"><h3>État par caisse</h3></div>
                <div className="card-body">
                  <table>
                    <thead><tr><th>Caisse</th><th>Prix</th><th>Intentions</th><th>Payées</th><th>Statut</th></tr></thead>
                    <tbody>
                      {Object.values(stats.statsByCaisse || {}).map((s, i) => (
                        <tr key={i}>
                          <td><strong>{s.carton?.nom || s.carton?.slug}</strong></td>
                          <td>{s.carton?.prix}€</td>
                          <td>{s.total}/3</td>
                          <td>{s.paid}/3</td>
                          <td>{s.readyToBuy ? <span className="badge complete">✓ À commander</span> : s.readyToOrder ? <span className="badge paid">Prêt à payer</span> : <span className="badge pending">En attente</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'intentions' && (
            <>
              <div className="page-header"><h2>Intentions</h2><p>{intentions.length} intention(s) enregistrée(s)</p></div>
              <div className="card">
                <div className="card-header"><h3>Liste des intentions</h3></div>
                <div className="card-body" style={{ overflowX: 'auto' }}>
                  {intentions.length === 0 ? (
                    <div className="empty-state"><span>📝</span><p>Aucune intention pour le moment</p></div>
                  ) : (
                    <table>
                      <thead><tr><th>Date</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Caisse</th><th>Statut</th><th>Actions</th></tr></thead>
                      <tbody>
                        {intentions.map((intention) => (
                          <tr key={intention.id}>
                            <td>{new Date(intention.created_at).toLocaleDateString('fr-FR')}</td>
                            <td><strong>{intention.name}</strong></td>
                            <td>{intention.email}</td>
                            <td>{intention.phone || '-'}</td>
                            <td>{intention.caisse}</td>
                            <td><span className={`badge ${intention.status}`}>{intention.status === 'paid' ? 'Payé' : 'En attente'}</span></td>
                            <td><div className="actions"><button className="btn btn-danger btn-sm" onClick={() => deleteIntention(intention.id)}>Supprimer</button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'cartons' && (
            <>
              <div className="page-header"><h2>Cartons</h2><p>Gérez les caisses de vins (prix calculé automatiquement)</p></div>
              <div className="card">
                <div className="card-header">
                  <h3>Liste des cartons</h3>
                  <button className="btn btn-primary" onClick={() => { setEditingCarton({}); setShowCartonModal(true); }}>+ Nouveau carton</button>
                </div>
                <div className="card-body">
                  {cartons.length === 0 ? (
                    <div className="empty-state"><span>📦</span><p>Aucun carton configuré</p><button className="btn btn-primary" onClick={() => { setEditingCarton({}); setShowCartonModal(true); }} style={{ marginTop: '1rem' }}>Créer le premier carton</button></div>
                  ) : (
                    cartons.map((carton) => (
                      <div key={carton.id} className="caisse-card">
                        <div className="caisse-info">
                          <h4>{carton.nom}</h4>
                          <p><span className={`badge ${carton.type}`}>{carton.type}</span> {carton.region}</p>
                          <p style={{ fontSize: '0.8rem', color: '#888' }}>
                            {(carton.vins || []).map(v => `${v.quantite || 2}× ${v.nom}`).join(' • ')}
                          </p>
                          <div className="price">{carton.prix}€ <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#888' }}>(calculé auto)</span></div>
                        </div>
                        <div className="actions">
                          <button className="btn btn-secondary btn-sm" onClick={() => { setEditingCarton(carton); setShowCartonModal(true); }}>Modifier</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteCarton(carton.id)}>Supprimer</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'clients' && (
            <>
              <div className="page-header"><h2>Clients</h2><p>Liste des clients uniques</p></div>
              <div className="card">
                <div className="card-body" style={{ overflowX: 'auto' }}>
                  {(() => {
                    const clientsMap = {}
                    intentions.forEach(i => {
                      if (!clientsMap[i.email]) clientsMap[i.email] = { name: i.name, email: i.email, phone: i.phone, intentions: [], totalPaid: 0 }
                      clientsMap[i.email].intentions.push(i)
                      if (i.status === 'paid') {
                        const carton = cartons.find(c => c.slug === i.caisse)
                        if (carton) clientsMap[i.email].totalPaid += carton.prix
                      }
                    })
                    const clients = Object.values(clientsMap)
                    if (clients.length === 0) return <div className="empty-state"><span>👥</span><p>Aucun client pour le moment</p></div>
                    return (
                      <table>
                        <thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Intentions</th><th>Total payé</th></tr></thead>
                        <tbody>
                          {clients.map((client, i) => (
                            <tr key={i}><td><strong>{client.name}</strong></td><td>{client.email}</td><td>{client.phone || '-'}</td><td>{client.intentions.length}</td><td><strong>{client.totalPaid}€</strong></td></tr>
                          ))}
                        </tbody>
                      </table>
                    )
                  })()}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {showCartonModal && <CartonModal carton={editingCarton} onSave={saveCarton} onClose={() => { setShowCartonModal(false); setEditingCarton(null); }} />}
    </>
  )
}

function CartonModal({ carton, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: carton?.id || null,
    slug: carton?.slug || '',
    nom: carton?.nom || '',
    region: carton?.region || '',
    type: carton?.type || 'rouge',
    vins: carton?.vins?.length > 0 ? carton.vins.map(v => ({
      nom: v.nom || '',
      prix: v.prix || '',
      domaine: v.domaine || '',
      quantite: v.quantite || 2
    })) : [
      { nom: '', prix: '', domaine: '', quantite: 2 },
      { nom: '', prix: '', domaine: '', quantite: 2 },
      { nom: '', prix: '', domaine: '', quantite: 2 }
    ]
  })

  // Calcul du prix en temps réel
  const prixCalcule = formData.vins.reduce((sum, vin) => {
    const prix = parseFloat(String(vin.prix || 0).replace('€', '').replace(',', '.')) || 0
    const quantite = parseInt(vin.quantite) || 2
    return sum + (prix * quantite)
  }, 0)

  const updateVin = (index, field, value) => {
    const newVins = [...formData.vins]
    newVins[index] = { ...newVins[index], [field]: value }
    setFormData({ ...formData, vins: newVins })
  }

  const addVin = () => {
    setFormData({
      ...formData,
      vins: [...formData.vins, { nom: '', prix: '', domaine: '', quantite: 2 }]
    })
  }

  const removeVin = (index) => {
    if (formData.vins.length <= 1) return
    const newVins = formData.vins.filter((_, i) => i !== index)
    setFormData({ ...formData, vins: newVins })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const slug = formData.slug || formData.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    onSave({ ...formData, slug })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{carton?.id ? 'Modifier le carton' : 'Nouveau carton'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="prix-calcule">
              💰 Prix calculé : {Math.ceil(prixCalcule)}€
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nom du carton</label>
                <input type="text" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} placeholder="Ex: Bordeaux Découverte" required />
              </div>
              <div className="form-group">
                <label>Slug (auto)</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="Ex: bordeaux-decouverte" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Région</label>
                <input type="text" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} placeholder="Ex: Bordeaux" required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                  <option value="rouge">Rouge</option>
                  <option value="blanc">Blanc</option>
                  <option value="rose">Rosé</option>
                </select>
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Composition des vins
              <button type="button" className="btn btn-secondary btn-sm" onClick={addVin}>+ Ajouter un vin</button>
            </h4>

            {formData.vins.map((vin, index) => (
              <div key={index} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '0.75rem', position: 'relative' }}>
                {formData.vins.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeVin(index)} 
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.9rem' }}
                  >×</button>
                )}
                <div className="form-row-3">
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label>Nom du vin</label>
                    <input type="text" value={vin.nom} onChange={e => updateVin(index, 'nom', e.target.value)} placeholder="Nom du vin" />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label>Prix unitaire (€)</label>
                    <input type="number" step="0.01" value={vin.prix} onChange={e => updateVin(index, 'prix', e.target.value)} placeholder="16.90" />
                  </div>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label>Quantité</label>
                    <input type="number" min="1" value={vin.quantite} onChange={e => updateVin(index, 'quantite', e.target.value)} placeholder="2" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Domaine (optionnel)</label>
                  <input type="text" value={vin.domaine} onChange={e => updateVin(index, 'domaine', e.target.value)} placeholder="Nom du domaine" />
                </div>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">Enregistrer ({Math.ceil(prixCalcule)}€)</button>
          </div>
        </form>
      </div>
    </div>
  )
}

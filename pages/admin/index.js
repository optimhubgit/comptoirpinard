import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Admin() {
  const router = useRouter()
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('intentions')
  const [intentions, setIntentions] = useState([])
  const [cartons, setCartons] = useState([])
  const [stats, setStats] = useState({})
  const [editingCarton, setEditingCarton] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth')
      if (res.ok) {
        setAuthenticated(true)
        fetchData()
      } else {
        router.push('/admin/login')
      }
    } catch {
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    const [intentionsRes, cartonsRes, statsRes] = await Promise.all([
      fetch('/api/admin/intentions'),
      fetch('/api/admin/cartons'),
      fetch('/api/admin/stats')
    ])
    setIntentions(await intentionsRes.json())
    setCartons(await cartonsRes.json())
    setStats(await statsRes.json())
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const handleDeleteIntention = async (id) => {
    if (!confirm('Supprimer cette intention ?')) return
    await fetch(`/api/admin/intentions?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const handleSaveCarton = async (e) => {
    e.preventDefault()
    const method = editingCarton.id ? 'PUT' : 'POST'
    await fetch('/api/admin/cartons', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingCarton)
    })
    setShowModal(false)
    setEditingCarton(null)
    fetchData()
  }

  const handleDeleteCarton = async (id) => {
    if (!confirm('Supprimer cette caisse ?')) return
    await fetch(`/api/admin/cartons?id=${id}`, { method: 'DELETE' })
    fetchData()
  }

  const openEditModal = (carton = null) => {
    setEditingCarton(carton || {
      nom: '', slug: '', region: '', type: 'rouge', badge: '', prix: 0, min_personnes: 3, active: true, ordre: 0, vins: []
    })
    setShowModal(true)
  }

  const calculerPrixTotal = () => {
    if (!editingCarton?.vins) return 0
    return editingCarton.vins.reduce((sum, v) => sum + (parseFloat(v.prix) || 0) * (parseInt(v.quantite) || 2), 0)
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement...</div>
  if (!authenticated) return null

  return (
    <>
      <Head><title>Admin - Le Club BonBouchon</title></Head>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .admin-container { max-width: 1400px; margin: 0 auto; padding: 1rem; }
        .admin-header { background: linear-gradient(135deg, #4A1F24 0%, #722F37 100%); color: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .admin-header h1 { font-size: 1.5rem; }
        .logout-btn { background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: white; padding: 1.25rem; border-radius: 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .stat-value { font-size: 2rem; font-weight: 700; color: #722F37; }
        .stat-label { color: #666; font-size: 0.85rem; margin-top: 0.25rem; }
        .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .tab { padding: 0.75rem 1.5rem; border: none; background: white; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .tab.active { background: #722F37; color: white; }
        .content-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 600px; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #eee; }
        th { background: #f9f9f9; font-weight: 600; color: #333; }
        .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
        .badge-pending { background: #fff3cd; color: #856404; }
        .badge-complete { background: #d4edda; color: #155724; }
        .badge-paid { background: #cce5ff; color: #004085; }
        .btn { padding: 0.4rem 0.8rem; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
        .btn-edit { background: #e3f2fd; color: #1976d2; }
        .btn-delete { background: #ffebee; color: #c62828; }
        .btn-add { background: #722F37; color: white; padding: 0.75rem 1.5rem; font-size: 1rem; margin-bottom: 1rem; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
        .modal { background: white; border-radius: 12px; padding: 2rem; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; }
        .modal h2 { margin-bottom: 1.5rem; color: #722F37; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group.full { grid-column: 1 / -1; }
        .form-group label { display: block; margin-bottom: 0.4rem; font-weight: 500; color: #333; }
        .form-group input, .form-group select { width: 100%; padding: 0.6rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #722F37; }
        .form-group small { color: #666; font-size: 0.75rem; display: block; margin-top: 0.25rem; }
        .vins-section { border-top: 1px solid #eee; padding-top: 1rem; margin-top: 1rem; }
        .vin-row { display: grid; grid-template-columns: 2fr 1.5fr 1fr 1fr auto; gap: 0.5rem; align-items: end; margin-bottom: 0.5rem; }
        .vin-row input { padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px; }
        .prix-calcule { background: #e8f5e9; padding: 0.75rem; border-radius: 6px; text-align: center; font-weight: 600; color: #2e7d32; margin: 1rem 0; }
        .modal-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
        .modal-actions button { padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 500; }
        .btn-cancel { background: #eee; border: none; }
        .btn-save { background: #722F37; color: white; border: none; }
        .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .checkbox-label input { width: auto; }
        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .vin-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="admin-container">
        <header className="admin-header">
          <h1>🍷 Admin - Le Club BonBouchon</h1>
          <button className="logout-btn" onClick={handleLogout}>Déconnexion</button>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalIntentions || 0}</div>
            <div className="stat-label">Intentions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.lotsComplets || 0}</div>
            <div className="stat-label">Lots complets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalCaisses || 0}</div>
            <div className="stat-label">Caisses réservées</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.ca || 0}€</div>
            <div className="stat-label">CA potentiel</div>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === 'intentions' ? 'active' : ''}`} onClick={() => setActiveTab('intentions')}>
            Intentions ({intentions.length})
          </button>
          <button className={`tab ${activeTab === 'cartons' ? 'active' : ''}`} onClick={() => setActiveTab('cartons')}>
            Caisses ({cartons.length})
          </button>
        </div>

        <div className="content-card">
          {activeTab === 'intentions' && (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Caisse</th>
                  <th>Lot</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {intentions.map(i => (
                  <tr key={i.id}>
                    <td>{new Date(i.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>{i.name}</td>
                    <td>{i.email}</td>
                    <td>{i.caisse}</td>
                    <td>#{i.lot_number}</td>
                    <td>
                      <span className={`badge ${i.lot_complete ? 'badge-complete' : 'badge-pending'}`}>
                        {i.lot_complete ? 'Lot complet' : 'En attente'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-delete" onClick={() => handleDeleteIntention(i.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
                {intentions.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Aucune intention</td></tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'cartons' && (
            <>
              <button className="btn btn-add" onClick={() => openEditModal()}>+ Ajouter une caisse</button>
              <table>
                <thead>
                  <tr>
                    <th>Ordre</th>
                    <th>Nom</th>
                    <th>Région</th>
                    <th>Type</th>
                    <th>Prix</th>
                    <th>Min. pers.</th>
                    <th>Actif</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartons.map(c => (
                    <tr key={c.id}>
                      <td>{c.ordre}</td>
                      <td>{c.nom}</td>
                      <td>{c.region}</td>
                      <td>{c.type}</td>
                      <td>{c.prix}€</td>
                      <td>{c.min_personnes || 3}</td>
                      <td>{c.active ? '✅' : '❌'}</td>
                      <td>
                        <button className="btn btn-edit" onClick={() => openEditModal(c)} style={{ marginRight: '0.5rem' }}>Modifier</button>
                        <button className="btn btn-delete" onClick={() => handleDeleteCarton(c.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingCarton?.id ? 'Modifier' : 'Ajouter'} une caisse</h2>
            <form onSubmit={handleSaveCarton}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom</label>
                  <input type="text" value={editingCarton?.nom || ''} onChange={e => setEditingCarton({...editingCarton, nom: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Slug (URL)</label>
                  <input type="text" value={editingCarton?.slug || ''} onChange={e => setEditingCarton({...editingCarton, slug: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Région</label>
                  <input type="text" value={editingCarton?.region || ''} onChange={e => setEditingCarton({...editingCarton, region: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={editingCarton?.type || 'rouge'} onChange={e => setEditingCarton({...editingCarton, type: e.target.value})}>
                    <option value="rouge">Rouge</option>
                    <option value="blanc">Blanc</option>
                    <option value="rose">Rosé</option>
                    <option value="champagne">Champagne</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Badge</label>
                  <input type="text" value={editingCarton?.badge || ''} onChange={e => setEditingCarton({...editingCarton, badge: e.target.value})} placeholder="ex: Rouge • Prestige" />
                </div>
                <div className="form-group">
                  <label>Ordre d'affichage</label>
                  <input type="number" value={editingCarton?.ordre || 0} onChange={e => setEditingCarton({...editingCarton, ordre: parseInt(e.target.value) || 0})} />
                </div>
                <div className="form-group">
                  <label>Min. personnes pour un lot</label>
                  <input type="number" min="1" max="10" value={editingCarton?.min_personnes || 3} onChange={e => setEditingCarton({...editingCarton, min_personnes: parseInt(e.target.value) || 3})} />
                  <small>1 = commande directe (ex: Champagne), 3 = achat groupé</small>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={editingCarton?.active ?? true} onChange={e => setEditingCarton({...editingCarton, active: e.target.checked})} />
                    Actif (visible sur le site)
                  </label>
                </div>
              </div>

              <div className="vins-section">
                <h3 style={{ marginBottom: '1rem' }}>Vins de la caisse</h3>
                {(editingCarton?.vins || []).map((vin, idx) => (
                  <div key={idx} className="vin-row">
                    <input placeholder="Nom du vin" value={vin.nom || ''} onChange={e => {
                      const vins = [...(editingCarton.vins || [])]
                      vins[idx] = { ...vins[idx], nom: e.target.value }
                      setEditingCarton({...editingCarton, vins})
                    }} />
                    <input placeholder="Domaine" value={vin.domaine || ''} onChange={e => {
                      const vins = [...(editingCarton.vins || [])]
                      vins[idx] = { ...vins[idx], domaine: e.target.value }
                      setEditingCarton({...editingCarton, vins})
                    }} />
                    <input type="number" step="0.01" placeholder="Prix €" value={vin.prix || ''} onChange={e => {
                      const vins = [...(editingCarton.vins || [])]
                      vins[idx] = { ...vins[idx], prix: e.target.value }
                      setEditingCarton({...editingCarton, vins})
                    }} />
                    <input type="number" placeholder="Qté" value={vin.quantite || 2} onChange={e => {
                      const vins = [...(editingCarton.vins || [])]
                      vins[idx] = { ...vins[idx], quantite: parseInt(e.target.value) || 2 }
                      setEditingCarton({...editingCarton, vins})
                    }} />
                    <button type="button" className="btn btn-delete" onClick={() => {
                      const vins = editingCarton.vins.filter((_, i) => i !== idx)
                      setEditingCarton({...editingCarton, vins})
                    }}>×</button>
                  </div>
                ))}
                <button type="button" className="btn btn-edit" onClick={() => {
                  const vins = [...(editingCarton.vins || []), { nom: '', domaine: '', prix: '', quantite: 2 }]
                  setEditingCarton({...editingCarton, vins})
                }}>+ Ajouter un vin</button>
                
                <div className="prix-calcule">
                  Prix calculé : {calculerPrixTotal().toFixed(2)}€ → Prix arrondi : {Math.ceil(calculerPrixTotal())}€
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button type="submit" className="btn-save">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

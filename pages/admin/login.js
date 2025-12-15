import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('admin_token', data.token)
        router.push('/admin')
      } else {
        setError(data.error || 'Mot de passe incorrect')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin - Connexion | Sélection Vins</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(135deg, #4A1F24 0%, #722F37 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-container {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
          margin: 1rem;
        }
        .logo { text-align: center; margin-bottom: 2rem; }
        .logo span { font-size: 3rem; }
        h1 { text-align: center; color: #4A1F24; font-size: 1.5rem; margin-bottom: 0.5rem; }
        .subtitle { text-align: center; color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
        .form-group { margin-bottom: 1.5rem; }
        label { display: block; font-size: 0.8rem; font-weight: 500; color: #333; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        input { width: 100%; padding: 1rem; font-size: 1rem; border: 2px solid #e0e0e0; border-radius: 8px; transition: border-color 0.3s; font-family: inherit; }
        input:focus { outline: none; border-color: #722F37; }
        .btn { width: 100%; padding: 1rem; font-size: 1rem; font-weight: 600; color: white; background: linear-gradient(135deg, #722F37 0%, #4A1F24 100%); border: none; border-radius: 8px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; font-family: inherit; }
        .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(114, 47, 55, 0.4); }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .error { background: #fee; color: #c00; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; text-align: center; font-size: 0.9rem; }
      `}</style>

      <div className="login-container">
        <div className="logo"><span>🍷</span></div>
        <h1>Administration</h1>
        <p className="subtitle">Le Club BonBouchon</p>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Entrez le mot de passe" required />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </>
  )
}

import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

      if (res.ok) {
        router.push('/admin')
      } else {
        setError('Mot de passe incorrect')
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
        <title>Admin - Connexion</title>
      </Head>
      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #4A1F24 0%, #722F37 100%);
          padding: 1rem;
        }
        .login-box {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
        }
        h1 {
          text-align: center;
          color: #722F37;
          margin-bottom: 1.5rem;
          font-family: Georgia, serif;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #eee;
          border-radius: 8px;
          font-size: 1rem;
        }
        input:focus {
          outline: none;
          border-color: #722F37;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background: #722F37;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        button:hover {
          background: #4A1F24;
        }
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error {
          background: #f8d7da;
          color: #721c24;
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
      <div className="login-container">
        <div className="login-box">
          <h1>🍷 Admin</h1>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

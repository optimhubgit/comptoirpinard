import crypto from 'crypto'

// Générer un token basé sur le mot de passe admin (valide 24h)
function generateToken() {
  const today = new Date().toISOString().split('T')[0]
  return crypto
    .createHash('sha256')
    .update((process.env.ADMIN_PASSWORD || 'default') + today + 'selection-vins-secret')
    .digest('hex')
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' })
  }

  const { password } = req.body

  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD non configuré!')
    return res.status(500).json({ error: 'Configuration manquante - ajoutez ADMIN_PASSWORD dans Vercel' })
  }

  if (password === process.env.ADMIN_PASSWORD) {
    const token = generateToken()
    res.status(200).json({ success: true, token })
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' })
  }
}

export function verifyAdminToken(token) {
  if (!token || !process.env.ADMIN_PASSWORD) return false
  
  const today = new Date().toISOString().split('T')[0]
  const validToken = crypto
    .createHash('sha256')
    .update(process.env.ADMIN_PASSWORD + today + 'selection-vins-secret')
    .digest('hex')
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  const yesterdayToken = crypto
    .createHash('sha256')
    .update(process.env.ADMIN_PASSWORD + yesterday + 'selection-vins-secret')
    .digest('hex')
  
  return token === validToken || token === yesterdayToken
}

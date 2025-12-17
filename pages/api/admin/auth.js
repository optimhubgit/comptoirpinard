const COOKIE_NAME = 'admin_session'

function parseCookies(cookieHeader) {
  const cookies = {}
  if (!cookieHeader) return cookies
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) cookies[name] = decodeURIComponent(value)
  })
  return cookies
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { password } = req.body
    
    if (password === process.env.ADMIN_PASSWORD) {
      const isProduction = process.env.NODE_ENV === 'production'
      const cookie = `${COOKIE_NAME}=authenticated; HttpOnly; Path=/; Max-Age=${60 * 60 * 24}; SameSite=Strict${isProduction ? '; Secure' : ''}`
      res.setHeader('Set-Cookie', cookie)
      return res.status(200).json({ success: true })
    }
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  if (req.method === 'GET') {
    const cookies = parseCookies(req.headers.cookie)
    if (cookies[COOKIE_NAME] === 'authenticated') {
      return res.status(200).json({ authenticated: true })
    }
    return res.status(401).json({ authenticated: false })
  }

  if (req.method === 'DELETE') {
    const isProduction = process.env.NODE_ENV === 'production'
    const cookie = `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${isProduction ? '; Secure' : ''}`
    res.setHeader('Set-Cookie', cookie)
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}

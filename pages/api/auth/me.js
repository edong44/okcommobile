
import { parse } from 'cookie'

export default function handler(req, res) {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.admin_token

  if (!token) {
    return res.status(401).json({ error: 'unauthorized' })
  }

  res.status(200).json({ username: token })
}

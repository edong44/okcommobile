
import { serialize } from 'cookie'

export default function handler(req, res) {
  const cookie = serialize('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
  })

  res.setHeader('Set-Cookie', cookie)
  res.status(200).json({ message: 'ออกจากระบบแล้ว' })
}


import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { serialize } from 'cookie'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body

  try {
    const admin = await prisma.admin.findUnique({ where: { username } })
    if (!admin) {
      return res.status(401).json({ error: 'ไม่พบผู้ใช้งาน' })
    }

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง' })
    }

    const cookie = serialize('admin_token', 'okcommobile-secret', {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 24
    })

    res.setHeader('Set-Cookie', cookie)
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('❌ Login error:', err)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' })
  }
}

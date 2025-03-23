
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const repairs = await prisma.repair.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return res.status(200).json(repairs)
  }

  if (req.method === 'POST') {
    const { customer, phone, phoneModel, issue, partsUsed } = req.body

    if (!customer || !phone || !phoneModel || !issue) {
      return res.status(400).json({ error: 'ข้อมูลไม่ครบ' })
    }

    try {
      const repair = await prisma.repair.create({
        data: {
          customer,
          phone,
          phoneModel,
          issue,
          partsUsed
        }
      })
      return res.status(201).json(repair)
    } catch (error) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะบันทึก' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { customer, phone, phoneModel, issue, partsUsed, status } = req.body

    try {
      const updated = await prisma.repair.update({
        where: { id: parseInt(id) },
        data: { customer, phone, phoneModel, issue, partsUsed, status }
      })
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(404).json({ error: 'ไม่พบงานซ่อมนี้' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

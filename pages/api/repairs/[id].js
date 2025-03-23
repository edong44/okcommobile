
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const {
      customer,
      phone,
      phoneModel,
      issue,
      partsUsed,
      estimatedPrice,
      actualPrice,
      status,
      receivedAt,
      completedAt
    } = req.body

    try {
      const updated = await prisma.repair.update({
        where: { id: parseInt(id) },
        data: {
          customer,
          phone,
          phoneModel,
          issue,
          partsUsed,
          estimatedPrice: estimatedPrice ? parseInt(estimatedPrice) : null,
          actualPrice: actualPrice ? parseInt(actualPrice) : null,
          status,
          receivedAt: receivedAt ? new Date(receivedAt) : undefined,
          completedAt: completedAt ? new Date(completedAt) : null
        }
      })
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(500).json({ error: 'ไม่สามารถอัปเดตข้อมูลได้' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.repair.delete({ where: { id: parseInt(id) } })
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ error: 'ไม่สามารถลบข้อมูลได้' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}

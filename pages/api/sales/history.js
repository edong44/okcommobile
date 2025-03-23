
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const sales = await prisma.sale.findMany({
      orderBy: { soldAt: 'desc' },
      take: 10,
      include: {
        items: {
          include: {
            product: true  // ✅ รวมข้อมูลสินค้า
          }
        }
      }
    })

    res.status(200).json(sales)
  } catch (error) {
    console.error('❌ Error loading sales history:', error)
    res.status(500).json({ error: 'ไม่สามารถโหลดรายการขายได้' })
  }
}

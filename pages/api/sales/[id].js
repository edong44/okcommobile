
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const saleId = parseInt(req.query.id)

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // ดึงรายการสินค้าก่อนลบ
    const saleItems = await prisma.saleItem.findMany({
      where: { saleId },
      select: { productId: true, quantity: true }
    })

    // เพิ่ม stock กลับให้สินค้า
    for (const item of saleItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      })
    }

    // ลบ SaleItem ที่เกี่ยวข้อง
    await prisma.saleItem.deleteMany({
      where: { saleId }
    })

    // ลบ Sale
    await prisma.sale.delete({
      where: { id: saleId }
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('❌ ลบรายการขายไม่สำเร็จ:', error)
    res.status(500).json({ error: 'ไม่สามารถลบรายการขายได้' })
  }
}

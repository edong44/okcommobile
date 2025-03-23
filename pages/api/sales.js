import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { customer, seller, note, items } = req.body

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'ไม่มีรายการสินค้า' })
  }

  try {
    const sale = await prisma.sale.create({
      data: {
        customer,
        seller,
        note,
        items: {
          create: items.map((item) => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total: item.quantity * item.price,
          })),
        },
      },
      include: { items: true },
    })

    // ลด stock สินค้า
    for (const item of items) {
      await prisma.product.update({
        where: { id: parseInt(item.productId) },
        data: {
          stock: {
            decrement: parseInt(item.quantity),
          },
        },
      })
    }

    res.status(200).json({ success: true, sale })
  } catch (error) {
    console.error('❌ ERROR:', error)
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกการขาย' })
  }
}

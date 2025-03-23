
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { name } = req.body
    try {
      const updated = await prisma.productType.update({
        where: { id: parseInt(id) },
        data: { name }
      })
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(400).json({ error: 'ไม่สามารถแก้ไขชื่อชนิดสินค้าได้' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      // เช็คก่อนว่ามีสินค้าที่ใช้ชนิดสินค้านี้อยู่หรือไม่
      const related = await prisma.product.findFirst({
        where: { productTypeId: parseInt(id) }
      })
      if (related) {
        return res.status(400).json({ error: 'ไม่สามารถลบได้ เพราะยังมีสินค้าใช้ชนิดนี้อยู่' })
      }

      await prisma.productType.delete({ where: { id: parseInt(id) } })
      return res.status(200).json({ success: true })
    } catch (error) {
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะลบ' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

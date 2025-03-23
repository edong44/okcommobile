
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const {
      name, stock, costPrice, salePrice, description,
      source, importDate, productTypeId
    } = req.body

    try {
      const updated = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name,
          stock,
          costPrice,
          salePrice,
          description,
          source,
          importDate: importDate ? new Date(importDate) : undefined,
          productType: {
            connect: { id: productTypeId }
          }
        }
      })
      return res.status(200).json(updated)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'ไม่สามารถอัปเดตสินค้าได้' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({
        where: { id: parseInt(id) }
      })
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'ไม่สามารถลบสินค้าได้' })
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

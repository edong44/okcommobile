
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const products = await prisma.product.findMany({
      include: { productType: true }
    })
    return res.status(200).json(products)
  }

  if (req.method === 'POST') {
    const { name, stock, productTypeId, costPrice, salePrice, description, source, importDate } = req.body
    try {
      const product = await prisma.product.create({
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
      return res.status(201).json(product)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'เพิ่มสินค้าไม่สำเร็จ' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const types = await prisma.productType.findMany()
    return res.status(200).json(types)
  }

  if (req.method === 'POST') {
    const { name } = req.body
    try {
      const type = await prisma.productType.create({ data: { name } })
      return res.status(201).json(type)
    } catch (error) {
      return res.status(400).json({ error: 'เพิ่มชนิดสินค้าไม่สำเร็จ หรือมีชื่อซ้ำแล้ว' })
    }
  }

  return res.status(405).end(`Method ${req.method} Not Allowed`)
}

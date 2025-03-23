import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Stock() {
  const [stockItems] = useState([
    { id: 1, name: 'จอ iPhone 11', quantity: 5 },
    { id: 2, name: 'แบตเตอรี่ Samsung A51', quantity: 2 },
    { id: 3, name: 'สายชาร์จ Type-C', quantity: 10 },
    { id: 4, name: 'กระจกกันรอย Redmi 10', quantity: 4 },
    { id: 5, name: 'ฝาหลัง iPhone 12', quantity: 1 },
  ])

  return (
    <>
      <Head>
        <title>สต๊อกสินค้า - OK Commobile</title>
        <meta name="description" content="ระบบจัดการสต๊อกของร้านโอเคคอมโมบาย" />
      </Head>

      <header className="header">
        <h1>สต๊อกสินค้า</h1>
        <nav>
          <ul>
            <li><Link href="/">หน้าแรก</Link></li>
            <li><Link href="/services">บริการ</Link></li>
            <li><Link href="/products">สินค้า</Link></li>
            <li><Link href="/stock">สต๊อกสินค้า</Link></li>
            <li><Link href="/repair">รับงานซ่อม</Link></li>
            <li><Link href="/admin">ผู้ดูแลระบบ</Link></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <section className="stock-section">
          <h2>รายการอะไหล่ในสต๊อก</h2>
          <table>
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>จำนวนคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {stockItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} OK Commobile - All rights reserved.</p>
      </footer>
    </>
  )
}

import Head from 'next/head'
import Link from 'next/link'

export default function Services() {
  return (
    <>
      <Head>
        <title>บริการ - OK Commobile</title>
        <meta name="description" content="บริการจากร้านโอเคคอมโมบาย" />
      </Head>

      <header className="header">
        <h1>บริการของเรา</h1>
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
        <section className="service-section">
          <h2>บริการหลักของร้าน OK Commobile</h2>
          <ul>
            <li>🔧 ซ่อมมือถือทุกรุ่น ทุกยี่ห้อ</li>
            <li>🔋 เปลี่ยนแบตเตอรี่ / จอ / อะไหล่แท้</li>
            <li>📱 จำหน่ายมือถือใหม่ มือสอง</li>
            <li>🧾 ประเมินราคาซ่อมเบื้องต้นฟรี</li>
            <li>🧰 บริการอัปเดตซอฟต์แวร์ & แฟลชเครื่อง</li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} OK Commobile - All rights reserved.</p>
      </footer>
    </>
  )
}

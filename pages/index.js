import Head from 'next/head'
import Link from 'next/link'


export default function Home() {
  return (
    <>
      <Head>
        <title>OK Commobile - ร้านจำหน่ายและซ่อมมือถือ</title>
        <meta name="description" content="ร้านโอเคคอมโมบาย | จำหน่าย-ซ่อมมือถือครบวงจร" />
      </Head>

      <header className="header">
        <h1>OK Commobile</h1>
        <nav>
          <ul>
            <li><Link href="/">หน้าแรก</Link></li>
            <li><Link href="/services">บริการ</Link></li>
            <li><Link href="/sales">ขายสินค้า</Link></li>
            <li><Link href="/products">สินค้า</Link></li>
            <li><Link href="/stock">สต๊อกสินค้า</Link></li>
            <li><Link href="/repair">รับงานซ่อม</Link></li>
            <li><Link href="/admin">ผู้ดูแลระบบ</Link></li>
          </ul>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <h2>ยินดีต้อนรับสู่ร้าน OK Commobile</h2>
          <p>เราจำหน่ายมือถือ อุปกรณ์เสริม และให้บริการซ่อมครบวงจร</p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} OK Commobile - All rights reserved.</p>
      </footer>
    </>
  )
}

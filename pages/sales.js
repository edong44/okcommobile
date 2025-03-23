
import Head from 'next/head'
import Link from 'next/link'

import { useState, useEffect } from 'react'

export default function Sales() {
  const [products, setProducts] = useState([])
  const [types, setTypes] = useState([])
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    customer: '',
    seller: '',
    note: ''
  })
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts)
    fetch('/api/product-types').then(res => res.json()).then(setTypes)
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    const res = await fetch('/api/sales/history')
    const data = await res.json()
    setHistory(data)
  }

  const deleteSale = async (id) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบรายการขายนี้?')) return
    const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchHistory()
    } else {
      alert('❌ ลบไม่สำเร็จ')
    }
  }

  const addItem = () => {
    setItems([...items, { productTypeId: '', productId: '', quantity: 1, price: 0 }])
  }

  const updateItem = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value))
      newItems[index].price = product?.salePrice || 0
    }
    setItems(newItems)
  }

  const removeItem = (index) => {
    const newItems = [...items]
    newItems.splice(index, 1)
    setItems(newItems)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const saleItems = items.map(item => ({
      productId: parseInt(item.productId),
      quantity: parseFloat(item.quantity),
      price: parseFloat(item.price)
    }))
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items: saleItems })
    })
    if (res.ok) {
      setMessage('✅ บันทึกการขายเรียบร้อยแล้ว')
      setItems([])
      setForm({ customer: '', seller: '', note: '' })
      await fetchHistory()
    } else {
      setMessage('❌ เกิดข้อผิดพลาดในการบันทึก')
    }
  }

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)

  return (
    <>
      <Head><title>ขายสินค้า - OK Commobile</title></Head>      
      <main style={{ padding: '2rem' }}>
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
        <h1>ขายสินค้า</h1>
        <form onSubmit={handleSubmit}>
          <input name="customer" value={form.customer} onChange={handleChange} placeholder="👤 ชื่อลูกค้า (optional)" />
          <input name="seller" value={form.seller} onChange={handleChange} placeholder="🧑‍💼 ชื่อผู้ขาย (optional)" />
          <textarea name="note" value={form.note} onChange={handleChange} placeholder="📝 หมายเหตุเพิ่มเติม" />
          <hr />
          {items.map((item, index) => {
            const filteredProducts = products.filter(p => item.productTypeId && p.productTypeId === parseInt(item.productTypeId))
            return (
              <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px dashed #ccc', paddingBottom: '1rem' }}>
                <select value={item.productTypeId} onChange={e => updateItem(index, 'productTypeId', e.target.value)}>
                  <option value="">-- เลือกชนิดสินค้า --</option>
                  {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <select value={item.productId} onChange={e => updateItem(index, 'productId', e.target.value)}>
                  <option value="">-- เลือกสินค้า --</option>
                  {filteredProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input type="number" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} placeholder="จำนวน" />
                <input type="number" value={item.price} onChange={e => updateItem(index, 'price', e.target.value)} placeholder="ราคาต่อชิ้น" />
                <span> รวม: {item.quantity * item.price} บาท </span>
                <button type="button" onClick={() => removeItem(index)}>ลบ</button>
              </div>
            )
          })}
          <button type="button" onClick={addItem}>➕ เพิ่มรายการสินค้า</button>
          <h3>รวมทั้งหมด: {total} บาท</h3>
          <button type="submit">💾 บันทึกการขาย</button>
        </form>

        {message && <p>{message}</p>}

        <hr />
        <h2>🧾 รายการขายล่าสุด</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {history.map(sale => (
            <div key={sale.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              width: '300px',
              background: '#f9f9f9',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <strong>🧑‍💼 ผู้ขาย:</strong> {sale.seller || '-'}<br />
              <strong>👤 ลูกค้า:</strong> {sale.customer || '-'}<br />
              <strong>🕒 วันที่:</strong> {new Date(sale.soldAt).toLocaleString()}<br />
              <strong>📋 รายการ:</strong>
              <ul style={{ paddingLeft: '1.2rem' }}>
                {sale.items.map(item => (
                  <li key={item.id}>
                    {item.product?.name || '❌'} × {item.quantity} = {item.total} บาท
                  </li>
                ))}
              </ul>
              <strong>💰 รวม:</strong> {sale.items.reduce((sum, i) => sum + i.total, 0)} บาท<br />
              {sale.note && <div><strong>📝 หมายเหตุ:</strong> {sale.note}</div>}
              <button onClick={() => deleteSale(sale.id)} style={{ color: 'red', marginTop: '0.5rem' }}>🗑️ ลบรายการ</button>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

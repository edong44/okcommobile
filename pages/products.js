
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [types, setTypes] = useState([])
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', productTypeId: '', stock: '', costPrice: '', salePrice: '',
    description: '', source: '', importDate: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchTypes()
  }, [])

  const fetchProducts = async () => {
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
  }

  const fetchTypes = async () => {
    const res = await fetch('/api/product-types')
    const data = await res.json()
    setTypes(data)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return ''
    return sortOrder === 'asc' ? ' ▲' : ' ▼'
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      stock: parseInt(form.stock),
      costPrice: parseInt(form.costPrice),
      salePrice: parseInt(form.salePrice),
      productTypeId: parseInt(form.productTypeId)
    }

    const res = await fetch(editId ? `/api/products/${editId}` : '/api/products', {
      method: editId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setMessage(editId ? '✅ แก้ไขสินค้าเรียบร้อย' : '✅ เพิ่มสินค้าเรียบร้อยแล้ว')
      setEditId(null)
      setForm({ name: '', productTypeId: '', stock: '', costPrice: '', salePrice: '', description: '', source: '', importDate: '' })
      fetchProducts()
    } else {
      setMessage('❌ ไม่สามารถบันทึกข้อมูลได้')
    }
  }

  const startEdit = (p) => {
    setEditId(p.id)
    setShowForm(true)
    setForm({
      name: p.name, productTypeId: p.productTypeId?.toString() || '', stock: p.stock,
      costPrice: p.costPrice || '', salePrice: p.salePrice || '',
      description: p.description || '', source: p.source || '',
      importDate: p.importDate ? p.importDate.substring(0, 10) : ''
    })
  }

  const deleteProduct = async (id) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบสินค้านี้?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) fetchProducts()
    else alert('ลบสินค้าไม่สำเร็จ')
  }

  const sortedProducts = [...products]
    .filter(p =>
      (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
      (!filterType || p.productTypeId?.toString() === filterType)
    )
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1
      if (sortBy === 'importDate') return order * (new Date(a.importDate || 0) - new Date(b.importDate || 0))
      if (sortBy === 'stock') return order * (a.stock - b.stock)
      if (sortBy === 'name') return order * a.name.localeCompare(b.name)
      return 0
    })

  return (
    <>
      <Head><title>สินค้า - OK Commobile</title></Head>
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
      <main style={{ padding: '2rem' }}>
        <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem' }}>
          {showForm ? '➖ ย่อฟอร์มเพิ่มสินค้า' : '➕ เพิ่มสินค้า'}
        </button>

        {showForm && (
          <>
            <h1>{editId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}</h1>
            <form onSubmit={handleSubmit}>
              <input name="name" value={form.name} onChange={handleChange} placeholder="ชื่อสินค้า" required />
              <select name="productTypeId" value={form.productTypeId} onChange={handleChange} required>
                <option value="">-- เลือกชนิดสินค้า --</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="จำนวนในสต๊อก" required />
              <input name="costPrice" type="number" value={form.costPrice} onChange={handleChange} placeholder="ราคาทุน" />
              <input name="salePrice" type="number" value={form.salePrice} onChange={handleChange} placeholder="ราคาขาย" />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="รายละเอียดสินค้า" />
              <input name="source" value={form.source} onChange={handleChange} placeholder="ที่มา" />
              <input name="importDate" type="date" value={form.importDate} onChange={handleChange} placeholder="วันที่นำเข้า" />
              <button type="submit">{editId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}</button>
              {editId && (
                <button type="button" onClick={() => {
                  setEditId(null);
                  setForm({
                    name: '', productTypeId: '', stock: '', costPrice: '', salePrice: '', description: '', source: '', importDate: ''
                  });
                }} style={{ marginLeft: '1rem' }}>ยกเลิก</button>
              )}
            </form>
          </>
        )}

        <h2>รายการสินค้า</h2>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาสินค้า..." style={{ marginBottom: '1rem', padding: '8px' }} />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ marginLeft: '1rem' }}>
          <option value="">ทุกประเภท</option>
          {types.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>ชื่อ{getSortIcon("name")}</th>
              <th>ชนิด</th>
              <th onClick={() => handleSort("stock")}>สต๊อก{getSortIcon("stock")}</th>
              <th>ราคาทุน</th>
              <th>ราคาขาย</th>
              <th>ที่มา</th>
              <th onClick={() => handleSort("importDate")}>นำเข้า{getSortIcon("importDate")}</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.productType?.name || '-'}</td>
                <td>{p.stock}</td>
                <td>{p.costPrice || '-'}</td>
                <td>{p.salePrice || '-'}</td>
                <td>{p.source || '-'}</td>
                <td>{p.importDate?.substring(0, 10) || '-'}</td>
                <td>
                  <button onClick={() => startEdit(p)}>แก้ไข</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <style jsx>{`
          table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 1rem;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:nth-child(odd) {
            background-color: #ffffff;
          }
          th {
            background-color: #4caf50;
            color: white;
            cursor: pointer;
          }
          td, th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          form {
            margin-bottom: 2rem;
          }
          input, textarea, select {
            display: block;
            width: 100%;
            margin-bottom: 0.5rem;
            padding: 8px;
          }
        `}</style>
      </main>
    </>
  )
}

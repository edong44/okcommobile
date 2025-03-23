
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ProductTypes() {
  const [types, setTypes] = useState([])
  const [name, setName] = useState('')
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    fetchTypes()
  }, [])

  const fetchTypes = async () => {
    const res = await fetch('/api/product-types')
    const data = await res.json()
    setTypes(data)
  }

  const addType = async (e) => {
    e.preventDefault()
    await fetch('/api/product-types', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    setName('')
    fetchTypes()
  }

  const startEdit = (id, name) => {
    setEditId(id)
    setEditName(name)
  }

  const saveEdit = async () => {
    await fetch(`/api/product-types/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName })
    })
    setEditId(null)
    setEditName('')
    fetchTypes()
  }

  const deleteType = async (id) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบชนิดสินค้านี้?')) return
    const res = await fetch(`/api/product-types/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchTypes()
    } else {
      const err = await res.json()
      alert(err.error || 'ไม่สามารถลบได้')
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>จัดการชนิดสินค้า</h1>
      <form onSubmit={addType}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อชนิดสินค้า" required />
        <button type="submit">เพิ่ม</button>
      </form>

      <ul>
        {types.map((t) => (
          <li key={t.id}>
            {editId === t.id ? (
              <>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} />
                <button onClick={saveEdit}>บันทึก</button>
                <button onClick={() => setEditId(null)}>ยกเลิก</button>
              </>
            ) : (
              <>
                {t.name}
                <button onClick={() => startEdit(t.id, t.name)} style={{ marginLeft: '1rem' }}>แก้ไข</button>
                <button onClick={() => deleteType(t.id)} style={{ color: 'red', marginLeft: '0.5rem' }}>ลบ</button>
              </>
            )}
          </li>
        ))}
      </ul>
<p style={{ marginTop: "1rem" }}>👉 <Link href="/products">กลับไปหน้าเพิ่มสินค้า</Link></p>

    </main>
  )
}

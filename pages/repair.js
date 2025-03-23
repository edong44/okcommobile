
import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Repair() {
  const [repairs, setRepairs] = useState([])
  const [filterStatus, setFilterStatus] = useState('ทั้งหมด')
  const [form, setForm] = useState({
    customer: '', phone: '', phoneModel: '', issue: '', partsUsed: '',
    estimatedPrice: '', actualPrice: '', receivedAt: '', completedAt: ''
  })
  const [message, setMessage] = useState('')
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({
    customer: '', phone: '', phoneModel: '', issue: '', partsUsed: '',
    estimatedPrice: '', actualPrice: '', receivedAt: '', completedAt: '', status: 'รอซ่อม'
  })

  useEffect(() => { fetchRepairs() }, [])

  const fetchRepairs = async () => {
    const res = await fetch('/api/repairs')
    const data = await res.json()
    setRepairs(data)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    const res = await fetch('/api/repairs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setForm({ customer: '', phone: '', phoneModel: '', issue: '', partsUsed: '', estimatedPrice: '', actualPrice: '', receivedAt: '', completedAt: '' })
      setMessage('✅ บันทึกงานซ่อมเรียบร้อยแล้ว')
      fetchRepairs()
    } else {
      const err = await res.json()
      setMessage('❌ ' + (err.error || 'เกิดข้อผิดพลาด'))
    }
  }

  const startEdit = (r) => {
    setEditId(r.id)
    setEditForm({
      customer: r.customer, phone: r.phone, phoneModel: r.phoneModel,
      issue: r.issue, partsUsed: r.partsUsed || '', estimatedPrice: r.estimatedPrice || '',
      actualPrice: r.actualPrice || '', receivedAt: r.receivedAt?.substring(0, 10) || '',
      completedAt: r.completedAt?.substring(0, 10) || '', status: r.status
    })
  }

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value })
  }

  const saveEdit = async () => {
    const res = await fetch(`/api/repairs/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm)
    })
    if (res.ok) {
      setEditId(null)
      fetchRepairs()
    } else {
      const err = await res.json()
      setMessage('❌ ' + (err.error || 'ไม่สามารถอัปเดตข้อมูลได้'))
    }
  }

  const deleteRepair = async (id) => {
    if (!confirm('คุณแน่ใจว่าต้องการลบงานซ่อมนี้?')) return
    const res = await fetch(`/api/repairs/${id}`, { method: 'DELETE' })
    if (res.ok) fetchRepairs()
    else alert('ลบไม่สำเร็จ')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'รอซ่อม': return 'gray'
      case 'กำลังซ่อม': return 'blue'
      case 'ซ่อมเสร็จแล้ว': return 'green'
      case 'คืนเครื่อง': return 'orange'
      case 'จบงานซ่อม': return 'purple'
      default: return 'black'
    }
  }

  const filteredRepairs = repairs.filter(r => filterStatus === 'ทั้งหมด' || r.status === filterStatus)

  return (
    <>
      <Head><title>รับงานซ่อม - OK Commobile</title></Head>
      <header className="header">
        <h1>สินค้า</h1>
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
      <main style={{ padding: '2rem' }}>
        <h1>เพิ่มงานซ่อม</h1>
        <form onSubmit={handleSubmit}>
          <input name="customer" value={form.customer} onChange={handleChange} placeholder="ชื่อลูกค้า" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="เบอร์โทร" />
          <input name="phoneModel" value={form.phoneModel} onChange={handleChange} placeholder="รุ่นโทรศัพท์" />
          <textarea name="issue" value={form.issue} onChange={handleChange} placeholder="อาการเสีย" />
          <input name="partsUsed" value={form.partsUsed} onChange={handleChange} placeholder="อะไหล่ที่ใช้" />
          <input type="number" name="estimatedPrice" value={form.estimatedPrice} onChange={handleChange} placeholder="ราคาประเมิน" />
          <input type="number" name="actualPrice" value={form.actualPrice} onChange={handleChange} placeholder="ราคาจริง" />
          <input type="date" name="receivedAt" value={form.receivedAt} onChange={handleChange} />
          <input type="date" name="completedAt" value={form.completedAt} onChange={handleChange} />
          <button type="submit">บันทึก</button>
        </form>

        {message && <p>{message}</p>}

        <h2>รายการงานซ่อม</h2>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="ทั้งหมด">ทั้งหมด</option>
          <option value="รอซ่อม">รอซ่อม</option>
          <option value="กำลังซ่อม">กำลังซ่อม</option>
          <option value="ซ่อมเสร็จแล้ว">ซ่อมเสร็จแล้ว</option>
          <option value="คืนเครื่อง">คืนเครื่อง</option>
          <option value="จบงานซ่อม">จบงานซ่อม</option>
        </select>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
          {filteredRepairs.map((r) => (
            <div key={r.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', minWidth: '300px', backgroundColor:'#ffff99' }}>
              {editId === r.id ? (
                <>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>ชื่อลูกค้า:</em><input name="customer" value={editForm.customer} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>เบอร์โทร:</em><input name="phone" value={editForm.phone} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>รุ่น:</em><input name="phoneModel" value={editForm.phoneModel} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>อาการเสีย:</em><textarea name="issue" value={editForm.issue} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>อะไหล่:</em><input name="partsUsed" value={editForm.partsUsed} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>ราคาประเมิน:</em><input name="estimatedPrice" value={editForm.estimatedPrice} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>ราคาจริง:</em><input name="actualPrice" value={editForm.actualPrice} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>วันที่รับ:</em><input type="date" name="receivedAt" value={editForm.receivedAt} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}><em>วันที่เสร็จ:</em><input type="date" name="completedAt" value={editForm.completedAt} onChange={handleEditChange} /></div>
<div style={{ display: 'flex', gap: '0.5rem' }}>
<em>สถานะ:</em>
<select name="status" value={editForm.status} onChange={handleEditChange}>
  <option value="รอซ่อม">รอซ่อม</option>
  <option value="กำลังซ่อม">กำลังซ่อม</option>
  <option value="ซ่อมเสร็จแล้ว">ซ่อมเสร็จแล้ว</option>
  <option value="คืนเครื่อง">คืนเครื่อง</option>
  <option value="จบงานซ่อม">จบงานซ่อม</option>
</select>
</div>
<div>
  <button onClick={saveEdit}>บันทึก</button>
  <button onClick={() => setEditId(null)} style={{ marginLeft: '0.5rem' }}>ยกเลิก</button>
</div>
                </>
              ) : (
                <>
                  <strong>{r.customer}</strong> ({r.phone})<br />
                  <em>รุ่น:</em> {r.phoneModel}<br />
                  <em>อาการ:</em> {r.issue}<br />
                  <em>อะไหล่:</em> {r.partsUsed || '-'}<br />
                  <em>ราคาประเมิน:</em> {r.estimatedPrice || '-'} บาท<br />
                  <em>ราคาจริง:</em> {r.actualPrice || '-'} บาท<br />
                  <em>รับเมื่อ:</em> {r.receivedAt?.substring(0, 10)}<br />
                  <em>เสร็จเมื่อ:</em> {r.completedAt?.substring(0, 10) || '-'}<br />
                  <em style={{ color: getStatusColor(r.status) }}>สถานะ: {r.status}</em><br />
                  <button onClick={() => startEdit(r)}>แก้ไข</button>
                  <button onClick={() => deleteRepair(r.id)} style={{ marginLeft: '0.5rem', color: 'red' }}>ลบ</button>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

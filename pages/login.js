
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    if (res.ok) {
      router.push('/admin')
    } else {
      setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  return (
    <>
      <Head>
        <title>เข้าสู่ระบบผู้ดูแล - OK Commobile</title>
      </Head>

      <main className="main" style={{ maxWidth: '400px', margin: '4rem auto' }}>
        <h2>เข้าสู่ระบบผู้ดูแล</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">เข้าสู่ระบบ</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </main>
    </>
  )
}

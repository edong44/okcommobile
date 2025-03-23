
import { parse } from 'cookie'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Admin({ isAuthenticated }) {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated])

  if (!isAuthenticated) return null

  return (
    <main style={{ padding: '2rem' }}>
      <h1>ยินดีต้อนรับผู้ดูแลระบบ</h1>
      {/* เนื้อหาแอดมินต่าง ๆ */}
    </main>
  )
}

export async function getServerSideProps({ req }) {
  const cookies = parse(req.headers.cookie || '')
  const token = cookies.admin_token

  return {
    props: {
      isAuthenticated: token === 'okcommobile-secret'
    }
  }
}

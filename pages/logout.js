import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    const logout = async () => {
      await fetch('/api/auth/logout')
      router.push('/login')
    }
    logout()
  }, [router])

  return <p>กำลังออกจากระบบ...</p>
}

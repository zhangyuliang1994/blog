'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// 需要预加载的路径列表
const PATHS_TO_PREFETCH = [
  '/',
  '/about',
  '/blog',
  '/projects',
  '/links',
  '/guestbook',
  '/tags'
]

export default function ClientNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // 预取主要页面
    PATHS_TO_PREFETCH.forEach((path) => {
      if (path !== pathname) {
        // 这个操作是非阻塞的，不会影响当前页面性能
        router.prefetch(path)
      }
    })
  }, [pathname, router])
  
  // 这是一个纯功能组件，不渲染任何内容
  return null
} 
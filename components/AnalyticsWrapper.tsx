'use client'

import { Analytics } from '@vercel/analytics/react'
import { useEffect, useState } from 'react'

export default function AnalyticsWrapper() {
  const [isDev, setIsDev] = useState(true)
  
  useEffect(() => {
    // 只在客户端判断是否为开发环境
    setIsDev(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  }, [])
  
  if (isDev) {
    return null
  }
  
  return <Analytics />
} 
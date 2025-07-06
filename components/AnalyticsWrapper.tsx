'use client'

import { Analytics } from '@vercel/analytics/react'
import { useEffect, useState } from 'react'

export default function AnalyticsWrapper() {
  const [isStatic, setIsStatic] = useState(true)
  
  useEffect(() => {
    // 检测是否为静态导出环境
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isVercelDeployment = window.location.hostname.includes('vercel.app') || process.env.VERCEL === '1'
    
    // 只在 Vercel 动态部署环境下启用 Analytics
    setIsStatic(isDev || !isVercelDeployment)
  }, [])
  
  if (isStatic) {
    return null
  }
  
  return <Analytics />
} 
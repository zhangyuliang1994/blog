'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, theme, setTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        aria-label="选择系统主题"
        onClick={() => setTheme('system')}
        className={`p-1 rounded-md ${theme === 'system' ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
        title="系统主题"
      >
        <Monitor size={18} />
      </button>
      <button
        aria-label="切换亮暗模式"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        className="p-1 rounded-md"
        title={resolvedTheme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      >
        {mounted && resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </div>
  )
}

export default ThemeSwitch

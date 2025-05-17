'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(true)
  const twikooRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<string>('light')

  // 当暗/亮模式变化时更新评论系统主题
  useEffect(() => {
    if (resolvedTheme) {
      setCurrentTheme(resolvedTheme)
    }
  }, [resolvedTheme])

  useEffect(() => {
    // 动态导入twikoo
    const initTwikoo = async () => {
      try {
        // @ts-ignore
        const twikoo = await import('twikoo')
        if (twikooRef.current) {
          twikoo.init({
            envId: 'https://twikoo.xiaofeng.show/', // 您的环境ID
            el: '#twikoo-comments',
            path: slug, // 使用slug作为页面路径
            lang: 'zh-CN',
            darkMode: currentTheme === 'dark'
          })
        }
      } catch (error) {
        console.error('加载Twikoo评论系统失败:', error)
      }
    }

    initTwikoo()
  }, [slug, currentTheme])

  // 当主题变化时重新初始化评论
  useEffect(() => {
    const twikooContainer = document.getElementById('twikoo-comments')
    if (twikooContainer) {
      // 清空容器
      twikooContainer.innerHTML = ''
      
      // 重新初始化
      const initTwikooTheme = async () => {
        try {
          // @ts-ignore
          const twikoo = await import('twikoo')
          twikoo.init({
            envId: 'https://twikoo.xiaofeng.show/', // 您的环境ID
            el: '#twikoo-comments',
            path: slug,
            lang: 'zh-CN',
            darkMode: currentTheme === 'dark'
          })
        } catch (error) {
          console.error('更新Twikoo主题失败:', error)
        }
      }
      
      initTwikooTheme()
    }
  }, [currentTheme, slug])

  return (
    <div className="pt-6 pb-6 text-gray-700 dark:text-gray-300">
      <div 
        ref={twikooRef} 
        id="twikoo-comments" 
      />
    </div>
  )
}

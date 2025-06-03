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
            darkMode: currentTheme === 'dark',
            // 添加博主配置
            admin: '张晓风',
            adminLabel: '博主',
            avatar: '/static/images/avatar.png',
            master: 'zhangyuliang9425@gmail.com' // 添加博主邮箱
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
            darkMode: currentTheme === 'dark',
            // 添加博主配置
            admin: '张晓风',
            adminLabel: '博主',
            avatar: '/static/images/avatar.png',
            master: 'zhangyuliang9425@gmail.com' // 添加博主邮箱
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
      <style jsx global>{`
        /* 只修复头像相关样式 */
        .tk-avatar,
        .tk-avatar-container,
        .tk-avatar img {
          width: 56px !important;
          height: 56px !important;
          border-radius: 50% !important;
          overflow: hidden !important;
          position: relative !important;
        }

        .tk-avatar img {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          margin: 0 !important;
        }

        /* 确保图片不会被拉伸 */
        img {
          max-width: none !important;
        }

        /* 博主标签样式 */
        .tk-admin-label {
          background-color: #1e88e5 !important;
          color: white !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          font-size: 12px !important;
          margin-left: 6px !important;
        }
      `}</style>
      <div 
        ref={twikooRef} 
        id="twikoo-comments" 
      />
    </div>
  )
}

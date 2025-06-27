'use client'

import { useState } from 'react'

interface PostPasswordPromptProps {
  onCorrectPassword: () => void
  password_real: string
}

export default function PostPasswordPrompt({ onCorrectPassword, password_real }: PostPasswordPromptProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === password_real) {
      onCorrectPassword()
      setError('')
      // Store verified status in session storage to avoid re-entering password on refresh
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('post_unlocked_2025-05-monthly-report', 'true')
      }
    } else {
      setError('密码错误，请重试')
    }
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          这篇文章受密码保护
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          请输入密码以查看内容。
        </p>
      </div>
      <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
        <div className="flex flex-col items-center justify-center pt-8 xl:col-span-3">
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none dark:text-gray-200"
                type="password"
                placeholder="请输入密码"
                aria-label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="flex-shrink-0 rounded border-4 border-teal-500 bg-teal-500 px-2 py-1 text-sm text-white hover:border-teal-700 hover:bg-teal-700"
                type="submit"
              >
                提交
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
} 
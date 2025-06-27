'use client'

import React from 'react'
import siteMetadata from '@/data/siteMetadata'

const MonthlyReportCard = () => {
  const StatItem = ({ label, value, emoji }) => (
    <div className="flex items-center justify-between rounded-lg bg-gray-200 p-3 dark:bg-gray-700">
      <div className="flex items-center">
        <span className="mr-2 text-xl">{emoji}</span>
        <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
      </div>
      <span className="font-semibold text-primary-500">{value}</span>
    </div>
  )

  const EventItem = ({ emoji, text }) => (
    <li className="flex items-start">
      <span className="mr-3 text-xl">{emoji}</span>
      <span>{text}</span>
    </li>
  )

  return (
    <div className="relative my-8">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col items-center sm:flex-row">
          <div className="mb-4 sm:mb-0 sm:mr-6">
            <img src={siteMetadata.siteLogo} alt="Logo" className="h-20 w-20 rounded-full" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              BAT董事会 · 2025年5月月报
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              本月关键词：结婚、生娃、跑路、薅羊毛
            </p>
          </div>
        </div>

        <div className="my-6 h-px bg-gray-200 dark:bg-gray-700"></div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <StatItem emoji="💬" label="本月金句" value="天天想跑路,月月拿满勤" />
          <StatItem emoji="😂" label="吹水指数" value="★★★★★" />
          <StatItem emoji="🐑" label="羊毛指数" value="★★★★★" />
          <StatItem emoji="🏆" label="本月赢家" value="臧浩然 & 许浩杰" />
        </div>

        <div className="my-6 h-px bg-gray-200 dark:bg-gray-700"></div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">✨ 本月大事记</h3>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <EventItem emoji="🤵" text="恭喜臧哥喜提已婚人士身份，光速完成人生大事！" />
            <EventItem emoji="🍼" text="恭喜浩杰喜提准爸爸身份，群聊育儿经讨论热度飙升！" />
            <EventItem
              emoji="😫"
              text='节后综合症席卷全群，"班味儿"过敏，跑路意愿空前高涨。'
            />
            <EventItem
              emoji="🚀"
              text='"别人家的公司"成功破防，英语学习被提上日程！'
            />
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MonthlyReportCard 
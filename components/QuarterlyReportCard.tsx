'use client'

import React from 'react'
import siteMetadata from '@/data/siteMetadata'

const QuarterlyReportCard = ({ report }) => {
  if (!report) {
    return null
  }

  const { title, keywords, stats, events } = report

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">本季关键词：{keywords}</p>
          </div>
        </div>

        <div className="my-6 h-px bg-gray-200 dark:bg-gray-700"></div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {stats.map((stat, index) => (
            <StatItem key={index} emoji={stat.emoji} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="my-6 h-px bg-gray-200 dark:bg-gray-700"></div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-200">
            ✨ 本季大事记
          </h3>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            {events.map((event, index) => (
              <EventItem key={index} emoji={event.emoji} text={event.text} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default QuarterlyReportCard 
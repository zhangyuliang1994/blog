import Image from 'next/image'
import { genPageMetadata } from 'app/seo'
import Comments from '@/components/Comments'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({ title: '留言板' })

export default function GuestbookPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          留言板
        </h1>
      </div>

      <div className="items-start space-y-2 py-6 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
        <div className="flex flex-col items-center pt-8 xl:sticky xl:top-0">
          <Image
            src="/static/images/ocean.jpeg"
            alt="留言板"
            width={320}
            height={240}
            className="h-48 w-48 rounded-lg object-cover object-center"
          />
        </div>

        <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            欢迎来到留言板！这里是一个开放的交流空间，您可以在这里：
          </p>
          
          <ul className="list-disc pl-6 text-gray-500 dark:text-gray-400">
            <li>分享您的想法和建议</li>
            <li>提出问题或讨论感兴趣的话题</li>
            <li>留下您的足迹，与我和其他访客互动</li>
            <li>给予鼓励或提供宝贵的反馈</li>
          </ul>
          
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            我会认真阅读每一条留言，并尽可能及时回复。感谢您的参与和支持！
          </p>
          
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">留下您的足迹</h2>
            <Comments slug="guestbook" />
          </div>
        </div>
      </div>
    </div>
  )
} 
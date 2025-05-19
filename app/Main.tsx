import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Image from 'next/image'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <div className="flex items-center justify-between space-y-4 mt-7">
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            <span className="wave">👋🏻</span>, <span>我是 </span>
            <span className="text-sky-500 dark:text-teal-400">晓风</span>
          </h1>
          <p>欢迎来到我的博客 - 在这里我分享我喜欢的一切。</p>
          <Link
            href="/about"
            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
          >
            关于我
          </Link>
        </div>
        <div className="rounded-full md:hidden shadow-lg ">
          <Image
            src="/static/images/avatar.png"
            alt="头像"
            width={150}
            height={150}
            priority
            className="h-50 w-50 rounded-full shadow-gray-300"
          />
        </div>
        <Image
          src="/static/images/avatar.png"
          alt="头像"
          width={200}
          height={200}
          priority
          className="h-50 w-50 rounded-full hidden md:block shadow-lg shadow-gray-400"
        />
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-0 mt-3 md:mt-0 pb-2 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            最新文章
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            探索最新发布的文章。
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && '暂无文章。'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags } = post
            return (
              <li key={slug} className="py-4">
                <article>
                  <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                    <dl>
                      <dt className="sr-only">发布于</dt>
                      <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                      </dd>
                    </dl>
                    <div className="space-y-5 xl:col-span-3 hover:lg:bg-gray-100 hover:lg:dark:bg-zinc-800/90 xl:p-4 xl:-ml-6 rounded-lg">
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold  leading-8 tracking-tight">
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-800 hover:underline underline-offset-4 dark:text-gray-100 hover:dark:text-green-400"
                            >
                              <div>{title}</div>
                            </Link>
                          </h2>
                          <div className="flex flex-wrap">
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {summary}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`阅读 "${title}"`}
                        >
                          阅读更多 &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="所有文章"
          >
            所有文章 &rarr;
          </Link>
        </div>
      )}
      {/* {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )} */}
    </>
  )
}

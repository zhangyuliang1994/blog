'use client'

import { ReactNode, useState, useEffect } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/ImageZoom'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import TableOfContents from '@/components/TableOfContents'
import { Toc } from '@/components/remark-toc-headings'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, toc } = content
  const basePath = path.split('/')[0]
  const [readingProgress, setReadingProgress] = useState<number>(0)
  
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollPercent = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
      setReadingProgress(scrollPercent > 100 ? 100 : (scrollPercent < 0 ? 0 : scrollPercent))
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 对目录进行编号处理
  const generateNumberedToc = (items: Toc): (Toc[number] & { prefix: string })[] => {
    let level1Counter = 0;
    let level2Counter = 0;
    let level3Counter = 0;
    
    return items.map((item) => {
      let prefix = '';
      if (item.depth === 1 || item.depth === 2) {
        level1Counter++;
        level2Counter = 0;
        level3Counter = 0;
        prefix = `${level1Counter}. `;
      } else if (item.depth === 3) {
        if (level2Counter === 0) level2Counter = 1;
        level2Counter++;
        level3Counter = 0;
        prefix = `${level1Counter}.${level2Counter - 1} `;
      } else if (item.depth === 4) {
        if (level3Counter === 0) level3Counter = 1;
        level3Counter++;
        prefix = `${level1Counter}.${level2Counter - 1}.${level3Counter - 1} `;
      }
      
      return {
        ...item,
        prefix,
      };
    });
  };
  
  const numberedToc = toc && Array.isArray(toc) ? generateNumberedToc(toc as Toc) : [];

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">发布于</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="pb-10 pt-6 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">作者</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8 bg-gray-200 dark:bg-zinc-700/70 p-2 rounded-lg shadow-md hover:bg-gray-300 hover:dark:bg-zinc-700">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-base font-medium leading-5">
                        <dt className="sr-only">姓名</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Linkedin</dt>
                        <dd>
                          {author.linkedin && (
                            <Link
                              href={author.linkedin}
                              className="text-primary-500 dark:text-green-400 font-bold hover:text-primary-600 dark:hover:text-green-500"
                            >
                              {author.linkedin.replace('https://www.linkedin.com/in/', 'linkedin/')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
              
              {/* 添加移动端目录，在小屏幕上显示，在xl屏幕上隐藏 */}
              {toc && (
                <div className="mt-6 block xl:hidden">
                  <details className="bg-gray-200 dark:bg-zinc-800/95 rounded-lg py-2 shadow-md">
                    <summary className="ml-3 text-lg font-bold cursor-pointer text-gray-900 dark:text-gray-100 flex justify-between items-center px-2">
                      <span>目录</span>
                      <span className="text-sm font-medium px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-green-300">
                        {readingProgress}%
                      </span>
                    </summary>
                    <div className="mx-2 py-2">
                      <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                        {numberedToc.map((heading) => (
                          <li
                            key={heading.value}
                            className={`
                              ${heading.depth === 2 ? 'pl-0' : ''}
                              ${heading.depth === 3 ? 'pl-4' : ''}
                              ${heading.depth === 4 ? 'pl-8' : ''}
                              ${heading.depth > 4 ? 'pl-12' : ''}
                              py-1
                            `}
                          >
                            <a
                              href={heading.url}
                              className="text-sm block hover:text-primary-500 dark:hover:text-green-400"
                            >
                              <span className="font-medium mr-1">{heading.prefix}</span>
                              {heading.value}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              )}
            </dl>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
              {/* <div className="pb-6 pt-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={editUrl(filePath)}>在GitHub上查看</Link>
              </div> */}
              {siteMetadata.comments && (
                <div
                  className="pb-6 pt-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      标签
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          上一篇文章
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          下一篇文章
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                  aria-label="返回博客"
                >
                  &larr; 返回博客
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
      
      {/* 添加左侧固定目录导航 */}
      {toc && Array.isArray(toc) && toc.length > 0 && <TableOfContents toc={toc as Toc} />}
    </SectionContainer>
  )
}

'use client'

import { useState, useEffect } from 'react'
import 'css/prism.css'
import 'katex/dist/katex.css'
import PageTitle from '@/components/PageTitle'
import PostPasswordPrompt from '@/components/PostPasswordPrompt'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { coreContent } from 'pliny/utils/contentlayer'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}

interface BlogPostPageProps {
  post: Blog
  authorDetails: any[]
  prev: any
  next: any
  isProduction: boolean
  children: React.ReactNode
}

export default function BlogPostPage({
  post,
  authorDetails,
  prev,
  next,
  isProduction,
  children,
}: BlogPostPageProps) {
  const [unlocked, setUnlocked] = useState(false)
  const postWithPassword = post as Blog & { password?: string }

  useEffect(() => {
    if (postWithPassword.password) {
      const isUnlocked = sessionStorage.getItem(`post_unlocked_${postWithPassword.slug}`) === 'true'
      if (isUnlocked) {
        setUnlocked(true)
      }
    }
  }, [postWithPassword.password, postWithPassword.slug])

  if (isProduction && postWithPassword.draft === true) {
    return (
      <div className="mt-24 text-center">
        <PageTitle>
          Under Construction{' '}
          <span role="img" aria-label="roadwork sign">
            🚧
          </span>
        </PageTitle>
      </div>
    )
  }

  const mainContent = coreContent(post)
  const Layout = layouts[post.layout || defaultLayout]

  const jsonLd = post.structuredData
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name,
    }
  })

  if (postWithPassword.password && !unlocked) {
    return (
      <PostPasswordPrompt
        password_real={postWithPassword.password}
        onCorrectPassword={() => {
          sessionStorage.setItem(`post_unlocked_${postWithPassword.slug}`, 'true')
          setUnlocked(true)
        }}
      />
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        {children}
      </Layout>
    </>
  )
} 
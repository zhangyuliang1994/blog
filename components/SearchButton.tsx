'use client'

import { AlgoliaButton } from 'pliny/search/AlgoliaButton'
import ChineseSearch from '@/components/search/ChineseSearch'
import siteMetadata from '@/data/siteMetadata'
import { Search } from 'lucide-react'

const SearchButton = () => {
  if (!siteMetadata.search) {
    return null
  }
  
  // 使用我们的中文搜索组件，完全替代KBar
  if (siteMetadata.search.provider === 'kbar') {
    return <ChineseSearch />
  }
  
  // 使用原始Algolia按钮
  if (siteMetadata.search.provider === 'algolia') {
    return (
      <AlgoliaButton aria-label="搜索">
        <Search />
      </AlgoliaButton>
    )
  }
  
  return null
}

export default SearchButton

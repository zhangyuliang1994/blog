import { Doc } from 'contentlayer/generated'

export const sortDocs = (docs: Doc[]) => {
  return docs.sort((a, b) => {
    // 提取主目录编号（例如从"01-development-preparation/1.0-开发前期准备"中提取"01"）
    const aMainDir = a.slug.split('/')[0].split('-')[0]
    const bMainDir = b.slug.split('/')[0].split('-')[0]
    
    // 首先按主目录排序
    if (aMainDir !== bMainDir) {
      return parseInt(aMainDir) - parseInt(bMainDir)
    }
    
    // 如果在同一个主目录，则按order属性排序
    return a.order - b.order
  })
} 
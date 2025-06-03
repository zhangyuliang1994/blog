// 移除导入并直接定义TechStack类型
type TechStack = string

interface ProjectDataProps {
  title: string
  description: string
  imgSrc: string
  href: string
  techStack: TechStack[]
}

const projectsData: ProjectDataProps[] = [
  {
  title: 'Harry Potter 霍格沃茨分院帽测试网站',
  description: 
    'Harry Potter 霍格沃茨分院帽测试网站是一个沉浸式的魔法世界体验平台。包含智能分院测试、AI驱动的分院帽问答系统、四大学院详细介绍、多语言支持(中英文)等功能。网站采用霍格沃茨夜景背景，配有漂浮灯笼、湖面反光等魔法视觉效果，以及定制的魔法棒光标。集成Google Gemini AI提供个性化的分院帽回答，完全部署在Vercel平台上。',
  href: 'https://harrypotter.cc',
  imgSrc: '/static/images/harry-potter-website.png',
  techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Google Gemini AI', 'Vercel'],
  }
]

export default projectsData

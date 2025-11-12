interface FriendDataProps {
  name: string
  description: string
  url: string
  avatar?: string
}

const friendsData: FriendDataProps[] = [
  {
    name: '张晓风的博客',
    description: '分享技术学习笔记，包括MySQL、Redis、Spring、Nginx、Docker等技术内容',
    url: 'https://zhangyuliang1994.github.io/',
  },
  {
    name: 'Jason Xu',
    description: '欲买桂花同载酒，终不似，少年游。个人技术博客，分享编程与生活',
    url: 'https://www.xhjvyq.cn/',
  },
  {
    name: 'Kibou',
    description: 'Yuisama 的个人博客，记录技术、生活与思考。',
    url: 'https://blog.yuisama.top:8000/kibou',
  },
]

export default friendsData


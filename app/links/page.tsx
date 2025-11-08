import friendsData from '@/data/friendsData'
import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import Image from '@/components/ImageZoom'

export const metadata = genPageMetadata({ title: '友链' })

export default function Links() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            友链
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            一些朋友的博客，值得关注和阅读。
          </p>
        </div>
        <div className="py-5">
          {friendsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                暂无友链，欢迎交换友链！
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {friendsData.map((friend) => (
                <Link
                  key={friend.url}
                  href={friend.url}
                  className="group block p-6 rounded-xl border-2 border-zinc-300 hover:border-black dark:border-zinc-700 hover:dark:border-white/90 transition-all duration-200 hover:shadow-lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-start space-x-4">
                    {friend.avatar && (
                      <div className="flex-shrink-0">
                        <Image
                          alt={friend.name}
                          src={friend.avatar}
                          className="rounded-full w-16 h-16 object-cover"
                          width={64}
                          height={64}
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                        {friend.name}
                        <span className="ml-2 text-sm text-gray-400">→</span>
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {friend.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}


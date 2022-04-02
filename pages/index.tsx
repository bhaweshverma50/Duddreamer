import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../types'

interface Props {
  posts: [Post]
}

export default function Home({ posts }: Props) {
  return (
    <div>
      <Head>
        <title>Duddreamer | Blogs</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="flex items-center justify-between bg-yellow-400">
        <div className="space-y-5 px-8 pt-5">
          {/* <h1>DudDreamer: Don't just dream, share your dreams with others</h1> */}
          <h1 className="max-w-l font-serif text-4xl font-medium text-slate-800 md:text-6xl md:text-5xl">
            DudDreamer: Why dream alone when you can share it with others
          </h1>
          <h2 className="text-md max-w-l pb-6 font-serif md:pb-4 md:text-xl">
            Ever got curious about what you dreamt last light or if your dream
            means anything? Struggling to remember your dreams from past?
            Wondering if others had a same dream as you? Well, here you can
            connect with people and read what others are dreaming these days.
          </h2>
        </div>
        <img
          style={{ transform: 'rotate(28deg)' }}
          className="m-1 hidden h-80 w-80 opacity-75 md:inline-flex"
          src="/dream.svg"
          alt="dream-logo"
        />
      </div>
      <p className="mx-3 my-5 text-2xl font-bold md:mx-8">Posts</p>
      <div className="w-100 mx-3 grid grid-cols-1 sm:grid-cols-2 sm:gap-5 md:mx-8 lg:grid-cols-3">
        {posts.map((post) => (
          <Link href={`/post/slug=${post.slug.current}`} key={post._id}>
            <div className="my-2 overflow-hidden rounded-lg border-2 border-yellow-500 bg-gray-600 text-white">
              <div>
                <img
                  className="h-60 w-full object-cover"
                  src={urlFor(post.mainImage).url()!}
                  alt="banner-image"
                />
              </div>
              <div className="px-4 py-3">
                <p className="text-xl font-medium">{post.title}</p>
                <p className="pt-1 text-[1rem] font-extralight line-clamp-4">
                  {post.description}
                </p>
                <div className="align-center flex gap-3 pt-6 pb-2 text-sm font-thin text-slate-300">
                  <img
                    className="h-8 w-8 rounded-sm border-2 border-slate-900"
                    src={urlFor(post.author.image).width(50).url()!}
                    alt=""
                  />
                  <div className="flex items-center justify-center">
                    Post by {post.author.name} on{' '}
                    {new Date(post._createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type=="post"]{
  _id, title, _createdAt,
  author -> {
  name,
  image
},
description,
mainImage,
slug
}`

  const posts = await sanityClient.fetch(query)

  return {
    props: {
      posts,
    },
  }
}

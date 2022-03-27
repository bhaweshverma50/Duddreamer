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
          <h2 className="text-md max-w-l pb-6 font-serif md:pb-1 md:text-xl">
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
      <div>
        {posts.map((post) => (
          <Link href={`/post/slug=${post.slug.current}`} key={post._id}>
            <div>
              <img
                src={urlFor(post.mainImage).width(600).url()!}
                alt="banner-image"
              />
              <div>
                <p>{post.title}</p>
                <p>
                  {post.description} by {post.author.name}
                </p>
              </div>
              <img src={urlFor(post.author.image).width(50).url()!} alt="" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type=="post"]{
  _id, title,
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

import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../types'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'
import Head from 'next/head'

interface Props {
  post: Post
}

function Post({ post }: Props): JSX.Element {
  return (
    <div>
      <Head>
        <title>DudDreamer | {post.title}</title>
      </Head>
      <Header />
      <div>
        <img
          className="h-40 w-full object-cover"
          src={urlFor(post.mainImage).url()!}
          alt="banner-image"
        />
        <article className="mx-auto max-w-3xl p-5">
          <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
          <h2 className="text-l mb-2 font-light text-gray-500">
            {post.description}
          </h2>
          <div>
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
              projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1 className="my-5 text-3xl font-bold">{props.children}</h1>
                ),
                h2: (props: any) => (
                  <h2 className="my-5 text-2xl font-bold">{props.children}</h2>
                ),
                h3: (props: any) => (
                  <h3 className="my-5 text-2xl font-bold">{props.children}</h3>
                ),
                h4: (props: any) => (
                  <h4 className="text-l my-5 font-bold">{props.children}</h4>
                ),
                li: ({ children }: any) => (
                  <li className="ml-10 list-disc">{children}</li>
                ),
                p: ({ children }: any) => <p className="my-4">{children}</p>,
                blockquote: (props: any) => (
                  <blockquote className="my-4">{props.children}</blockquote>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-blue-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
      </div>
    </div>
  )
}

export default Post

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`

  const post = await sanityClient.fetch(query)

  const paths = post.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }))

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
            title,
            description,
            mainImage,
            slug,
            body,
            author->{
                name,
                image
            },
            'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
        }`

  const post = await sanityClient.fetch(query, {
    slug: params?.slug?.slice(5),
  })

  if (!post) {
    return { notFound: true }
  }
  return {
    props: {
      post,
    },
    revalidate: 60 * 60,
  }
}

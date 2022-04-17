import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../types'
import { GetStaticProps } from 'next'
import PortableText from 'react-portable-text'

interface Props {
  post: Post
}

function Post({ post }: Props): JSX.Element {
  return (
    <div>
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
    slug: params.slug.split('=')[1],
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

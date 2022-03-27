import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../types'
import { GetStaticProps } from 'next'

interface Props {
  post: [Post]
}

function Post({ post }: Props) {
  return (
    <div>
      <Header />
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
  const query = `*[_type == "post" && slug.current == 'my-first-dream'][0]{
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

  const post = await sanityClient.fetch(query, { slug: params?.slug })

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

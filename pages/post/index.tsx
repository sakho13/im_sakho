import type { GetStaticProps, NextPage } from "next"
import PostList from "../../components/post_list"
import { PostController } from "../../lib/post/PostController"
import styles from "../../styles/post_index.module.scss"
import { PostType } from "../api/api_output_types"

export type PostListProps = {
  posts: PostType[]
}

const Post: NextPage<PostListProps> = (props: PostListProps) => {
  return (
    <div className={styles.container}>
      <PostList posts={props.posts} />
    </div>
  )
}

export const getStaticProps: GetStaticProps<PostListProps> = async () => {
  const postController = new PostController()

  const posts = await postController.getPosts()

  return {
    props: {
      posts,
    },
  }
}

export default Post

import type { GetStaticProps, NextPage } from "next"
import PostList from "@/components/post_list"
import { PostController } from "@/lib/post/PostController"
import styles from "@/styles/post_index.module.scss"
import { BlogInfo } from "@/types/blog"

export type PostListOnlyProps = {
  blogs: BlogInfo[]
}

const Post: NextPage<PostListOnlyProps> = ({ blogs }: PostListOnlyProps) => {
  return (
    <div className={styles.container}>
      <PostList blogs={blogs} />
    </div>
  )
}

export const getStaticProps: GetStaticProps<PostListOnlyProps> = async () => {
  const postController = new PostController()

  const blogs = await postController.getMicroCMSPosts()

  return {
    props: {
      blogs,
    },
  }
}

export default Post

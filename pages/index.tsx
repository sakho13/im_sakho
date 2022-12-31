import type { GetStaticProps, NextPage } from "next"
import PostList from "../components/post_list"
import AboutMe from "../components/about_me"
import { Grid } from "@nextui-org/react"
import { PostListProps } from "./post"
import { PostController } from "../lib/post/PostController"

const Home: NextPage<PostListProps> = ({ posts }: PostListProps) => {
  return (
    <Grid.Container>
      <Grid xs={12} md={5} justify="center">
        <AboutMe />
      </Grid>
      <Grid xs={12} md={7} justify="center">
        <PostList posts={posts} />
      </Grid>
    </Grid.Container>
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

export default Home

import type { GetStaticProps, NextPage } from "next"
import PostList from "../components/post_list"
import AboutMe from "../components/about_me"
import { Grid } from "@nextui-org/react"
import { PostController } from "../lib/post/PostController"
import { BlogInfo } from "@/types/blog"

type HomeProps = {
  blogs: BlogInfo[]
}

const Home: NextPage<HomeProps> = ({ blogs }: HomeProps) => {
  return (
    <Grid.Container>
      <Grid xs={12} md={5} justify="center">
        <AboutMe />
      </Grid>
      <Grid xs={12} md={7} justify="center">
        <PostList blogs={blogs} />
      </Grid>
    </Grid.Container>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const postController = new PostController()

  const blogs = await postController.getMicroCMSPosts()

  return {
    props: {
      blogs,
    },
  }
}

export default Home

import type { GetStaticProps, NextPage } from "next"
import PostList from "@/components/post_list"
import AboutMe from "@/components/about_me"
import { PostController } from "@/lib/post/PostController"
import { BlogInfo } from "@/types/blog"
import { Grid } from "@mui/material"

type HomeProps = {
  blogs: BlogInfo[]
}

const Home: NextPage<HomeProps> = ({ blogs }: HomeProps) => {
  return (
    <Grid container sx={{ flexDirection: { md: "row", xs: "column-reverse" } }}>
      <Grid item xs={12} md={5}>
        <AboutMe noMenu={false} />
      </Grid>
      <Grid item xs={12} md={7}>
        <PostList blogs={blogs} />
      </Grid>
    </Grid>
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

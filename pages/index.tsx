import type { GetStaticProps, NextPage } from "next"
import PostList from "@/components/post_list"
import AboutMe from "@/components/about_me"
import { PostController } from "@/lib/post/PostController"
import { BlogInfo } from "@/types/blog"
import { Grid } from "@mui/material"
import Head from "next/head"

type HomeProps = {
  blogs: BlogInfo[]
}

const Home: NextPage<HomeProps> = ({ blogs }: HomeProps) => {
  return (
    <>
      <Head>
        <title>Sakho&apos;s Portfolios</title>
      </Head>

      <Grid
        container
        sx={{ flexDirection: { md: "row", xs: "column-reverse" } }}
      >
        <Grid item xs={12} md={4}>
          <AboutMe noMenu={false} />
        </Grid>
        <Grid item xs={12} md={8}>
          <PostList blogs={blogs} />
        </Grid>
      </Grid>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomeProps> = async (context) => {
  // console.log("getStaticProps")
  const postController = new PostController()

  const blogs = await postController.getMicroCMSPosts()

  return {
    props: {
      blogs: blogs,
    },
  }
}

export default Home

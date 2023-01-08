import type { GetStaticProps, NextPage } from "next"
import PostList from "@/components/post_list"
import { PostController } from "@/lib/post/PostController"
import styles from "@/styles/post_index.module.scss"
import { BlogInfo } from "@/types/blog"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import AboutMe from "@/components/about_me"
import { Grid } from "@mui/material"

export type PostListOnlyProps = {
  blogs: BlogInfo[]
}

const Post: NextPage<PostListOnlyProps> = ({ blogs }: PostListOnlyProps) => {
  const router = useRouter()

  const [categoryId, setCategoryId] = useState("")
  const [subCategoryId, setSubCategoryId] = useState("")

  useEffect(() => {
    setCategoryId("")
    setSubCategoryId("")

    if (
      router.query.category !== undefined &&
      !Array.isArray(router.query.category)
    ) {
      setCategoryId(router.query.category)
    }
    if (
      router.query.sub_category !== undefined &&
      !Array.isArray(router.query.sub_category)
    ) {
      setSubCategoryId(router.query.sub_category)
    }
  }, [router.query])

  return (
    <Grid
      container
      className={styles.container}
      sx={{
        flexDirection: { md: "row", xs: "column-reverse" },
      }}
    >
      <Grid
        item
        xs={12}
        md={3}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: { xs: "30px" },
        }}
      >
        <AboutMe
          noTitle={true}
          noIcon={true}
          noLink={true}
          noText={true}
          noMenu={false}
        />
      </Grid>
      <Grid item xs={12} md={9}>
        <PostList
          blogs={blogs.filter((blog) => {
            if (categoryId === "all" || categoryId === "") {
              return true
            } else {
              const categories = blog.category.map((c) => c.id)
              return (
                categories.includes(categoryId) &&
                (subCategoryId === ""
                  ? true
                  : categories.includes(subCategoryId))
              )
            }
          })}
        />
      </Grid>
    </Grid>
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

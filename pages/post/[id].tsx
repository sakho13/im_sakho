import CategoryBar from "@/components/category_bar"
import { convDate } from "@/lib/date_utility/date_utility"
import { CategoryInfo } from "@/types/category"
import type { NextPage, GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { PostController } from "../../lib/post/PostController"
import styles from "../../styles/post_detail.module.scss"

export type PostDetailType = {
  title: string
  categories: CategoryInfo[]
  createdAt: string
  lastUpdatedAt: string
  html: string
}

const PostDetail: NextPage<PostDetailType> = ({
  title,
  categories,
  createdAt,
  lastUpdatedAt,
  html,
}: PostDetailType) => {
  const router = useRouter()

  /**
   * 記事をNOTIONのレスポンスから整形する関数
   * @returns
   */
  const content = () => {
    return (
      <div>
        <div>
          <h1 className={styles.title_part}>{title}</h1>
          <p className={styles.date_part}>
            作成日: {createdAt} / 最終更新日: {lastUpdatedAt}
          </p>
          <CategoryBar categories={categories} />
        </div>

        <div className={styles.content_part}>
          {html === null ? (
            <p>NONE</p>
          ) : (
            <div>
              <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css"
                integrity="sha384-vKruj+a13U8yHIkAyGgK1J3ArTLzrFGBbBc0tDp4ad/EyewESeXE/Iv67Aj8gKZ0"
                crossOrigin="anonymous"
              />

              <script
                defer
                src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js"
                integrity="sha384-PwRUT/YqbnEjkZO0zZxNqcxACrXe+j766U2amXcgMg5457rve2Y7I6ZJSm2A0mS4"
                crossOrigin="anonymous"
              ></script>

              <script
                defer
                src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/contrib/auto-render.min.js"
                integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05"
                crossOrigin="anonymous"
              >
                renderMathInElement(document.body)
              </script>
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: html }}
              ></div>
              <p style={{ height: "50px" }}></p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return <div className={styles.container}>{content()}</div>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const postController = new PostController()
  const blogs = await postController.getMicroCMSPosts()

  const paths = blogs.map((blog) => `/post/${blog.id}`)
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<PostDetailType> = async (ctx) => {
  try {
    if (
      ctx.params === undefined ||
      ctx.params.id == undefined ||
      Array.isArray(ctx.params.id)
    ) {
      return {
        notFound: true,
      }
    }

    const id = ctx.params.id

    const postController = new PostController()

    const blog = await postController.getMicroCMSPost(id)
    if (blog === null) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        html: blog.content,
        title: blog.title,
        categories: blog.category,
        createdAt: convDate(blog.createdAt),
        lastUpdatedAt: convDate(blog.revisedAt),
      },
    }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}

export default PostDetail

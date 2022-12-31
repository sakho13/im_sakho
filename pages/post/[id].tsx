import type { NextPage, GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import Genrebar from "../../components/genrebar"
import { PostController } from "../../lib/post/PostController"
import styles from "../../styles/post_detail.module.scss"
import { PostGenreType } from "../api/api_output_types"
export type PostDetailType = {
  title: string
  genres: PostGenreType[]
  createdAt: string
  lastUpdatedAt: string
  html: string
}

const PostDetail: NextPage<PostDetailType> = ({
  title,
  genres,
  createdAt,
  lastUpdatedAt,
  html,
}: PostDetailType) => {
  const router = useRouter()

  const formatDateTime = (dateTime: string) => {
    const splitedDateTime = dateTime.split("T")
    const [year, month, date] = splitedDateTime[0].split("-")
    return `${year}年 ${month}月 ${date}日`
  }

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
            作成日: {formatDateTime(createdAt)} / 最終更新日:{" "}
            {formatDateTime(lastUpdatedAt)}
          </p>
          <Genrebar genres={genres} />
        </div>

        <div className={styles.content_part}>
          {html === null ? (
            <p>NONE</p>
          ) : (
            <div>
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
  const posts = await postController.getPosts()

  const paths = posts.map((post) => `/post/${post.slug}`)
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

    const post = await postController.getPost(id)
    const postInfo = post.postInfo as any

    return {
      props: {
        html: post.html,
        title: postInfo.properties.Page.title[0].plain_text ?? "",
        genres: [
          ...postInfo.properties.Genre.multi_select.map((g: any) => {
            return {
              id: g.id,
              name: g.name,
              color: g.color,
            }
          }),
        ],
        createdAt: postInfo.created_time ?? "",
        lastUpdatedAt: postInfo.last_edited_time ?? "",
      },
    }
  } catch (err) {
    return {
      notFound: true,
    }
  }
}

export default PostDetail

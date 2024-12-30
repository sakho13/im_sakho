import type { NextPage } from "next"
import styles from "../styles/post_list.module.scss"
import { useRouter } from "next/router"
import { BlogInfo } from "@/types/blog"
import { DateUtility } from "@/lib/utilities/DateUtility"
import CategoryBar from "./category_bar"

export type PostListProps = {
  blogs: BlogInfo[]
}

const PostList: NextPage<PostListProps> = ({ blogs = [] }: PostListProps) => {
  const router = useRouter()

  const redirectPostTo = (id: string) => {
    router.push(`/post/${id}`)
  }

  return (
    <div id="post_list" className={styles.container}>
      <h1>Posts</h1>

      <div className={styles.post_container}>
        {blogs.map((blog) => (
          <div
            className={styles.post_cell}
            key={blog.id}
            onClick={(e) => {
              redirectPostTo(blog.id)
            }}
          >
            <div className={styles.post_cell_icon}>
              {/* アイコン */}
              {blog.eyecatch ? (
                <img
                  className={styles.post_cell_icon_img}
                  alt="icon"
                  src={blog.eyecatch.url}
                />
              ) : blog.icon.length === 0 ? (
                <p className={styles.post_cell_icon_icon}>{"📄"}</p>
              ) : (
                <p className={styles.post_cell_icon_icon}>{blog.icon[0]}</p>
              )}
            </div>

            <div className={styles.post_cell_body}>
              <p className={styles.post_cell_title} title={blog.title}>
                {blog.title}
              </p>
              <p className={styles.post_cell_date}>
                <span>
                  作成日:{" "}
                  {DateUtility.convertISO8601ToFormattedDate(blog.createdAt)}
                </span>
              </p>
              <p className={styles.post_cell_date}>
                <span>
                  最終更新日:{" "}
                  {DateUtility.convertISO8601ToFormattedDate(blog.revisedAt)}
                </span>
              </p>
              <div className={styles.post_cell_genres}>
                <CategoryBar categories={blog.category} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList

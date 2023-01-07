import type { NextPage } from "next"
import styles from "../styles/post_list.module.scss"
import { useRouter } from "next/router"
import { BlogInfo } from "@/types/blog"
import { convDate } from "@/lib/date_utility/date_utility"
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
                  className={styles.svg_icon}
                  alt="icon"
                  src={blog.eyecatch.url}
                />
              ) : blog.icon.length === 0 ? (
                <p className={styles.icon}>{"📄"}</p>
              ) : (
                <p className={styles.icon}>{blog.icon[0]}</p>
              )}
            </div>

            <div className={styles.post_cell_body}>
              <p className={styles.post_cell_title} title={blog.title}>
                {blog.title}
              </p>
              <p className={styles.post_cell_date}>
                <span>作成日: {convDate(blog.createdAt)}</span>
              </p>
              <p className={styles.post_cell_date}>
                <span>最終更新日: {convDate(blog.revisedAt)}</span>
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

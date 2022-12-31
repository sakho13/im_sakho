import type { NextPage, GetStaticPaths } from "next"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Grid, Loading } from "@nextui-org/react"
import { GetPostsOutput } from "../pages/api/get_posts"
import { PostType } from "../pages/api/api_output_types"
import styles from "../styles/post_list.module.scss"
import { useRouter } from "next/router"
import Genrebar from "./genrebar"
import { PostListProps } from "../pages/post"

const PostList: NextPage<PostListProps> = ({ posts = [] }: PostListProps) => {
  const router = useRouter()

  const redirectPostTo = (id: string) => {
    router.push(`/post/${id}`)
  }

  const formatDateTime = (dateTime: string) => {
    const splitedDateTime = dateTime.split("T")
    const [year, month, date] = splitedDateTime[0].split("-")
    return `${year}年 ${month}月 ${date}日`
  }

  return (
    <div id="post_list" className={styles.container}>
      <h1>Posts</h1>

      <div className={styles.post_container}>
        {posts.map((post) => (
          <div
            className={styles.post_cell}
            key={post.slug}
            onClick={(e) => {
              redirectPostTo(post.slug)
            }}
          >
            <div className={styles.post_cell_icon}>
              {/* アイコン */}
              {post.icon === null ? (
                <p className={styles.icon}>{"📄"}</p>
              ) : !post.icon.isUrl ? (
                <p className={styles.icon}>{post.icon.icon}</p>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.svg_icon}
                  src={post.icon.icon}
                  alt="icon"
                />
              )}
            </div>

            <div className={styles.post_cell_body}>
              <p className={styles.post_cell_title} title={post.title}>
                {post.title}
              </p>
              <p className={styles.post_cell_date}>
                <span>作成日: {formatDateTime(post.created_at)}</span>
              </p>
              <p className={styles.post_cell_date}>
                <span>最終更新日: {formatDateTime(post.last_edited_at)}</span>
              </p>
              <div className={styles.post_cell_genres}>
                <Genrebar genres={post.genres} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostList

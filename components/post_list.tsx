import type { NextPage } from "next"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Grid, Loading } from "@nextui-org/react"
import Image from "next/image"
import { GetPostsOutput } from "../pages/api/get_posts"
import { PostType } from "../pages/api/api_output_types"
import styles from "../styles/post_list.module.scss"
import { useRouter } from "next/router"
import Genrebar from "./genrebar"

const PostList: NextPage = () => {
  const [nextPost, setNextPost] = useState<string>("")
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)

  const router = useRouter()

  const fetchData = async () => {
    if (!loading) {
      setLoadingButton(true)
    }
    const res = await axios.post<GetPostsOutput>("/api/get_posts", {
      nextCursor: nextPost === "" ? null : nextPost,
    })
    if (res.data.success) {
      setPosts([...posts, ...res.data.result.posts])

      if (res.data.result.nextCursor) {
        setNextPost(res.data.result.nextCursor)
      } else {
        setNextPost("")
      }
    }
    setLoading(false)
    setLoadingButton(false)
  }

  const redirectPostTo = (id: string) => {
    router.push(`/post/${id}`)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDateTime = (dateTime: string) => {
    const splitedDateTime = dateTime.split("T")
    const [year, month, date] = splitedDateTime[0].split("-")
    return `${year}年 ${month}月 ${date}日`
  }

  return (
    <div id="post_list" className={styles.container}>
      <h1>Posts</h1>

      {loading ? (
        <div className={styles.loading}>
          <Loading type="points" size="lg" className={styles.loading_main}>
            Now Loading
          </Loading>
        </div>
      ) : (
        <div className={styles.post_container}>
          {posts.map((post) => (
            <div
              className={styles.post_cell}
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
                <p className={styles.post_cell_title}>{post.title}</p>
                <p className={styles.post_cell_date}>
                  作成日: {formatDateTime(post.created_at)}
                </p>
                <div className={styles.post_cell_genres}>
                  <Genrebar genres={post.genres} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {nextPost === "" ? (
        <></>
      ) : (
        <div className={styles.load_button_part}>
          <Button onClick={() => fetchData()}>
            {loadingButton ? (
              <Loading
                type="points"
                size="md"
                className={styles.loading_main}
              />
            ) : (
              "他の投稿"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}

export default PostList

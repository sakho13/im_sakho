import type { NextPage } from "next"
import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Grid, Loading } from "@nextui-org/react"
import Image from "next/image"
import { GetPostsOutput } from "../pages/api/get_posts"
import { PostType } from "../pages/api/api_output_types"
import styles from "../styles/post_list.module.scss"
import { useRouter } from "next/router"

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
        <Grid.Container css={{ width: "100%" }} gap={2} justify="center">
          {posts.map((post) => (
            <Grid key={post.id} md={5.5} xs={10} justify="center">
              <Card
                variant="flat"
                css={{
                  height: "300px",
                  width: "300px",
                  "background-color": "#ede3ce",
                }}
              >
                <Card.Header>
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

                  <Grid.Container>
                    <Grid xs={12} justify="flex-start">
                      <p className={styles.post_title}>{post.title}</p>
                    </Grid>
                    <Grid xs={12}>
                      作成日: {formatDateTime(post.created_at)}
                    </Grid>
                  </Grid.Container>
                </Card.Header>

                <Card.Divider />

                <Card.Body>
                  <p style={{ margin: 0, fontWeight: "bold" }}>ジャンル</p>
                  <p>
                    {post.genres.map((genre, i) => {
                      return (
                        <span key={i} className={styles.genre_part}>
                          {genre.name}
                        </span>
                      )
                    })}
                  </p>
                </Card.Body>

                <Card.Divider />

                <Card.Footer>
                  <div className={styles.card_link_container}>
                    <p
                      onClick={(e) => {
                        redirectPostTo(post.slug)
                      }}
                      className={styles.card_link}
                    >
                      To →
                    </p>
                  </div>
                </Card.Footer>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
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

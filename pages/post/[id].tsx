import { Loading } from "@nextui-org/react"
import axios from "axios"
import type { NextPage, GetStaticPaths, GetStaticProps, GetStaticPropsResult } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Genrebar from "../../components/genrebar"
import styles from "../../styles/post_detail.module.scss"
import { PostGenreType } from "../api/api_output_types"
import { GetPostOutput } from "../api/get_post"

type Params = {
  id: string
}

const PostDetail: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [title, setTitle] = useState<string>("unknown")
  const [genres, setGenres] = useState<PostGenreType[]>([])
  const [createdAt, setCreatedAt] = useState<string>("")
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>("")
  const [html, setHtml] = useState<string | null>(null)

  const fetchData = async () => {
    const { id } = router.query
    if (id === undefined) {
      return
    }

    const res = await axios.post<GetPostOutput>("/api/get_post", {
      slug: id,
    })

    // console.log(res.data)
    if (res.data.success === false || res.data.result.postInfo === null) {
      router.replace("/")
    } else {
      const postInfo = res.data.result.postInfo as any
      setTitle(postInfo.properties.Page.title[0].plain_text)
      setGenres([
        ...postInfo.properties.Genre.multi_select.map((g: any) => {
          return {
            id: g.id,
            name: g.name,
            color: g.color,
          }
        }),
      ])
      setCreatedAt(postInfo.created_time)
      setLastUpdatedAt(postInfo.last_edited_time)
      setHtml(res.data.result.html)
    }

    setLoading(false)
  }

  useEffect(() => {
    // const { id } = router.query

    fetchData()
  }, [router.query])

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
              <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }}></div>
              <p style={{height: "50px"}}></p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loading}>
          <Loading type="points" size="lg" className={styles.loading_main}>
            Now Loading
          </Loading>
        </div>
      ) : (
        content()
      )}
    </div>
  )
}

// export const getStaticPaths: GetStaticPaths<Params> = async () => {
//   const ids = [
//     "i_started_this",
//     "created_gd_rap",
//     "i_read_rongo_to_soroban_2022",
//     "report_sakhool_1",
//   ]

//   return {
//     paths: ids.map((id) => {
//       return {
//         params: {id: id}
//       }
//     }),
//     fallback: false,
//   }
// }

// export const getStaticProps: GetStaticProps<{}> = (context) => {
//   // context.params
//   return {} as GetStaticPropsResult<{}>
// }

export default PostDetail

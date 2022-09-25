import { Loading, Modal } from "@nextui-org/react"
import axios from "axios"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { CSSProperties, useEffect, useState } from "react"
import styles from "../../styles/post_detail.module.scss"
import { Content, List, Paragraph } from "../../types/content_type"
import { PostGenreType } from "../api/api_output_types"
import { GetPostOutput } from "../api/get_post"

const PostDetail: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState("")

  const [title, setTitle] = useState<string>("unknown")
  const [genres, setGenres] = useState<PostGenreType[]>([])
  const [createdAt, setCreatedAt] = useState<string>("")
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>("")
  const [contents, setContents] = useState<Content[]>([])

  const [listType, setListType] = useState<"none" | "bull" | "num">("none")
  const [listStr, setListStr] = useState<string | null>(null)

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
      console.log(res.data.result.contents)

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
      setContents(res.data.result.contents)
    }

    setLoading(false)
  }

  useEffect(() => {
    const { id } = router.query
    setSlug(String(id))

    fetchData()
  }, [router.query])

  const formatDateTime = (dateTime: string) => {
    const splitedDateTime = dateTime.split("T")
    const [year, month, date] = splitedDateTime[0].split("-")
    return `${year}年 ${month}月 ${date}日`
  }

  /**
   * Paragraphオブジェクト から soan の形に
   * @param paragraph
   * @returns
   */
  const richText2Tag = (paragraph: Paragraph): JSX.Element[] => {
    return paragraph.map((p, i) => {
      const style: CSSProperties = {}
      if (p.style.bold) {
        style.fontWeight = "bold"
      }
      if (p.style.italic) {
        style.fontStyle = "italic"
      }
      if (p.style.underline) {
        style.textDecoration = "underline"
      }
      if (p.style.strikethrough) {
        style.textDecoration = "line-through"
      }
      if (p.style.color !== "default") {
        const colors = [
          "yellow",
          "gray",
          "brown",
          "orange",
          "green",
          "blue",
          "purple",
          "pink",
          "red",
        ]
        if (typeof p.style.color === "string") {
          if (p.style.color.includes("_background")) {
            const [c, _bg] = p.style.color.split("_")
            if (colors.includes(c)) {
              style.backgroundColor = c
            }
          } else {
            if (colors.includes(p.style.color)) {
              style.color = p.style.color
            }
          }
        }
      }

      if (p.link !== null) {
        return (
          <span key={i} className={styles.link_part}>
            <a href={p.link} target="_blank">{p.value}</a>
          </span>
        )
      }
      return (
        <span key={i} style={style}>
          {p.value}
        </span>
      )
    })
  }

  const bList2Tag = (val: (Paragraph | List)[] | List): JSX.Element => {
    if (Array.isArray(val)) {
      const li: JSX.Element[] = [] // <li></li>の配列

      for (const v of val) {
        if (Array.isArray(v)) {
          li.push(<li>{richText2Tag(v)}</li>)
        } else {
          li.push(bList2Tag(v.value))
        }
      }

      return (
        <ol className={styles.taLeft}>
          {li}
        </ol>
      )
    } else {
      return bList2Tag(val.value)
    }
  }

  const nList2Tag = (val: (Paragraph | List)[] | List): JSX.Element => {
    if (Array.isArray(val)) {
      const li: JSX.Element[] = [] // <li></li>の配列

      for (const v of val) {
        if (Array.isArray(v)) {
          li.push(<li>{richText2Tag(v)}</li>)
        } else {
          li.push(bList2Tag(v.value))
        }
      }

      return <ul className={styles.taLeft}>{li}</ul>
    } else {
      return bList2Tag(val.value)
    }
  }

  /**
   * NOTIONのレスポンス要素からHTML形式に変形
   * @param obj
   * @returns
   */
  const convDom = (obj: Content) => {
    if (obj.type === "h1") {
      return <h1 style={{ width: "70%" }}>{richText2Tag(obj.value)}</h1>

    }

    if (obj.type === "h2") {
      return <h2 style={{ width: "70%" }}>{richText2Tag(obj.value)}</h2>
    }

    if (obj.type === "h3") {
      return <h3 style={{ width: "70%" }}>{richText2Tag(obj.value)}</h3>
    }

    if (obj.type === "p") {
      // 段組み無視
      return <p style={{ width: "70%" }}>{richText2Tag(obj.values)}</p>
    }

    if (obj.type === "eq") {
      return <p>{obj.value}</p>
    }

    if (obj.type === "b_list") {
      console.log(obj.values)
      return bList2Tag(obj.values)
    }

    if (obj.type === "n_list") {
      console.log(obj.values)
      return nList2Tag(obj.values)
    }

    if (obj.type === "code") {
        return (
          <>
            <p>{obj.language}</p>
            <pre>
              <code>
                <p>{richText2Tag(obj.values)}</p>
              </code>
            </pre>
          </>
        )
    }

    if (obj.type === "divider") {
      return <hr className={styles.divider}></hr>
    }

    return <p>empty</p>
  }

  /**
   * 記事をNOTIONのレスポンスから整形する関数
   * @returns
   */
  const content = () => {
    return (
      <>
        <div>
          <h1 className={styles.title_part}>{title}</h1>
          <p className={styles.date_part}>
            作成日: {formatDateTime(createdAt)} / 最終更新日:{" "}
            {formatDateTime(lastUpdatedAt)}
          </p>
          <div className={styles.genre_part}>
            {genres.map((genre) => {
              return <p key={genre.id}>{genre.name}</p>
            })}
          </div>
        </div>

        <div>
          {contents.map((content, i) => {
            return (
              <div key={i} className={styles.content_part}>
                {convDom(content)}
              </div>
            )
          })}
          <div className={styles.content_part}>
            <p></p>
          </div>
          <div className={styles.content_part}>
            <p></p>
          </div>
          <div className={styles.content_part}>
            <p></p>
          </div>
          <div className={styles.content_part}>
            <p></p>
          </div>
        </div>
      </>
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

export default PostDetail

import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import { event } from "../lib/gtag"
import styles from "../styles/navbar.module.scss"

const Navbar: NextPage = () => {
  type PageNames = "Home" | "Profile" | "Posts" | "Tech"

  const router = useRouter()
  const [currentPageName, setPageName] = useState<PageNames>("Home")

  /**
   * ページ遷移
   * @param name
   */
  const changePage = (name: PageNames) => {
    try {
      // event({
      //   action: "jump_page_nav",
      //   category: "Action",
      //   label: "Nav",
      //   value: name,
      // })
    } catch (err) {
      // console.warn(err)
    }

    switch (name) {
      case "Home":
        setPageName("Home")
        router.push("/")
        break
      case "Profile":
        setPageName("Profile")
        router.push("/profile")
        break
      case "Posts":
        setPageName("Posts")
        router.push("/post")
        break
      case "Tech":
        setPageName("Tech")
        router.push("/tech")
        break
    }
  }

  return (
    <header className={styles.container}>
      <div className={styles.title}>
        <h2>
          <span className={styles.name}>さこ</span>です
        </h2>
      </div>
      <div className={styles.subtitle}>
        <p>作ったものまとめ</p>
      </div>

      <ul className={styles.nav_list}>
        <li
          onClick={() => changePage("Home")}
          className={currentPageName === "Home" ? styles.current : ""}
        >
          Home
        </li>
        <li
          onClick={() => changePage("Profile")}
          className={currentPageName === "Profile" ? styles.current : ""}
        >
          Profile
        </li>
        <li
          onClick={() => changePage("Posts")}
          className={currentPageName === "Posts" ? styles.current : ""}
        >
          Posts
        </li>

        <li
          onClick={() => changePage("Tech")}
          className={currentPageName === "Tech" ? styles.current : ""}
        >
          Tech
        </li>
      </ul>
    </header>
  )
}

export default Navbar

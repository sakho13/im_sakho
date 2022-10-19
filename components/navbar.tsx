import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import styles from "../styles/navbar.module.scss"

const Navbar: NextPage = () => {
  type PageNames = "Home" | "AboutMe" | "Posts"

  const router = useRouter()
  const [currentPageName, setPageName] = useState<PageNames>("Home")

  /**
   * ページ遷移
   * @param name
   */
  const changePage = (name: PageNames) => {
    switch (name) {
      case "Home":
        setPageName("Home")
        router.push("/")
        break
      case "AboutMe":
        setPageName("AboutMe")
        router.push("/about")
        break
      case "Posts":
        setPageName("Posts")
        router.push("/post")
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
          onClick={() => changePage("AboutMe")}
          className={currentPageName === "AboutMe" ? styles.current : ""}
        >
          AboutMe
        </li>
        <li
          onClick={() => changePage("Posts")}
          className={currentPageName === "Posts" ? styles.current : ""}
        >
          Posts
        </li>
      </ul>
    </header>
  )
}

export default Navbar

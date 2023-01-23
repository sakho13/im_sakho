import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styles from "../styles/navbar.module.scss"

const Navbar: NextPage = () => {
  type PageNames = "Home" | "Profile" | "Posts" | "Tech"

  const router = useRouter()
  const [currentPageName, setPageName] = useState<PageNames>("Home")

  useEffect(() => {
    console.log(router.pathname)
    switch (router.pathname) {
      case "/profile":
        setPageName("Profile")
        break
      case "/post":
        setPageName("Posts")
        break
      case "/tech":
        setPageName("Tech")
        break
      default:
        setPageName("Home")
        break
    }
  }, [router.pathname])

  const navLinks: {
    title: PageNames
    path: string
  }[] = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Profile",
      path: "/profile",
    },
    {
      title: "Posts",
      path: "/post",
    },
    {
      title: "Tech",
      path: "/tech",
    },
  ]

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
        {navLinks.map((link) => {
          return (
            <li
              key={link.title + "-nav"}
              className={currentPageName === link.title ? styles.current : ""}
            >
              <Link href={link.path}>{link.title}</Link>
            </li>
          )
        })}
      </ul>
    </header>
  )
}

export default Navbar

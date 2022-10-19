import { ReactElement } from "react"
// import Footer from "./footer"
import Navbar from "./navbar"

type LayoutProps = {
  readonly children: ReactElement[]
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      {/* <Footer /> */}
    </>
  )
}

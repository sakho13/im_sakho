import { RecoilRoot } from "recoil"
import { ReactElement } from "react"
// import Footer from "./footer"
import Navbar from "./navbar"

type LayoutProps = {
  readonly children: ReactElement[]
}

export default function Layout({ children }: LayoutProps) {
  // console.log("lay", children)
  return (
    <RecoilRoot>
      <Navbar />

      <main>{children}</main>

      {/* <Footer /> */}
    </RecoilRoot>
  )
}
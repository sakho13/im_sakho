import { AnimatePresence } from "framer-motion"
import { ReactElement } from "react"
// import Footer from "./footer"
import Navbar from "./navbar"

type LayoutProps = {
  readonly children: ReactElement[]
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AnimatePresence mode="wait">
      <Navbar />

      <main>{children}</main>

      {/* <Footer /> */}
    </AnimatePresence>
  )
}

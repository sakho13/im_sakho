import { RecoilRoot } from "recoil"
// import Footer from "./footer"
import Navbar from "./navbar"

export default function Layout({ children }) {
  return (
    <RecoilRoot>
      <Navbar />

      <main>{children}</main>

      {/* <Footer /> */}
    </RecoilRoot>
  )
}
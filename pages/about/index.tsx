/* eslint-disable react-hooks/rules-of-hooks */
import { motion } from "framer-motion"
import type { NextPage } from "next"
import Head from "next/head"
import AboutMe from "../../components/about_me"

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About - Sakho&apos;s Portfolios -</title>
      </Head>

      <motion.div
        initial={{ opacity: 0 }} // 初期状態
        animate={{ opacity: 1 }} // マウント時
        exit={{ opacity: 0 }} // アンマウント時
        transition={{
          duration: 0.5,
        }}
      >
        <AboutMe noText={false} noTechs={false} />
      </motion.div>
    </>
  )
}

export default About

/* eslint-disable react-hooks/rules-of-hooks */
import type { NextPage } from "next"
import Head from "next/head"
import AboutMe from "../../components/about_me"

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About - Sakho&apos;s Portfolios -</title>
      </Head>

      <AboutMe noText={false} />
    </>
  )
}

export default About

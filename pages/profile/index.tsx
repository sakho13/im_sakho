/* eslint-disable react-hooks/rules-of-hooks */
import { Histories } from "@/statics/follow_techs"
import { Grid } from "@mui/material"
import { motion } from "framer-motion"
import type { NextPage } from "next"
import Head from "next/head"
import AboutMe from "../../components/about_me"
import styles from "@/styles/about_index.module.scss"

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
        style={{ width: "inherit" }}
      >
        <Grid
          container
          sx={{
            width: "inherit",
            flexDirection: { md: "row", xs: "column" },
          }}
        >
          <Grid item xs={12} md={6}>
            <AboutMe noText={false} />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ paddingX: { md: "20px", xs: "10px" }, overflowY: "auto" }}
          >
            <h1>Career</h1>

            {Histories.map((history, i) => {
              return (
                <div key={`career-${i}`} className={styles.history_box}>
                  <p className={styles.history_box_title}>{history.title}</p>

                  <p className={styles.history_box_date}>{history.date}</p>

                  {history.works.length > 0 ? (
                    <ul className={styles.history_box_work}>
                      {history.works.map((work, wi) => (
                        <li key={`career-${i}-w-${wi}`}>{work}</li>
                      ))}
                    </ul>
                  ) : undefined}

                  {history.comment !== "" ? (
                    <p className={styles.history_box_comment}>
                      <span>Comment:</span>
                      {history.comment}
                    </p>
                  ) : undefined}

                  <div className={styles.history_box_history}>
                    <p>Techs:</p>
                    {history.techs.map((tech, ti) => {
                      return <p key={`career-${i}-t-${ti}`}>{tech}</p>
                    })}
                  </div>
                </div>
              )
            })}
          </Grid>
        </Grid>
      </motion.div>
    </>
  )
}

export default About

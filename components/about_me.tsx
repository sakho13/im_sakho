import { Grid } from "@nextui-org/react"
import type { NextPage } from "next"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import styles from "../styles/about_me.module.scss"
import LinkButtons from "./link_buttons"

const AboutMe: NextPage = () => {
  const isMd = useMediaQuery(960)

  return (
    <div className={styles.container}>
      <h1>About Me</h1>

      <Grid.Container justify="center" direction="row" alignItems="center">
        <Grid xs={12} md={6} justify="center">
          <Image
            src='/my_icon.jpeg'
            alt="my_icon"
            className={styles.img_cover}
            objectFit="cover"
            width={300}
            height={300}
          />
        </Grid>
        <Grid xs={12} md={6} justify="center">
          <LinkButtons />
        </Grid>
      </Grid.Container>
    </div>
  )
}

export default AboutMe

function useMediaQuery(width: number) {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e: any) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`);
    media.addListener(updateTarget);

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true);
    }

    return () => media.removeListener(updateTarget);
  }, []);

  return targetReached;
}


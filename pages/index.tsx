import type { NextPage } from 'next'
import styles from '../styles/Home.module.scss'
import PostList from '../components/post_list'
import AboutMe from '../components/about_me'
import { Grid } from '@nextui-org/react'

const Home: NextPage = () => {

  return (
    <Grid.Container>
      <Grid xs={12} md={5} justify='center'>
        <AboutMe />
      </Grid>
      <Grid xs={12} md={7} justify='center'>
        <PostList />
      </Grid>
    </Grid.Container>
  )
}

export default Home

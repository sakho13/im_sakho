import type { NextPage } from 'next'
import PostList from '../../components/post_list'
import styles from '../../styles/post_index.module.scss'

const Post: NextPage = () => {
  return (
    <div className={styles.container}>
      <PostList />
    </div>
  )
}

export default Post
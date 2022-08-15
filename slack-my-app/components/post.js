import styles from "../styles/Home.module.css";
const PostItem = ({ post }) => {
  return (
    <div className={styles.post}>
      <p>{post.id}</p>
      <div className={styles.textcols}>
        <p>{post.name}</p>
        <p>{post.date}</p>
      </div>
      <p className={styles.textContent}>{post.post}</p>
      {/* {console.log(post)} */}
    </div>
  );
};
export default PostItem;

import styles from "./../app/page.module.css";

export default function Loading() {
  return (
    <div className={styles.fullPageContainer}>
      <div className={styles.loadingText}>loading...</div>
    </div>
  );
}

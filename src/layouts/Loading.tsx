import styles from "./../app/page.module.css";

interface LoadingProps {
  showTitle?: boolean;
  message: string;
}

export default function Loading(props: LoadingProps) {
  return (
    <div className={styles.fullPageContainer}>
      {props.showTitle && (
        <div className={styles.loadingTitle}>QRICK QROLL</div>
      )}
      <div className={styles.loadingText}>{props.message}</div>
    </div>
  );
}

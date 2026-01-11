import { GameData, GameState } from "@/types/interfaces";
import styles from "./../app/page.module.css";
import { classes } from "@/lib/util";
import { Scanner } from "@yudiel/react-qr-scanner";
import Image from "next/image";
import { useEffect } from "react";

interface GuesserScreenProps {
  gameData: GameData;
  guess: (scanned: boolean) => void;
  nextQuestion: () => void;
}

export default function GuesserScreen(props: GuesserScreenProps) {
  useEffect(() => {
    if (props.gameData.scanned && !props.gameData.correct) {
      window.open("https://www.youtube.com/watch?v=xvFZjo5PgG0", "_blank");
    }
  }, [props.gameData]);

  return (
    <div>
      <div
        className={classes(
          styles.centerContent,
          styles.title,
          styles.guesserScreenTitle
        )}
      >
        QRICK QROLL
      </div>
      {props.gameData.gameState === GameState.GAME_OVER ? (
        <div className={styles.finalScore}>{props.gameData.score}</div>
      ) : props.gameData.gameState === GameState.PENDING ? (
        <div className={styles.centerContent}>
          <div className={styles.qrScannerInnerContainer}>
            <Scanner
              onScan={() => props.guess(true)}
              components={{
                onOff: true,
                torch: false,
                zoom: false,
                finder: false,
              }}
              sound={false}
            />
          </div>
          <div className={styles.skipButtonContainer}>
            <button
              className={classes(styles.button, styles.skipButton)}
              onClick={() => props.guess(false)}
            >
              RICK ROLL
            </button>
          </div>
        </div>
      ) : props.gameData.gameState === GameState.GUESSED ? (
        <div className={styles.centerContent}>
          <Image
            src={props.gameData.correct ? "/sad-rick.gif" : "/rick-roll.gif"}
            className={styles.rickFeedback}
            alt="Rick roll"
            width={300}
            height={300}
          />
          <button
            className={classes(styles.button, styles.nextButton)}
            onClick={props.nextQuestion}
          >
            NEXT
          </button>
          <div className={styles.explanation}>
            {props.gameData.scanned && props.gameData.correct
              ? "correct! that qr code was perfectly safe."
              : props.gameData.scanned && !props.gameData.correct
              ? "oh no! you've been rick rolled!"
              : !props.gameData.scanned && props.gameData.correct
              ? "nice work! you avoided a rick roll!"
              : "oh no! that wasn't a rick roll!"}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

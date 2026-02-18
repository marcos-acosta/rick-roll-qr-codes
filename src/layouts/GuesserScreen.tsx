import { GameData, GameState } from "@/types/interfaces";
import styles from "./../app/page.module.css";
import { classes } from "@/lib/util";
import { Scanner } from "@yudiel/react-qr-scanner";
import Image from "next/image";
import { useEffect, useState } from "react";

interface GuesserScreenProps {
  gameData: GameData;
  guess: (scanned: boolean) => void;
  nextQuestion: () => void;
}

export default function GuesserScreen(props: GuesserScreenProps) {
  const [codeToScan, setCodeToScan] = useState(false);

  const nextQuestion = () => {
    setCodeToScan(false);
    props.nextQuestion();
  };

  return (
    <div className={styles.centerContent}>
      <div className={styles.guesserScreenOuterContainer}>
        <div
          className={classes(
            styles.centerContent,
            styles.title,
            styles.guesserScreenTitle
          )}
          style={{ color: "#ba7500" }}
        >
          QRICK QROLL
        </div>
        {props.gameData.gameState === GameState.GAME_OVER ? (
          <div className={styles.centerContent}>
            <div className={styles.gameOverSubtitle}>YOUR SCORE</div>
            <div className={styles.gameOverText}>
              {props.gameData.score}/{props.gameData.questionNumber || 20}
            </div>
          </div>
        ) : props.gameData.gameState === GameState.PENDING ? (
          <div className={styles.centerContent}>
            <div className={styles.qrScannerInnerContainer}>
              <Scanner
                onScan={(detectedCodes) =>
                  setCodeToScan(detectedCodes.length > 0)
                }
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
                onClick={() => props.guess(true)}
                disabled={!codeToScan}
              >
                SCAN
              </button>
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
            {!props.gameData.correct && props.gameData.scanned && (
              <Image
                src="/rick-roll.gif"
                className={styles.rickFeedback}
                alt="Rick roll"
                width={300}
                height={300}
              />
            )}
            <div
              className={classes(
                styles.guesserFeedbackText,
                props.gameData.correct ? styles.correct : styles.incorrect
              )}
            >
              {props.gameData.correct ? "CORRECT :D" : "INCORRECT >:("}
            </div>
            <div className={styles.explanation}>
              {props.gameData.scanned && props.gameData.correct
                ? "Nice! You scanned a harmless QR code."
                : props.gameData.scanned && !props.gameData.correct
                ? "You fool! You've been rick rolled!"
                : !props.gameData.scanned && props.gameData.correct
                ? "Nice! You avoided being rick rolled!"
                : "Oh no! You got paranoid and skipped a cool website..."}
            </div>
            <button
              className={classes(styles.button, styles.nextButton)}
              onClick={nextQuestion}
            >
              NEXT
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

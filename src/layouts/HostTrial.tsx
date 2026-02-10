import { GameData, GameState } from "@/types/interfaces";
import styles from "./../app/page.module.css";
import QrCode from "@/components/QrCode";
import Image from "next/image";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { useEffect, useRef } from "react";
import { classes } from "@/lib/util";
import { debugPrintAllVectorizedRickRollQrCodes } from "@/lib/randomRickRoll";

interface HostTrialProps {
  gameData: GameData;
  startOver: () => void;
}

export default function HostTrial(props: HostTrialProps) {
  const roundNumber = props.gameData.questionNumber || 1;
  const { width, height } = useWindowSize();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const guessed =
    props.gameData.scanned !== null && props.gameData.correct !== null;
  const isRickRoll =
    guessed && props.gameData.scanned === !props.gameData.correct;

  useEffect(() => {
    if (isRickRoll && !props.gameData.correct) {
      if (!audioRef.current) {
        audioRef.current = new Audio("/rick-roll.mp3");
      }
      audioRef.current.play().catch((error) => {
        console.error("Failed to play audio:", error);
      });
    }
  }, [isRickRoll]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [roundNumber]);

  useEffect(() => {
    debugPrintAllVectorizedRickRollQrCodes();
  }, []);

  return (
    <div className={styles.hostTrialContainer}>
      {guessed && props.gameData.correct && (
        <Confetti width={width} height={height} />
      )}
      <div className={styles.topLeftTitle}>QRICK QROLL</div>
      <div className={styles.hostTrialCenterContent}>
        <div className={styles.trialInnerContent}>
          {props.gameData.gameState === GameState.GAME_OVER ? (
            <>
              <div className={styles.gameOverSubtitle}>YOUR SCORE</div>
              <div className={styles.gameOverText}>
                {props.gameData.score}/{roundNumber}
              </div>
              <button
                className={classes(styles.button, styles.startOverButton)}
                onClick={props.startOver}
              >
                START OVER
              </button>
            </>
          ) : (
            <>
              <div className={styles.roundText}>ROUND {roundNumber}</div>
              <div className={styles.scoreContainer}>
                {props.gameData.score} for{" "}
                {roundNumber -
                  (props.gameData.gameState === GameState.GUESSED ? 0 : 1)}
              </div>
              {props.gameData.gameState === GameState.GUESSED && (
                <div
                  className={classes(
                    styles.scoreContainer,
                    props.gameData.correct ? styles.correct : styles.incorrect
                  )}
                >
                  {props.gameData.correct ? "CORRECT :D" : "INCORRECT >:("}
                </div>
              )}
              {guessed && isRickRoll ? (
                <div>
                  <Image
                    src={
                      props.gameData.correct
                        ? "/sad-rick.gif"
                        : "/rick-roll.gif"
                    }
                    className={styles.rickBigScreen}
                    alt="Rick roll"
                    width={300}
                    height={300}
                  />
                </div>
              ) : guessed && !isRickRoll ? (
                <div className={styles.iframeContainer}>
                  <iframe
                    className={styles.safeWebsite}
                    src={props.gameData.qrCodeData?.url}
                  />
                </div>
              ) : (
                props.gameData.qrCodeData && (
                  <div className={styles.trialQrCodeContainer}>
                    <QrCode qrCodeData={props.gameData.qrCodeData} />
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

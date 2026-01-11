import { GameData, GameState } from "@/types/interfaces";
import styles from "./../app/page.module.css";
import { classes } from "@/lib/util";
import { Scanner } from "@yudiel/react-qr-scanner";

interface GuesserScreenProps {
  gameData: GameData;
  guess: (scanned: boolean) => void;
}

export default function GuesserScreen(props: GuesserScreenProps) {
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
      ) : (
        <div>
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
              <button className={classes(styles.button, styles.skipButton)}>
                RICK ROLL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

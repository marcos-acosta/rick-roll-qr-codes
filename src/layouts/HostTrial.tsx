import { GameData, GameState } from "@/types/interfaces";
import styles from "./../app/page.module.css";
import QrCode from "@/components/QrCode";

interface HostTrialProps {
  gameData: GameData;
}

export default function HostTrial(props: HostTrialProps) {
  const roundNumber = props.gameData.questionNumber || 1;

  return (
    <div>
      <div className={styles.topLeftTitle}>RICK OR ROLL</div>
      <div className={styles.centerContent}>
        <div className={styles.trialInnerContent}>
          <div className={styles.roundText}>ROUND {roundNumber}</div>
          <div className={styles.scoreContainer}>
            {props.gameData.score} for{" "}
            {roundNumber -
              (props.gameData.gameState === GameState.GUESSED ? 0 : 1)}
          </div>
          {props.gameData.qrCodeData && (
            <div className={styles.trialQrCodeContainer}>
              <QrCode qrCodeData={props.gameData.qrCodeData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

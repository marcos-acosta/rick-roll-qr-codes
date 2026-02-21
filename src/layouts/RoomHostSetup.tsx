import { ErrorCorrectionLevel, GameData, GameState } from "@/types/interfaces";
import styles from "./../app/page.module.css";
import { classes } from "@/lib/util";
import { useRef, useState } from "react";
import QrCode from "@/components/QrCode";

interface RoomHostSetupProps {
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
  gameData: GameData | null;
  roomCode: string;
  start: () => void;
}

export default function RoomHostSetup(props: RoomHostSetupProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/json") {
      // Create a FileList-like object and synthetic event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);

      const syntheticEvent = {
        target: {
          files: dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      await props.handleFileUpload(syntheticEvent);
    } else {
      alert("Please drop a valid JSON file");
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.fullWidthOuterContainer}>
      <div className={classes(styles.centeredTitleContainer, styles.title)}>
        QRICK QROLL
      </div>
      <div className={styles.centerContent}>
        <div className={styles.roomCodeContainer}>
          <div>ROOM CODE</div>
          <div className={styles.roomCode}>{props.roomCode}</div>
        </div>
      </div>
      <div className={styles.centerContent}>
        <div className={styles.actionsGrid}>
          <div>
            <div
              className={classes(
                styles.dropJsonContainer,
                isDragging && styles.dragging
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
            >
              <div className={styles.dropJsonInstructions}>
                {props.gameData?.numSafeQrCodesUploaded
                  ? `qr codes uploaded!`
                  : "drag and drop non-rick roll qr code json"}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                onChange={props.handleFileUpload}
                className={styles.hiddenInput}
              />
            </div>
          </div>
          <div className={styles.joinRoomContainer}>
            <div className={styles.centerContent}>
              <div className={styles.joinQrCodeContainer}>
                <QrCode
                  qrCodeData={{
                    url: `https://rickroll.marcos.ac/room/${props.roomCode}`,
                    errorCorrectionLevel: ErrorCorrectionLevel.LOW,
                  }}
                />
                <div className={styles.joinText}>SCAN TO JOIN</div>
              </div>
              <div className={styles.havePlayer}>
                {props.gameData?.hasPlayer === false
                  ? "waiting for player..."
                  : "player joined!"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.centerContent}>
        <button
          className={classes(styles.button, styles.largeButton)}
          disabled={props.gameData?.gameState !== GameState.READY_TO_START}
          onClick={props.start}
        >
          LET'S ROLL
        </button>
      </div>
    </div>
  );
}

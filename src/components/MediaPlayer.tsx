import { useRef, useState } from "react";
import styles from "@/app/page.module.css";
import y2k from "@/app/y2k.module.css";
import mediaStyles from "./MediaPlayer.module.css";
import Image from "next/image";
import { classes } from "@/lib/util";

export default function MediaPlayer({
  createRoom,
}: {
  createRoom: () => void;
}) {
  const [pos, setPos] = useState({ x: 555, y: 111 }); // initial position
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    // drag only with primary button / touch
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragging.current = true;

    // current pointer position minus window position = offset inside window
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    // capture pointer so dragging keeps working even if pointer leaves title bar
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;

    const nextX = e.clientX - offset.current.x;
    const nextY = e.clientY - offset.current.y;

    setPos({ x: nextX, y: nextY });
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div className={y2k.inner}>
      <div className={mediaStyles.window} style={{ left: pos.x, top: pos.y }}>
        {/* Title Bar (drag handle) */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className={mediaStyles.titleBar}
        >
          <span>Media Player - QRICK QROLL</span>
          <button aria-label="Close" className={mediaStyles.closeButton}>
            X
          </button>
        </div>

        {/* Window Content */}
        <div className={mediaStyles.windowContent}>
          <div className={mediaStyles.gifContainer}>
            <Image
              src="/rick-roll.gif"
              alt="Rick roll"
              width={300}
              height={300}
              loading="eager"
              className={mediaStyles.gif}
            />
          </div>

          {/* Description Box */}
          <div className={y2k.descriptionBox}>
            <div className={classes(y2k.descHeader, mediaStyles.betHeader)}>
              BET.TXT
            </div>
            <p>
              A bespoke website created by{" "}
              <a href="https://marcos.ac" target="_blank" className={y2k.link}>
                Marcos Acosta
              </a>{" "}
              and Jiadai He to win a bet he made with her that he could
              discriminate Rick Roll QR codes from non-Rick Roll QR codes from
              sight alone with 95% accuracy. Read the exact{" "}
              <a
                href="https://docs.google.com/document/d/1oJakuWIx8AXTyerasxtlfZZnxzDXphE85znXyTfuHXI/edit?tab=t.0"
                target="_blank"
                className={y2k.link}
              >
                terms
              </a>
              .
            </p>
          </div>

          <div className={styles.centerContent}>
            <button
              onClick={createRoom}
              className={mediaStyles.createRoomButton}
            >
              [ CREATE_ROOM ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

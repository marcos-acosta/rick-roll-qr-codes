import { useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";
import y2k from "@/app/y2k.module.css";
import Image from "next/image";
import { classes } from "@/lib/util";

export default function MediaPlayer({ createRoom }: { createRoom: () => void }) {
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
      <div
        style={{
          position: "absolute",
          left: pos.x,
          top: pos.y,
          width: "min(95vw, 560px)",
          maxHeight: "85vh",
          overflow: "auto",
          backgroundColor: "#efbe5f",
          border: "2px solid #000",
          boxShadow: "inset 2px 2px #fff, inset -2px -2px #d7c9bb",
          fontFamily: "MS Sans Serif, Arial, sans-serif",
          touchAction: "none", // important on mobile to prevent scrolling while dragging
        }}
      >
        {/* Title Bar (drag handle) */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#4ab1af",
            color: "#f48fac",
            padding: "0px 6px",
            height: "1.5em",
            fontSize: "clamp(1rem, 3vw, 2rem)",
            textShadow: "3px 3px #fff",
            fontWeight: "900",
            letterSpacing: "-2px",
            margin: "0",
            fontStyle: "italic",
            cursor: "grab",
          }}
        >
          <span>Media Player - QRICK QROLL</span>
          <button aria-label="Close" style={{ cursor: "pointer" }}>
            X
          </button>
        </div>

        {/* Window Content */}
        <div
            style={{
              padding: "10px",
              backgroundColor: "#fec954",
            }}
          >
            <div
              style={{
                border: "2px solid #000",
                backgroundColor: "#c2abf6",  // purple
                padding: "2px",
              }}
            >
              <Image
                src="/rick-roll.gif"
                alt="Rick roll"
                width={300}
                height={300}
                loading="eager"
                style={{
                  display: "block",
                  imageRendering: "pixelated",
                  filter: "invert(10%)",
                }}
              />
            </div>

            {/* Description Box */}
            <div className={y2k.descriptionBox}>
              <div className={y2k.descHeader} style={{ backgroundColor: "#4a5b94"}}>BET.TXT</div>
              <p>
                A bespoke website created by{" "}
                <a href="https://marcos.ac" target="_blank" className={y2k.link}>
                  Marcos Acosta
                </a>{" "}
                and Jiadai He to win a bet he made with her that he could discriminate Rick
                Roll QR codes from non-Rick Roll QR codes from sight alone with 95%
                accuracy. Read the exact {" "}
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
                className={classes(styles.button, styles.largeButton)}
                style={{
                  backgroundColor: "#4ab1af",
                  color: "#000",
                  border: "4px outset #fff",
                  padding: "6px 12px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  boxShadow: "5px 5px 0px #000",
                  textTransform: "uppercase" as const,
                  transition: "transform 0.1s",
                }}
              >
                [ CREATE_ROOM ]
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}
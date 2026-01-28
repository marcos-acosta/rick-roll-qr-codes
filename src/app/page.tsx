"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { classes, ROOM_CODE_LETTERS } from "@/lib/util";
import Image from "next/image";

function DesktopIcon({ src, label, x, y }: { src: string; label: string; x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 150,
        textAlign: "center",
        zIndex: 2,
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <img
        src={src}
        alt={label}
        style={{
          width: 140,
          height: 140,
          display: "block",
          margin: "0 auto",
        }}
      />
      <div
        style={{
          marginTop: 4,
          fontSize: 12,
          color: "#fff",
          textShadow: "1px 1px #000",
          fontFamily: "MS Sans Serif, Arial, sans-serif",
          lineHeight: "1.2",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const router = useRouter();

  const createRoom = () => {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += ROOM_CODE_LETTERS.charAt(
        Math.floor(Math.random() * ROOM_CODE_LETTERS.length)
      );
    }
    router.push(`/room/${code}`);
  };

  const desktopIcons = [
    { src: "/pc.png", label: "My Computer", x: 22, y: 22 },
    { src: "/musi.png", label: "Musi", x: 192, y: 22 },
    { src: "/pink-internet.png", label: "Internet", x: 22, y: 192 },
    { src: "/calendar.png", label: "Calendar", x: 192, y: 192 },
    { src: "/recyle.png", label: "Recycle", x: 22, y: 364 },
    { src: "/clock.png", label: "Time", x: 192, y: 364 },
    { src: "/console.png", label: "Game", x: 22, y: 536 },
    { src: "/youtube.png", label: "Youtube", x: 192, y: 536 },
  ];

  return (
    <div className={styles.pageOuterContainer} style={y2kStyles.outer}>
      {/* <div className={styles.win95Saver} /> */}
      {desktopIcons.map((icon, index) => (
        <DesktopIcon key={index} src={icon.src} label={icon.label} x={icon.x} y={icon.y} />
      ))}

      <img
        src={"/cd-player.png"}
        alt="CD Player"
        style={{
          position: "absolute",
          top: "300px",
          left: "400px",
          width: 320,
          height: 180,
          display: "block",
          margin: "0 auto",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.4) 100%)",
          zIndex: 1,
        }}
      />
      {/* <div style={y2kStyles.retroSun} /> */}
      <div style={y2kStyles.gridOverlay} />

      <div className={styles.pageInnerContainer} style={y2kStyles.inner}>
        
        {/* GIF Container with Windows 95 Media Player Window*/}
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#c0c0c0",
            border: "2px solid #000",
            boxShadow: "inset 2px 2px #fff, inset -2px -2px #808080",
            fontFamily: "MS Sans Serif, Arial, sans-serif",
            marginBottom: "auto",
            transform: "translateX(200px)",
          }}
        >
          
          {/* Title Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#000080", // Win95 dark blue
              color: "#fff",
              padding: "0px 6px",
              height: "2.2em",
              
              // fontSize: "12px",
              fontSize: "clamp(1rem, 3vw, 2rem)",
              textShadow: "3px 3px #ff00ff, -2px -2px #00ffff",
              fontWeight: "900",
              letterSpacing: "-2px",
              margin: "0",
              fontStyle: "italic",
            }}
          >
            <span>Media Player - QRICK QROLL</span>

            {/* Close Button */}
            <button
              aria-label="Close"
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#c0c0c0",
                border: "2px solid #000",
                boxShadow: "inset 1px 1px #fff, inset -1px -1px #808080",
                fontSize: "10px",
                lineHeight: "10px",
                padding: 0,
                cursor: "pointer",
                fontFamily: "MS Sans Serif, Arial, sans-serif",
              }}
            >
              X
            </button>
          </div>

          {/* Window Content */}
          <div
            style={{
              padding: "10px",
              backgroundColor: "#c0c0c0",
            }}
          >
            <div
              style={{
                border: "2px solid #000",
                backgroundColor: "#000",
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
                }}
              />
            </div>

            {/* Description Box */}
            <div className={styles.description} style={y2kStyles.descriptionBox}>
              <div style={y2kStyles.descHeader}>BET.TXT</div>
              <p>
                A bespoke website created by{" "}
                <a href="https://marcos.ac" target="_blank" style={y2kStyles.link}>
                  MARCOS ACOSTA
                </a>{" "}
                to win a bet he made with JIADAI HE that he could discriminate Rick
                Roll QR codes from non-Rick Roll QR codes from sight alone with 95%
                accuracy. Read the exact {" "}
                <a
                  href="https://docs.google.com/document/d/1oJakuWIx8AXTyerasxtlfZZnxzDXphE85znXyTfuHXI/edit?tab=t.0"
                  target="_blank"
                  style={y2kStyles.link}
                >
                  TERMS
                </a>
                .
              </p>
            </div>

            <div className={styles.centerContent}>
              <button
                onClick={createRoom}
                className={classes(styles.button, styles.largeButton)}
                style={{
                  backgroundColor: "#00ffff",
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
    </div>
  );
}

const y2kStyles = {
  
  outer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Courier New", Courier, monospace',
    overflow: "hidden",
    position: "relative" as const,

    /* Windows 95 background image */
    backgroundImage: "url('/windows95.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
  },
  gridOverlay: {
    position: "absolute" as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
    backgroundSize: "30px 30px",
    pointerEvents: "none" as const,
  },
  retroSun: {
    position: "absolute" as const,
    top: "15%",
    left: "50%",
    transform: "translateX(-50%)",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "linear-gradient(to bottom, #ffcc00 0%, #ff007f 100%)",
    boxShadow: "0 0 50px #ff007f",
    zIndex: 0,
    WebkitMaskImage: "repeating-linear-gradient(to bottom, black 0px, black 15px, transparent 20px, transparent 25px)",
  },
  inner: {
    zIndex: 2,
    maxWidth: "600px",
    padding: "40px",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "clamp(2rem, 8vw, 4rem)",
    color: "#fff",
    textShadow: "4px 4px #ff00ff, -2px -2px #00ffff",
    fontWeight: "900",
    letterSpacing: "-2px",
    margin: "0",
    fontStyle: "italic",
  },
  descriptionBox: {
    marginTop: "40px",
    marginBottom: "20px",
    backgroundColor: "#c0c0c0", // Windows 95 Grey
    border: "2px solid #000",
    boxShadow: "inset 2px 2px #fff, inset -2px -2px #808080",
    color: "#000",
    padding: "15px",
    fontSize: "0.9rem",
    textAlign: "left" as const,
    lineHeight: "1.4",
  },
  descHeader: {
    backgroundColor: "#000080",
    color: "#fff",
    padding: "2px 8px",
    fontSize: "0.7rem",
    marginBottom: "10px",
    display: "inline-block",
  },
  link: {
    color: "#0000ff",
    textDecoration: "underline",
    fontWeight: "bold",
  }
};
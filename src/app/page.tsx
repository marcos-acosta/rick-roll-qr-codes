"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { ROOM_CODE_LETTERS } from "@/lib/util";
import MediaPlayer from "@/components/MediaPlayer";
import SystemMessageBox from "@/components/SystemMessageBox";

function DesktopIcon({ src, label, x, y }: { src: string; label: string; x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -70%)",
        width: '10%',
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
          width: '70%',
          display: "block",
          margin: "0 auto",
        }}
      />
      <div
        style={{
          marginTop: "2%",
          fontSize: "clamp(11px, 2vw, 16px)",
          color: "#fff",
          textShadow: "1px 1px #000",
          fontFamily: "Comic Sans MS, cursive",
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
    { src: "/pc.png", label: "Computer", x: 5, y: 10 },
    { src: "/musi.png", label: "Musi", x: 15, y: 10 },
    { src: "/pink-internet.png", label: "Internet", x: 5, y: 27 },
    { src: "/calendar.png", label: "Calendar", x: 15, y: 27 },
    { src: "/recyle.png", label: "Recycle", x: 5, y: 44 },
    { src: "/clock.png", label: "Time", x: 15, y: 44 },
    { src: "/console.png", label: "Game", x: 5, y: 61 },
    { src: "/youtube.png", label: "Youtube", x: 15, y: 61 },
  ];

  return (
    <div className={styles.pageOuterContainer} style={{...y2kStyles.outer, position: "relative"}}>
      <div className={styles.starfield}/>
      {desktopIcons.map((icon, index) => (
        <DesktopIcon key={index} src={icon.src} label={icon.label} x={icon.x} y={icon.y} />
      ))}

      <img
        src={"/mix.png"}
        alt="CD Player"
        style={{
          position: "absolute",
          top: "50%",
          left: "15%",
          width: 500,
          height: 500,
        }}
      />
      <SystemMessageBox />
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

      <MediaPlayer createRoom={createRoom} />
      
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
    backgroundColor: "#fec954", // Windows 95 Grey
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
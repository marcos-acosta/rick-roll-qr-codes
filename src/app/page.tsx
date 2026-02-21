"use client";

import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import y2k from "./y2k.module.css";
import { ROOM_CODE_LETTERS } from "@/lib/util";
import MediaPlayer from "@/components/MediaPlayer";
import SystemMessageBox from "@/components/SystemMessageBox";

function DesktopIcon({ src, label, x, y }: { src: string; label: string; x: number; y: number }) {
  return (
    <div
      className={styles.desktopIcon}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <img
        src={src}
        alt={label}
        className={styles.desktopIconImg}
      />
      <div className={styles.desktopIconLabel}>
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
    <div className={`${styles.pageOuterContainer} ${y2k.outer}`}>
      <div className={styles.starfield}/>
      {desktopIcons.map((icon, index) => (
        <DesktopIcon key={index} src={icon.src} label={icon.label} x={icon.x} y={icon.y} />
      ))}

      <img
        src={"/mix.png"}
        alt="CD Player"
        className={styles.mixImg}
      />
      <SystemMessageBox />
      <div className={y2k.vignette} />
      {/* <div className={y2k.retroSun} /> */}
      <div className={y2k.gridOverlay} />

      <MediaPlayer createRoom={createRoom} />

    </div>
  );
}

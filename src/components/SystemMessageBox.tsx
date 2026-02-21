import { useState, useCallback, useRef, useEffect } from "react";
import styles from "./SystemMessageBox.module.css";

export default function SystemMessageBox() {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ x: 200, y: 60 });
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, startLeft: 0, startTop: 0 });

    useEffect(() => {
        setMounted(true);
        setPosition({
            x: window.innerWidth * 0.65 - 175,
            y: window.innerHeight * 0.1,
        });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        dragRef.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        startLeft: position.x,
        startTop: position.y,
        };
    }, [position]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current.isDragging) return;
        setPosition({
            x: dragRef.current.startLeft + (e.clientX - dragRef.current.startX),
            y: dragRef.current.startTop + (e.clientY - dragRef.current.startY),
        });
        };
        const handleMouseUp = () => {
        dragRef.current.isDragging = false;
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    if (!mounted) return null;

    return (
        <div
            role="dialog"
            aria-label="System Error"
            className={styles.dialog}
            style={{ left: position.x, top: position.y }}
        >
            <div onMouseDown={handleMouseDown} className={styles.titleBar}>
                <span className={styles.titleText}>System Error</span>
                <button type="button" aria-label="Close" className={styles.closeButton}>
                    ✕
                </button>
            </div>
            {/* Content */}
            <div className={styles.content}>
                <div className={styles.row}>
                    {/* Error icon */}
                    <div className={styles.errorIcon}>✕</div>
                    <span className={styles.message}>You&apos;re screwed. Continue?</span>
                </div>
                {/* Buttons */}
                <div className={styles.buttons}>
                    <button type="button" className={styles.button}>I&apos;m fine</button>
                    <button type="button" className={`${styles.button} ${styles.buttonDisabled}`}>Quit</button>
                    <button type="button" className={styles.button}>Damn!</button>
                </div>
            </div>
        </div>
    );
}

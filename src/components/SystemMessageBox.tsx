import { useState, useCallback, useRef, useEffect } from "react";

const buttonStyle: React.CSSProperties = {
    minWidth: 70,
    padding: "4px 12px",
    fontSize: 12,
    border: "1px solid #808080",
    backgroundColor: "#c0c0c0",
    boxShadow: "inset 1px 1px 0 #fff, 1px 1px 0 #404040",
    cursor: "default",
    color: "#000",
    fontFamily: "MS Sans Serif, Tahoma, Arial, sans-serif",
};

  
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
        style={{
            position: "fixed",
            left: position.x,
            top: position.y,
            width: 350,
            zIndex: 20,
            boxSizing: "border-box",
            border: "2px solid #fff",
            borderRadius: 6,
            boxShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            overflow: "hidden",
            fontFamily: "MS Sans Serif, Tahoma, Arial, sans-serif",
        }}
        >
        <div
            onMouseDown={handleMouseDown}
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 8px",
            backgroundColor: "#f48fac",
            cursor: "move",
            userSelect: "none",
            }}
        >
            <span style={{ color: "#fff", fontSize: 13, fontWeight: "bold", textShadow: "1px 1px 0 #333" }}>
                System Error
            </span>
            <button
            type="button"
            aria-label="Close"
            style={{
                width: 20,
                height: 20,
                padding: 0,
                border: "1px solid #808080",
                backgroundColor: "#c0c0c0",
                boxShadow: "inset 1px 1px 0 #fff, 1px 1px 0 #404040",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                lineHeight: 1,
                color: "#404040",
            }}
            >
            ✕
            </button>
        </div>
        {/* Content */}
        <div
            style={{
            backgroundColor: "#E0DCD1",
            padding: "12px 14px",
            borderTop: "1px solid #808080",
            }}
        >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
            {/* Error icon */}
            <div
                style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#f48fac",
                border: "2px solid #fff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold",
                lineHeight: 1,
                }}
            >
                ✕
            </div>
            <span style={{ color: "#000", fontSize: 13, lineHeight: 1.35 }}>
                You're screwed. Continue?
            </span>
            </div>
            {/* Buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <button type="button" style={buttonStyle}>I'm fine</button>
            <button type="button" style={{ ...buttonStyle, color: "#A0A0A0" }}>Ok</button>
            <button type="button" style={buttonStyle}>Damn!</button>
            </div>
        </div>
        </div>
    );
}
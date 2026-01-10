"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomsPage() {
  const [roomCode, setRoomCode] = useState("");
  const router = useRouter();

  // Generate a random 6-character room code
  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${code}`);
  };

  const joinRoom = () => {
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>QR Code Game</h1>

      <div style={{ marginTop: "40px" }}>
        <h2>Create New Room</h2>
        <button onClick={createRoom}>Create Room</button>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Join Existing Room</h2>
        <input
          type="text"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && joinRoom()}
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

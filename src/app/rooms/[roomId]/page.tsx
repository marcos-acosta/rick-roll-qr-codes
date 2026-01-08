"use client";

import { use, useState } from "react";
import usePartySocket from "partysocket/react";
import QrCode from "@/components/QrCode";
import { generateRandomRickRollQrCode } from "@/lib/randomRickRoll";
import { loadQrCodesFromFile } from "@/lib/qrCodeUpload";
import { GameData, GameState, QrCodeData } from "@/types/interfaces";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  // Unwrap the params Promise
  const { roomId } = use(params);

  const [role, setRole] = useState<"creator" | "joiner" | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);
  const [qrCodeData] = useState<QrCodeData>(generateRandomRickRollQrCode());

  // This hook creates a WebSocket connection to your PartyKit server
  // It automatically handles reconnection and connection state
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: roomId,
    onMessage(event) {
      const data = JSON.parse(event.data);

      // Handle different message types from the server
      if (data.type === "role") {
        setRole(data.role);
      } else if (data.type === "game_data") {
        setGameData(data.gameData);
      }
    },
  });

  const increment = () => {
    // Send a message to the server
    socket.send(JSON.stringify({ type: "increment" }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const qrCodes = await loadQrCodesFromFile(file);
      // Send the QR codes to the server
      socket.send(JSON.stringify({ type: "upload_qr_codes", qrCodes }));
    } catch (error) {
      alert("Error loading QR codes: " + error);
    }
  };

  const start = () => {
    socket.send(JSON.stringify({ type: "start_game" }));
  };

  if (!role) {
    return <div style={{ padding: "20px" }}>Connecting...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Room: {roomId}</h1>
      <h2>Role: {role}</h2>
      {gameData && (
        <div>
          <h2>Count: {gameData.count}</h2>
          <h2>Game state: {gameData.gameState}</h2>
          <h2>Has player: {gameData.hasPlayer ? "yes" : "no"}</h2>
        </div>
      )}

      {role === "creator" ? (
        <div>
          <h3>You are the creator - show QR code</h3>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="qr-upload">Upload QR Codes JSON: </label>
            <input
              id="qr-upload"
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
            />
          </div>
          {gameData?.gameState === GameState.READY_TO_START && (
            <button onClick={start}>Start</button>
          )}
          <div style={{ maxWidth: "300px" }}>
            <QrCode qrCodeData={qrCodeData} />
          </div>
          <div style={{ marginTop: "20px" }}>
            <div>URL: {qrCodeData.url}</div>
            <div>Error correction: {qrCodeData.errorCorrectionLevel}</div>
          </div>
        </div>
      ) : (
        <div>
          <h3>You are the joiner - scan or skip!</h3>
          <button
            onClick={increment}
            style={{ padding: "10px 20px", fontSize: "16px" }}
          >
            Increment Count
          </button>
        </div>
      )}
    </div>
  );
}

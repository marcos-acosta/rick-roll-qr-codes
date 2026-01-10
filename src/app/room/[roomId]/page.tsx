"use client";

import { use, useState } from "react";
import usePartySocket from "partysocket/react";
import QrCode from "@/components/QrCode";
import { loadQrCodesFromFile } from "@/lib/qrCodeUpload";
import { GameData, GameState } from "@/types/interfaces";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  // Unwrap the params Promise
  const { roomId } = use(params);

  const [role, setRole] = useState<"creator" | "joiner" | null>(null);
  const [gameData, setGameData] = useState<GameData | null>(null);

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

  const guess = (scan: boolean) => {
    socket.send(JSON.stringify({ type: "guess", scan }));
  };

  const nextQuestion = () => {
    socket.send(JSON.stringify({ type: "next_question" }));
  };

  const startOver = () => {
    socket.send(JSON.stringify({ type: "start_over" }));
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
          <h2>Game state: {gameData.gameState}</h2>
          <h2>Has player: {gameData.hasPlayer ? "yes" : "no"}</h2>
          <h2>Question number: {gameData.questionNumber}</h2>
          <h2>Score: {gameData.score}</h2>
          <h2>
            Action taken:{" "}
            {gameData.scanned === null
              ? "N/A"
              : gameData.scanned
              ? "Scanned"
              : "Skipped"}
          </h2>
          <h2>
            Was correct?{" "}
            {gameData.correct === null
              ? "N/A"
              : gameData.correct
              ? "YES! :D"
              : "No :("}
          </h2>
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
          {gameData?.qrCodeData && (
            <div>
              <div style={{ maxWidth: "300px" }}>
                <QrCode qrCodeData={gameData.qrCodeData} />
              </div>
              <div style={{ marginTop: "20px" }}>
                <div>URL: {gameData.qrCodeData.url}</div>
                <div>
                  Error correction: {gameData.qrCodeData.errorCorrectionLevel}
                </div>
              </div>
            </div>
          )}
          {gameData?.gameState === GameState.GAME_OVER && (
            <div>
              <h1>Game over! Score: {gameData.score}</h1>
              <button onClick={startOver}>Start over</button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3>You are the joiner - scan or skip!</h3>
          {gameData?.gameState === GameState.PENDING ? (
            <div>
              <div>
                <Scanner
                  onScan={() => guess(true)}
                  components={{
                    onOff: true,
                    torch: false,
                    zoom: false,
                    finder: false,
                  }}
                  sound={false}
                />
              </div>
              <button onClick={() => guess(false)}>Skip</button>
            </div>
          ) : gameData?.gameState === GameState.GUESSED ? (
            <button onClick={nextQuestion}>Next</button>
          ) : gameData?.gameState === GameState.GAME_OVER ? (
            <div>
              <h1>Game over! Score {gameData.score}</h1>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

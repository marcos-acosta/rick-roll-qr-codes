"use client";

import { use, useState } from "react";
import usePartySocket from "partysocket/react";
import { loadQrCodesFromFile } from "@/lib/qrCodeUpload";
import { GameData, GameState } from "@/types/interfaces";
import { Scanner } from "@yudiel/react-qr-scanner";
import Loading from "@/layouts/Loading";
import RoomHostSetup from "@/layouts/RoomHostSetup";
import HostTrial from "@/layouts/HostTrial";
import GuesserScreen from "@/layouts/GuesserScreen";

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

  // console.log(gameData);

  const isInRoomSetup =
    gameData?.gameState == GameState.NOT_STARTED ||
    gameData?.gameState === GameState.READY_TO_START;
  const isInGame =
    gameData?.gameState == GameState.PENDING ||
    gameData?.gameState === GameState.GUESSED;

  if (!role) {
    return <Loading message={"loading..."} showTitle />;
  }

  return role === "creator" ? (
    isInRoomSetup ? (
      <RoomHostSetup
        handleFileUpload={handleFileUpload}
        roomCode={roomId}
        gameData={gameData}
        start={start}
      />
    ) : isInGame ? (
      <HostTrial gameData={gameData} />
    ) : (
      <></>
    )
  ) : isInRoomSetup ? (
    <Loading message={"waiting for host to start..."} showTitle />
  ) : isInGame ? (
    <GuesserScreen gameData={gameData} guess={guess} />
  ) : (
    <></>
  );
}

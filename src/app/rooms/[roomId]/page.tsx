"use client";

import { use, useState } from "react";
import usePartySocket from "partysocket/react";
import QrCode from "@/components/QrCode";
import { generateRandomRickRollQrCode } from "@/lib/randomRickRoll";
import { QrCodeData } from "@/types/interfaces";

export default function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  // Unwrap the params Promise
  const { roomId } = use(params);

  const [role, setRole] = useState<"creator" | "joiner" | null>(null);
  const [count, setCount] = useState(0);
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
      } else if (data.type === "count") {
        setCount(data.count);
      }
    },
  });

  const increment = () => {
    // Send a message to the server
    socket.send(JSON.stringify({ type: "increment" }));
  };

  if (!role) {
    return <div style={{ padding: "20px" }}>Connecting...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Room: {roomId}</h1>
      <h2>Role: {role}</h2>
      <h2>Count: {count}</h2>

      {role === "creator" ? (
        <div>
          <h3>You are the creator - show QR code</h3>
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
          <button onClick={increment} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Increment Count
          </button>
        </div>
      )}
    </div>
  );
}

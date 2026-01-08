import { GameData, GameState, QrCodeData } from "@/types/interfaces";
import Sampler from "@/lib/sampler";
import type * as Party from "partykit/server";

const INITIAL_GAME_DATA: GameData = {
  count: 0,
  questionNumber: null,
  score: 0,
  creator: null,
  qrCodeData: null,
  gameState: GameState.NOT_STARTED,
  scanned: false,
  hasPlayer: false,
};

// This is the server that runs on PartyKit's edge infrastructure
// Each room gets its own instance of this class
export default class Server implements Party.Server {
  // Room state - stored in memory for this room
  gameData: GameData;
  safeQrCodeSampler: Sampler<QrCodeData> | null = null;

  constructor(readonly room: Party.Room) {
    // Create a new copy of the initial game data for this room
    this.gameData = { ...INITIAL_GAME_DATA };
  }

  isReadyToStart() {
    return this.gameData.hasPlayer && this.safeQrCodeSampler;
  }

  nextQuestion() {
    this.gameData = {
      ...this.gameData,
      questionNumber: (this.gameData.questionNumber || 0) + 1,
      gameState: GameState.PENDING,
    };
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Connected: ${conn.id} to room ${this.room.id}`);

    // If this is the first connection, they become the creator
    if (this.gameData.creator === null) {
      this.gameData.creator = conn.id;
      conn.send(JSON.stringify({ type: "role", role: "creator" }));
    } else {
      this.gameData.hasPlayer = true;
      if (this.isReadyToStart()) {
        this.gameData.gameState = GameState.READY_TO_START;
      }
      conn.send(JSON.stringify({ type: "role", role: "joiner" }));
    }

    this.room.broadcast(
      JSON.stringify({ type: "game_data", gameData: this.gameData })
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);

    // Handle increment message
    if (data.type === "increment") {
      this.gameData.count++;
    } else if (data.type === "upload_qr_codes") {
      // Handle QR code upload
      const qrCodes = data.qrCodes as QrCodeData[];
      if (Array.isArray(qrCodes) && qrCodes.length > 0) {
        this.safeQrCodeSampler = new Sampler(qrCodes);

        // If we have both a player and QR codes, we're ready to start
        if (this.isReadyToStart()) {
          this.gameData.gameState = GameState.READY_TO_START;
        }
      }
    } else if (data.type === "start_game") {
      if (this.gameData.gameState === GameState.READY_TO_START) {
        this.nextQuestion();
      }
    }

    // Broadcast updated game data to ALL connections in the room
    this.room.broadcast(
      JSON.stringify({ type: "game_data", gameData: this.gameData })
    );
  }
}

Server satisfies Party.Worker;

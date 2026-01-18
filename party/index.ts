import { GameData, GameState, QrCodeData } from "@/types/interfaces";
import Sampler from "@/lib/sampler";
import type * as Party from "partykit/server";
import { generateRandomRickRollQrCode } from "@/lib/randomRickRoll";

const INITIAL_GAME_DATA: GameData = {
  questionNumber: null,
  score: 0,
  creator: null,
  qrCodeData: null,
  gameState: GameState.NOT_STARTED,
  scanned: null,
  correct: null,
  hasPlayer: false,
  numSafeQrCodesUploaded: null,
};

// This is the server that runs on PartyKit's edge infrastructure
// Each room gets its own instance of this class
export default class Server implements Party.Server {
  // Room state - stored in memory for this room
  gameData: GameData;
  safeQrCodeSampler: Sampler<QrCodeData> | null = null;
  isRickRoll: boolean | null = null;

  constructor(readonly room: Party.Room) {
    // Create a new copy of the initial game data for this room
    this.gameData = { ...INITIAL_GAME_DATA };
  }

  isReadyToStart() {
    console.log("Checking if ready to start:", {
      hasPlayer: this.gameData.hasPlayer,
      safeQrCodeSamplerExists: !!this.safeQrCodeSampler,
    });
    return this.gameData.hasPlayer && this.safeQrCodeSampler;
  }

  nextQuestion() {
    if (!this.safeQrCodeSampler) {
      return;
    }
    const isRickRoll = Math.random() > 0.5;
    const qrCodeData = isRickRoll
      ? generateRandomRickRollQrCode()
      : this.safeQrCodeSampler.sample();
    this.gameData = {
      ...this.gameData,
      questionNumber: (this.gameData.questionNumber || 0) + 1,
      gameState: GameState.PENDING,
      qrCodeData: qrCodeData,
      scanned: null,
      correct: null,
    };
    this.isRickRoll = isRickRoll;
  }

  reset() {
    if (!this.safeQrCodeSampler) {
      return;
    }
    this.safeQrCodeSampler.reset();
    const isRickRoll = Math.random() > 0.5;
    const qrCodeData = isRickRoll
      ? generateRandomRickRollQrCode()
      : this.safeQrCodeSampler.sample();
    this.gameData = {
      ...this.gameData,
      questionNumber: 1,
      gameState: GameState.PENDING,
      qrCodeData: qrCodeData,
      scanned: null,
      correct: null,
      score: 0,
    };
    this.isRickRoll = isRickRoll;
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

    console.log(`Broadcasting game data to room ${this.gameData}`);

    this.room.broadcast(
      JSON.stringify({ type: "game_data", gameData: this.gameData })
    );
  }

  onMessage(message: string, sender: Party.Connection) {
    const data = JSON.parse(message);

    // Handle increment message
    if (data.type === "upload_qr_codes") {
      // Handle QR code upload
      const qrCodes = data.qrCodes as QrCodeData[];
      console.log(`Received ${qrCodes.length} QR codes from ${sender.id}`);
      console.log(qrCodes);
      if (Array.isArray(qrCodes) && qrCodes.length > 0) {
        this.safeQrCodeSampler = new Sampler(qrCodes);
        this.gameData.numSafeQrCodesUploaded = qrCodes.length;
        console.log(`Initialized safe QR code sampler with ${qrCodes.length} codes`);
        // If we have both a player and QR codes, we're ready to start
        if (this.isReadyToStart()) {
          this.gameData.gameState = GameState.READY_TO_START;
        }
      }
    } else if (data.type === "start_game") {
      if (this.gameData.gameState === GameState.READY_TO_START) {
        this.nextQuestion();
      }
    } else if (data.type === "guess") {
      if (this.gameData.gameState === GameState.PENDING) {
        const isCorrect = data.scan === !this.isRickRoll;
        this.gameData = {
          ...this.gameData,
          scanned: data.scan,
          correct: isCorrect,
          score: this.gameData.score + (isCorrect ? 1 : 0),
          gameState: GameState.GUESSED,
        };
      }
    } else if (data.type === "next_question") {
      if (this.gameData.questionNumber === 20) {
        this.gameData = {
          ...this.gameData,
          gameState: GameState.GAME_OVER,
          qrCodeData: null,
          correct: null,
          scanned: null,
        };
      } else {
        this.nextQuestion();
      }
    } else if (data.type === "start_over") {
      this.reset();
    }

    // Broadcast updated game data to ALL connections in the room
    this.room.broadcast(
      JSON.stringify({ type: "game_data", gameData: this.gameData })
    );
  }
}

Server satisfies Party.Worker;

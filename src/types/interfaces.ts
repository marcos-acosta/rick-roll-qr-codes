export enum ErrorCorrectionLevel {
  LOW = "L",
  MEDIUM = "M",
  HIGH = "H",
  QUARTILE = "Q",
}

export enum GameState {
  NOT_STARTED = "NOT_STARTED",
  READY_TO_START = "READY_TO_START",
  PENDING = "PENDING",
  GUESSED = "GUESSED",
  GAME_OVER = "GAME_OVER",
}

export interface QrCodeData {
  url: string;
  mask: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export interface GameData {
  count: number;
  questionNumber: number | null;
  score: number;
  creator: string | null;
  qrCodeData: QrCodeData | null;
  gameState: GameState;
  scanned: boolean | null;
  hasPlayer: boolean;
}

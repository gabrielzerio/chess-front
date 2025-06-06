export type PieceColor = "white" | "black";
export type PieceType = "rook" | "knight" | "bishop" | "queen" | "king" | "pawn";
export interface Position { row: number; col: number; }
export interface Piece {
  type: PieceType;
  color: PieceColor;
  position: Position;
}
export type GameStatus = 'waiting' | 'playing' | 'ended' | 'checkmate' | 'paused_reconnect' | 'abandoned';
export type Board = (Piece | null)[][];

export interface IPlayer {
  playerName?:string;
  playerID:string;
  gameID:string;
  color?:PieceColor;
}

export interface IHandleGameOver{
  status?:GameStatus;
  colorWinner?:PieceColor;
  message?:string;
  playerWinner:string;
}

export type Login = {
    playerID?: string;
    gameID?: string;
    success: boolean;
};
export type IPausedForReconection = {
    disconnectedPlayerName: string;
    timeLeft: number;
}
export interface IHandleJoinedOrReconnected {
    message?:'string'
    board: Board,
    color: PieceColor,
    turn: PieceColor,
    status: string
}
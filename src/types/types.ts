export type PieceColor = "white" | "black";
export type PieceType = "rook" | "knight" | "bishop" | "queen" | "king" | "pawn";
export interface Position { row: number; col: number; }
export interface Piece {
  type: PieceType;
  color: PieceColor;
  position: Position;
}
export type Board = (Piece | null)[][];

export interface IPlayer {
  playerName?:string;
  playerID:string;
  gameID:string;
  color?:PieceColor;
}
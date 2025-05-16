import type { PieceColor, PieceType, Piece } from "../../../types/types";

type ChildProps ={
    row:number;
    col:number;
    boardRefs:React.RefObject<(HTMLDivElement | null)[][]>
    isHighlight:boolean;
    isCapture:boolean;
    piece:Piece|null;
    handleSquareClick: (row: number, col: number) => Promise<void>
    pieceSymbols: Record<PieceType, Record<PieceColor, string>>
}
export function BoardPiece({row,col,boardRefs, isHighlight, isCapture, piece, handleSquareClick, pieceSymbols}:ChildProps){
    return (
                    <div key={`${row}-${col}`} id={`${row}-${col}`} ref={el => { boardRefs.current[row][col] = el; }}
                      className={`
                         flex items-center justify-center relative 
                        ${(row + col) % 2 === 0 ? "bg-yellow-100 dark:bg-yellow-800" : "bg-yellow-700 dark:bg-yellow-600"} 
                        cursor-pointer transition
                        ${isHighlight ? "!bg-green-500 dark:!bg-green-700" : ""}
                        ${isCapture ? "!bg-red-500 dark:!bg-red-700" : ""}`}
                      onClick={() => handleSquareClick(row, col)}
                    >
                      <span className="piece absolute text-4xl select-none pointer-events-none">
                        {piece ? pieceSymbols[piece.type][piece.color] : ""}
                      </span>
                    </div>
                  );
}
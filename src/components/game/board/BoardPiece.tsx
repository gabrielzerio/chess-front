import type { Piece } from "../../../types/types";

type ChildProps = {
  row: number;
  col: number;
  boardRefs: React.RefObject<(HTMLDivElement | null)[][]>
  isHighlight: boolean;
  isCapture: boolean;
  piece: Piece | null;
  handleSquareClick: (row: number, col: number) => Promise<void>
}
function getPieceImage(piece: Piece | null): string | null {
  if (!piece) return "";
  return `/pieces/${piece.color}_${piece.type}.svg`;
}
export function BoardPiece({ row, col, boardRefs, isHighlight, isCapture, piece, handleSquareClick }: ChildProps) {
  const imgSrc = getPieceImage(piece)
  return (
    <div key={`${row}-${col}`} id={`${row}-${col}`} ref={el => { boardRefs.current[row][col] = el; }}
      className={`flex items-center justify-center relative
                        ${(row + col) % 2 === 0 ? "bg-yellow-100 dark:bg-yellow-800" : "bg-yellow-700 dark:bg-yellow-600"} 
                        cursor-pointer transition
                        ${isHighlight ? "!bg-green-500 dark:!bg-green-700" : ""}
                        ${isCapture ? "!bg-red-500 dark:!bg-red-700" : ""}`}
      onClick={() => handleSquareClick(row, col)}>

      {imgSrc && (
        <img
          src={imgSrc}
          alt={`${piece?.color} ${piece?.type}`}
          className="select-none pointer-events-none sm:w-[70%] sm:h-[70%] object-contain"
          draggable={false}
        />)}

    </div>
  );
}
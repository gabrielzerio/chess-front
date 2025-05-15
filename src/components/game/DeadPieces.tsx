import type { PieceColor, PieceType, Piece} from "../../types/types";

interface CompDeadPiecesProps {
    deadPieces:{white:Piece[]; black:Piece[]};
    pieceSymbols: {[key in PieceType]: {[key in PieceColor]: string}};
    endGameModal: { open: boolean };
}

export function DeadPieces({deadPieces, pieceSymbols, endGameModal}: CompDeadPiecesProps) {
  return (
         <div className={`dead-pieces flex flex-col justify-between p-5 h-[500px] w-[200px] rounded-lg text-4xl bg-neutral-600 md:justify-self-end ${endGameModal.open ? "blur-sm" : ""}`}>
          <div id="black-pieces" className="flex flex-wrap">
            {deadPieces.black.map((p, i) => (
              <span key={i}>{pieceSymbols[p.type][p.color]}</span>
            ))}
          </div>
          <div id="white-pieces" className="flex flex-wrap">
            {deadPieces.white.map((p, i) => (
              <span key={i}>{pieceSymbols[p.type][p.color]}</span>
            ))}
          </div>
        </div> 
  );
}
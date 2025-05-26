import React, { useState, useRef, useEffect } from "react";
import ModalInicio from "./components/modals/Modal";
import {Game} from './components/game/index'
import type { PieceColor, PieceType, Position, Piece, Board, IPlayer} from "./types/types";
import { DeadPieces } from "./components/game/DeadPieces";
import { GameHeader } from "./components/game/GameHeader";
import { useUser } from "./UserContext";
import { BoardPiece } from "./components/game/board/BoardPiece";
import { BoardContainer } from "./components/game/board/BoardGrid";
import {socket} from './socket'
import { criarJogo } from "./api";

// interface JoinPayload  {
//   gameId:string,
//   playerName:string
// }

// const pieceSymbols: Record<PieceType, Record<PieceColor, string>> = {
//   rook: { white: "♖", black: "♜" },
//     knight: { white: "♘", black: "♞" },
//     bishop: { white: "♗", black: "♝" },
//     queen: { white: "♕", black: "♛" },
//     king: { white: "♔", black: "♚" },
//     pawn: { white: "p", black:("o") },
// };

// // const WS_API_URL =  import.meta.env.VITE_WS_API_URL;





// export const ChessGame: React.FC = () => {


  
//   // // Estados principais

 
  


// // useEffect(() => {
// //     socket.emit('joinGame', { playerName: JoinInputPlayerName || 'aaaa' });
// // },[isConnected])

  
//   // refs para posicionamento do modal de promoção
//   // Previne fechar modais com ESC
//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if ( promotionModal.open || endGameModal.open) {
//         if (e.key === "Escape") e.preventDefault();
//       }
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [ promotionModal.open, endGameModal.open]);



// useEffect(() => {
//   const root = window.document.documentElement;
//   if (darkMode) {
//     root.classList.add('dark');
//   } else {
//     root.classList.remove('dark');
//   }
// }, [darkMode]);

// // 4. Tocar som de game over




//   return (
//     <div className="flex flex-col lg:flex-row gap-6 items-center md:justify-center w-full h-screen sm:h-full sm:px-2 py-4 bg-gray-100 dark:bg-gray-900 font-sans text-neutral-900 dark:text-neutral-100">
//         {/* <button onClick={() => setDarkMode(!darkMode)}
//           className="absolute bottom-4 md:-bottom-0 right-4 z-50 px-4 py-2 rounded-lg font-bold text-sm
//         bg-neutral-800 text-white hover:bg-yellow-400 hover:text-black dark:bg-yellow-500 dark:text-black dark:hover:bg-neutral-800 dark:hover:text-white">
//         {darkMode ? "Modo Claro ☀️" : "Modo Escuro 🌙"}
//         </button> */}

      

// export default ChessGame;
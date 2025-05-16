import { useContext } from "react";
import type { PieceColor } from "../../types/types";
import { useUser } from "../../UserContext";
import { DivGameId } from "../game/GameId"

type ChildProps = {
  handleRestart:(status: string | null) => void;
}

export function GameHeader({handleRestart}:ChildProps){
const contexto = useUser();
    return (
        <div className="flex flex-row w-screen md:items-center bg-yellow-200 dark:bg-yellow-900 shadow-lg rounded-xl px-4 py-2 border border-yellow-600 dark:border-yellow-700">
            
          <div id="turn-info" className="p-5 text-lg text-center rounded-lg grow font-medium">
            {contexto.playerColor ? (contexto.turn === contexto.playerColor ? "Sua vez" : "Aguardando adversário")
            : `Turno: ${contexto.turn === "white" ? contexto.playerName || "Jogador Branco" : contexto.playerName || "Jogador Preto"}`}
          </div>
          <DivGameId/>
          <button 
            onClick={() => handleRestart('leave')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 ml-4 rounded-lg font-bold shadow-md transition">
            SAIR DO JOGO
          </button>
        </div>
    )
}
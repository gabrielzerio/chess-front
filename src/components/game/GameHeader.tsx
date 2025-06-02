import { useUser } from "../../UserContext";
import { DivGameId } from "../game/GameId"
import { useNavigate } from "react-router-dom";

export function GameHeader(){
  const navigate = useNavigate();
  function handleRestart(operacao:string){
    if(operacao==='leave'){
      navigate('/');
      localStorage.clear();
    }
  }
  const contexto = useUser();
    return (
        <div className="flex flex-row w-screen h-25 sm:h-15 md:items-center md:w-[800px] bg-yellow-200 dark:bg-yellow-900 shadow-lg rounded-xl px-4 py-2 border border-yellow-600 dark:border-yellow-700">
            
            <DivGameId/>
          <div id="turn-info" className="p-5 text-lg text-center self-center rounded-lg grow font-medium">
            {contexto.playerColor ? (contexto.turn === contexto.playerColor ? "Sua vez" : "Aguardando adversário")
            : `Turno: ${contexto.turn === "white" ? contexto.playerName || "Jogador Branco" : contexto.playerName || "Jogador Preto"}`}
          </div>
          <button 
            onClick={() => handleRestart('leave')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 ml-4 rounded-lg font-bold shadow-md transition">
            SAIR DO JOGO
          </button>
        </div>
    )
}
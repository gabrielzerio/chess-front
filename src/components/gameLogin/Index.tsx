// import { useContext } from "react";
// import { useUser } from "./UserContext";
// import type { UserContextType } from "./types/ContextType";

import { useNavigate } from "react-router-dom";
import { createGame, joinGame } from "../../api";
import { useUser } from "../../UserContext";
import { useEffect, useState } from "react";
import type { IPlayer } from "../../types/types";
import { useUserFunctions } from "../../UserFunctionsContext";
import { ResumeGameModal } from "../modal/ResumeGameModal";

export function MenuInicio() {

  const contexto = useUser();
  const { handleAttemptReconnect } = useUserFunctions();
  const navigate = useNavigate();

  const [showResumeModal, setShowResumeModal] = useState(false);

  useEffect(() => {
    async function attemptConnection() {
      const status = await handleAttemptReconnect();
      if (status === "ok") {
        setShowResumeModal(true); // Mostra o modal de confirmação
      }
    }
    attemptConnection();
  }, []);

  async function handleCreateGame() {
    if (!contexto.inputPlayerName)
      return;

    const playerInfos = await createGame(contexto.inputPlayerName); //retorna IPlayer
    if (!playerInfos.gameID || !playerInfos.playerID) {
      return
    }

    contexto.setPlayerName(contexto.inputPlayerName);
    contexto.setGameID(playerInfos.gameID);
    contexto.setPlayerID(playerInfos.playerID);
    // Ao criar ou entrar em um jogo:
    navigate("/game", { state: { skipResume: true } });
  }

  async function handleJoinGame() {
    if (!contexto.JoinInputPlayerName)
      return;
    if (!contexto.inputGameID) {
      return;
    }
    const player: Omit<IPlayer, "playerID"> = { playerName: contexto.JoinInputPlayerName, gameID: contexto.inputGameID };
    const playerInfos = await joinGame(player); //retorna IPlayer
    if (!playerInfos.gameID || !playerInfos.playerID) {
      return
    }
    contexto.setPlayerName(contexto.JoinInputPlayerName);
    contexto.setGameID(playerInfos.gameID);
    contexto.setPlayerID(playerInfos.playerID);
    navigate("/game", { state: { skipResume: true } });

  }




  return (
    <>
      <div className="h-screen bg-black bg-opacity-50 flex justify-center z-50 w-screen sm:items-center">
        <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-8 rounded-2xl border-4 border-neutral-800 dark:border-yellow-400 shadow-xl flex flex-col gap-6 items-center min-w-[350px]">
          <h2 className="font-serif text-2xl font-bold mb-4">♟️ Bem-vindo ao Xadrez Online</h2>

          <div className="w-full">
            <h3 className="font-bold mb-2 text-lg">Criar novo jogo</h3>
            <input
              className="border-2 border-neutral-800 dark:border-yellow-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded px-4 py-2 mb-2 w-full"
              value={contexto.inputPlayerName}
              onChange={e => contexto.setInputPlayerName(e.target.value)}
              placeholder="Seu nome"
            />
            <button
              className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg w-full"
              onClick={handleCreateGame}
            >
              Criar Jogo
            </button>
          </div>

          <div className="w-full border-t border-gray-300 dark:border-yellow-500 pt-4">
            <h3 className="font-bold mb-2 text-lg">Entrar em jogo existente</h3>
            <input
              className="border-2 border-neutral-800 dark:border-yellow-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded px-4 py-2 mb-2 w-full"
              value={contexto.inputGameID}
              onChange={e => contexto.setInputGameID(e.target.value)}
              placeholder="ID do jogo"
            />
            <input
              className="border-2 border-neutral-800 dark:border-yellow-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded px-4 py-2 mb-2 w-full"
              value={contexto.JoinInputPlayerName}
              onChange={e => contexto.setJoinInputPlayerName(e.target.value)}
              placeholder="Seu nome"
            />
            <button
              className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg w-full"
              onClick={handleJoinGame}
            >
              Entrar no Jogo
            </button>
          </div>
        </div>
      </div>
      {showResumeModal &&
        <ResumeGameModal
          onConfirm={() => {
            setShowResumeModal(false);
            navigate("/game");
          }}
          onCancel={() => {
            setShowResumeModal(false);
            localStorage.clear()
          }}
        />
      }
    </>
  )

}
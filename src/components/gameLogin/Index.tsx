// import { useContext } from "react";
// import { useUser } from "./UserContext";
// import type { UserContextType } from "./types/ContextType";

import { useNavigate } from "react-router-dom";
import { createGame, getPlayer, joinGame, playerRegister } from "../../api";
import { useUser } from "../../UserContext";
import { useEffect, useState } from "react";
import { useUserFunctions } from "../../UserFunctionsContext";
import { ResumeGameModal } from "../modal/ResumeGameModal";
import type { IPlayer } from "../../types/types";

export function MenuInicio() {
  const contexto = useUser();
  const { handleAttemptReconnect, saveToCookies, deleteCookie, getCookie } = useUserFunctions();
  const navigate = useNavigate();
  const lsPlayerName = localStorage.getItem('playerName');
  const [playerName, setPlayerName] = useState(lsPlayerName !== null ? lsPlayerName : "");
  const [playerId, setPlayerId] = useState(getCookie('playerId'));
  const [step, setStep] = useState<"name" | "menu">("name");
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Se quiser manter a lógica de retomada, pode adaptar aqui
  useEffect(() => {
    async function attemptConnection() {
      const status = await handleAttemptReconnect();
      if (status === "ok") {
        setShowResumeModal(true);
      }
    }
    if (playerName) {
      setStep('menu');
    }
    attemptConnection();
  }, []);

  // Função para avançar para o menu
  function handleAdvance() {
    if (!contexto.inputPlayerName) return;
    contexto.updatePlayerField("playerName", contexto.inputPlayerName);
    setPlayerName(contexto.inputPlayerName);
    localStorage.setItem('playerName', contexto.inputPlayerName);
    setStep("menu");
  }
  function resetPlayerName(): void {
    localStorage.removeItem('playerName');
  }
  function resetPlayerId() {
    deleteCookie('playerId');
    setPlayerId('');
  }
  // Função para voltar para a etapa de nome
  function handleBackToName() {
    setStep("name");
    resetPlayerName();
    resetPlayerId();
    contexto.setInputPlayerName("");
    contexto.setInputGameID("");
  }

  async function handlePlayerRegister(): Promise<string> {
    if (playerId) {
      try {
        const playerExists = await getPlayer(playerId);
        if (playerExists) {
          return playerExists.playerId;
        }
      } catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Jogador não existe, continua para registrar novo
        } else {
          // Outros erros, trate como quiser
          throw error;
        }
      }
    }
    // Se não existe ou deu 401, registra novo jogador
    const playerInfos = await playerRegister(playerName);
    return playerInfos.playerId;
  }

  async function handleJoinGame(gameId: string, player: IPlayer): Promise<boolean> {
    if (!gameId) return false;
    const playerInfos = await joinGame(player, gameId);
    contexto.setPlayer(playerInfos);
    return true;
  }



  async function handleEnterGame(new_game: boolean) { //tem player register, createGame e joinGame
    try {
      if (!playerName) return;
      // if (!contexto.player?.playerId) return; 
      let gameId: string;
      const playerId = await handlePlayerRegister();
      if (new_game) {
        gameId = await createGame(playerId);
        contexto.gameId = gameId;
      } else {
        gameId = contexto.inputGameID
        contexto.gameId = gameId
      }

      const player: IPlayer = { playerId: playerId };

      const succes = await handleJoinGame(gameId, player);
      // console.log('avaicou')

      // if (!contexto.gameId) return;
      if (succes) {
        saveToCookies("playerId", playerId);
        navigate(`games/${contexto.gameId}`, { state: { skipResume: true } });
      }
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        resetPlayerId();
      }
    }
  }

  return (
    <>
      <div className="h-screen bg-black bg-opacity-50 flex justify-center z-50 w-screen sm:items-center">
        <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-8 rounded-2xl border-4 border-neutral-800 dark:border-yellow-400 shadow-xl flex flex-col gap-4 min-w-[350px]">
          <h2 className="font-serif text-2xl font-bold mb-4">♟️ Bem-vindo ao Xadrez Online</h2>

          {step === "name" && (
            <div className="w-full flex flex-col gap-4 items-center">
              <input
                className="border-2 border-neutral-800 dark:border-yellow-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded px-4 py-2 mb-2 w-full"
                value={contexto.inputPlayerName}
                onChange={e => contexto.setInputPlayerName(e.target.value)}
                placeholder="Digite seu nome"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    handleAdvance();
                  }
                }}
              />
              <button
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg w-full"
                onClick={handleAdvance}
              >
                Avançar
              </button>
            </div>
          )}
          {step === "menu" && (
            <>
              <h3 className="">Jogador: {lsPlayerName}</h3>
              <div className="w-full flex flex-col gap-2">
                <h3 className="font-bold mb-2 text-lg">Criar novo jogo</h3>
                <button
                  className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-lg w-full"
                  onClick={() => handleEnterGame(true)}
                >
                  Criar Jogo
                </button>
              </div>
              <div className="w-full border-t border-gray-300 dark:border-yellow-500 pt-4 flex flex-col gap-2">
                <h3 className="font-bold mb-2 text-lg">Entrar em jogo existente</h3>
                <input
                  className="border-2 border-neutral-800 dark:border-yellow-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded px-4 py-2 mb-2 w-full"
                  value={contexto.inputGameID}
                  onChange={e => contexto.setInputGameID(e.target.value)}
                  placeholder="ID do jogo"
                />
                <button
                  className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded-lg w-full"
                  onClick={() => handleEnterGame(false)}
                >
                  Entrar no Jogo
                </button>
              </div>
              <button
                className="mt-4 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg w-full"
                onClick={handleBackToName}
              >
                Mudar nome
              </button>
            </>
          )}
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
            resetPlayerId();
          }}
        />
      }
    </>
  );
}
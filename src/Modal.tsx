// import { useContext } from "react";
// import { useUser } from "./UserContext";
// import type { UserContextType } from "./types/ContextType";
interface ModalInicioProps {
  joinOrCreateModal: boolean;
  createPlayerName: string;
  setCreatePlayerName: (name: string) => void;
  handleCreateGame: () => void;
  joinGameId: string;
  setJoinGameId: (id: string) => void;
  gameIds: string[];
  joinPlayerName: string;
  setJoinPlayerName: (name: string) => void;
  handleJoinGame: () => void;
}

function ModalInicio({ joinOrCreateModal, createPlayerName, setCreatePlayerName, handleCreateGame, joinGameId, setJoinGameId, gameIds, joinPlayerName, setJoinPlayerName, handleJoinGame }: ModalInicioProps) {
  // const {joinOrCreateModal,  } = useUser();

  return (
    joinOrCreateModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl border-4 border-neutral-800 shadow-xl flex flex-col gap-6 items-center min-w-[350px]">
          <h2 className="font-serif text-xl font-bold mb-2">Bem-vindo ao Xadrez Online</h2>
          <div className="w-full">
            <h3 className="font-bold mb-2">Criar novo jogo</h3>
            <input
              className="border-2 border-neutral-800 rounded px-4 py-2 mb-2 w-full"
              value={createPlayerName}
              onChange={e => setCreatePlayerName(e.target.value)}
              placeholder="Seu nome"
            />
            <button
              className="bg-green-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-900 w-full"
              onClick={handleCreateGame}
            >
              Criar Jogo
            </button>
          </div>
          <div className="w-full border-t border-gray-300 pt-4">
            <h3 className="font-bold mb-2">Entrar em jogo existente</h3>
            <select
              className="border-2 border-neutral-800 rounded px-4 py-2 mb-2 w-full"
              value={joinGameId}
              onChange={e => setJoinGameId(e.target.value)}
            >
              <option value="" disabled>Selecione um jogo</option>
              {gameIds.map((id: string) => (
                <option key={id} value={id}>{id}</option>
              ))}
            </select>
            <input
              className="border-2 border-neutral-800 rounded px-4 py-2 mb-2 w-full"
              value={joinPlayerName}
              onChange={e => setJoinPlayerName(e.target.value)}
              placeholder="Seu nome"
            />
            <button
              className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-900 w-full"
              onClick={handleJoinGame}
            >
              Entrar no Jogo
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ModalInicio;
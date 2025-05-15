// import { useContext } from "react";
// import { useUser } from "./UserContext";
// import type { UserContextType } from "./types/ContextType";
interface ModalInicioProps {
  joinOrCreateModal: boolean;
  inputPlayerName: string;
  setInputPlayerName: (name: string) => void;
  handleCreateGame: () => void;
  inputGameId: string;
  setInputGameId: (id: string) => void;
  JoinInputPlayerName: string;
  setJoinInputPlayerName: (name: string) => void;
  handleJoinGame: () => void;
}

function ModalInicio({ joinOrCreateModal, inputPlayerName, setInputPlayerName, handleCreateGame, inputGameId, setInputGameId, JoinInputPlayerName, setJoinInputPlayerName, handleJoinGame }: ModalInicioProps) {
  // const {joinOrCreateModal,  } = useUser();

return (
  joinOrCreateModal && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50 w-screen md:">
      <div className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-8 rounded-2xl border-4 border-neutral-800 dark:border-yellow-400 shadow-xl flex flex-col gap-6 items-center min-w-[350px]">
        <h2 className="font-serif text-2xl font-bold mb-4">♟️ Bem-vindo ao Xadrez Online</h2>

        <div className="w-full">
          <h3 className="font-bold mb-2 text-lg">Criar novo jogo</h3>
          <input
            className="border-2 border-neutral-800 dark:border-yellow-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded px-4 py-2 mb-2 w-full"
            value={inputPlayerName}
            onChange={e => setInputPlayerName(e.target.value)}
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
            value={inputGameId}
            onChange={e => setInputGameId(e.target.value)}
            placeholder="ID do jogo"
          />
          <input
            className="border-2 border-neutral-800 dark:border-yellow-500 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded px-4 py-2 mb-2 w-full"
            value={JoinInputPlayerName}
            onChange={e => setJoinInputPlayerName(e.target.value)}
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
  )
);

}

export default ModalInicio;
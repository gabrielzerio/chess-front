import { createContext, useState, useContext } from 'react';
//import type {UserContextType} from './types/ContextType';

  type UserContextType = {
      player1: string;
      setPlayer1: (name: string) => void;
      player2: string;
      setPlayer2: (name: string) => void;
      gameId: string | null;
      setGameId: (id: string | null) => void;
      // handleCreateGame: () => Promise<void>;
      joinOrCreateModal: boolean;
      setJoinOrCreateModal: (value: boolean) => void;
  }
  //const [joinOrCreateModal, setJoinOrCreateModal] = useState(true);
  
 const UserContext = createContext<UserContextType | undefined>(undefined);
 function UserProvider({ children }: { children: React.ReactNode }) {

  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [gameId, setGameId] = useState<string | null>(null);
  const [joinOrCreateModal, setJoinOrCreateModal] = useState(true);
  // const handleCreateGame = async () => {
  //   // sua lógica aqui
  // };

  return (
    <UserContext.Provider value={{
      player1, setPlayer1,
      player2, setPlayer2,
      gameId, setGameId,
      joinOrCreateModal, setJoinOrCreateModal
    }}>
      {children}
    </UserContext.Provider>
  );
}
  export { UserProvider, UserContext };

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser precisa estar dentro do UserProvider');
  return context;
};


    
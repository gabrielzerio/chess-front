export type UserContextType = {
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
// src/hooks/useRestoreSession.ts
import { useEffect } from "react";
import { getSessionInfo, clearSessionInfo } from "../services/sessionStorage";

export const useRestoreSession = ({
  onFailure,
}: {
  onSuccess: (gameId: string, playerName: string) => void;
  onFailure: () => void;
}) => {
  useEffect(() => {
    const restore = async () => {
      const { playerName, gameId } = getSessionInfo();

      if (!playerName || !gameId) {
        clearSessionInfo();
        return onFailure();
      }

      // try {
      //   await getGameExists(gameId, playerName);
      //   onSuccess(gameId, playerName);
      // } catch {
      //   clearSessionInfo();
      //   onFailure();
      // }
    };

    restore();
  }, []);
};

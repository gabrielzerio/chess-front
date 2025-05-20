// src/services/sessionStorage.ts
export const getSessionInfo = () => {
  const playerName = localStorage.getItem("playerName");
  const gameId = localStorage.getItem("gameId");
  return { playerName, gameId };
};

export const clearSessionInfo = () => {
  localStorage.removeItem("playerName");
  localStorage.removeItem("gameId");
};

// src/services/api.ts
const API_URL = import.meta.env.VITE_HTTP_API_URL;

export async function createGame() {
  const res = await fetch(`${API_URL}/createGame`, { method: "POST" });
  const data = await res.json();
  console.log(data);
  return data.gameId;
}

export async function deleteGame(gameId: string) {
  const res = await fetch(`${API_URL}/games/${gameId}`, { method: "DELETE" });
  return res.json();
}

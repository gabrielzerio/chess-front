// src/services/api.ts
const API_URL = import.meta.env.VITE_HTTP_API_URL;

export async function createGame() {
  const res = await fetch(`${API_URL}/createGame`, { method: "POST" });
  const data = await res.json();
  return data.gameId;
}

export async function joinGame(gameId: string, playerName: string) {
  const res = await fetch(`${API_URL}/games/${gameId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName }),
  });
  return res.json();
}

export async function deleteGame(gameId: string) {
  const res = await fetch(`${API_URL}/games/${gameId}`, { method: "DELETE" });
  return res.json();
}

export async function getGameExists(gameId: string, playerName: string) {
  const res = await fetch(`${API_URL}/games/validgame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gameId, playerName }),
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Jogo não encontrado (404)");
    throw new Error(`Erro: ${res.status}`);
  }

  return res.json();
}

export async function getPossibleMoves(gameId: string, from: { row: number, col: number }) {
  const res = await fetch(`${API_URL}/games/${gameId}/moves`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from }),
  });

  if (!res.ok) throw new Error("Erro ao buscar movimentos possíveis");
  return res.json();
}

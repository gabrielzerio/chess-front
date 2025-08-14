import axios, { AxiosHeaders } from "axios";
import type { IPlayer } from "../types/types";

const HTTP_API_URL = import.meta.env.VITE_HTTP_API_URL;

const api = axios.create({
  baseURL: HTTP_API_URL
})

type GameId = {
  gameID: string;
}

export const playerRegister = async (playerName: string, playerId: string): Promise<IPlayer> => {
  const { data } = await api.post<IPlayer>(`/playerRegister/?playerName=${playerName}&playerId=${playerId}`);
  return data;
}

export const createGame = async (playerId: string): Promise<string> => {
  const { data } = await api.post<GameId>("/createGame", { playerId: playerId });
  return data.gameID;
}

export const joinGame = async (player: IPlayer, gameID: string): Promise<IPlayer> => {
  const { data } = await api.post<IPlayer>(`/games/join?gameId=${gameID}`,
    { playerId: player.playerId }
  );
  return data;
}

export const verifyGameExists = async (player: IPlayer, roomId: string): Promise<string> => {
  const { data } = await api.post<AxiosHeaders>(`/gameExists/${roomId}`, { playerId: player.playerId, gameID: roomId });
  return data.status;
}
import axios, { AxiosHeaders } from "axios";
import type { IPlayer } from "../types/types";

const HTTP_API_URL = import.meta.env.VITE_HTTP_API_URL;

const api = axios.create({
  baseURL: HTTP_API_URL
})

type GameId = {
  gameId: string;
}

export const getPlayer = async (playerId: string): Promise<IPlayer | null> => {
  const {data} =  await api.get<IPlayer>(`/getPlayer?playerId=${playerId}`);
  if(data){
    return data;
  }
  return null;
}

export const playerRegister = async (playerName: string): Promise<IPlayer> => {
  const { data } = await api.post<IPlayer>(`/playerRegister/?playerName=${playerName}`);
  return data;
}

export const createGame = async (playerId: string): Promise<string> => {
  const { data } = await api.post<GameId>("/games/createGame", { playerId: playerId });
  return data.gameId;
}

export const joinGame = async (player: IPlayer, gameId: string): Promise<IPlayer> => {
  const { data } = await api.post<IPlayer>(`/games/join?gameId=${gameId}`,
    { playerId: player.playerId }
  );
  return data;
}

export const verifyGameExists = async (player: IPlayer, roomId: string): Promise<string> => {
  const { data } = await api.post<AxiosHeaders>(`/gameExists/${roomId}`, { playerId: player.playerId, gameId: roomId });
  return data.status;
}
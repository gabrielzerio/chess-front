import axios, { AxiosHeaders } from "axios";
import type { IPlayer } from "../types/types";

const HTTP_API_URL = import.meta.env.VITE_HTTP_API_URL;

const api = axios.create({
    baseURL: HTTP_API_URL
})

export const createGame = async(playerName:string):Promise<IPlayer> => {
    const {data} = await api.post<IPlayer>("/createGame", {playerName:playerName});
    return data;
}

export const joinGame = async(player:Omit<IPlayer, "playerID">):Promise<IPlayer> => {
    const {data} = await api.post<IPlayer>("/joinGame", {playerName:player.playerName, gameID:player.gameID});
    return data;
}

export const verifyGameExists = async(player:IPlayer):Promise<string> => {
    const {data} = await api.post<AxiosHeaders>("/gameExists", {playerID:player.playerID, gameID:player.gameID});
    return data.status;
}
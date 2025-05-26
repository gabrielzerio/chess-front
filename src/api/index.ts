import axios from "axios";
import type { IPlayer } from "../types/types";

const HTTP_API_URL = import.meta.env.VITE_HTTP_API_URL;

const api = axios.create({
    baseURL: HTTP_API_URL
})

export const criarJogo = async(playerName:string):Promise<IPlayer> => {
    const {data} = await api.post<IPlayer>("/createGame", {playerName:playerName});
    return data;
}
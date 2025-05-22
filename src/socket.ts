import { io } from "socket.io-client";

const WS_API_URL =  import.meta.env.VITE_WS_API_URL;

export const socket = io(WS_API_URL, {
    autoConnect:false,
});

socket.onAny((eventName, ...args) => {
    console.log(eventName, args);
});
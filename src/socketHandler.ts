// hooks/useSocketListeners.ts
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useUser } from "./UserContext";
import type { IHandleGameOver, IHandleJoinedOrReconnected, IPausedForReconection, IPlayer, Login, Piece } from "./types/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function useSocketListeners(socket: Socket, setBoard: React.Dispatch<React.SetStateAction<(Piece | null)[][]>>) {
    const {
        setPlayerColor,
        setTurn,
        gameID,
        setGameID,
        playerID,
        setPlayerID,
        setGameStatus,
        setEndGameModal,
        darkMode
    } = useUser();
    const navigate = useNavigate()

    function getInfosToPlay(): Login {
        const resolvedPlayerID: string | null = playerID || null;
        const resolvedGameID: string | null = gameID || null;

        if (!resolvedPlayerID || !resolvedGameID) {
            // If not in context, try localStorage
            const lsPlayerID = localStorage.getItem('playerID');
            const lsGameID = localStorage.getItem('gameID');

            if (lsPlayerID && lsGameID) {
                return {
                    playerID: lsPlayerID,
                    gameID: lsGameID,
                    success: true
                }
            }
        }
        else {
            localStorage.setItem('playerID', resolvedPlayerID);
            localStorage.setItem('gameID', resolvedGameID);
            return {
                playerID: resolvedPlayerID,
                gameID: resolvedGameID,
                success: true
            }
        }
        return {
            success: false
        }
    }
    useEffect(() => {
        if (!getInfosToPlay().success) {
            navigate('/');
            return;
        }
        const { playerID, gameID } = getInfosToPlay();
        if (!playerID || !gameID) {
            return;
        }
        setPlayerID(playerID);
        setGameID(gameID);
        const playerInfos: IPlayer = { gameID: gameID, playerID: playerID };
        socket.auth = playerInfos;

        function handleJoined({ board, color, turn, status }: IHandleJoinedOrReconnected) {
            setBoard(board);
            setPlayerColor(color);
            setTurn(turn);
            setGameStatus(status);
        }
        function handleConnect() {
            socket.emit('joinGame');
        }
        function handleBoardUpdate({ board, turn, status }: IHandleJoinedOrReconnected) {
            setBoard(board);
            setTurn(turn);
            setGameStatus(status);
        }
        function handleJoinError(message: string) {
            toast(message);
            localStorage.clear();
            navigate('/');
        }
        function handleMoveError(error: string) {
            toast(error);
        }
        if (socket.disconnected) {
            socket.connect();
        }
        function handlePausedForReconnect({ disconnectedPlayerName, timeLeft }: IPausedForReconection) {
            let secondsLeft = Math.ceil(timeLeft / 1000);
            // Cria o toast e guarda o id
            const toastId = toast.loading(
                `O jogador ${disconnectedPlayerName} saiu, tempo restante para finalização: ${secondsLeft} segundos`,
                { theme:darkMode ? "dark" : "light" }
            );

            // Atualiza o toast a cada segundo
            const interval = setInterval(() => {
                secondsLeft--;
                if (secondsLeft > 0) {
                    toast.update(toastId, {
                        render: `O jogador ${disconnectedPlayerName} saiu, tempo restante para finalização: ${secondsLeft} segundos`
                    });
                } else {
                    clearInterval(interval);
                    toast.dismiss(toastId);
                }
            }, 1000);
        }
        function handleGameOver(data: IHandleGameOver) {

            setEndGameModal({ open: true, winner: data });
        }

        function handleMessageReconnected({ playerID: emitPlayerID, playerName: emitPlayerName }: { playerID: string, playerName: string }) {
            if (playerID === emitPlayerID) {
                toast(`você reconectou`);
            } else {
                toast(`${emitPlayerName} se reconectou`);
            }
        }
        socket.on('connect', handleConnect);
        socket.on('joinedGame', handleJoined);
        socket.on('boardUpdate', handleBoardUpdate);
        socket.on('joinError', handleJoinError);
        socket.on('moveError', handleMoveError);
        socket.on('gameStarted', () => {
            toast(`A partida começou!`);
        })
        // socket.on('playersUpdate', handlePlayersUpdate);
        socket.on('gamePausedForReconnect', handlePausedForReconnect);
        socket.on('gameOver', handleGameOver);
        socket.on('playerReconnected', handleMessageReconnected);
        return () => {
            socket.off("joinedGame", handleJoined);
            socket.off("connect", handleConnect);
            socket.off('boardUpdate', handleBoardUpdate);
            socket.off('joinError', handleJoinError);
            socket.off('moveError', handleMoveError);
            socket.off('gameStarted');
            // socket.off('playersUpdate', handlePlayersUpdate);
            socket.off('gamePausedForReconnect', handlePausedForReconnect);
            socket.off('gameOver', handleGameOver);
            socket.off('playerReconnected', handleMessageReconnected);

            socket.disconnect();
        }
    }, [gameID, playerID]);

}

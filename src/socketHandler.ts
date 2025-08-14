// hooks/useSocketListeners.ts
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useUser } from "./UserContext";
import type { IHandleGameOver, IHandleJoinedOrReconnected, IPausedForReconection, Login, moveError } from "./types/types";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserFunctions } from "./UserFunctionsContext";
let pausedToastInterval: NodeJS.Timeout | null = null;
let pausedToastId: string | number | null = null;

export function useSocketListeners(socket: Socket) {
    const {
        setTurn,
        player,
        setGameID,
        setGameStatus,
        setEndGameModal,
        darkMode,
        setBoard,
        updatePlayerField,
    } = useUser();
    const navigate = useNavigate()
    const userFunctions = useUserFunctions();
    const { roomId } = useParams<{ roomId: string }>();

    function getInfosToPlay(): Login {
        const resolvedPlayerID: string | null = player.playerId || null;
        const resolvedGameID: string | null = roomId || null;

        if (!resolvedPlayerID || !resolvedGameID) {
            // If not in context, try localStorage
            const lsPlayerID = userFunctions.getCookie('playerId');

            if (lsPlayerID && roomId) {

                return {
                    playerId: lsPlayerID,
                    gameID: roomId,
                    success: true
                }
            }
        }
        else {
            userFunctions.saveToCookies('playerId', resolvedPlayerID);
            return {
                playerId: resolvedPlayerID,
                gameID: resolvedGameID,
                success: true
            }
        }
        return {
            success: false
        }
    }

    useEffect(() => {
        const infosToPlay = getInfosToPlay();
        if (!infosToPlay.success) {
            navigate('/');
            return;
        }
        const { playerId, gameID } = infosToPlay;
        if (!playerId || !gameID) {
            return;
        }
        updatePlayerField('playerId', playerId);
        setGameID(gameID);
        // const playerInfos: IPlayer = { playerId: playerId };
        console.log(infosToPlay);
        socket.auth = { playerId: infosToPlay.playerId, gameID: infosToPlay.gameID };

        function handleJoined({ board, color, turn, status }: IHandleJoinedOrReconnected) {
            setBoard(board);
            updatePlayerField('color', color);
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
            //LIMPAR OS COOKIES AQUI
            navigate('/');
        }
        function handleMoveError(moveError: moveError) {
            const { message } = moveError
            toast(message);
        }
        if (socket.disconnected) {
            socket.connect();
        }
        function handlePausedForReconnect({ disconnectedPlayerName, timeLeft }: IPausedForReconection) {
            let secondsLeft = Math.ceil(timeLeft / 1000);
            // Cria o toast e guarda o id
            pausedToastId = toast.loading(
                `O jogador ${disconnectedPlayerName} saiu, tempo restante para finalização: ${secondsLeft} segundos`,
                { theme: darkMode ? "dark" : "light" }
            );

            // Atualiza o toast a cada segundo
            pausedToastInterval = setInterval(() => {
                secondsLeft--;
                if (secondsLeft > 0 && pausedToastId) {
                    toast.update(pausedToastId, {
                        render: `O jogador ${disconnectedPlayerName} saiu, tempo restante para finalização: ${secondsLeft} segundos`
                    });
                } else {
                    if (pausedToastInterval) clearInterval(pausedToastInterval);
                    if (pausedToastId) toast.dismiss(pausedToastId);
                    pausedToastInterval = null;
                    pausedToastId = null;
                }
            }, 1000);
        }
        function handleGameOver(data: IHandleGameOver) {
            setEndGameModal({ open: true, winner: data });
        }

        function handleMessageReconnected({ playerId: emitPlayerID, playerName: emitPlayerName }: { playerId: string, playerName: string }) {
            // Limpa o toast e o intervalo se houver reconexão
            if (pausedToastInterval) clearInterval(pausedToastInterval);
            if (pausedToastId) toast.dismiss(pausedToastId);
            pausedToastInterval = null;
            pausedToastId = null;

            if (playerId === emitPlayerID) {
                toast(`você reconectou`);
            } else {
                toast(`${emitPlayerName} se reconectou`);
            }
        }

        function handleJoinMessage(message: { playerName: string }) {
            const { playerName } = message;
            toast(`o jogador ${playerName} conectou!`);
            if (pausedToastInterval) clearInterval(pausedToastInterval);
            if (pausedToastId) toast.dismiss(pausedToastId);
            pausedToastInterval = null;
            pausedToastId = null;
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
        socket.on('roomJoinMessage', handleJoinMessage);
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
            socket.off('roomJoinMessage', handleJoinMessage);
            socket.disconnect();
        }
    }, []);

}

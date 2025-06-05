// hooks/useSocketListeners.ts
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useUser } from "./UserContext";
import type { Board, IPlayer, Piece, PieceColor } from "./types/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Login = {
    playerID?: string;
    gameID?: string;
    success: boolean;
};
type GameStatus = 'waiting' | 'playing' | 'ended' | 'checkmate' | 'paused_reconnect' | 'abandoned';
type IPausedForReconection = {
    disconnectedPlayerName: string;
    gameStatus: GameStatus;
    timeLeft: number;
}
interface IHandleJoinedOrReconnected {
    message?:'string'
    board: Board,
    color: PieceColor,
    turn: PieceColor,
    status: string
}

export function useSocketListeners(socket: Socket, setBoard: React.Dispatch<React.SetStateAction<(Piece | null)[][]>>) {
    const {
        setPlayerColor,
        setTurn,
        setMoveInfo,
        gameID,
        setGameID,
        playerID,
        setPlayerID,
        gameStatus,
        setGameStatus,
        setEndGameModal
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

        function handleJoined({ board, color, turn, status }:IHandleJoinedOrReconnected) {
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
        // function handlePlayersUpdate() {
        //     toast(`O jogador saiu`);
        // }
        function handlePausedForReconnect({ disconnectedPlayerName, gameStatus, timeLeft }: IPausedForReconection) {
            // toast('Status do jogo foi alterado')
            toast(`O jogador ${disconnectedPlayerName} saiu, tempo restante para finalizacao! ${timeLeft / 1000} segundos`);
        }
        function handleGameOver() {
            setEndGameModal({ open: true, winner: "gabriel" });
        }
        
        function handleMessageReconnected({playerID:emitPlayerID, playerName:emitPlayerName}:{playerID:string, playerName:string}){
            if(playerID === emitPlayerID){
                toast(`você reconectou`);
            }else{
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

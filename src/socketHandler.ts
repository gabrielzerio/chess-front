// hooks/useSocketListeners.ts
import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { useUser } from "./UserContext";
import type { Board, IPlayer, Piece, PieceColor } from "./types/types";
import { useNavigate } from "react-router-dom";

type Login = {
    playerID?: string;
    gameID?: string;
    success: boolean;
};

export function useSocketListeners(socket: Socket, setBoard: React.Dispatch<React.SetStateAction<(Piece | null)[][]>>) {
    const {
        setPlayerColor,
        setTurn,
        setMoveInfo,
        gameID,
        playerID,
        gameStatus,
        setGameStatus,
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
        else{
            localStorage.setItem('playerID', resolvedPlayerID);
            localStorage.setItem('gameID', resolvedGameID);
            return {
                playerID: resolvedPlayerID,
                gameID: resolvedGameID,
                success: true
            }
        }
        return {
            success:false
        }
    }
    useEffect(() => {
        if(!getInfosToPlay().success){
            navigate('/');
            return;
        }
        const { playerID, gameID } = getInfosToPlay();
        if (!playerID || !gameID) {
            return;
        }
        const playerInfos: IPlayer = { gameID: gameID, playerID: playerID };
        socket.auth = playerInfos;
        
        function handleJoined({ board, color, turn, status }: { board: Board, color: PieceColor, turn: PieceColor, status: string }) {
            setBoard(board);
            setPlayerColor(color);
            setTurn(turn);
            setGameStatus(status);
        }
        function handleConnect() {
            socket.emit('joinGame');
        }
        function handleBoardUpdate({ board, turn, status }: { board: Board, turn: PieceColor, status: string }) {
            setBoard(board);
            setTurn(turn);
            setGameStatus(status);
        }
        function handleJoinError(message:string){
            //notify(message);
            localStorage.clear();
            navigate('/');
        }
        function handleMoveError(error:string){
            //notify(error);
        }
        if (socket.disconnected) {
            socket.connect();
        }
        socket.on('connect', handleConnect);
        socket.on('joinedGame', handleJoined);
        socket.on('boardUpdate', handleBoardUpdate);
        socket.on('joinError', handleJoinError);
        socket.on('moveError', handleMoveError);
        return () => {
            socket.off("joinedGame", handleJoined);
            socket.off("connect", handleConnect);
            socket.off('boardUpdate', handleBoardUpdate);
            socket.off('joinError', handleJoinError);
            socket.off('moveError', handleMoveError);
            localStorage.clear();
            socket.disconnect();
        }
    }, [gameID, playerID]);

}

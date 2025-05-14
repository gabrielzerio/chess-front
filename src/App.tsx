import React, { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import ModalInicio from "./Modal";

import type { PieceColor, PieceType, Position, Piece} from "./types/types";
import { DeadPieces } from "./DeadPieces";


interface JoinPayload  {
  gameId:string,
  playerName:string
}

const pieceSymbols: Record<PieceType, Record<PieceColor, string>> = {
  rook: { white: "♖", black: "♜" },
    knight: { white: "♘", black: "♞" },
    bishop: { white: "♗", black: "♝" },
    queen: { white: "♕", black: "♛" },
    king: { white: "♔", black: "♚" },
    pawn: { white: "♙", black: "♟" },
};

const HTTP_API_URL = import.meta.env.VITE_HTTP_API_URL;
const WS_API_URL =  import.meta.env.VITE_WS_API_URL;

const initialBoard: (Piece | null)[][] = Array(8)
  .fill(null)
  .map(() => Array(8).fill(null));

async function createGame() {
  const response = await fetch(`${HTTP_API_URL}/createGame`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data.gameId;
}

async function joinGame(gameId: string, playerName: string) {
  const response = await fetch(`${HTTP_API_URL}/games/${gameId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ playerName })
  });
  return await response.json();
}

async function deleteGame(gameId: string) {
  const response = await fetch(`${HTTP_API_URL}/games/${gameId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });
  return await response.json();
}

async function getGameExists(gameId: string, playerName: string): Promise<boolean> { //modifiquei a função para retornar erro se os dados recebidos forem invalidos
  const response = await fetch(`${HTTP_API_URL}/games/validgame`, { //precisa existir o mesmo gameId e playerName para funcionar
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, playerName })
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Jogo não encontrado (404)");
    } else {
      throw new Error(`Erro ao buscar tabuleiro: ${response.status}`);
    }
  }
  return await response.json();
}

export const ChessGame: React.FC = () => {
  // Estados principais
  const [board, setBoard] = useState<(Piece | null)[][]>(initialBoard);
  const [deadPieces, setDeadPieces] = useState<{ white: Piece[]; black: Piece[] }>({ white: [], black: [] });
  const [selected, setSelected] = useState<Position | null>(null);
  const [turn, setTurn] = useState<PieceColor>("white");
  const [moveInfo, setMoveInfo] = useState("Clique em uma peça para mover");
  const [highlights, setHighlights] = useState<Position[]>([]);
  const [captureHighlights, setCaptureHighlights] = useState<Position[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [playerColor, setPlayerColor] = useState<PieceColor | null>(null);
  // Modais
  const [promotionModal, setPromotionModal] = useState<{ open: boolean; position?: Position; color?: PieceColor; squareRect?: DOMRect }>(
    { open: false }
  );
  const [endGameModal, setEndGameModal] = useState<{ open: boolean; winner?: string }>({ open: false });
  const [joinOrCreateModal, setJoinOrCreateModal] = useState(true);
  // Nomes dos jogadores
  const gameId = useRef<string | null>(null); //são refs pois não renderizam, é tipo uma variavel comum msm
  const playerName = useRef<string | null>(null);
  const [effect, setEffect] = useState(false); // usado para forçar o re-render do componente no effect
  
  const [inputPlayerName, setInputPlayerName] = useState<string>(""); // usado no input do nome no modal quando cria uma sala
  const [JoinInputPlayerName, setJoinInputPlayerName] = useState<string>(""); // usado no input do nome quando vai entrar em sala existente no modal
  const [inputGameId, setInputGameId] = useState<string>(""); // usado no input do id do jogo no modal
  
  // refs para posicionamento do modal de promoção
  const boardRefs = useRef<(HTMLDivElement | null)[][]>(
    Array(8).fill(null).map(() => Array(8).fill(null))
  );

  // Previne fechar modais com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ( promotionModal.open || endGameModal.open) {
        if (e.key === "Escape") e.preventDefault();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [ promotionModal.open, endGameModal.open]);

// 3. Conectar ao WebSocket ao entrar na sala
  useEffect(() => {
  const fetchValidGame = async () => {
    const lsPlayerName = localStorage.getItem("playerName");
    const lsGameId = localStorage.getItem("gameId");
      if(!lsPlayerName || !lsGameId){
          localStorage.removeItem("playerName");
          localStorage.removeItem("gameId");
        return;
      } 
    try{
      await getGameExists(lsGameId ,lsPlayerName);
      gameId.current = lsGameId;
      playerName.current = lsPlayerName;
      setJoinOrCreateModal(false);
    } catch(error){
      console.error("Erro ao restaurar sessão:", error);
      localStorage.removeItem("playerName");
      localStorage.removeItem("gameId");
    }
    
  if (!gameId.current || !playerName.current) return;

  const socket = io(WS_API_URL);

    // const payload:JoinPayload = {
    //   gameId:gameId.current, playerName:playerName.current
    // }

  socket.on("connect", () => {
    socket.emit("join", {gameId:gameId.current, playerName:playerName.current} as JoinPayload); //passagem de objeto tipado com as
  });

  socket.on("joined", ({ board, color, turn }) => {
    setBoard(board);
    setPlayerColor(color);
    setTurn(turn);
    setMoveInfo(color ? `Você está jogando de ${color === "white" ? "brancas" : "pretas"}` : "");
  });

  socket.on("boardUpdate", ({ board, turn }) => {
    setBoard(board);
    setTurn(turn);
  });

  socket.on("moveError", ({ message }) => {
    alert(message);
  });

  socket.on("gameOver", ({ winner }) => {
    console.log("recebi gameOver sim", winner);
    setEndGameModal({ open: true, winner: `o Ganhador foi ${winner}` });
  });

  setSocket(socket);

  return () => {
    socket.disconnect();
  };
}
fetchValidGame();
}, [effect]);

// 4. Tocar som de game over
useEffect(() => {
  if (!endGameModal.open) return;
  new Audio("/sounds/gameover.mp3").play();
}, [endGameModal.open]);

  
  // Utilitário: remove destaques
  const removeHighlight = () => {
    setHighlights([]);
    setCaptureHighlights([]);
  };

  // Clique no tabuleiro
  const handleSquareClick = async (row: number, col: number) => {
    
      if (playerColor && turn !== playerColor) {
        setMoveInfo("Aguarde sua vez.");
        return;
      } 
      setMoveInfo(`Clicou em ${String.fromCharCode(65 + col)}${8 - row}`);
    if (selected && (selected.row !== row || selected.col !== col)) {
      if (playerColor && turn === playerColor) {
        const piece = board[selected.row][selected.col];
        // Verifica se é um peão chegando na última linha
        if (
          piece &&
          piece.type === "pawn" &&
          ((piece.color === "white" && row === 0) ||
            (piece.color === "black" && row === 7))
        ) {
          // Abre o modal e espera a escolha
          const promotionType = await showPromotionDialog(piece.color, { row, col });
          sendMove(selected, { row, col }, promotionType);
        } else {
          sendMove(selected, { row, col });
        }
      } 
      setSelected(null);
      removeHighlight();
    } else {
      setSelected({ row, col });
      // NOVO: buscar movimentos possíveis do back-end
      console.log("cor do jgoador atual", playerColor)
      if (board[row][col] && (!playerColor || board[row][col]?.color === playerColor)) {
        const response = await fetch(`${HTTP_API_URL}/games/${gameId.current}/moves`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: { row, col } })
        });
        const data = await response.json();
       
        setHighlights(data.normalMoves);
        setCaptureHighlights(data.captureMoves);

      } else {
        removeHighlight();
        
      }
    }
  };

  // Função para enviar movimento ao servidor (corrigida)
  function sendMove(from: Position, to: Position, promotionType?: PieceType) {
    if (!playerColor) {
      setMoveInfo("Você não está em uma partida ativa.");
      return;
    }
    socket?.emit('move', { gameId:gameId.current, from, to, promotionType, playerName:playerName.current });
  }

  // Modal de promoção
  const showPromotionDialog = (color: PieceColor, position: Position) => {
    const square = boardRefs.current[position.row][position.col];
    const squareRect = square?.getBoundingClientRect();
    setPromotionModal({ open: true, color, position, squareRect });
    return new Promise<PieceType>((resolve) => {
      // handlerPromotion resolve a promise
      const handlerPromotion = (type: PieceType) => {
        setPromotionModal({ open: false });
        resolve(type);
      };
      (window as any).handlePromotion = handlerPromotion;
    });
  };

  // Modal de promoção: handler
  const handlePromotion = (type: PieceType) => {
    setPromotionModal({ open: false });
    if ((window as any).handlePromotion) (window as any).handlePromotion(type);
  };

  // Modal de reinício
  const handleRestart = (op:string | null) => {
    socket?.disconnect(); 
    setEndGameModal({ open: false });
     localStorage.removeItem("gameId");
    localStorage.removeItem("playerName");
    setDeadPieces({ white: [], black: [] });
    setTurn("white");
      if(!gameId.current){ 
        console.log('erro, o ref gameId não existe');
        return;
      }
      if(!op && op!=='leave'){
      deleteGame(gameId.current);
      setJoinOrCreateModal(true);
      }
     else{
      setJoinOrCreateModal(true);
     }
  };

  // Novo: fluxo para criar jogo
  const handleCreateGame = async () => {
    if (!inputPlayerName) return;
    const id = await createGame();
    await joinGame(id, inputPlayerName);
    gameId.current = id;
    playerName.current = inputPlayerName;
    setJoinOrCreateModal(false);
    setMoveInfo(`Aguardando outro jogador entrar... (ID: ${id})`);
    localStorage.setItem("gameId", id);
    localStorage.setItem("playerName", playerName.current)
    setEffect(!effect); // força o re-render
  };

  // Novo: fluxo para entrar em jogo existente
  const handleJoinGame = async () => {
    if (!inputGameId || !JoinInputPlayerName) return;
    
    const result = await joinGame(inputGameId, JoinInputPlayerName);
    if (result.success) { //caso retorne sucesso
      gameId.current = inputGameId; //atribui o valor do state ao ref
      playerName.current = JoinInputPlayerName; //atribui o valor do state ao ref
  
      setJoinOrCreateModal(false); // fecha o modal
      
      // setMoveInfo(`Entrou no jogo ${joinGameId}`);
      localStorage.setItem("gameId", gameId.current);
      localStorage.setItem("playerName", playerName.current);
      setEffect(!effect); // força o re-render
    } else {
      setMoveInfo("Erro ao entrar no jogo.");
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      
      <ModalInicio
        joinOrCreateModal={joinOrCreateModal}
        inputPlayerName = {inputPlayerName}
        setInputPlayerName = {setInputPlayerName}
        handleCreateGame={handleCreateGame}
        handleJoinGame={handleJoinGame}
        inputGameId={inputGameId}
        setInputGameId={setInputGameId}
        JoinInputPlayerName={JoinInputPlayerName}
        setJoinInputPlayerName={setJoinInputPlayerName}
    />
      <div className="grid gap-12 grid-cols-1 md:grid-cols-3 p-8" id="main-grid">
        <DeadPieces 
          deadPieces={deadPieces}
          pieceSymbols={pieceSymbols}
          endGameModal={endGameModal}
        />

        {/* Chess Board & Info */}
        <div className={`chess-container flex flex-col gap-5 w-fit ${endGameModal.open ? "blur-sm" : ""}`}>
          <div className="flex flex-row w-800px items-center bg-yellow-100">
              <div id="turn-info" className=" p-5 text-lg text-center rounded-lg grow">
              {playerColor ? (turn === playerColor ? "Sua vez" : "Aguardando adversário")
              : `Turno: ${turn === "white" ? playerName.current || "Jogador Branco" : playerName.current || "Jogador Preto"}`}
          </div>
             <button 
             onClick={() => handleRestart('leave')}
             className="bg-red-500 cursor-pointer h-10 rounded-lg">SAIR DO JOGO</button>
               
          </div>
          <div>
            <div id="board-wrapper" className="flex items-center">
              {/* Board */}
              <div
                id="board"
                className="grid grid-cols-8 grid-rows-8 border-4 border-neutral-800 relative"
                style={{ width: 800, height: 800 }}
              >
                {board.map((rowArr, row) =>
                  rowArr.map((piece, col) => {
                    const isHighlight = highlights.some(pos => pos.row === row && pos.col === col);
                    const isCapture = captureHighlights.some(pos => pos.row === row && pos.col === col);
                    
                    return (
                      <div key={`${row}-${col}`} id={`${row}-${col}`} ref={el => { boardRefs.current[row][col] = el;}}
                        className={`
                          w-[100px] h-[100px] flex items-center justify-center relative ${(row + col) % 2 === 0 ? "bg-yellow-100" : "bg-yellow-700"} cursor-pointer
                          ${isHighlight ? "!bg-green-500" : ""}
                          ${isCapture ? "!bg-red-500" : ""}`}
                        onClick={() => handleSquareClick(row, col)}
                      >
                        <span className="piece absolute text-4xl select-none pointer-events-none">
                          {piece ? pieceSymbols[piece.type][piece.color] : ""}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              {/* Y Coordinates */}
              <div className="y-coordinates grid grid-rows-8 ml-2 text-lg font-bold text-neutral-800 text-center">
                {[8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                  <div key={n} className="h-[100px] flex items-center justify-center">{n}</div>
                ))}
              </div>
            </div>
            {/* X Coordinates */}
            <div className="x-coordinates grid grid-cols-8 mt-2 text-lg font-bold text-neutral-800 text-center">
              {["A", "B", "C", "D", "E", "F", "G", "H"].map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            
            {/* Info Panel */}
            <div className="info-panel text-center mt-2">
              <p id="move-info" className="text-2xl h-8 mb-2">{moveInfo}</p>
            </div>
          </div>
        </div>

        {/* Modals */}
        {/* Promotion Modal */}
        {promotionModal.open && (
          <div
            className="fixed z-50"
            style={{
              left: promotionModal.squareRect?.left,
              top: promotionModal.color === "white"
                ? (promotionModal.squareRect?.top ?? 0) - 60
                : (promotionModal.squareRect?.bottom ?? 0),
              position: "absolute"
            }}
          >
            <div className="bg-yellow-100 border-2 border-yellow-700 rounded-lg p-6 shadow-lg">
              <h2 className="font-serif text-xl font-bold mb-4">Escolha uma peça para promoção</h2>
              <div className="flex gap-4 justify-center">
                {(["queen", "rook", "bishop", "knight"] as PieceType[]).map((type) => (
                  <button
                    key={type}
                    className="text-3xl w-12 h-12 p-1 cursor-pointer bg-yellow-100 border border-yellow-700 rounded hover:bg-yellow-700 hover:text-yellow-100"
                    onClick={() => handlePromotion(type)}
                  >
                    {pieceSymbols[type][promotionModal.color!]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* End Game Modal */}
        {endGameModal.open && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-gray-100 to-gray-300 p-8 rounded-xl border-4 border-neutral-800 shadow-xl flex flex-col gap-4 items-center">
              <h2 className="font-serif text-2xl font-bold">Fim de Jogo!</h2>
              <p id="winnerMessage">{endGameModal.winner}</p>
               <button
                className="bg-neutral-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 hover:text-neutral-900"
                onClick={() => handleRestart(null)}>
                Encerrar
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChessGame;
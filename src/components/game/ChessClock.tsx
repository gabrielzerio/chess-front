interface ChessClockProps {
    whiteSeconds: number;
    blackSeconds: number;
    active: "white" | "black" | null;
}

function formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}


// Para o timer se o jogo acabou

export function ChessClock({ whiteSeconds, blackSeconds, active }: ChessClockProps) {
    
    return (
        <div className="flex flex-col rounded-xl overflow-hidden shadow-lg min-w-[220px] mt-6 bg-slate-700">
            <div className="flex justify-between px-4 py-2 bg-slate-800 text-white text-base">
                <span>Brancas</span>
                <span className={active === "white" ? "text-red-500" : ""}>●</span>
            </div>
            <div
                className={`w-full h-14 flex justify-center items-center text-3xl font-bold text-white transition-all duration-300 bg-teal-500
          ${active === "white" ? "shadow-inner shadow-red-500" : ""}
          ${whiteSeconds <= 30 && whiteSeconds > 0 ? "text-red-500 animate-pulse" : ""}
        `}
            >
                {formatTime(whiteSeconds)}
            </div>
            <div className="flex justify-between px-4 py-2 bg-slate-800 text-white text-base">
                <span>Pretas</span>
                <span className={active === "black" ? "text-red-500" : ""}>●</span>
            </div>
            <div
                className={`w-full h-14 flex justify-center items-center text-3xl font-bold text-white transition-all duration-300 bg-blue-600
          ${active === "black" ? "shadow-inner shadow-red-500" : ""}
          ${blackSeconds <= 30 && blackSeconds > 0 ? "text-red-500 animate-pulse" : ""}
        `}
            >
                {formatTime(blackSeconds)}
            </div>
        </div>
    );
}
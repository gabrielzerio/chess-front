type ChildProps = {
    gameId: React.RefObject<string | null>
}

export function DivGameId({gameId}:ChildProps){
    return (
        <div className="bg-amber-300 dark:bg-yellow-800 text-center rounded-lg px-4 py-2 font-semibold shadow-md border border-yellow-700 dark:border-yellow-600">
                  ID do jogo: {gameId.current}
        </div>
    )
}
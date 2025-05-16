import type React from "react";

export function BoardContainer ({children}:{children:React.ReactNode}){
   return(
    <div
        id="board"
        className="grid grid-cols-[repeat(8,1fr)] grid-rows-[repeat(8,50px)] border-4 border-neutral-800 dark:border-neutral-200 w-screen h-3/4">
            {children}
    </div>
   );
}
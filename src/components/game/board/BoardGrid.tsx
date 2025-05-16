import type React from "react";

export function BoardContainer ({children}:{children:React.ReactNode}){
   return(
       <>
       <div
       id="board"
       className="
         grid grid-cols-8 grid-rows-8
         w-full max-w-[100vw] aspect-square
         border-4 border-neutral-800 dark:border-neutral-200
         sm:max-w-screen md:max-w-[600px] lg:max-w-[800px]
         "
       >
            {children}
    </div>
    <div className="hidden y-coordinates grid-rows-8 ml-2 text-base font-bold text-neutral-800 dark:text-neutral-200 text-center sm:grid">
      {[8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
        <div key={n} className="flex items-center justify-center h-full">{n}</div>
      ))}
    </div>
     </>
   );
}
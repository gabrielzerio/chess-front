import { createContext, useContext, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { verifyGameExists } from "./api";
import type { IPlayer } from "./types/types";
// import { socket } from "";

interface IUserFunctionsContext {
    handleLeaveAndReset(): void;
    handleAttemptReconnect(): Promise<string | void> ;
}

const UserFunctionsContext = createContext<IUserFunctionsContext | undefined>(undefined);
function FunctionsProvider({ children }: { children: ReactNode }) {
    // const socketHandler = useSocketListeners(socket);

    const navigate = useNavigate();
    const context = useUser();
    
    const handleLeaveAndReset = () => {
        navigate('/'); 
        // socketHandler.
        localStorage.clear(); 
        context.resetSessionStates();
        console.log("Sessão encerrada, navegado para home e localStorage limpo.");
    };

     const handleAttemptReconnect = async ():Promise<string | void>  => {
        const LsPlayerID = localStorage.getItem('playerID');
        const LsGameID = localStorage.getItem('gameID');
        if(LsGameID && LsPlayerID){
            const player:IPlayer = {playerID:LsPlayerID, gameID:LsGameID};

            const data = await verifyGameExists(player);
            console.log(data);
            if(data){
                
                console.log(data);
                return data
            }
        }
        return;
    }

    return (
        <UserFunctionsContext.Provider value={{
            handleLeaveAndReset,
            handleAttemptReconnect
        }}>
            {children}
        </UserFunctionsContext.Provider>
    );
}


export const useUserFunctions = (): IUserFunctionsContext => {
    const context = useContext(UserFunctionsContext);
    if (context === undefined) {
        throw new Error('useUserFunctions deve ser utilizado dentro de um FunctionsProvider. Certifique-se de que seu componente está encapsulado por <FunctionsProvider>.');
    }
    return context;
};

export { FunctionsProvider, UserFunctionsContext };

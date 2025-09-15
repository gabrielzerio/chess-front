import { createContext, useContext, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "./UserContext";
import { verifyGameExists } from "./api";
import type { IPlayer } from "./types/types";
// import { socket } from "";

interface IUserFunctionsContext {
    handleLeaveAndReset(): void;
    handleAttemptReconnect(): Promise<string | void>;
    getCookie: (name: string) => string | null;
    saveToCookies: (key: string, value: string) => void;
    deleteCookie: (name: string) => void;
}


const UserFunctionsContext = createContext<IUserFunctionsContext | undefined>(undefined);
function FunctionsProvider({ children }: { children: ReactNode }) {

    
    // const socketHandler = useSocketListeners(socket);
    const { roomId } = useParams<{ roomId: string }>();

    const navigate = useNavigate();
    const context = useUser();

    const handleLeaveAndReset = () => {
        navigate('/');
        context.resetSessionStates();
    };

    function getCookie(name: string): string | null {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find(row => row.startsWith(name + "="));
        return cookie ? cookie.split("=")[1] : null;
    }

    function deleteCookie(name: string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }

    

    function saveToCookies(key: string, value: string) {
        document.cookie = `${key}=${value}; max-age=7200`
    }
    const handleAttemptReconnect = async (): Promise<string | void> => {
        const LsPlayerID = getCookie('playerId');
        if (roomId && LsPlayerID) {
            const player: IPlayer = { playerId: LsPlayerID };

            const data = await verifyGameExists(player, roomId);
            console.log(data);
            if (data) {

                console.log(data);
                return data
            }
        }
        return;
    }

    return (
        <UserFunctionsContext.Provider value={{
            handleLeaveAndReset,
            handleAttemptReconnect,
            getCookie,
            saveToCookies,
            deleteCookie
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

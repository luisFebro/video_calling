import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from 'socket.io-client'

const url = "ws://localhost:8080";
const ws = socketIOClient(url);

export const RoomContext = createContext<null | any>({
    ws
})

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const enterRoom = ({ roomId }: { roomId: string }) => {
        navigate(`/room/${roomId}`);
    };

    useEffect(() => {
        ws.on("room-created", enterRoom);
    }, [])
    
    return(
        <RoomContext.Provider value={{ ws }}>
            {children}
        </RoomContext.Provider>
    )
}
    


import { createContext } from "react";
import socketIOClient from 'socket.io-client'

const WS = "ws://localhost:8080";

const RoomContext = createContext<null | any>(null)

const ws = socketIOClient(WS)

export const RoomProvider: React.FunctionComponent = ({ children }) => {
    return(
        <RoomContext.Provider value={{ ws }}>
            {children}
        </RoomContext.Provider>
    )
}
    


import { useContext } from "react"
import { RoomProvider } from "../context/RoomContext"

export default function JoinButton() {
    const { ws } = useContext(RoomProvider);

    const joinRoom = () => {
        ws.emit("join-room", "1234")
    }

    return(
        <button onClick={joinRoom} className='bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white'>Start new meeting</button>
    )
}
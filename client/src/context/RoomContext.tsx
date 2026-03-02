import Peer from "peerjs";
import { createContext, useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socketIOClient from 'socket.io-client'
import { v4 as uuidv4 } from "uuid";
import { peerReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const url = "ws://localhost:8080";
const ws = socketIOClient(url);

export const RoomContext = createContext<null | any>({
    ws
})

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const [me, setMe] = useState<Peer>();
    const [stream, setStream] = useState<MediaStream>();
    const[peers, dispatch] = useReducer(peerReducer, {});

    const enterRoom = ({ roomId }: { roomId: string }) => {
        navigate(`/room/${roomId}`);
    };


    const getParticipants = ({ roomId, participants }: { roomId: string, participants: string[] }) => {
        console.log("Participants in the room", roomId, participants);
    }

    const removePeer = (peerId: string) => {
        dispatch(removePeerAction(peerId))
    }

    useEffect(() => {
        const meId = uuidv4();

        const peer = new Peer(meId)
        setMe(peer);

        // Getting streaming for 
        // TODO not working. permission denied by system
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
        });


        ws.on("room-created", enterRoom);
        ws.on("get-users", getParticipants);
        ws.on("user-disconnected", removePeer)
    }, [])


    useEffect(() => {
        if (!me || !stream) return;


        ws.on("user-joined", ({ peerId }: { peerId: string }) => {
            const call = me.call(peerId, stream);

            call.on("stream", (peerStream) => {
                dispatch(addPeerAction(peerId, peerStream));
            })
        })


        me.on("call", (call) => {
            call.answer(stream);

            call.on("stream", (peerStream) => {
                dispatch(addPeerAction(call.peer, peerStream));
            })
        })

    
    }, [me, stream])


    console.log("Peers in the room", peers);
    
    
    return(
        <RoomContext.Provider value={{ ws, me, stream, peers }}>
            {children}
        </RoomContext.Provider>
    )
}
    

// const getMediaStream = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         // Successfully obtained stream, do something with it (e.g., set state)
//         console.log("Media stream obtained:", stream);
//         return stream;
//       } catch (error: any) { // TODO: improve error typing
//         if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
//           // User denied permission or system blocked it
//           console.error("Permission to access camera/microphone was denied.", error);
//           // TODO: Display a user-friendly message explaining how to enable permissions.
//           // For example: "Please enable camera/microphone access in your browser settings or system preferences."
//           alert("Please enable camera and microphone access in your browser settings or system preferences to use this feature.");
//         } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
//           // No media devices found
//           console.error("No camera or microphone found.", error);
//           alert("No camera or microphone devices found. Please ensure one is connected and recognized by your system.");
//         } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
//           // Hardware error, device in use, or OS-level issue
//           console.error("Camera/microphone is already in use or inaccessible.", error);
//           alert("Your camera or microphone might be in use by another application, or there's a hardware issue. Please close other applications that might be using it.");
//         } else {
//           // Other unexpected errors
//           console.error("An unexpected error occurred while accessing media devices:", error);
//           alert("An unexpected error occurred. Please try again or contact support.");
//         }
//         return null; // Return null or throw a re-handled error
//       }
//     };
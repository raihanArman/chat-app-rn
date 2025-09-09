import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Socket, Server as SocketIOServer } from "socket.io";
import { registerUserEvents } from "./userEvents";
import { registerChatEvents } from "./chatEvents";
import Conversation from "../models/Conversation";

dotenv.config();

export function intializeSocket(server: any): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*"
        }
    })

    // auth middleware
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token
        if (!token) {
            return next(new Error("Authentication error: no token provided"))
        }

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
            if (err) {
                return next(new Error("Authentication error: invalid token"))
            }

            console.log(decoded.user)

            let userData = decoded.user
            socket.data = userData
            socket.data.userId = userData.id
            next()
        })
    })

    // when socket connect 
    io.on("connection", async (socket: Socket) => {
        const userId = socket.data.userId
        console.log(`a user connected ${userId} name ${socket.data.name}`)

        // register events
        registerChatEvents(io, socket)
        registerUserEvents(io, socket)

        try {
            const conversations = await Conversation.find({
                participants: userId
            }).select("_id")

            conversations.forEach(conversation => {
                socket.join(conversation._id.toString())
            })
        } catch (error) {
            console.log("Error joining conversation: ", error)
        }

        socket.on('disconnect', () => {
            // user logout
            console.log(`user ${userId} disconnected`)
        })
    })

    return io
}
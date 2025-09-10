import { Server as SocketIOServer, Socket } from "socket.io";
import Conversation from "../models/Conversation";

export function registerChatEvents(io: SocketIOServer, socket: Socket) {
    socket.on("getConversations", async (data) => {
        console.log("getConversations event: ", data)
        try {
            const userId = socket.data.userId
            if (!userId) {
                socket.emit("getConversations", {
                    success: false, msg: "Unauthorized"
                })

                return
            }

            const conversations = await Conversation.find({
                participants: userId
            })
                .sort({ updatedAt: -1 })
                .populate({
                    path: "lastMessage",
                    select: "content senderId attachment createdAt"
                })
                .populate({
                    path: "participants",
                    select: "name avatar email"
                })
                .lean()

            socket.emit("getConversations", {
                success: true,
                data: conversations
            })
        } catch (error: any) {
            console.log("getConversations error: ", error)
            socket.emit("getConversations", {
                success: false, msg: "Error getting conversations"
            })
        }
    })

    socket.on("newConversation", async (data) => {
        console.log("newConversation event: ", data)

        try {
            if (data.type == 'direct') {
                // check if already exists
                const existingConversation = await Conversation.findOne({
                    type: 'direct',
                    participants: {
                        $all: data.participants,
                        $size: 2
                    }
                }).populate({
                    path: "participants",
                    select: "name avatar email"
                })
                    .lean()

                if (existingConversation) {
                    socket.emit("newConversation", {
                        success: true,
                        data: {
                            ...existingConversation,
                            isNew: false,
                        }
                    })

                    return
                }
            }

            // create new conversation
            const conversation = await Conversation.create({
                type: data.type,
                participants: data.participants,
                name: data.name || "",
                avatar: data.avatar,
                createdBy: socket.data.userId,
            })

            // get all connected sockets
            const connectedSockets = Array.from(io.sockets.sockets.values()).filter(
                (s) => data.participants.includes(s.data.userId)
            )

            // join this conversation by all online participants
            connectedSockets.forEach((participantSocket) => {
                participantSocket.join(conversation._id.toString())
            })

            // send conversation data back (populated)
            const populatedConversation = await Conversation.findById(conversation._id)
                .populate({
                    path: "participants",
                    select: "name avatar email"
                })
                .lean()

            if (!populatedConversation) {
                throw new Error("Failed to populate conversation")
            }

            // emit conversation to all participants
            io.to(conversation._id.toString()).emit("newConversation", {
                success: true,
                data: {
                    ...populatedConversation,
                    isNew: true,
                }
            })
        } catch (error) {
            console.log("Error creating conversation", error)
            socket.emit("newConversation", {
                success: false, msg: "Error creating conversation"
            })
        }
    })
}
import { Server as SocketIOServer, Socket } from "socket.io";
import User from "../models/User";
import { generateToken } from "../utils/token";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
    socket.on("testSocket", (data) => {
        socket.emit("testSocket", { msg: "it's working!!!" })
    })

    socket.on("updateProfile", async (data: { name?: string, avatar?: string }) => {
        console.log('updateProfile event: ', data)

        const userId = socket.data.userId
        if (!userId) {
            return socket.emit('updateProfile', {
                success: false, msg: "Unauthorized"
            })
        }

        try {
            const updatedUser = await User
                .findByIdAndUpdate(userId, { name: data.name, avatar: data.avatar },
                    {
                        new: true
                    },
                )

            if (!updatedUser) {
                return socket.emit('updateProfile', {
                    success: false, msg: "User not found"
                })
            }

            const newToken = generateToken(updatedUser)
            socket.emit('updateProfile', {
                success: true, msg: "Profile updated successfully",
                data: { token: newToken }
            })
        } catch (error) {
            console.log('Error updating profile', error)
            socket.emit('updateProfile', {
                success: false, msg: "Error updating profile"
            })
        }
    })
}
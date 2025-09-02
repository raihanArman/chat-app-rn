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

    socket.on("getContacts", async () => {
        try {
            const currentUserId = socket.data.userId
            if (!currentUserId) {
                socket.emit("getContacts", {
                    success: false, msg: "Unauthorized"
                })
                return
            }

            const users = await User.find(
                { _id: { $ne: currentUserId } },
                { password: 0 }
            ).lean()

            const contacts = users.map((user) => (
                {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar || "",
                }
            ))

            socket.emit("getContacts", {
                success: true, msg: "Contacts fetched successfully",
                data: contacts
            })

        } catch (error) {
            console.log('Error getting contacts', error)
            socket.emit('getContacts', {
                success: false, msg: "Error getting contacts"
            })
        }
    })
}
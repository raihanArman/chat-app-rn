import { getSocket } from "./socket"

export const testSocket = (payload: any, off: boolean = false) => {
    const socket = getSocket()
    if (!socket) return

    if (off) {
        // turn off listing to this event
        socket.off("test", payload) // payload is the callback
    } else if (typeof payload == "function") {
        socket.on("testSocket", payload) // payload as callback for this event
    } else {
        socket.emit("testSocket", payload) // sending payload data
    }
}

export const updateProfileSocket = (payload: any, off: boolean = false) => {
    const socket = getSocket()
    if (!socket) return

    if (off) {
        // turn off listing to this event
        socket.off("updateProfile", payload) // payload is the callback
    } else if (typeof payload == "function") {
        socket.on("updateProfile", payload) // payload as callback for this event
    } else {
        socket.emit("updateProfile", payload) // sending payload data
    }
}
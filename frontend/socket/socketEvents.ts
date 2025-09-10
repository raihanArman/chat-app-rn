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

export const getContacts = (payload: any, off: boolean = false) => {
    const socket = getSocket()
    if (!socket) return

    if (off) {
        // turn off listing to this event
        socket.off("getContacts", payload) // payload is the callback
    } else if (typeof payload == "function") {
        socket.on("getContacts", payload) // payload as callback for this event
    } else {
        socket.emit("getContacts", payload) // sending payload data
    }
}

export const newConversation = (payload: any, off: boolean = false) => {
    const socket = getSocket()
    if (!socket) {
        console.log("Socket is not connected")
        return;
    }

    if (off) {
        socket.off("newConversation", payload)
    } else if (typeof payload == "function") {
        socket.on("newConversation", payload)
    } else {
        socket.emit("newConversation", payload)
    }
}

export const getConversations = (payload: any, off: boolean = false) => {
    const socket = getSocket()
    if (!socket) {
        console.log("Socket is not connected")
        return;
    }

    if (off) {
        socket.off("getConversations", payload)
    } else if (typeof payload == "function") {
        socket.on("getConversations", payload)
    } else {
        socket.emit("getConversations", payload)
    }
}
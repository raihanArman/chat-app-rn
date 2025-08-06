import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import { intializeSocket } from "./socket/socket";
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server is running");
});

const PORT = process.env.PORT || 3000
const server = http.createServer(app);

// listen to socket event
intializeSocket(server)

connectDB().then(() => {
    console.log("Database connected");
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.log(`Failed to start server, error database ${error}`);
})

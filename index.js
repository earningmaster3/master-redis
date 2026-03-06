import express from "express";
import dotenv from "dotenv";
import { prisma } from "./src/lib/db.js";
import bodyParser from "body-parser";
import { rateLimiter } from "./src/middleware/rateLimiter.js";
import authRoutes from "./src/routes/authRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(rateLimiter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/users", async (req, res) => {

    const { name, email } = req.body;
    const users = await prisma.user.create({
        data: {
            name,
            email,
        },
    });
    res.json(users);
});

app.use("/auth", authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
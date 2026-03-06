import { Router } from "express";
import { prisma } from "../lib/db.js"
import { createSession, sessionMiddleware, destroySession } from "../middleware/session.js";
const router = Router();

//login

router.post("/login", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "email not found" })
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        //Redis create session and userdata - stays in redis instead of database 

        const token = await createSession(user.id, {
            email: user.email,
            name: user.name
        })

        res.json({
            message: "logged In",
            token,
            user: { id: user.id, email: user.email, name: user.name }
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post("/logout", sessionMiddleware, async (req, res) => {
    if (req.sessionToken) {
        await destroySession(req.sessionToken)
    }
    res.json({ message: "Logged out" });
})

export default router;
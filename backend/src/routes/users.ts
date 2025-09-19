import express, {Router} from 'express';
import users from "./../store/users.js";

const router: Router = express.Router();

router.use(express.json());

router.post("/api/users", async (req, res) => {
    const {email, firstName, lastName} = req.body;
    try {
        const result = await users.addUser({email, firstName, lastName});
        res.json({result});
    } catch (error) {
        console.error("Failed to add user", error);
        res.status(500).send({error: "Failed to add user"});
    }
})

export default router;

import express, {Router} from 'express';
import lists from "./../store/lists.js";
import {requireAuth} from "../auth/middleware.js";

const router: Router = express.Router();

router.use(express.json());
router.use(requireAuth);

router.get("", async (req, res) => {
    const userId = req.identity as string;
    const result = await lists.getLists(userId);
    res.json({lists: result});
});

router.post("", async (req, res) => {
    const {name} = req.body;
    const result = await lists.addList({name: name, ownerId: 1});
    res.json({result});
})

export default router;

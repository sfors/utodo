import express, {Router} from 'express';
import lists from "./../store/lists.js";

const router: Router = express.Router();

router.use(express.json());

router.get("/api/lists", async (req, res) => {
    const result = await lists.getLists(1);
    res.json({lists: result});
});

router.post("/api/lists", async (req, res) => {
    const {name} = req.body;
    const result = await lists.addList({name: name, ownerId: 1});
    res.json({result});
})

export default router;

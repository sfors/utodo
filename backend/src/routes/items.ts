import express, {Router} from 'express';
import items from "./../store/items.js";

const router: Router = express.Router();

router.use(express.json());

router.get("/api/items", async (req, res) => {
    const result = await items.getItems(1);
    res.json({items: result});
});

router.post("/api/items", async (req, res) => {
    const {listId, name} = req.body;
    const result = await items.addItem({listId: listId, name: name});
    res.json({result});
})

export default router;

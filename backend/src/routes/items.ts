import express, {Router} from 'express';
import items from "./../store/items.js";
import {requireAuth} from "../auth/middleware.js";

const router: Router = express.Router();

router.use(express.json());
router.use(requireAuth);

router.get("", async (req, res) => {
    const result = await items.getItems("");
    res.json({items: result});
});

router.post("", async (req, res) => {
    const {listId, name} = req.body;
    const result = await items.addItem({listId: listId, name: name});
    res.json({result});
})

export default router;

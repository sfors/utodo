import express, {Router} from 'express';
import lists from "./../store/lists.js";
import {requireAuth} from "../auth/middleware.js";
import items from "../store/items.js";

const router: Router = express.Router();

router.use(express.json());
router.use(requireAuth);

router.get("", async (req, res) => {
  const userId = req.identity as string;
  const result = await lists.getLists(userId);
  res.json(result);
});

router.post("", async (req, res) => {
  const userId = req.identity as string;
  const {name} = req.body;
  const result = await lists.addList({name: name, ownerId: userId});
  res.json(result);
})

router.get("/:listId/items", async (req, res) => {
  const listId = req.params.listId;
  const result = await items.getItems(listId);
  res.json(result);
});

router.post("/:listId/items", async (req, res) => {
  const listId = req.params.listId;
  const {name, index, id} = req.body;
  const result = await items.addItem({listId, name, index, id});
  res.json(result);
})

export default router;

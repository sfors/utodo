import express, {Router} from "express";
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
  const {id, name} = req.body;
  const result = await lists.addList({id, name: name, ownerId: userId});
  res.json(result);
});

router.get("/:listId", async (req, res) => {
  const userId = req.identity as string;
  const listId = req.params.listId;
  const result = await lists.getList(listId);
  if (!result) {
    res.status(404).json({error: "List not found"});
    return;
  } else {
    res.json(result);
  }
});

router.get("/:listId/items", async (req, res) => {
  const listId = req.params.listId;
  const result = await items.getItems(listId);
  res.json(result);
});

router.post("/:listId/join", async (req, res) => {
  const userId = req.identity as string;
  const listId = req.params.listId;
  const ownerId = await lists.getOwnerId(listId);
  if (ownerId === null) {
    return res.status(404).json({error: "List not found"});
  } else if (userId === ownerId) {
    return res.json({success: true});
  } else {
    const result = await lists.joinList(listId, userId);
    return res.json({success: result});
  }
});

router.get("/:listId/items/:itemId", async (req, res) => {
  const listId = req.params.listId;
  const itemId = req.params.itemId;
  const result = await items.getItem(listId, itemId);
  res.json(result);
});

export default router;

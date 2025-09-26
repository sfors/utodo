import express, {Router} from "express";
import {requireAuth} from "../auth/middleware.js";
import type {UpdateItem, AddItem, Change} from "../model.js";
import items from "../store/items.js";

const router: Router = express.Router();

router.use(express.json());
router.use(requireAuth);

async function handleUpdateItem(userId: string, change: UpdateItem) {
  if (["index", "parentId", "typeId", "description", "name", "done"].includes(change.key)) {
    //TODO: check access with userId and listId
    return items.updateItem(change);
  } else {
    throw new Error("Invalid key");
  }
}

async function handleAddItem(userId: string, {listId, name, index, itemId}: AddItem) {
  //TODO: check access with userId and listId
  return items.addItem({listId, name, index, id: itemId});
}

async function handleChange(userId: string, change: Change) {
  if (change.type === "updateItem") {
    return handleUpdateItem(userId, change as UpdateItem);
  } else if (change.type === "addItem") {
    return handleAddItem(userId, change as AddItem);
  } else {
    throw new Error("No change type");
  }
}

router.post("", async (req, res) => {
  const userId = req.identity as string;
  const change: Change = req.body;

  const result = await handleChange(userId, change);
  res.json(result);
});

export default router;

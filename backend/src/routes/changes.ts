import express, {Router} from "express";
import {requireAuth} from "../auth/middleware.js";
import type {UpdateItem, AddItem, Change, UpdateList} from "../model.js";
import items from "../store/items.js";
import lists from "../store/lists.js";
import {notifySubscribers} from "../websocket/webSocketHandler.js";

const router: Router = express.Router();

router.use(express.json());
router.use(requireAuth);

async function handleUpdateItem(userId: string, change: UpdateItem) {
  if (["index", "parentId", "typeId", "description", "name", "done"].includes(change.key)) {
    //TODO: check access with userId and listId
    const result = await items.updateItem(change);
    notifySubscribers(`list-${change.listId}`, {
      type: "itemUpdated",
      listId: change.listId,
      itemId: change.itemId
    });
    return result;
  } else {
    throw new Error("Invalid key");
  }
}

async function handleAddItem(userId: string, {listId, name, index, itemId, parentId}: AddItem) {
  //TODO: check access with userId and listId
  const result = await items.addItem({listId, name, index, id: itemId, parentId});
  notifySubscribers(`list-${listId}`, {
    type: "itemAdded",
    listId: listId,
    itemId: itemId ? itemId : null
  });
  return result;
}

async function handleUpdateList(userId: string, change: UpdateList) {
  if (["name", "frozen"].includes(change.key)) {
    //TODO: check access with userId and listId
    const result = await lists.updateList(change);
    notifySubscribers(`list-${change.listId}`, {
      type: "listUpdated",
      listId: change.listId,
    });
    return result;
  } else {
    throw new Error("Invalid key");
  }
}

async function handleChange(userId: string, change: Change) {
  if (change.type === "updateItem") {
    return handleUpdateItem(userId, change as UpdateItem);
  } else if (change.type === "addItem") {
    return handleAddItem(userId, change as AddItem);
  } else if (change.type === "updateList") {
    return handleUpdateList(userId, change as UpdateList);
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

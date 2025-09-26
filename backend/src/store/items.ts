import {v7 as uuidv7} from "uuid";
import sql from "./db.js";
import type {Row} from "postgres";
import type {Item, ItemKey, UpdateItem} from "../model.js";

function mapItem(row: Row): Item {
  return {
    id: row.id,
    index: row.index,
    parentId: row.parent_id,
    typeId: row.type_id,
    description: row.description,
    name: row.name,
    done: row.done,
    customFields: row.custom_fields
  }
}

async function getItems(listId: string) {
  const result = await sql`
      select *
      from items
      where list_id = ${listId}
      order by index
  `;

  return result.map(item => mapItem(item));
}

async function addItem(item: {name: string, listId: string, index: number, id: string | undefined}) {
  const {name, listId, index} = item;
  const itemToInsert = {
    id: item.id ? item.id : uuidv7(),
    name,
    list_id: listId,
    index
  };
  const result = await sql`
      insert into items ${sql(itemToInsert)}
          returning *
  `;

  if (result.length > 0 && result[0]) {
    return mapItem(result[0]);
  } else {
    throw new Error("Could not insert list");
  }
}

async function updateItem(update: UpdateItem) {
  const set = update.key === "parentId" ?
    {parent_id: update.value} : {[update.key]: update.value};
  const result = await sql`
      update items 
      set ${sql(set)}
      where id = ${update.itemId} and list_id = ${update.listId}
      returning *
  `;

  if (result.length > 0 && result[0]) {
    return mapItem(result[0]);
  } else {
    throw new Error("Could not update item");
  }
}

export default {
  getItems,
  addItem,
  updateItem
}
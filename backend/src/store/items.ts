import {v7 as uuidv7} from "uuid";
import sql from "./db.js";
import type {Row} from "postgres";

export interface Item {
  id: string;
  index: number;
  parentId: string | null;
  typeId: string | null;
  description: string | null;
  name: string | null;
  done: boolean;
  customFields: any;
}

function mapItem(row: Row) {
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
  `;

  return result.map(item => mapItem(item));
}

async function addItem({name, listId}: { name: string, listId: string }) {
  const itemToInsert = {id: uuidv7(), name, list_id: listId, index: 0};
  return await sql`
      insert into items ${sql(itemToInsert)}
          returning *
  `;
}

export default {
  getItems,
  addItem
}
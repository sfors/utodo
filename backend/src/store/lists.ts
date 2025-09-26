import {v7 as uuidv7} from "uuid";
import sql from "./db.js";
import type {Row} from "postgres";
import type {List} from "../model.js";

function mapList(row: Row): List {
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    name: row.name,
    frozen: row.frozen
  }
}

async function getLists(ownerId: string) {
  const result = await sql`
      select lists.*, concat(users.first_name, ' ', users.last_name) as owner_name
      from lists
          join users on lists.owner_id = users.id
      where lists.owner_id = ${ownerId}
  `;

  return result.map(mapList);
}

async function addList({name, ownerId}: { name: string, ownerId: string }) {
  const listToInsert = {id: uuidv7(), name, owner_id: ownerId};
  const result = await sql`
      insert into lists ${sql(listToInsert)}
          returning *
  `;

  if (result.length > 0 && result[0]) {
    return mapList(result[0]);
  } else {
    throw new Error("Could not insert list");
  }
}

export default {
  getLists,
  addList
}
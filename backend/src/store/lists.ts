import {v7 as uuidv7} from "uuid";
import sql from "./db.js";
import type {Row} from "postgres";
import type {List, UpdateList} from "../model.js";

function mapList(row: Row): List {
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerName: row.owner_name,
    name: row.name,
    frozen: row.frozen
  };
}

async function getOwnerId(listId: string) {
  const result = await sql`select lists.owner_id
                           from lists
                           where lists.id = ${listId}`;

  if (result.length > 0 && result[0]) {
    return result[0].owner_id as string;
  } else {
    return null;
  }
}

async function getList(listId: string) {
  const result = await sql`
      select lists.*, concat(users.first_name, ' ', users.last_name) as owner_name
      from lists
               join users on lists.owner_id = users.id
      where lists.id = ${listId}
  `;

  return result.map(mapList).find(() => true) || null;
}

async function getLists(userId: string) {
  const result = await sql`
      select lists.*, concat(users.first_name, ' ', users.last_name) as owner_name
      from lists
               join users on lists.owner_id = users.id
               left outer join members on lists.id = members.list_id
      where (lists.owner_id = ${userId} or members.user_id = ${userId})
      order by lists.id DESC
  `;

  return result.map(mapList);
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

async function addList({id, name, ownerId}: {id?: string, name?: string, ownerId: string}) {
  const listToInsert = {
    id: id ? id : uuidv7(),
    name: name ? name : currentDate(),
    owner_id: ownerId
  };
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

async function updateList(update: UpdateList) {
  const result = await sql`
      update lists
      set ${sql({[update.key]: update.value})}
      where id = ${update.listId}
      returning *
  `;

  if (result.length > 0 && result[0]) {
    return mapList(result[0]);
  } else {
    throw new Error("Could not update item");
  }
}

async function isMember(listId: string, userId: string) {
  const result = await sql`select *
                           from members
                           where list_id = ${listId}
                             and user_id = ${userId}`;
  return (result.length > 0 && result[0]) as boolean;
}

async function joinList(listId: string, userId: string) {
  const isMemberAlready = await isMember(listId, userId);

  if (isMemberAlready) {
    return true;
  }

  const membership = {list_id: listId, user_id: userId};
  const result = await sql`insert into members ${sql(membership)}`;
  if (result.length > 0 && result[0]) {
    return true;
  } else {
    throw new Error("Could not insert membership");
  }
}


export default {
  getOwnerId,
  getList,
  getLists,
  addList,
  updateList,
  joinList
};
import {v7 as uuidv7} from "uuid";
import sql from "./db.js";

async function getLists(ownerId: string) {
    return await sql`
        select *
        from lists
    `;
}

async function addList({name, ownerId}: { name: string, ownerId: string }) {
    const listToInsert = {id: uuidv7(), name, owner_id: ownerId};
    return await sql`
        insert into lists ${sql(listToInsert)}
        returning *
    `;
}

export default {
    getLists,
    addList
}
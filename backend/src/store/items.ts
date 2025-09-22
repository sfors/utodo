import {v7 as uuidv7} from "uuid";
import sql from "./db.js";

async function getItems(list_id: string) {
    return await sql`
        select *
        from items
    `;
}

async function addItem({name, listId}: { name: string, listId: number }) {
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
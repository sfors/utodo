import sql from "./db.js";

async function getLists(ownerId: number) {
    return await sql`
        select *
        from lists
    `;
}

async function addList({name, ownerId}: { name: string, ownerId: number }) {
    const listToInsert = {name, owner_id: ownerId};
    return await sql`
        insert into lists ${sql(listToInsert)}
        returning *
    `;
}

export default {
    getLists,
    addList
}
import sql from "./db.js";

async function getUser(userId: number) {
    return await sql`
        select *
        from users
        where id = ${userId}
    `;
}

async function getUsers() {
    return await sql`
        select *
        from users
    `;
}

async function addUser({email, firstName, lastName}: { email: string, firstName: string, lastName: string }) {
    const userToInsert = {email, first_name: firstName, last_name: lastName};
    return await sql`
        insert into users ${sql(userToInsert)}
            returning *
    `;
}

export default {
    getUser,
    getUsers,
    addUser
}
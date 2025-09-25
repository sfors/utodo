import type {Row} from "postgres";
import {v7 as uuidv7} from "uuid";
import sql from "./db.js";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

function mapUser(row: Row): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name
  }
}

async function getUserById(userId: string): Promise<User | null> {
  const result = await sql`
      select *
      from users
      where id = ${userId}
  `;

  if (result.length > 0 && result[0]) {
    return mapUser(result[0]);
  } else {
    return null;
  }
}



async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
      select *
      from users
      where email = ${email}
  `;

  if (result.length > 0 && result[0]) {
    return mapUser(result[0]);
  } else {
    return null;
  }
}

async function getUsers() {
  return await sql`
      select *
      from users
  `;
}

async function addUser({email, firstName, lastName}: { email: string, firstName: string, lastName: string }) {
  const userToInsert = {id: uuidv7(), email, first_name: firstName, last_name: lastName};
  const result = await sql`
      insert into users ${sql(userToInsert)}
          returning *
  `;
  if (result.length > 0 && result[0]) {
    return mapUser(result[0]);
  } else {
    throw new Error("Could not insert user");
  }
}

async function updateUser(user: { id: string, firstName: string, lastName: string }) {
  const userToUpdate = {id: user.id, first_name: user.firstName, last_name: user.lastName};
  const result = await sql`
      update users
      set ${sql(userToUpdate, 'first_name', 'last_name')}
      where id = ${userToUpdate.id}
      returning *
  `;
  if (result.length > 0 && result[0]) {
    return mapUser(result[0]);
  } else {
    throw new Error("Could not update user");
  }
}

export default {
  addUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser
}
import type {Row} from "postgres";
import {v7 as uuidv7} from "uuid";
import sql from "./db.js";
import type {User} from "../model.js";


function mapUser(row: Row): User {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name
  };
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

async function addUser({email, firstName, lastName}: {email: string, firstName: string, lastName: string}) {
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

async function updateUser(user: {id: string, firstName: string, lastName: string}) {
  const userToUpdate = {id: user.id, first_name: user.firstName, last_name: user.lastName};
  const result = await sql`
      update users
      set ${sql(userToUpdate, "first_name", "last_name")}
      where id = ${userToUpdate.id}
      returning *
  `;
  if (result.length > 0 && result[0]) {
    return mapUser(result[0]);
  } else {
    throw new Error("Could not update user");
  }
}

async function addCode({email, code}: {email: string, code: string}) {
  const result = await sql`
      insert into verification_codes ${sql({email, code, expires_at: new Date(Date.now() + (1000 * 60 * 60 * 10))})}
          returning *
  `;
  if (result.length > 0 && result[0]) {
    return;
  } else {
    throw new Error("Could not insert verification code");
  }
}

async function checkCode({email, code}: {email: string, code: string}) {
  const result = await sql`
      select *
      from verification_codes
      where email = ${email}
        and code = ${code}
        and expires_at > now()
  `;

  return !!(result.length > 0 && result[0]);
}


export default {
  addUser,
  getUserByEmail,
  getUserById,
  getUsers,
  updateUser,
  addCode,
  checkCode
};
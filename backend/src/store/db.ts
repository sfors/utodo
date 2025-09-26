import postgres from "postgres";

const sql = postgres({ssl: "require"}); // will use psql environment variables

export default sql;
import postgres from "postgres";

const sql = postgres(process.env.LUCID_DATABASE_URL as string, {
  ssl: {
    rejectUnauthorized: false,
  },
});

export default sql;

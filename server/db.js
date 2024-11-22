const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "mk123postgres",
  host: "127.0.0.1",
  port: 5432,
  database: "todo_app",
});
module.exports = pool;

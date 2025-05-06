require('dotenv').config()

const configLocal = {
  db: {
    host: "localhost",
    /* user: "aa",               // Linux
    password: "a1234567890",
    database: "osteuslivros" */
    user: "root",               // windows
    password: "neveira",
    database: "bd-2024-09-12",
    // database: "osteuslivros",
    //connectionLimit : 10,
  },
  listPerPage: 10,
};

const configRailway = {
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  ssl: { rejectUnauthorized: false } // Obrigatorio em Railway
};

const configRender = {
  host: process.env.DB_POSGRESQL_HOST,
  user: process.env.DB_POSGRESQL_USER,
  password: process.env.DB_POSGRESQL_PASSWORD,
  database: process.env.DB_POSGRESQL_NAME,
  port: process.env.DB_POSGRESQL_PORT,
  ssl: { rejectUnauthorized: false }
};

module.exports = {
  configLocal,
  configRailway,
  configRender
}
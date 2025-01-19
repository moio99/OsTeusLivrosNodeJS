const config = {
    db: {
      host: "localhost",
      /* user: "aa",               // Linux
      password: "a1234567890",
      database: "osteuslivros" */
      user: "root",               // windows
      password: "neveira",
      //database: "bd-2024-09-12",
      database: "osteuslivros",
      //connectionLimit : 10,
    },
    listPerPage: 10,
  };
  
  module.exports = config;
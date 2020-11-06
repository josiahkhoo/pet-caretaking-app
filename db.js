const Pool = require("pg").Pool;
require('dotenv').config();

// To be modified
const pool = new Pool({
    connectionString: process.env.DB_CONN_URI,
    ssl: { 
        rejectUnauthorized: false 
    }
})

module.exports = pool;
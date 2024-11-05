// config/db.js
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,      // Debe estar definido en tu .env
    port: process.env.DB_PORT || 5432, // Puerto por defecto de PostgreSQL
    user: process.env.DB_USER,      // Debe estar definido en tu .env
    password: process.env.DB_PASSWORD, // Debe estar definido en tu .env
    database: process.env.DB_NAME,   // Debe estar definido en tu .env
});

module.exports = pool;

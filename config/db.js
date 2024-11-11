const { Pool } = require('pg'); // Asegúrate de que 'pg' está instalado

// Configura la conexión a la base de datos
const pool = new Pool({
    user: 'your_user', // tu usuario de base de datos
    host: 'localhost', // o el host de tu base de datos
    database: 'your_database', // nombre de la base de datos
    password: 'your_password', // tu contraseña
    port: 5432, // puerto por defecto para PostgreSQL
});

module.exports = { pool };

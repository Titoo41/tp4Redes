const bcrypt = require('bcrypt');
const pool = require('../config/db'); // Asegúrate de que esto esté apuntando a tu configuración de base de datos
const { generateToken } = require('../config/jwt');

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *`;
    const values = [username, hashedPassword];
    try {
        const result = await pool.query(query, values);
        const token = generateToken(result.rows[0].id);
        res.json({ message: 'Usuario registrado', token });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = $1`;
    try {
        const result = await pool.query(query, [username]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const token = generateToken(user.id);
                return res.json({ message: 'Login exitoso', token });
            }
        }
        res.status(401).json({ error: 'Credenciales inválidas' });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = { registerUser, loginUser };

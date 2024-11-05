const jwt = require('jsonwebtoken');

const secret = 'camion'; // Usa tu clave secreta aquí

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
};

const verifyToken = (token) => {
    return jwt.verify(token, secret);
};

module.exports = { generateToken, verifyToken };

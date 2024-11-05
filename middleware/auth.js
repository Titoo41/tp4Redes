// middleware/auth.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send({ error: 'Token requerido' });
    }

    jwt.verify(token, 'camion', (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: 'Token inválido' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;

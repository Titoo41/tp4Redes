// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').startsWith('Bearer ') 
        ? req.header('Authorization').split(' ')[1]
        : null;  // Verifica si el token tiene el prefijo 'Bearer'

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado, se requiere autenticación' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Token no válido' });
    }
};

module.exports = verifyToken;

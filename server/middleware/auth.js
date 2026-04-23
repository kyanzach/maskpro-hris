const jwt = require('jsonwebtoken');

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Get token from header
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
            }

            const token = authHeader.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'maskpro_hris_secret_key');
            req.user = decoded; // Add user payload to request

            // Check roles if allowedRoles array is not empty
            if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.access_level)) {
                return res.status(403).json({ success: false, message: 'Forbidden: Insufficient privileges' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            res.status(401).json({ success: false, message: 'Token is not valid or has expired' });
        }
    };
};

module.exports = { authorize };

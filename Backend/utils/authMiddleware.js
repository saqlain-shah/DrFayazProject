export const authenticate = (req, res, next) => {
    if (
        req.path === '/api/auth/login' ||
        req.path === '/api/auth/register' ||
        req.path === '/api/userauth/login' ||
        req.path === '/api/userauth/register' ||
        req.path === '/api/schedule' ||
        req.path === '/api/schedule/past'
        
    ) {
        return next();
    }
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

export const authenticate = (req, res, next) => {
    // Check if user is trying to access login, register, or schedule routes
    if (
        req.path === '/api/auth/login' ||
        req.path === '/api/auth/register' ||
        req.path === '/api/userauth/login' ||
        req.path === '/api/userauth/register' ||
        req.path === '/api/schedule' ||
        req.path === '/api/schedule/past'
        
    ) {
        return next(); // Bypass authentication middleware for these routes
    }

    // Check if user is authenticated, for example, by checking if a token is present in the request header
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Perform additional authentication checks if necessary

    next(); // Proceed to the next middleware or route handler
};

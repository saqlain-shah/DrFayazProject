export const authenticate = (req, res, next) => {
    // Check if user is trying to access login or register routes
    if (
        req.path === '/api/auth/login' ||
        req.path === '/api/auth/register' ||
        req.path === '/api/userauth/login' || // Corrected path
        req.path === '/api/userauth/register' // Corrected path
    ) {
        return next(); // Bypass authentication middleware for login and register routes
    }

    // Check if user is authenticated, for example, by checking if a token is present in the request header
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Perform additional authentication checks if necessary

    next(); // Proceed to the next middleware or route handler
};

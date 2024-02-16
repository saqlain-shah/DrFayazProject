// authController.js (controllers/authController.js)
import passport from '../config/passport.js';

export const googleAuth = passport.authenticate('google', { scope: ['email', 'profile'] });

export const googleAuthCallback = passport.authenticate('google', { failureRedirect: '/login' });

export const logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

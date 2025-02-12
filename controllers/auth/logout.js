// controllers/auth/logout.js
const { StatusCodes } = require("http-status-codes");


// Clear JWT token from the client-side and optionally invalidate it on the server-side
const logout = (req, res) => {
    // Clear the JWT token from the client-side
    res.clearCookie('jwtToken');

    // Optionally, you can also invalidate the token on the server-side
    // by adding the token to a blacklist or revoking it from the database.

    // Send a response indicating successful logout
    res.status(StatusCodes.OK).json({ message: 'Logout successful' });
};

module.exports = logout;
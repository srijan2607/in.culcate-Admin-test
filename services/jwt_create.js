const jwt = require("jsonwebtoken");

const createJWT = (user) => {
  // Create token with consistent payload structure
  return jwt.sign(
    {
      userId: user.id, // Use consistent naming
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isContent_creator: user.isContent_creator,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME || "1d",
    }
  );
};

module.exports = { createJWT };

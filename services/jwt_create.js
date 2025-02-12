const jwt = require("jsonwebtoken");

const createJWT = (userId, name) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_LIFETIME) {
    throw new Error("JWT_SECRET or JWT_LIFETIME is not set.");
  }

  // Convert BigInt to string if necessary
  const payload = {
    userId: typeof userId === "bigint" ? userId.toString() : userId,
    name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

module.exports = { createJWT };

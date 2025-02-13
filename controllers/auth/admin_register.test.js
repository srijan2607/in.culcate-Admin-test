const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const { createJWT } = require("../../services/jwt_create");
const { hashPassword } = require("../../services/password_auth");

const register_admin = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    throw new BadRequestError("User already exists");
  }
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    },
  });

  const token = createJWT(newUser.id, newUser.name);

  res.status(StatusCodes.CREATED).json({
    message: "Admin registered successfully",
    token,
    newUser,
  });
};

module.exports = register_admin;

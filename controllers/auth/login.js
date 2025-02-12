const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const { createJWT } = require("../../services/jwt_create");
const { comparePassword } = require("../../services/password_auth");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email and password");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isAdmin: true,
        isContentCreator: true,
        isValidator: true,
        isConsumer: true,
      },
    });

    if (!user) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid credentials");
    }

    const token = createJWT(user);

    // Don't send password in response
    const { password: _, ...userWithoutPassword } = user;

    res.status(StatusCodes.OK).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    throw new BadRequestError(error.message || "Login failed");
  }
};

module.exports = loginUser;

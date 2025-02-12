// controllers/users/validator.js
// CRUD on Validator only by Admin

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const { hashPassword } = require("../../services/password_auth");

// Get all validators

const get_all_validator = async (req, res) => {
  const page = Number(req.params.page) || 1;
  let limit = Number(req.query.limit) || 10;
  if (page <= 0) {
    limit = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const contentCreators = await prisma.user.findMany({
    where: { isValidator: true },
  });
  res.status(StatusCodes.OK).json(contentCreators);
};

// Get a validator by id

const get_validator_by_id = async (req, res) => {
  const { id } = req.params;
  const validator = await prisma.user.findUnique({
    where: { id },
  });
  if (!validator) {
    throw new BadRequestError(`No validator with id ${id}`);
  }
  res.status(StatusCodes.OK).json(validator);
};

// Create a validator

const create_validator = async (req, res) => {
  if (req.user && req.user.isAdmin) {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const validator = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isValidator: true,
      },
    });
    res.status(StatusCodes.CREATED).json(validator);
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin"
    );
  }
};

// Update a validator

const update_validator = async (req, res) => {
  if (req.user && req.user.isAdmin) {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const validator = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(StatusCodes.OK).json(validator);
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin"
    );
  }
};

// Delete a validator

const delete_validator = async (req, res) => {
  if (req.user && req.user.isAdmin) {
    const { id } = req.params;
    const validator = await prisma.user.delete({
      where: { id },
    });
    res.status(StatusCodes.OK).json(validator);
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin"
    );
  }
};

module.exports = {
  get_all_validator,
  get_validator_by_id,
  create_validator,
  update_validator,
  delete_validator,
};

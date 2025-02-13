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
    where: { is: Number(id), isValidator: true },
  });
  res.status(StatusCodes.OK).json(contentCreators);
};

// Get a validator by id

const get_validator_by_id = async (req, res) => {
  const { id } = req.params;
  const validator = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  if (!validator) {
    throw new BadRequestError(`No validator with id ${id}`);
  }
  res.status(StatusCodes.OK).json(validator);
};

// Create a validator

const create_validator = async (req, res) => {
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
};

// Update a validator

const update_validator = async (req, res) => {
  const { id } = req.params;
  const { email, password, name } = req.body;
  let update_data = { email, name };

  if (password) {
    const hashedPassword = await hashPassword(password);
    update_data.password = hashedPassword;
  }

  const updated_validator = await prisma.user.update({
    where: { id: Number(id), isValidator : true },
    data: update_data,
  });

  if (!updated_validator) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Admin not found" });
  }

  res.status(StatusCodes.OK).json(updated_validator);
};

// Delete a validator

const delete_validator = async (req, res) => {
  const { id } = req.params;
  const validator = await prisma.user.delete({
    where: { id: Number(id) },
  });
  res.status(StatusCodes.OK).json(validator);
};

module.exports = {
  get_all_validator,
  get_validator_by_id,
  create_validator,
  update_validator,
  delete_validator,
};

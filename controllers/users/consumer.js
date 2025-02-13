// controllers/users/consumer.js
// CRUD on Consumers which can only be done by admin only

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const { hashPassword } = require("../../services/password_auth");

// Get all consumers
const get_all_consumers = async (req, res) => {
  const page = Number(req.params.page) || 1;
  let limit = Number(req.query.limit) || 10;
  if (page <= 0) {
    limit = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const consumers = await prisma.user.findMany({
    skip: (page - 1) * limit, // Calculate the number of items to skip
    take: limit, // Number of items to return
    where: {
      isConsumer: true,
      isAdmin: false,
      isContent_creator: false,
      isValidator: false,
    },
  });
  res.status(StatusCodes.OK).json(consumers);
};

// Get consumer by ID
const get_consumer_by_id = async (req, res) => {
  const { id } = req.params;
  const consumer = await prisma.user.findUnique({
    where: {
      id: Number(id),
      isConsumer: true,
      isAdmin: false,
      isContent_creator: false,
      isValidator: false,
    },
  });
  if (!consumer) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Consumer not found" });
  }
  res.status(StatusCodes.OK).json(consumer);
};

// Create a new consumer
const create_consumer = async (req, res) => {
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
      isConsumer: true,
    },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Consumer registered successfully", newUser });
};

// Update consumer by ID
const update_consumer = async (req, res) => {
  const { id } = req.params;
  const { email, password, name } = req.body;
  let update_data = { email, name };

  if (password) {
    const hashedPassword = await hashPassword(password);
    update_data.password = hashedPassword;
  }

  const updated_consumer = await prisma.user.update({
    where: { id: Number(id), isConsumer: true },
    data: update_data,
  });

  if (!updated_consumer) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Admin not found" });
  }

  res.status(StatusCodes.OK).json(updated_consumer);
};

// Delete consumer by ID
const delete_consumer = async (req, res) => {
  const { id } = req.params;
  const deletedConsumer = await prisma.user.delete({
    where: { id: Number(id) },
  });
  if (!deletedConsumer) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Consumer not found" });
  }
  res.status(StatusCodes.OK).json(deletedConsumer);
};

module.exports = {
  get_all_consumers,
  get_consumer_by_id,
  create_consumer,
  update_consumer,
  delete_consumer,
};

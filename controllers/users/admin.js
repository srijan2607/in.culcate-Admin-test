// controllers/users/admin.js
// CRUD on Admin which can be done on Admin only and by Admin only
const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const { hashPassword } = require("../../services/password_auth");

// Get all admins
const get_all_admins = async (req, res) => {
  const page = Number(req.params.page) || 1;
  let limit = Number(req.query.limit) || 10;
  if (page <= 0) {
    limit = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const admins = await prisma.user.findMany({
    skip: (page - 1) * limit, // Calculate the number of items to skip
    take: limit, // Number of items to return
    orderBy: { createdAt: "desc" },
    where: { isAdmin: true },
  });
  res.status(StatusCodes.OK).json(admins);
};

// Get admin by ID
const get_admin_by_id = async (req, res) => {
  const { id } = req.params;
  const admin = await prisma.user.findUnique({
    where: { id: Number(id), isAdmin: true },
  });
  if (!admin) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Admin not found" });
  }
  res.status(StatusCodes.OK).json(admin);
};

// Create a new admin
const create_admin = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    throw new BadRequestError("User already exists");
  }
  const hashedPassword = await hashPassword(password);
  const newAdmin = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    },
  });
  res
    .status(StatusCodes.CREATED)
    .json({ message: "Admin registered successfully", newAdmin });
};

// Update admin by ID
const update_admin = async (req, res) => {
  const { id } = req.params;
  const { email, password, name } = req.body;
  let update_data = { email, name };

  if (password) {
    const hashedPassword = await hashPassword(password);
    update_data.password = hashedPassword;
  }

  const updated_Admin = await prisma.user.update({
    where: { id: Number(id), isAdmin: true},
    data: update_data,
  });

  if (!updated_Admin) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Admin not found" });
  }

  res.status(StatusCodes.OK).json(updated_Admin);
};

// Delete admin by ID
const delete_admin = async (req, res) => {
  const { id } = req.params;
  const deletedAdmin = await prisma.user.delete({
    where: { id: Number(id), isAdmin: true },
  });
  if (!deletedAdmin) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Admin not found" });
  }
  res.status(StatusCodes.OK).json(deletedAdmin);
};

module.exports = {
  get_all_admins,
  get_admin_by_id,
  create_admin,
  update_admin,
  delete_admin,
};

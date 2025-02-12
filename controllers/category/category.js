// controllers/category/category.js

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../../errors");

// Get all the categories

const get_all_categories = async (req, res) => {
  const page = Number(req.params.page) || 1;
  let limit = Number(req.query.limit) || 10;
  if (page <= 0) {
    limit = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const categories = await prisma.category.findMany({
    skip: (page - 1) * limit, // Calculate the number of items to skip skip = (2 - 1) * 10 = 1 * 10 = 10
    take: limit, // Number of items to return

    orderBy: { createdAt: "desc" },
  });
  res.json(categories);
};

// Create a new category

// Create a new category
const create_category = async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new BadRequestError("Please provide name and description");
  }
  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });
  res.status(StatusCodes.CREATED).json(category);
};

// Update a category
const update_category = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: {
      name,
    },
  });
  res.json(category);
};

// Delete a category
const delete_category = async (req, res) => {
  const { id } = req.params;
  await prisma.category.delete({
    where: { id: Number(id) },
  });
  res.status(StatusCodes.NO_CONTENT).send();
};

module.exports = {
  get_all_categories,
  create_category,
  update_category,
  delete_category,
};

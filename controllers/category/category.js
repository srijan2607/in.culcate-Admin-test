// controllers/category/category.js

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../../errors");

// get all categories
const get_all_categories = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const categories = await prisma.category.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      Knowledge_capsule: {
        select: {
          id: true,
          Short_title: true,
          Long_title: true,
        },
      },
    },
  });
  const total_categories = await prisma.category.count();
  const totalPages = Math.ceil(total_categories / limit);
  res.status(StatusCodes.OK).json({
    categories: categories,
    totalPages: totalPages,
    total_categories: total_categories,
    limit: limit,
    currentPage: page,
  });
};

// create a category

const create_category = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Please provide a name for the category");
  }

  // Check if category already exists
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: name,
    },
  });

  if (existingCategory) {
    throw new BadRequestError("Category with this name already exists");
  }

  const newCategory = await prisma.category.create({
    data: {
      name,
    },
  });
  const ans = { ...newCategory };
  res.status(StatusCodes.CREATED).json({ newCategory });
};

// update a category
const update_category = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    throw new BadRequestError("Please provide a name for the category");
  }
  const updatedCategory = await prisma.category.update({
    where: { id: Number(id) },
    data: { name },
  });
  res.status(StatusCodes.OK).json({ updatedCategory });
};

const delete_category = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await prisma.category.delete({
    where: { id: Number(id) },
  });
  res.status(StatusCodes.OK).json({ deletedCategory });
};

module.exports = {
  get_all_categories,
  create_category,
  update_category,
  delete_category,
};

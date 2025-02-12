// controllers/users/content_creator.js
// CRUD on Content Creator which can only be done by admin only

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../../errors");
const { hashPassword } = require("../../services/password_auth");

// Get all content creators
const get_all_content_creators = async (req, res) => {
  const page = Number(req.params.page) || 1;
  let limit = Number(req.query.limit) || 10;
  if (page <= 0) {
    limit = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const contentCreators = await prisma.user.findMany({
    skip: (page - 1) * limit, // Calculate the number of items to skip
    take: limit, // Number of items to return

    where: { isContentCreator: true },
  });
  res.status(StatusCodes.OK).json(contentCreators);
};

// Get content creator by ID
const get_content_creator_by_id = async (req, res) => {
  const { id } = req.params;
  const contentCreator = await prisma.user.findUnique({
    where: { id },
    include: { isContentCreator: true },
  });
  if (!contentCreator) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Content Creator not found" });
  }
  res.status(StatusCodes.OK).json(contentCreator);
};

// Create a new content creator
const create_content_creator = async (req, res) => {
  if (req.user && req.user.isAdmin) {
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
        isContentCreator: true,
      },
    });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Content Creator registered successfully", token });
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin"
    );
  }
};

// Update content creator by ID
const update_content_creator = async (req, res) => {
  if (req.user && req.user.isAdmin) {
    const { id } = req.params;
    const { email, password, name } = req.body;
    const updatedContentCreator = await prisma.user.update({
      where: { id },
      isContentCreator: true,
      data: { email, password, name },
    });
    if (!updatedContentCreator) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Content Creator not found" });
    }
    res.status(StatusCodes.ACCEPTED).json(updatedContentCreator);
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin"
    );
  }
};

// Delete content creator by ID
const delete_content_creator = async (req, res) => {
  if (req.user && req.user.isAdmin) {
    const { id } = req.params;
    const deletedContentCreator = await prisma.user.delete({
      where: { id: Number(id), isContent_creator: true },
    });
    if (!deletedContentCreator) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Content Creator not found" });
    }
    res.status(StatusCodes.ACCEPTED).json(deletedContentCreator);
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin"
    );
  }
};

module.exports = {
  get_all_content_creators,
  get_content_creator_by_id,
  create_content_creator,
  update_content_creator,
  delete_content_creator,
};

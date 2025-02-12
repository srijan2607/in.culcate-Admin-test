// controllers/tags/tags.js

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../../errors");

// Get all the tags
const get_all_tags = async (req, res) => {
  const tags = await prisma.tag.findMany();
  res.json(tags);
};

// Get tags by ID
const get_tag_by_id = async (req, res) => {
  const { id } = req.params;
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Tag not found" });
  }
  res.json(tag);
};

// Create a new tag
const create_tag = async (req, res) => {
  if ((req.user && req.user.isAdmin) || req.user.isContentCreator) {
    const { name } = req.body;
    try {
      const tag = await prisma.tag.create({ data: { name } });
      res.status(StatusCodes.CREATED).json(tag);
    } catch (error) {
      throw new BadRequestError("Invalid tag data");
    }
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin or content creator"
    );
  }
};

// Update tag by ID
const update_tag = async (req, res) => {
  if ((req.user && req.user.isAdmin) || req.user.isContentCreator) {
    const { id } = req.params;
    const { name } = req.body;
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    if (!updatedTag) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Tag not found" });
    }
    res.json(updatedTag);
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin or content creator"
    );
  }
};

// Delete a tag by ID
const delete_tag = async (req, res) => {
  if ((req.user && req.user.isAdmin) || req.user.isContentCreator) {
    const { id } = req.params;
    const deletedTag = await prisma.tag.delete({ where: { id } });
    if (!deletedTag) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "Tag not found" });
    }
    res.json(deletedTag);
  } else {
    throw new UnauthenticatedError(
      "Dude Hold your horses, you are not an admin or content creator"
    );
  }
};

module.exports = {
  get_all_tags,
  get_tag_by_id,
  create_tag,
  update_tag,
  delete_tag,
};

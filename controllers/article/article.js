// controllers/article/article.js

//

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  CustomAPIError,
} = require("../../errors");

// Get all knowledge capsules

const get_all_knowledge_capsule = async (req, res) => {
  const page = Number(req.params.page) || 1;
  let limit = Number(req.query.limit) || 10;
  if (page <= 0) {
    limit = 1;
  }
  if (limit <= 0 || limit > 100) {
    limit = 10;
  }
  const knowledge_capsules = await prisma.knowledge_capsule.findMany({
    skip: (page - 1) * limit, // Calculate the number of items to skip
    take: limit, // Number of items to return
    orderBy: { createdAt: "desc" },
  });
  res
    .status(StatusCodes.OK)
    .json({ count: knowledge_capsules.length, knowledge_capsules });
};

// Get knowledge capsule by ID
const get_knowledge_capsule_by_id = async (req, res) => {
  const { id } = req.params;
  const knowledge_capsule = await prisma.knowledge_capsule.findUnique({
    where: { id: Number(id) },
  });
  if (!knowledge_capsule) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Knowledge capsule not found" });
  }
  res.status(StatusCodes.OK).json(knowledge_capsule);
};

// Create a new knowledge capsule

const create_knowledge_capsule = async (req, res) => {
  const {
    Short_title,
    Short_content,
    Short_image,
    Long_title,
    Long_content,
    Long_image,
    authorId,
    categoryId,
    tags, // Expecting an array of tag names
  } = req.body;

  // Validate required fields
  if (
    !Short_title ||
    !Short_content ||
    !Long_title ||
    !Long_content ||
    !authorId ||
    !categoryId
  ) {
    throw new BadRequestError("Please provide all required fields");
  }

  try {
    // Create or connect tags
    const tagConnections =
      tags?.map((tagName) => ({
        where: { name: tagName },
        create: { name: tagName },
      })) || [];

    // Create knowledge capsule
    const newKnowledgeCapsule = await prisma.knowledge_capsule.create({
      data: {
        Short_title,
        Short_content,
        Short_image,
        Long_title,
        Long_content,
        Long_image,
        Author: { connect: { id: authorId } }, // Ensuring the author exists
        category: { connect: { id: categoryId } }, // Ensuring the category exists
        tags: { connectOrCreate: tagConnections },
      },
      include: {
        Author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: true,
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Knowledge capsule created successfully",
      newKnowledgeCapsule,
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new BadRequestError("Duplicate entry detected");
    }
    console.error("Database Error:", error);
    throw new CustomAPIError("Failed to create knowledge capsule");
  }
};

// update knowledge capsule

const update_knowledge_capsule = async (req, res) => {
  const { id } = req.params;
  const {
    Short_title,
    Short_content,
    Short_image,
    Long_title,
    Long_content,
    Long_image,
    authorId,
    categoryId,
    tags, // Expecting an array of tag names
  } = req.body;

  // Validate required fields
  if (!Short_title || !Short_content || !Long_title || !Long_content) {
    throw new BadRequestError("Please provide all required fields");
  }

  // Convert id to integer
  const knowledgeCapsuleId = parseInt(id, 10);
  if (isNaN(knowledgeCapsuleId)) {
    throw new BadRequestError("Invalid knowledge capsule ID");
  }

  // Check if knowledge capsule exists
  const existingKnowledgeCapsule = await prisma.knowledge_capsule.findUnique({
    where: { id: knowledgeCapsuleId },
  });

  if (!existingKnowledgeCapsule) {
    throw new NotFoundError("Knowledge capsule not found");
  }

  // Validate categoryId exists
  if (categoryId) {
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw new BadRequestError("Invalid category ID");
    }
  }

  // Validate authorId exists
  if (authorId) {
    const authorExists = await prisma.user.findUnique({
      where: { id: authorId },
    });

    if (!authorExists) {
      throw new BadRequestError("Invalid author ID");
    }
  }

  try {
    const updatedKnowledgeCapsule = await prisma.knowledge_capsule.update({
      where: { id: knowledgeCapsuleId },
      data: {
        Short_title,
        Short_content,
        Short_image,
        Long_title,
        Long_content,
        Long_image,
        authorId,
        categoryId,
        // Handle tags (if provided)
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((tagName) => ({
                where: { name: tagName },
                create: { name: tagName },
              })),
            }
          : undefined, // Avoid unnecessary update if tags are not provided
      },
      include: {
        Author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    res.status(StatusCodes.OK).json({
      message: "Knowledge capsule updated successfully",
      updatedKnowledgeCapsule,
    });
  } catch (error) {
    console.error("Error updating knowledge capsule:", error);

    if (error.code === "P2002") {
      throw new BadRequestError("A tag with this name already exists");
    }
    throw new CustomAPIError("Failed to update knowledge capsule");
  }
};
// Delete knowledge capsule

const delete_knowledge_capsule = async (req, res) => {
  const { id } = req.params;
  const existingKnowledgeCapsule = await prisma.knowledge_capsule.findUnique({
    where: { id: Number(id) },
  });
  if (!existingKnowledgeCapsule) {
    throw new NotFoundError("Knowledge capsule not found");
  }
  await prisma.knowledge_capsule.delete({
    where: { id: Number(id) },
  });
  res.status(StatusCodes.OK).json({ message: "Knowledge capsule deleted" });
};

module.exports = {
  get_all_knowledge_capsule,
  get_knowledge_capsule_by_id,
  create_knowledge_capsule,
  update_knowledge_capsule,
  delete_knowledge_capsule,
};

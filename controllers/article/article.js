// controllers/article/article.js

//

const prisma = require("../../db/connect");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../../errors");

// Get all the Knowledge_capsule
const get_all_knowledge_capsule = async (req, res) => {
  try {
    const page = Math.max(Number(req.params.page) || 1, 1); // Ensure page is at least 1
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100); // Limit between 1 and 100

    const [knowledge_capsules, total_posts] = await Promise.all([
      prisma.knowledge_capsule.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.knowledge_capsule.count(),
    ]);

    const totalPages = Math.ceil(total_posts / limit);

    return res.status(StatusCodes.OK).json({
      count: knowledge_capsules.length,
      knowledge_capsules,
      totalPages,
      total_posts,
      limit,
      currentPage: page,
    });
  } catch (error) {
    throw new BadRequestError("Failed to fetch knowledge capsules");
  }
};

// Get Knowledge_capsule by ID
const get_knowledge_capsule_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    const knowledge_capsule = await prisma.knowledge_capsule.findUnique({
      where: { id },
    });

    if (!knowledge_capsule) {
      throw new NotFoundError("Knowledge capsule not found");
    }

    return res.status(StatusCodes.OK).json({ knowledge_capsule });
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new BadRequestError("Failed to fetch knowledge capsule");
  }
};

// Create a new Knowledge_capsule
const create_knowledge_capsule = async (req, res) => {
  try {
    const {
      Short_title,
      Short_content,
      Short_image,
      Long_title,
      Long_content,
      Long_image,
      tags, // Array of tag names
      categoryId, // Must be an existing category ID
      authorId, // Must be the current user's ID
    } = req.body;

    // Validate required fields
    if (
      !Short_title ||
      !Short_content ||
      !Long_title ||
      !Long_content ||
      !categoryId
    ) {
      throw new BadRequestError("Please provide all required fields");
    }

    // Verify category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists) {
      throw new BadRequestError("Invalid category ID");
    }

    // Handle tags - create new ones if they don't exist
    const tagObjects = [];
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {}, // If exists, don't update anything
          create: { name: tagName },
        });
        tagObjects.push({ id: tag.id });
      }
    }

    // Create knowledge capsule with tags
    const knowledge_capsule = await prisma.knowledge_capsule.create({
      data: {
        Short_title,
        Short_content,
        Short_image,
        Long_title,
        Long_content,
        Long_image,
        category: {
          connect: { id: categoryId },
        },
        Author: {
          connect: { id: req.user.userId }, // Connect to current user
        },
        tags: {
          connect: tagObjects, // Connect to existing/new tags
        },
      },
      include: {
        tags: true,
        category: true,
        Author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(StatusCodes.CREATED).json({ knowledge_capsule });
  } catch (error) {
    if (error instanceof BadRequestError) throw error;
    throw new BadRequestError(
      "Failed to create knowledge capsule: " + error.message
    );
  }
};

// Update Knowledge_capsule by ID
const update_knowledge_capsule = async (req, res) => {
  try {
    if (!req.user || (!req.user.isAdmin && !req.user.isContentCreator)) {
      throw new UnauthenticatedError("Unauthorized: Insufficient permissions");
    }

    const { id } = req.params;
    const updateData = req.body;

    const existingKnowledgeCapsule = await prisma.knowledge_capsule.findUnique({
      where: { id },
    });

    if (!existingKnowledgeCapsule) {
      throw new NotFoundError("Knowledge capsule not found");
    }

    const updatedKnowledge_capsule = await prisma.knowledge_capsule.update({
      where: { id },
      data: updateData,
    });

    return res
      .status(StatusCodes.OK)
      .json({ knowledge_capsule: updatedKnowledge_capsule });
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof NotFoundError)
      throw error;
    throw new BadRequestError("Failed to update knowledge capsule");
  }
};

// Delete Knowledge_capsule by ID
const delete_knowledge_capsule = async (req, res) => {
  try {
    if (!req.user || (!req.user.isAdmin && !req.user.isContentCreator)) {
      throw new UnauthenticatedError("Unauthorized: Insufficient permissions");
    }

    const { id } = req.params;
    const knowledge_capsule = await prisma.knowledge_capsule.findUnique({
      where: { id },
    });

    if (!knowledge_capsule) {
      throw new NotFoundError("Knowledge capsule not found");
    }

    await prisma.knowledge_capsule.delete({ where: { id } });
    return res
      .status(StatusCodes.OK)
      .json({ message: "Knowledge capsule deleted successfully" });
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof NotFoundError)
      throw error;
    throw new BadRequestError("Failed to delete knowledge capsule");
  }
};

module.exports = {
  get_all_knowledge_capsule,
  get_knowledge_capsule_by_id,
  create_knowledge_capsule,
  update_knowledge_capsule,
  delete_knowledge_capsule,
};

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
const cloudflareService = require("../../services/cloudflare");

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
  try {
    const {
      Short_title,
      Short_content,
      Long_title,
      Long_content,
      authorId,
      categoryId,
      tags,
    } = req.body;

    // Parse tags if it's a string
    let parsedTags = [];
    try {
      parsedTags = tags
        ? typeof tags === "string"
          ? JSON.parse(tags)
          : tags
        : [];
      if (!Array.isArray(parsedTags)) {
        throw new Error("Tags must be an array");
      }
    } catch (error) {
      throw new BadRequestError("Invalid tags format. Must be a JSON array");
    }

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

    // Upload images to Cloudflare if they exist
    let Short_image_url = null;
    let Long_image_url = null;

    if (req.files?.Short_image?.[0]) {
      Short_image_url = await cloudflareService.uploadImage(
        req.files.Short_image[0].buffer,
        `short_${Date.now()}_${req.files.Short_image[0].originalname}`
      );
    }

    if (req.files?.Long_image?.[0]) {
      Long_image_url = await cloudflareService.uploadImage(
        req.files.Long_image[0].buffer,
        `long_${Date.now()}_${req.files.Long_image[0].originalname}`
      );
    }

    // Create tag connections using parsed tags
    const tagConnections = parsedTags.map((tagName) => ({
      where: { name: tagName },
      create: { name: tagName },
    }));

    // Create knowledge capsule
    const newKnowledgeCapsule = await prisma.knowledge_capsule.create({
      data: {
        Short_title,
        Short_content,
        Short_image: Short_image_url,
        Long_title,
        Long_content,
        Long_image: Long_image_url,
        Author: { connect: { id: Number(authorId) } },
        category: { connect: { id: Number(categoryId) } },
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
    console.error("Error:", error);
    if (error.code === "P2002") {
      throw new BadRequestError("Duplicate entry detected");
    }
    throw new CustomAPIError("Failed to create knowledge capsule");
  }
};

// update knowledge capsule
const update_knowledge_capsule = async (req, res) => {
  const { id } = req.params;
  const {
    Short_title,
    Short_content,
    Long_title,
    Long_content,
    authorId,
    categoryId,
    tags,
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
    // Handle image updates
    let Short_image_url = existingKnowledgeCapsule.Short_image;
    let Long_image_url = existingKnowledgeCapsule.Long_image;

    // Update Short_image if new file is provided
    if (req.files?.Short_image?.[0]) {
      Short_image_url = await cloudflareService.uploadImage(
        req.files.Short_image[0].buffer,
        `short_${Date.now()}_${req.files.Short_image[0].originalname}`
      );
    }

    // Update Long_image if new file is provided
    if (req.files?.Long_image?.[0]) {
      Long_image_url = await cloudflareService.uploadImage(
        req.files.Long_image[0].buffer,
        `long_${Date.now()}_${req.files.Long_image[0].originalname}`
      );
    }

    const updatedKnowledgeCapsule = await prisma.knowledge_capsule.update({
      where: { id: knowledgeCapsuleId },
      data: {
        Short_title,
        Short_content,
        Short_image: Short_image_url,
        Long_title,
        Long_content,
        Long_image: Long_image_url,
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
          : undefined,
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

  try {
    // Delete images from Cloudflare if they exist
    if (existingKnowledgeCapsule.Short_image) {
      await cloudflareService.deleteImage(existingKnowledgeCapsule.Short_image);
    }
    if (existingKnowledgeCapsule.Long_image) {
      await cloudflareService.deleteImage(existingKnowledgeCapsule.Long_image);
    }

    // Delete the knowledge capsule
    await prisma.knowledge_capsule.delete({
      where: { id: Number(id) },
    });

    res.status(StatusCodes.OK).json({ message: "Knowledge capsule deleted" });
  } catch (error) {
    console.error("Error deleting knowledge capsule:", error);
    throw new CustomAPIError("Failed to delete knowledge capsule");
  }
};
module.exports = {
  get_all_knowledge_capsule,
  get_knowledge_capsule_by_id,
  create_knowledge_capsule,
  update_knowledge_capsule,
  delete_knowledge_capsule,
};

// controllers/home/home_page.js

// getting count of the Admin, consumers, Content creator, Category, tags, Knowledge Capsule

// Connect to the database using Prisma ORM

const { StatusCodes } = require("http-status-codes");
const prisma = require("../../db/connect");
const { BadRequestError } = require("../../errors");

const get_counts = async (req, res) => {
  try {
    const admin_count = await prisma.user.count({ where: { isAdmin: true } });
    const consumer_count = await prisma.user.count({
      where: {
        isConsumer: true,
        isAdmin: false,
        isContent_creator: false,
        isValidator: false,
      },
    });
    const content_creator_count = await prisma.user.count({
      where: { isContent_creator: true },
    });
    const category_count = await prisma.category.count();
    const tag_count = await prisma.tag.count();
    const knowledge_capsule_count = await prisma.knowledge_capsule.count();

    res.status(StatusCodes.OK).json({
      admin_count: admin_count,
      consumer_count: consumer_count,
      content_creator_count: content_creator_count,
      category_count: category_count,
      tag_count: tag_count,
      knowledge_capsule_count: knowledge_capsule_count,
    });
  } catch (error) {
    throw new BadRequestError(error);
  }
};

module.exports = {
  get_counts,
};

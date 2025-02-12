// controllers/home/home_page.js

// getting count of the Admin, consumers, Content creator, Category, tags, Knowledge Capsule

// Connect to the database using Prisma ORM

const { StatusCodes } = require("http-status-codes");
const prisma = require("../../db/connect");

// getting Count of no of Admin
const get_admin_count = async (req, res) => {
  const adminCount = await prisma.user.count({ where: { isAdmin: true } });
  res.status(StatusCodes.OK).json({ adminCount });
};

// getting Count of no of consumers
const get_consumer_count = async (req, res) => {
  const consumerCount = await prisma.user.count({
    where: { isConsumer: true },
  });
  res.status(StatusCodes.OK).json({ consumerCount });
};

// getting Count of no of Content creators
const get_content_creator_count = async (req, res) => {
  const contentCreatorCount = await prisma.user.count({
    where: { isContentCreator: true },
  });
  res.status(StatusCodes.OK).json({ contentCreatorCount });
};

// getting Count of no of Categories
const get_category_count = async (req, res) => {
  const categoryCount = await prisma.category.count();
  res.status(StatusCodes.OK).json({ categoryCount });
};

// getting Count of no of Tags
const get_tag_count = async (req, res) => {
  const tagCount = await prisma.tag.count();
  res.status(StatusCodes.OK).json({ tagCount });
};

// getting Count of no of Knowledge Capsules
const get_knowledge_capsule_count = async (req, res) => {
  const knowledgeCapsuleCount = await prisma.knowledge_capsule.count();
  res.status(StatusCodes.OK).json({ knowledgeCapsuleCount });
};

module.exports = {
  get_admin_count,
  get_consumer_count,
  get_content_creator_count,
  get_category_count,
  get_tag_count,
  get_knowledge_capsule_count,
};

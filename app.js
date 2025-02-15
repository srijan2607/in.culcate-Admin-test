// app.js

require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const cloudflareService = require("./services/cloudflare");
const prisma = new PrismaClient();
app.use(express.json());

// Routers
const admin = require("./routers/admin");
const article = require("./routers/article");
const category = require("./routers/category");
const consumer = require("./routers/consumer");
const content_creator = require("./routers/content_creator");
const home_page = require("./routers/home_page");
const login = require("./routers/login");
const tags = require("./routers/tags");
const validator = require("./routers/validators");
const Authentication = require("./middleware/authentication");
const isAdmin = require("./middleware/isAdmin");
const isAdminOrContentCreator = require("./middleware/isAdmin_or_CC");

// Security Packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// Middleware
app.set("trust proxy", 1);
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Routes Middleware
// Base = /api/admin/v1/f(n)

app.use("/api/admin/v1/admin", Authentication, admin);
app.use("/api/admin/v1/article", Authentication, article);
app.use("/api/admin/v1/category", Authentication, category);
app.use("/api/admin/v1/home_page", Authentication, home_page);
app.use("/api/admin/v1/login", login);
app.use("/api/admin/v1/tags", Authentication, tags);
app.use("/api/admin/v1/consumer", Authentication, consumer);
app.use("/api/admin/v1/content_creator", Authentication, content_creator);
app.use("/api/admin/v1/validator", Authentication, validator);

const port = process.env.PORT || 6000;

cloudflareService
  .testConnection()
  .then((isConnected) => {
    if (isConnected) {
      console.log("✅ Successfully connected to Cloudflare Images");
    } else {
      console.error("❌ Failed to connect to Cloudflare Images");
    }
  })
  .catch((error) => {
    console.error("❌ Error testing Cloudflare connection:", error.message);
  });

const start = async () => {
  try {
    await prisma.$connect();
    app.listen(port, () =>
      console.log(`Server is listening on http://localhost:${port}`)
    );
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
};

start();

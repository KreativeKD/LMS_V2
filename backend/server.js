const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const quizRoutes = require("./routes/quiz");
const publicRoutes = require("./routes/public");
const notificationRoutes = require("./routes/notification");
const announcementRoutes = require("./routes/announcement");
const seedAdmin = require("./utils/seedAdmin");
const logger = require("./utils/logger");
const { errorHandlerMiddleware } = require("./utils/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;
let server;
const path = require('path');

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  console.error(
    "Please create a .env file based on .env.example and set JWT_SECRET",
  );
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  console.error(
    "Please create a .env file based on .env.example and set MONGO_URI",
  );
  process.exit(1);
}

// CORS configuration
const normalizeOrigin = (origin) => origin.replace(/\/$/, "");
const envOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

const allowedOrigins = [
  ...new Set(["https://coursez.in", "https://www.coursez.in", ...envOrigins]),
];

const localhostDevOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;
const vercelOriginPattern = /^https:\/\/.*\.vercel\.app$/i;
const netlifyOriginPattern = /^https:\/\/.*\.netlify\.app$/i;

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = normalizeOrigin(origin);
      if (
        allowedOrigins.includes(normalizedOrigin) ||
        localhostDevOriginPattern.test(normalizedOrigin) ||
        vercelOriginPattern.test(normalizedOrigin) ||
        netlifyOriginPattern.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json({ limit: "50mb" }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use(logger.requestLogger);

// Sanitize user input to prevent NoSQL injection attacks
app.use(mongoSanitize());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 5,
    minPoolSize: 0,
  })
  .then(() => {
    logger.info("Connected to MongoDB Atlas");
    seedAdmin();
  })
  .catch((err) =>
    logger.error("MongoDB connection error", { error: err.message }),
  );

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);

app.get("/", (req, res) => {
  res.send("LMS API is running... (done by ved - latest)");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
  });
});

// Global error handler (must be last)
app.use(errorHandlerMiddleware);

const startServer = () => {
  if (server) {
    return server;
  }

  server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
  });

  return server;
};

const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down server.`);

  if (server) {
    server.close(() => {
      logger.info("HTTP server closed");
    });
  }

  await mongoose.connection.close(false);
  process.exit(0);
};

process.once("SIGTERM", () => {
  shutdown("SIGTERM").catch((err) => {
    logger.error("Error during shutdown", { error: err.message });
    process.exit(1);
  });
});

process.once("SIGINT", () => {
  shutdown("SIGINT").catch((err) => {
    logger.error("Error during shutdown", { error: err.message });
    process.exit(1);
  });
});

if (require.main === module) {
  startServer();
}

module.exports = app;

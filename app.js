const express = require("express");
const path = require("path");
const connectToDb = require("./config/connectToDb");
const xss = require("xss-clean");
const rateLimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const { errorHandler, notFound } = require("./middlewares/error");
const cors = require("cors");
require("dotenv").config();

// Connection To Db
connectToDb();

// Init App
const app = express();

// Middlewares
app.use(express.json());

// Security Headers (helmet)
app.use(helmet());

// Prevent Http Param Pollution
app.use(hpp());

// Prevent XSS(Cross Site Scripting) Attacks
app.use(xss());

// Rate Limiting
app.use(rateLimiting({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max:200,
}));

 // Cors Policy
 app.use(cors({
   origin: "https://blogyoussef.netlify.app"
 }));

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postsRoute"));
app.use("/api/comments", require("./routes/commentsRoute"));
app.use("/api/categories", require("./routes/categoriesRoute"));
app.use("/api/password",require("./routes/passwordRoute"));

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Static Folder
app.use(express.static(path.join(__dirname, "/build")));

// Client
app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, "/build","index.html"));
});

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

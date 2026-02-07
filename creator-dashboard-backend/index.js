// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const dotenv = require("dotenv");
// const cookieParser = require("cookie-parser");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();

// dotenv.config();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// var cors = require("cors");

// const corsOptions = {
//   // origin: ["http://localhost:3000", "http://192.168.100.69:3000"],
//   origin: "*",
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],

//   credentials: true,
// };

// // app.use(cors());
// app.use(cors(corsOptions));
// app.use(cookieParser()); // Make sure this is used before your routes

// //Authentication
// app.use("/api/auth", require("./routes/api/auth"));
// app.use("/api/assets", require("./routes/api/assets"));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started  on port ${PORT}`));



const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();
const app = express();

// ===== Body parsers =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== CORS =====
// For testing: allow all origins
// If using credentials (cookies), replace "*" with an array of allowed origins
app.use(cors({
  origin: "*",  // or ["http://localhost:3000"] if using cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // true only if using cookies
}));

// Preflight requests for all routes
app.options("*", cors());

// ===== Cookies =====
app.use(cookieParser());

// ===== Multer setup for file uploads =====
const uploadFolder = "uploads";

// Ensure the upload folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });


// Authentication routes
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/assets", require("./routes/api/assets"));

// ===== Start server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

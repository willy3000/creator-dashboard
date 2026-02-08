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
//   origin: [
//     "http://localhost:3000",
//     "http://192.168.100.6:3000",
//     "https://creator-dashboard-puce.vercel.app",
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
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

dotenv.config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://192.168.100.6:3000",
    "https://creator-dashboard-puce.vercel.app",
  ],
  credentials: true, 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/assets", require("./routes/api/assets"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const MONGODB_URL = process.env.MONGODB_URL;
// const db = require("monk")(MONGODB_URL);
const db = require("monk")(process.env.MONGODB_URL);
// const db = require("monk")("mongodb://localhost:27017/inventory-management");
const users = db.get("users");
const operators = db.get("operators");
const notifications = db.get("notifications");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT_SECRET;
const { sendNotification } = require("../../utils/constants");

//Sign Up #mongodb
router.post("/signUp", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const userDetails = {
    id: uuidv4(),
    username: req.body.username,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, salt),
  };

  users.find({}).then((doc) => {
    userAccounts = [...doc];
    const emailExists = userAccounts.some(
      (el) => el.email === userDetails.email,
    );

    if (emailExists) {
      res.json({
        success: false,
        message: "",
        error: "Email Already in Use",
        user: null,
      });
    } else {
      users.insert({ ...userDetails, adminId: userDetails.id }).then(() => {});
      const token = jwt.sign({ username: userDetails.username }, JWT_SECRET, {
        // expiresIn: "1h",
      });
      // Set the token as an HTTP-only cookie
      res.json({
        success: true,
        message: "Sign Up Successful",
        token: token,
        user: {
          userId: userDetails.id,
          username: userDetails.username,
          email: userDetails.email,
        },
      });
    }
  });
});

//Log in #mongodb
router.post("/logIn", (req, res) => {
  const userDetails = {
    email: req.body.email,
    password: req.body.password,
  };

  users.find({ email: userDetails.email }).then(async (doc) => {
    const account = doc[0];
    if (account) {
      const isPasswordValid = await bcrypt.compare(
        userDetails.password,
        account.password,
      );
      if (isPasswordValid) {
        const token = jwt.sign({ username: account.username }, JWT_SECRET, {
          // expiresIn: "1h",
        });

        // Set the token as an HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
          secure: false, // Only use HTTPS in production
          sameSite: "None", // Use 'None' for cross-origin requests
          maxAge: 3600000, // 1 hour expiration
          path: "/",
        });
        res.json({
          success: true,
          message: "Login Successful",
          token: token,
          user: {
            userId: account.id,
            username: account.username,
            email: account.email,
          },
        });
      } else {
        res.json({ success: false, message: "Invalid Password", user: null });
      }
    } else {
      res.json({
        success: false,
        message: "Email does not exist",
        user: null,
      });
    }
  });
});



module.exports = router;

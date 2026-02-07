const express = require("express");
const router = express.Router();
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const MONGODB_URL = process.env.MONGODB_URL;
// const db = require("monk")(MONGODB_URL);
const db = require("monk")(process.env.MONGODB_URL);
const questions = db.get("questions");
const users = db.get("users");
const answers = db.get("answers");
const inventory = db.get("inventory");
const assets = db.get("assets");
const items = db.get("items");
const assignments = db.get("assignments");
const authenticateJWT = require("../../middleware/authenticate-jwt");
const { uploadImage } = require("../../utils/constants");

const nullValues = [null, "null", "undefined", undefined, ""];

//Add Item group to inventory #mongodb
router.post(
  "/addAsset/:userId",
  //   authenticateJWT,
  upload.single("file"),
  async (req, res) => {
    const assetDetails = {
      id: uuidv4(),
      userId: req.params.userId,
      name: req.body.name,
      type: req.body.type,
      created_on: new Date(),
      tags: req.body.tags.split(",").map((tag) => tag.trim()),
      size: req.file.size,
      file: await uploadImage(req.file),
    };

    console.log(assetDetails);

    try {
      assets
        .insert({
          ...assetDetails,
        })
        .then((doc) => {
          // console.log(doc);
          res.json({
            success: true,
            message: "asset added successfully",
          });
        });
    } catch (err) {
      res.json({ success: false, message: err });
    }
  },
);

// Fetch all assets for a given userId
router.get(
  "/getAssets/:userId",
  // authenticateJWT,
  async (req, res) => {
    try {
      const userAssets = await assets.find({ userId: req.params.userId });
      res.json({
        success: true,
        result: [...userAssets],
      });
    } catch (err) {
      res.json({ success: false, message: err });
    }
  },
);

module.exports = router;

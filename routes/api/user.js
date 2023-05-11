const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  register,
  login,
  logout,
  current,
  avatar,
} = require("../../models/user");
const validate = require("../../validation/auth");
const validateToken = require("../../middleware/auth");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../..", "tmp"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/register", validate(), register);

router.post("/login", validate(), login);

router.post("/logout", validateToken, logout);

router.get("/current", validateToken, current);

router.patch("/avatars", validateToken, upload.single("avatar"), avatar);

module.exports = router;

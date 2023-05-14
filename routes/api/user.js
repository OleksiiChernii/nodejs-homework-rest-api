const express = require("express");
const multer = require("multer");
const {
  register,
  login,
  logout,
  current,
  avatar,
  verifyToken,
  verify,
} = require("../../models/user");
const { validate, validateVerify } = require("../../validation/auth");
const validateToken = require("../../middleware/auth");
const fs = require("fs");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dirPath = "tmp";
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    cb(null, dirPath);
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

router.get("/verify/:verificationToken", verifyToken);

router.post("/verify", validateVerify, verify);

module.exports = router;

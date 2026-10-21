const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const makeStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(__dirname, `../../uploads/${folder}`);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });

const imageFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|svg|webp|gif|avif/.test(
    path.extname(file.originalname).toLowerCase(),
  );
  ok ? cb(null, true) : cb(new Error("Images only"));
};

const singleUpload = multer({
  storage: makeStorage("sections"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const multiUpload = multer({
  storage: makeStorage("sections"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const logoUpload = multer({
  storage: makeStorage("logos"),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

// single image (hero bg, about image, etc)
router.post("/upload/image", singleUpload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: `/uploads/sections/${req.file.filename}` });
});

// multiple images (carousel, gallery)
router.post("/upload/images", multiUpload.array("files", 20), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: "No files" });
  res.json({
    urls: req.files.map((f) => `/uploads/sections/${f.filename}`),
  });
});

// logo (existing flow, now centralized here)
router.post("/upload/logo", logoUpload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: `/uploads/logos/${req.file.filename}` });
});

const videoFilter = (req, file, cb) => {
  const ok = /mp4|webm|ogg|mov/.test(
    path.extname(file.originalname).toLowerCase(),
  );
  ok ? cb(null, true) : cb(new Error("Videos only"));
};

const videoUpload = multer({
  storage: makeStorage("videos"),
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: videoFilter,
});

router.post("/upload/video", videoUpload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ url: `/uploads/videos/${req.file.filename}` });
});

module.exports = router;

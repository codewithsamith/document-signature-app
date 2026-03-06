const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const signatureUpload = require("../middleware/signatureUploadMiddleware");
const {
  uploadDocument,
  getUserDocuments,
  downloadDocument,
  signDocument
} = require("../controllers/documentController");
router.get("/", authMiddleware, getUserDocuments);
router.get("/:id", authMiddleware, downloadDocument);

// POST /api/documents/upload
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);
router.post(
  "/sign/:id",
  authMiddleware,
  signatureUpload.single("file"),
  signDocument
);

module.exports = router;
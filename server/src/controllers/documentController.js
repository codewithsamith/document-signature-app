const Document = require("../models/Document");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");


// Upload Document
exports.uploadDocument = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newDocument = await Document.create({
      fileName: req.file.filename,
      filePath: req.file.path,
      owner: req.user.id
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDocument
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
};



// Get User Documents
exports.getUserDocuments = async (req, res) => {
  try {

    const documents = await Document.find({
      owner: req.user.id
    }).sort({ uploadedAt: -1 });

    res.status(200).json({
      count: documents.length,
      documents
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
};



// Download Document
exports.downloadDocument = async (req, res) => {
  try {

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.download(document.filePath);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Server error" });

  }
};



// Sign Document
exports.signDocument = async (req, res) => {
  try {

    const { x, y } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No signature uploaded" });
    }

    // Load original PDF
    const existingPdfBytes = fs.readFileSync(document.filePath);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();

    const firstPage = pages[0];


    // Load signature image
    const signatureBytes = fs.readFileSync(req.file.path);

    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    const signatureDims = signatureImage.scale(0.5);


    // Draw signature
    firstPage.drawImage(signatureImage, {
      x: Number(x),
      y: Number(y),
      width: signatureDims.width,
      height: signatureDims.height
    });


    // Save signed PDF
    const signedPdfBytes = await pdfDoc.save();


    const signedFilePath = path.join(
      __dirname,
      "../../uploads",
      `signed-${document.fileName}`
    );


    fs.writeFileSync(signedFilePath, signedPdfBytes);


    // Update document in database
    document.signature = {
      imagePath: req.file.path,
      x,
      y,
      signedAt: new Date()
    };

    document.filePath = signedFilePath;

    await document.save();


    // Send file for download
    res.download(signedFilePath, `signed-${document.fileName}`);


  } catch (error) {

    console.error(error);

    res.status(500).json({ message: "Server error" });

  }
};
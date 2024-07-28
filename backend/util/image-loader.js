const express = require("express");


const path = require("path");

const router = express.Router();

router.get("/:imageName", (req, res, next) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname ,'..', "images",imageName);
  res.sendFile(imagePath);
});

module.exports = router;

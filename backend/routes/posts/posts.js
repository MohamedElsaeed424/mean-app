const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const postsController = require("../../controllers/posts/posts");
const multer = require("multer");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, fileName + "-" + Date.now() + "." + ext);
  },
});


router.get("/all-posts", postsController.getPosts);

router.get("/get-post/:postId", postsController.getPost);

router.post("/add-post",multer({storage:storage}).single("image"), postsController.createPost);

router.delete("/delete-post/:postId", postsController.deletePost);

router.put("/update-post/:postId",multer({storage:storage}).single("image"), postsController.updatePost);

module.exports = router;

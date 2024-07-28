const Post = require("../../model/post");


exports.getPosts = async (req, res, next) => {
  try {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage;
    const postQuery = Post.find();
    if (pageSize && currentPage) {
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    const posts = await postQuery;
    const count = await Post.countDocuments();
    res.status(200).json({
      message: "Fetched posts successfully.",
      posts: posts,
      maxPosts: count,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    console.log(11);
    console.log(post);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Post fetched.", post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }

}

exports.createPost = async (req, res, next) => {
  try {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content ,
      imagePath: url+"/images/" + req.file.filename,
    });
    const result = await post.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: {
        ...result,
        id: result._id,
      },
    });
  }catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: "Post deleted." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.updatePost = async (req, res, next) => {
  try {
    if(req.file){
      const url = req.protocol + "://" + req.get("host");
      req.body.imagePath = url+"/images/" + req.file.filename;
    }
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post.");
      error.statusCode = 404;
      throw error;
    }
    post.title = req.body.title;
    post.content = req.body.content;
    post.imagePath = req.body.imagePath;
    const result = await post.save();
    res.status(200).json({ message: "Post updated!", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

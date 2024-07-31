const jwt = require("jsonwebtoken");


module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    //-----------------If i cant fetch the Authorization header from frontend------------------
    if (!authHeader) {
      return res.status(401).json({ message: "Not Authenticated" });
    }
    const token = authHeader.split(" ")[1]; //Bearer token
    let decodedToken;
    //---------------------Verify the Token------------------------------------

    decodedToken = jwt.verify(token, "MY_ACCESS_SECRET_TOKEN_GENERATED");
    if (!decodedToken) {
      return res.status(401).json({ message: "Not Authenticated" });
    }
    req.accessToken = token;
    req.student_id = decodedToken.studentId;
    next();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
};

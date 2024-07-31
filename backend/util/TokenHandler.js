const jwt = require("jsonwebtoken");

const date = new Date();

const generateAccessToken = async (user) => {
  const accessToken = jwt.sign(
    { email: user.email, userId: user._id },
    "MY_ACCESS_SECRET_TOKEN_GENERATED",
    { expiresIn: "3d" }
  );
  const expiresIn = extractExpiryDate(accessToken);
  return { token: accessToken , expiresIn };
};

const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign(
    { email: user.email, userId: user._id },
    "MY_REFRESH_SECRET_TOKEN_GENERATED",
    { expiresIn: "30d" }
  );
  const expiresIn = extractExpiryDate(refreshToken);
  return { token: refreshToken.token, expiresIn };
};

function extractExpiryDate(jwtToken) {
  try {
    const decodedToken = jwt.decode(jwtToken, { complete: true });

    if (decodedToken && decodedToken.payload && decodedToken.payload.exp) {
      const expiryTimestamp = decodedToken.payload.exp;
      const expiryDate = new Date(expiryTimestamp * 1000); // Convert to milliseconds

      return expiryDate;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
    return err;
  }
  return null;
}

exports.generateRefreshToken = generateRefreshToken;
exports.generateAccessToken = generateAccessToken;

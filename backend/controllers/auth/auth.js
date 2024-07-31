const User = require("../../model/user");
const bycrypt = require("bcryptjs");
const {generateAccessToken} = require("../../util/TokenHandler");

exports.signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bycrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPassword,
    });
    const result = await user.save();

    res.status(201).json({
      message: "User created!",
      userId: result._id,
    });

  } catch (err) {
    if (!err.statusCode) {
      err.message = "Invalid authentication credentials";
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({email: email});
    if (!user) {
      const error = new Error("This user not be found ,Try Sign up");
      error.statusCode = 401;
      throw error;
    }

    if (!bycrypt.compare(password, user.password)) {
      const error = new Error("Wrong Password");
      error.statusCode = 401;
      throw error;
    }
    const { token: accessToken, expiresIn: accessExpiresIn } = await generateAccessToken(user);

    res.status(200).json({
      accessToken,
      expiresIn:3600,
      userId: user._id.toString(),
    });

  }catch (err) {
    if (!err.statusCode) {
      err.message = "Invalid authentication credentials";
      err.statusCode = 500;
    }
    next(err);
  }


}

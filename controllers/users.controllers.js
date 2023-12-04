const bcryptjs = require('bcryptjs');
const userService = require("../services/users.services");
const auth = require("../middlewares/auth");

exports.register = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    const result = await userService.register(user);
    return res.status(200).send({
      message: "Success",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login({ email, password });

    const token = auth.generateAccessToken(user.email);

    return res.status(200).send({
      message: "Success",
      data: { ...user, token },
    });
  } catch (error) {
    return next(error);
  }
};

exports.userProfile = (req, res, next) => {
  return res.status(200).json({ message: "Authorized User!" });
};
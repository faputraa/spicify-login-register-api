const UserModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");

function login({ email, password }, callback) {
  UserModel.getUserByEmail(email, (err, user) => {
    if (err || !user) {
      return callback({ message: "Invalid Email/Password!" });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = auth.generateAccessToken(email);
      return callback(null, { ...user, token });
    } else {
      return callback({ message: "Invalid Email/Password!" });
    }
  });
}

function register(params, callback) {
  if (!params.username) {
    return callback({ message: "Username Required" });
  }

  const user = {
    username: params.username,
    email: params.email,
    password: bcrypt.hashSync(params.password, 10),
    date: new Date().toISOString().slice(0, 19).replace("T", " "),
  };

  UserModel.createUser(user, (err, response) => {
    if (err) {
      return callback(err);
    }
    return callback(null, response);
  });
}

module.exports = {
  login,
  register,
};

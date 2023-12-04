const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "Snippet_SecretKey", (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.data; // Assuming 'data' field holds the user email
    next();
  });
}

function generateAccessToken(email) {
  return jwt.sign({ data: email }, "Snippet_SecretKey", {
    expiresIn: "1h"
  });
}

module.exports = {
  authenticateToken,
  generateAccessToken,
};

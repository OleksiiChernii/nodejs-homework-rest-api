const jsonwebtoken = require("jsonwebtoken");
require("dotenv").config("../.env");

const validateToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const [bearer, token] = authorization.split(" ");
  try {
    if (bearer !== "Bearer") {
      throw Error();
    }
    const { id, email } = jsonwebtoken.verify(token, process.env.SECRET);
    req.user = { id, email };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = validateToken;

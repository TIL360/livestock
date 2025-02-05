const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY; // Assuming you're storing the secret key as an environment variable

module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token.startsWith('Bearer ')) {
      token = token.split(" ")[1];
    }
    const decoded = jwt.verify(token, secretKey);
    req.userData = decoded;
    req.userId = decoded.userid;
  } catch (error) {
    return res.status(401).json({ 
      message: "Auth Failed in Check Auth" 
    });
  }
  next();
};
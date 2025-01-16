const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        /*return res.status(401).json({
            headers: process.env.JWT_KEY,
            token: token,
        });*/
        const decoded = jwt.verify(token, 'BzjG0Wnf8f');
        req.userData = decoded;
         req.userId = decoded.userid; // Store user id for future use
    }catch (error){
        return res.status(401).json({
            message:"Auth Failed in Check Auth"
        });
    }

    next();

};





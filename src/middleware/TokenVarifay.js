var jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    let token = req.headers["token"];
    jwt.verify(token, process.env.SECRATE_PASS, (err, decoded) => {
        if (err) {
            res.status(401).json({ status: "fail", message: "Unauthorized" });
        } else {
            let email = decoded.data;
            req.headers.email = email; 
            next();
        }
    });
};

import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        let token = req.header("Authorization");
        
        if (!token) {
            return res.status(401).json({ msg: "Access denied. No token provided." });
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trim();
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Token has expired. Please login again." });
        }
        res.status(401).json({ msg: "Invalid token." });
    }
};
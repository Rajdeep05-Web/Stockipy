import jwt from 'jsonwebtoken'; // toverify token

const authTokenVerifyMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from header

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded){
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = decoded; 
      next(); 
    } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Unauthorized: Token expired" });
        }
      return res.status(403).json({ error: "Invalid token" });
    }
};

export default authTokenVerifyMiddleware;
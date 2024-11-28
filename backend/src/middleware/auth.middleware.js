import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    //get the jwt token from req.cookies
    const token = req.cookies.jwt;

    //if there not token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provider" });
    }

    //decode the token for verify to JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //if the token is not valid
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    //find the user from database
    const user = await User.findById(decoded.userId).select("-password");

    //if user in not found
    if (!user) {
      return re.status(401).json({ message: "User not found" });
    }

    //if the user is authenticated..the user is the req user
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

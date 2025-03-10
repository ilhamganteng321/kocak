import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protecRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(401).json({message: "Unauthorized"});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({message: "Unauthorized token invalid"});
        }
        
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("error protectRoute", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};
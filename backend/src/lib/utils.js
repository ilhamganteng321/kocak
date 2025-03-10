import jwt from 'jsonwebtoken';

export const generatedToken = (userid, res) => {
    const token = jwt.sign({id: userid}, process.env.JWT_SECRET, {expiresIn: "30d"});

    res.cookie("jwt", token, {maxAge : 7 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV !== "development"});

    return token;
}
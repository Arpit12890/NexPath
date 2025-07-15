//only logged in user can access all features. So, we need to create a middleware to check if user is logged in or not.

import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res,next) => {
    try {
        //get token from cookie
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "User not authenticated"
            });
        }
        //verify token
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decode.userId; //store user id in req object
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            msg: "Failed to authenticate user"
        });
    }
}
export default isAuthenticated; 

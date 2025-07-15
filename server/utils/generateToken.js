//generate token for user
import jwt from 'jsonwebtoken';

export const generateToken = (res, user, message) => {
    const token = jwt.sign({
        userId: user._id
    }, process.env.SECRET_KEY, {
        expiresIn: '1d'
    });
    
    //store token in the cookie
    return res.status(200).cookie('token', token, {
        httpOnly: true, //for more security
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 //1 day
    }).json({ //jb bhi user login krega to message aur user dono return honge
        success: true,
        message,
        user
    });
}
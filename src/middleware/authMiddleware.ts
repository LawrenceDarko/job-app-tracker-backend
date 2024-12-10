import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User, { IUser } from '../models/User';
dotenv.config();

const jwtSecret = process.env.ACCESS_TOKEN_SECRET as string;
const jwtRefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string

interface JwtPayload {
    userId: string;
    username: string;
    exp: any
}

export interface AuthenticatedRequest extends Request {
    user?: IUser | any; // Use the IUser interface here
}



const protect = async(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>  => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }

    // console.log("Token", token)

    try {
        // console.log("Token", token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(decoded.exp * 1000 < Date.now()){
            res.status(401).json({message: 'Token expired'})
            return;
        }

        req.user = await User.findById(decoded.userId).select('-password');
        next()
    } catch (error) {
        console.log(error);
        res.status(403).json('Not authorized, token invalid');
        // res.redirect('http://localhost:3000/auth/login')
    }

    if(!token){
        res.status(401).json('Not authorized, no token')
    }
}

export default protect


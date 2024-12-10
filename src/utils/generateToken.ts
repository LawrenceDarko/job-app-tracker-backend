import jwt from 'jsonwebtoken';

export const generateToken = (userId: any, username: string): string => {
    return jwt.sign({ userId, username }, process.env.JWT_SECRET as string, {
        expiresIn: '1d',
    });
};

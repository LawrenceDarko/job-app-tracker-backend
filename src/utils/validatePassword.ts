import bcrypt from 'bcryptjs';

async function validatePassword(userPassword: string, hashedPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(userPassword, hashedPassword);
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false; // Handle error gracefully, return false or throw an appropriate error
    }
}

export default validatePassword

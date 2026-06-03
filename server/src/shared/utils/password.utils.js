import bcrypt from 'bcryptjs';
export const hashPassword = async (password) => bcrypt.hash(password, 12);
export const comparePassword = async (plain, hashed) => bcrypt.compare(plain, hashed);

import { z } from 'zod';

const passwordSchema = z.string().min(8).regex(/[A-Z]/, 'Need uppercase').regex(/[0-9]/, 'Need number');

export const registerSchema = z.object({
  firstName:       z.string().min(2).max(50).trim(),
  lastName:        z.string().min(2).max(50).trim(),
  email:           z.string().email().toLowerCase().trim(),
  password:        passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

export const loginSchema = z.object({
  email:    z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const refreshTokenSchema     = z.object({ refreshToken: z.string().min(1) });
export const forgotPasswordSchema   = z.object({ email: z.string().email().toLowerCase().trim() });
export const resetPasswordSchema    = z.object({ token: z.string().min(1), password: passwordSchema });
export const changePasswordSchema   = z.object({ currentPassword: z.string().min(1), newPassword: passwordSchema });
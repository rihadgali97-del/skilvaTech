import * as authService from './auth.service.js';
import { sendSuccess, sendCreated } from '../../shared/utils/response.utils.js';

export const register       = async (req, res, next) => { try { sendCreated(res, await authService.register(req.body), 'Registration successful'); } catch(e) { next(e); } };
export const login          = async (req, res, next) => { try { sendSuccess(res, await authService.login(req.body), 'Login successful'); } catch(e) { next(e); } };
export const refresh        = async (req, res, next) => { try { sendSuccess(res, await authService.refreshTokens(req.body.refreshToken)); } catch(e) { next(e); } };
export const logout         = async (req, res, next) => { try { await authService.logout(req.user.id); sendSuccess(res, null, 'Logged out'); } catch(e) { next(e); } };
export const getMe          = async (req, res, next) => { try { sendSuccess(res, { user: await authService.getMe(req.user.id) }); } catch(e) { next(e); } };
export const changePassword = async (req, res, next) => { try { await authService.changePassword(req.user.id, req.body); sendSuccess(res, null, 'Password changed'); } catch(e) { next(e); } };
export const forgotPassword = async (req, res, next) => { try { await authService.forgotPassword(req.body.email); sendSuccess(res, null, 'If that email exists, a reset link has been sent'); } catch(e) { next(e); } };
export const resetPassword  = async (req, res, next) => { try { await authService.resetPassword(req.body); sendSuccess(res, null, 'Password reset successfully'); } catch(e) { next(e); } };

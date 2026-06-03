import * as userService from './user.service.js';
import {
  sendSuccess,
  sendCreated,
  sendPaginated,
  sendNoContent,
} from '../../shared/utils/response.utils.js';

// GET /api/v1/users
export const listUsers = async (req, res, next) => {
  try {
    const result = await userService.listUsers(req.query);
    sendPaginated(res, result);
  } catch (err) { next(err); }
};

// GET /api/v1/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    sendSuccess(res, { user });
  } catch (err) { next(err); }
};

// POST /api/v1/users
export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    sendCreated(res, { user }, 'User created successfully');
  } catch (err) { next(err); }
};

// PATCH /api/v1/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    sendSuccess(res, { user }, 'User updated successfully');
  } catch (err) { next(err); }
};

// PATCH /api/v1/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.roleId, req.user);
    sendSuccess(res, { user }, 'User role updated');
  } catch (err) { next(err); }
};

// PATCH /api/v1/users/:id/activate
export const activateUser = async (req, res, next) => {
  try {
    const user = await userService.setUserActive(req.params.id, true, req.user);
    sendSuccess(res, { user }, 'User activated');
  } catch (err) { next(err); }
};

// PATCH /api/v1/users/:id/deactivate
export const deactivateUser = async (req, res, next) => {
  try {
    const user = await userService.setUserActive(req.params.id, false, req.user);
    sendSuccess(res, { user }, 'User deactivated');
  } catch (err) { next(err); }
};

// DELETE /api/v1/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user);
    sendNoContent(res);
  } catch (err) { next(err); }
};
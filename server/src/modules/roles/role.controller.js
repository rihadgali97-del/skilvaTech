import * as roleService from './role.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/response.utils.js';

// GET /api/v1/roles
export const listRoles = async (req, res, next) => {
  try {
    const roles = await roleService.listRoles();
    sendSuccess(res, { roles });
  } catch (err) { next(err); }
};

// GET /api/v1/roles/:id
export const getRoleById = async (req, res, next) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    sendSuccess(res, { role });
  } catch (err) { next(err); }
};

// POST /api/v1/roles
export const createRole = async (req, res, next) => {
  try {
    const role = await roleService.createRole(req.body);
    sendCreated(res, { role }, 'Role created successfully');
  } catch (err) { next(err); }
};

// PATCH /api/v1/roles/:id
export const updateRole = async (req, res, next) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    sendSuccess(res, { role }, 'Role updated successfully');
  } catch (err) { next(err); }
};

// DELETE /api/v1/roles/:id
export const deleteRole = async (req, res, next) => {
  try {
    await roleService.deleteRole(req.params.id);
    sendNoContent(res);
  } catch (err) { next(err); }
};

// PUT /api/v1/roles/:id/permissions
export const assignPermissions = async (req, res, next) => {
  try {
    const role = await roleService.assignPermissions(req.params.id, req.body.permissionIds);
    sendSuccess(res, { role }, 'Permissions assigned successfully');
  } catch (err) { next(err); }
};
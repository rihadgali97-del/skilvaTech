// project.controller.js
import * as projectService from './project.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listProjects   = async (req, res, next) => { try { sendPaginated(res, await projectService.listProjects(req.query));                                    } catch(e){ next(e); }};
export const getProjectById = async (req, res, next) => { try { sendSuccess(res, { project: await projectService.getProjectById(req.params.id) });                    } catch(e){ next(e); }};
export const createProject  = async (req, res, next) => { try { sendCreated(res, { project: await projectService.createProject(req.body) }, 'Project created');       } catch(e){ next(e); }};
export const updateProject  = async (req, res, next) => { try { sendSuccess(res, { project: await projectService.updateProject(req.params.id, req.body) }, 'Updated');} catch(e){ next(e); }};
export const deleteProject  = async (req, res, next) => { try { await projectService.deleteProject(req.params.id); sendNoContent(res);                               } catch(e){ next(e); }};
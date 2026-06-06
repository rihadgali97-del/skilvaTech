import * as courseService from './course.service.js';
import { sendSuccess, sendCreated, sendPaginated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listCourses   = async (req, res, next) => { try { sendPaginated(res, await courseService.listCourses(req.query));                                } catch(e){ next(e); }};
export const getCourseById = async (req, res, next) => { try { sendSuccess(res, { course: await courseService.getCourseById(req.params.id) });                 } catch(e){ next(e); }};
export const createCourse  = async (req, res, next) => { try { sendCreated(res, { course: await courseService.createCourse(req.body) }, 'Course created');     } catch(e){ next(e); }};
export const updateCourse  = async (req, res, next) => { try { sendSuccess(res, { course: await courseService.updateCourse(req.params.id, req.body) }, 'Course updated'); } catch(e){ next(e); }};
export const deleteCourse  = async (req, res, next) => { try { await courseService.deleteCourse(req.params.id); sendNoContent(res);                            } catch(e){ next(e); }};
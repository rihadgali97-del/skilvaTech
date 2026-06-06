import * as lessonService from './lesson.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listLessons   = async (req, res, next) => { try { sendSuccess(res, { lessons: await lessonService.listLessons(req.params.courseId) });                                      } catch(e){ next(e); }};
export const getLessonById = async (req, res, next) => { try { sendSuccess(res, { lesson: await lessonService.getLessonById(req.params.id) });                                           } catch(e){ next(e); }};
export const createLesson  = async (req, res, next) => { try { sendCreated(res, { lesson: await lessonService.createLesson(req.params.courseId, req.body) }, 'Lesson created');          } catch(e){ next(e); }};
export const updateLesson  = async (req, res, next) => { try { sendSuccess(res, { lesson: await lessonService.updateLesson(req.params.id, req.body) }, 'Lesson updated');                } catch(e){ next(e); }};
export const deleteLesson  = async (req, res, next) => { try { await lessonService.deleteLesson(req.params.id); sendNoContent(res);                                                      } catch(e){ next(e); }};
import * as lessonRepo from './lesson.repository.js';
import { findCourseById } from '../courses/course.repository.js';
import { NotFoundError, ConflictError } from '../../shared/errors/AppError.js';
import { generateSlug } from '../../shared/utils/formatters.js';

export const listLessons = async (courseId) => {
  const course = await findCourseById(courseId);
  if (!course) throw new NotFoundError('Course');
  return lessonRepo.findLessonsByCourse(courseId);
};

export const getLessonById = async (id) => {
  const lesson = await lessonRepo.findLessonById(id);
  if (!lesson) throw new NotFoundError('Lesson');
  return lesson;
};

export const createLesson = async (courseId, data) => {
  const course = await findCourseById(courseId);
  if (!course) throw new NotFoundError('Course');

  const slug = data.slug || generateSlug(data.title);
  const slugExists = await lessonRepo.findLessonBySlug(courseId, slug);
  if (slugExists) throw new ConflictError(`Slug "${slug}" already used in this course`);

  return lessonRepo.createLesson({ ...data, slug, courseId });
};

export const updateLesson = async (id, data) => {
  const lesson = await lessonRepo.findLessonById(id);
  if (!lesson) throw new NotFoundError('Lesson');

  if (data.slug && data.slug !== lesson.slug) {
    const slugExists = await lessonRepo.findLessonBySlug(lesson.courseId, data.slug);
    if (slugExists) throw new ConflictError(`Slug "${data.slug}" already used in this course`);
  }

  return lessonRepo.updateLesson(id, data);
};

export const deleteLesson = async (id) => {
  const lesson = await lessonRepo.findLessonById(id);
  if (!lesson) throw new NotFoundError('Lesson');
  await lessonRepo.deleteLesson(id);
};
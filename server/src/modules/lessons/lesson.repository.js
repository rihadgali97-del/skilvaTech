import prisma from '../../config/db.js';

const lessonSelect = {
  id: true, title: true, slug: true, content: true,
  videoUrl: true, duration: true, order: true,
  isPublished: true, isFree: true,
  courseId: true, createdAt: true, updatedAt: true,
};

export const findLessonsByCourse = (courseId) =>
  prisma.lesson.findMany({
    where: { courseId },
    select: lessonSelect,
    orderBy: { order: 'asc' },
  });

export const findLessonById = (id) =>
  prisma.lesson.findUnique({ where: { id }, select: lessonSelect });

export const findLessonBySlug = (courseId, slug) =>
  prisma.lesson.findUnique({ where: { courseId_slug: { courseId, slug } } });

export const createLesson = (data) =>
  prisma.lesson.create({ data, select: lessonSelect });

export const updateLesson = (id, data) =>
  prisma.lesson.update({ where: { id }, data, select: lessonSelect });

export const deleteLesson = (id) =>
  prisma.lesson.delete({ where: { id } });
import prisma from '../../config/db.js';

const courseSelect = {
  id: true, title: true, slug: true, description: true,
  thumbnail: true, price: true, level: true, isPublished: true,
  isFeatured: true, duration: true, order: true,
  createdAt: true, updatedAt: true,
  instructor: { select: { id: true, firstName: true, lastName: true, email: true } },
  _count: { select: { lessons: true, enrollments: true } },
};

export const findCourses = ({ skip, take, where, orderBy }) =>
  prisma.course.findMany({ skip, take, where, orderBy, select: courseSelect });

export const countCourses = (where) =>
  prisma.course.count({ where });

export const findCourseById = (id) =>
  prisma.course.findUnique({
    where: { id },
    select: {
      ...courseSelect,
      content: true,
      lessons: {
        orderBy: { order: 'asc' },
        select: { id: true, title: true, slug: true, order: true, duration: true, isPublished: true, isFree: true },
      },
    },
  });

export const findCourseBySlug = (slug) =>
  prisma.course.findUnique({ where: { slug } });

export const createCourse = (data) =>
  prisma.course.create({ data, select: courseSelect });

export const updateCourse = (id, data) =>
  prisma.course.update({ where: { id }, data, select: courseSelect });

export const deleteCourse = (id) =>
  prisma.course.delete({ where: { id } });
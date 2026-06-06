// enrollment.repository.js
import prisma from '../../config/db.js';

const enrollmentSelect = {
  id: true, status: true, progress: true, completedAt: true,
  createdAt: true, updatedAt: true,
  student: { select: { id: true, firstName: true, lastName: true, email: true } },
  course:  { select: { id: true, title: true, slug: true, thumbnail: true } },
};

export const findEnrollments = ({ skip, take, where, orderBy }) =>
  prisma.enrollment.findMany({ skip, take, where, orderBy, select: enrollmentSelect });

export const countEnrollments = (where) =>
  prisma.enrollment.count({ where });

export const findEnrollmentById = (id) =>
  prisma.enrollment.findUnique({ where: { id }, select: enrollmentSelect });

export const findEnrollmentByStudentAndCourse = (studentId, courseId) =>
  prisma.enrollment.findUnique({ where: { studentId_courseId: { studentId, courseId } } });

export const createEnrollment = (data) =>
  prisma.enrollment.create({ data, select: enrollmentSelect });

export const updateEnrollment = (id, data) =>
  prisma.enrollment.update({ where: { id }, data, select: enrollmentSelect });

export const deleteEnrollment = (id) =>
  prisma.enrollment.delete({ where: { id } });
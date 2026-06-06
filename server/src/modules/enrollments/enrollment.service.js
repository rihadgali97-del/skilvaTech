import * as enrollmentRepo from './enrollment.repository.js';
import { findCourseById } from '../courses/course.repository.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';
import prisma from '../../config/db.js';

export const listEnrollments = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'status', 'progress']);

  const where = {};
  if (query.studentId) where.studentId = query.studentId;
  if (query.courseId)  where.courseId  = query.courseId;
  if (query.status)    where.status    = query.status;

  const [data, total] = await Promise.all([
    enrollmentRepo.findEnrollments({ skip, take: limit, where, orderBy }),
    enrollmentRepo.countEnrollments(where),
  ]);

  return { data, total, page, limit };
};

export const enrollStudent = async ({ studentId, courseId }) => {
  // Verify course exists and is published
  const course = await findCourseById(courseId);
  if (!course) throw new NotFoundError('Course');
  if (!course.isPublished) throw new BadRequestError('Course is not published');

  // Verify student exists
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  if (!student) throw new NotFoundError('Student');

  // Check already enrolled
  const existing = await enrollmentRepo.findEnrollmentByStudentAndCourse(studentId, courseId);
  if (existing) throw new ConflictError('Student already enrolled in this course');

  return enrollmentRepo.createEnrollment({ studentId, courseId });
};

export const updateProgress = async (id, { progress, status }) => {
  const enrollment = await enrollmentRepo.findEnrollmentById(id);
  if (!enrollment) throw new NotFoundError('Enrollment');

  const data = {};
  if (progress !== undefined) {
    if (progress < 0 || progress > 100) throw new BadRequestError('Progress must be between 0 and 100');
    data.progress = progress;
    if (progress === 100) { data.status = 'completed'; data.completedAt = new Date(); }
  }
  if (status) data.status = status;

  return enrollmentRepo.updateEnrollment(id, data);
};

export const cancelEnrollment = async (id) => {
  const enrollment = await enrollmentRepo.findEnrollmentById(id);
  if (!enrollment) throw new NotFoundError('Enrollment');
  return enrollmentRepo.updateEnrollment(id, { status: 'cancelled' });
};
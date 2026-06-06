import * as courseRepo from './course.repository.js';
import { NotFoundError, ConflictError } from '../../shared/errors/AppError.js';
import { parsePagination, parseSort } from '../../shared/utils/pagination.utils.js';
import { generateSlug } from '../../shared/utils/formatters.js';
import prisma from '../../config/db.js';

export const listCourses = async (query = {}) => {
  const { page, limit, skip } = parsePagination(query);
  const orderBy = parseSort(query, ['createdAt', 'title', 'price', 'order']);

  const where = {};
  if (query.search) {
    where.OR = [
      { title:       { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }
  if (query.level)                  where.level       = query.level;
  if (query.instructorId)           where.instructorId = query.instructorId;
  if (query.isPublished !== undefined) where.isPublished = query.isPublished === 'true';
  if (query.isFeatured  !== undefined) where.isFeatured  = query.isFeatured  === 'true';

  const [data, total] = await Promise.all([
    courseRepo.findCourses({ skip, take: limit, where, orderBy }),
    courseRepo.countCourses(where),
  ]);

  return { data: data.map(formatCourse), total, page, limit };
};

export const getCourseById = async (id) => {
  const course = await courseRepo.findCourseById(id);
  if (!course) throw new NotFoundError('Course');
  return formatCourse(course);
};

export const createCourse = async (data) => {
  const slug = data.slug || generateSlug(data.title);

  // Verify instructor exists
  const instructor = await prisma.user.findUnique({ where: { id: data.instructorId } });
  if (!instructor) throw new NotFoundError('Instructor');

  const slugExists = await courseRepo.findCourseBySlug(slug);
  if (slugExists) throw new ConflictError(`Slug "${slug}" already in use`);

  const course = await courseRepo.createCourse({ ...data, slug });
  return formatCourse(course);
};

export const updateCourse = async (id, data) => {
  const existing = await courseRepo.findCourseById(id);
  if (!existing) throw new NotFoundError('Course');

  if (data.slug && data.slug !== existing.slug) {
    const slugExists = await courseRepo.findCourseBySlug(data.slug);
    if (slugExists) throw new ConflictError(`Slug "${data.slug}" already in use`);
  }

  if (data.instructorId && data.instructorId !== existing.instructor?.id) {
    const instructor = await prisma.user.findUnique({ where: { id: data.instructorId } });
    if (!instructor) throw new NotFoundError('Instructor');
  }

  const course = await courseRepo.updateCourse(id, data);
  return formatCourse(course);
};

export const deleteCourse = async (id) => {
  const course = await courseRepo.findCourseById(id);
  if (!course) throw new NotFoundError('Course');
  await courseRepo.deleteCourse(id);
};

const formatCourse = (course) => ({
  ...course,
  lessonCount:     course._count?.lessons     ?? 0,
  enrollmentCount: course._count?.enrollments ?? 0,
  _count: undefined,
});
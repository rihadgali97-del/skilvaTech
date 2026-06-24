import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/modules/courses/course.repository.js', () => ({
  findCourses:      vi.fn(),
  countCourses:     vi.fn(),
  findCourseById:   vi.fn(),
  findCourseBySlug: vi.fn(),
  createCourse:     vi.fn(),
  updateCourse:     vi.fn(),
  deleteCourse:     vi.fn(),
}));

vi.mock('../../../src/config/db.js', () => ({
  default: {
    user: { findUnique: vi.fn() },
  },
}));

import * as courseRepo from '../../../src/modules/courses/course.repository.js';
import prisma from '../../../src/config/db.js';
import * as courseService from '../../../src/modules/courses/course.service.js';
import { NotFoundError, ConflictError } from '../../../src/shared/errors/AppError.js';

describe('course.service (unit)', () => {

  beforeEach(() => { vi.clearAllMocks(); });

  // ── createCourse ────────────────────────────────────────────────────────────
  describe('createCourse', () => {
    it('creates a course when instructor exists and slug is free', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'instructor-1' });
      courseRepo.findCourseBySlug.mockResolvedValue(null);
      courseRepo.createCourse.mockImplementation((data) =>
        Promise.resolve({ id: 'course-1', ...data, _count: { lessons: 0, enrollments: 0 } })
      );

      const result = await courseService.createCourse({
        title: 'New Course',
        instructorId: 'instructor-1',
        level: 'beginner',
      });

      expect(result.title).toBe('New Course');
      expect(courseRepo.createCourse).toHaveBeenCalledOnce();
    });

    it('auto-generates a slug from the title', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'instructor-1' });
      courseRepo.findCourseBySlug.mockResolvedValue(null);
      courseRepo.createCourse.mockImplementation((data) =>
        Promise.resolve({ id: 'c1', ...data, _count: {} })
      );

      const result = await courseService.createCourse({
        title: 'Advanced React Patterns',
        instructorId: 'instructor-1',
      });

      expect(result.slug).toBe('advanced-react-patterns');
    });

    it('throws NotFoundError when instructor does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        courseService.createCourse({ title: 'Orphan Course', instructorId: 'ghost-id' })
      ).rejects.toThrow(NotFoundError);

      expect(courseRepo.createCourse).not.toHaveBeenCalled();
    });

    it('throws ConflictError when slug is already taken', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'instructor-1' });
      courseRepo.findCourseBySlug.mockResolvedValue({ id: 'existing-course' });

      await expect(
        courseService.createCourse({
          title: 'Duplicate', slug: 'taken-slug', instructorId: 'instructor-1',
        })
      ).rejects.toThrow(ConflictError);

      expect(courseRepo.createCourse).not.toHaveBeenCalled();
    });
  });

  // ── updateCourse ────────────────────────────────────────────────────────────
  describe('updateCourse', () => {
    it('throws NotFoundError when course does not exist', async () => {
      courseRepo.findCourseById.mockResolvedValue(null);
      await expect(courseService.updateCourse('missing-id', { title: 'Updated' }))
        .rejects.toThrow(NotFoundError);
    });

    it('updates without touching slug/instructor when neither changes', async () => {
      courseRepo.findCourseById.mockResolvedValue({
        id: 'course-1', title: 'Old', slug: 'old', instructor: { id: 'instructor-1' },
      });
      courseRepo.updateCourse.mockResolvedValue({ id: 'course-1', title: 'New', _count: {} });

      const result = await courseService.updateCourse('course-1', { title: 'New' });

      expect(result.title).toBe('New');
      expect(courseRepo.findCourseBySlug).not.toHaveBeenCalled();
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('throws ConflictError when changing to a taken slug', async () => {
      courseRepo.findCourseById.mockResolvedValue({
        id: 'course-1', slug: 'current', instructor: { id: 'i1' },
      });
      courseRepo.findCourseBySlug.mockResolvedValue({ id: 'other-course' });

      await expect(courseService.updateCourse('course-1', { slug: 'taken' }))
        .rejects.toThrow(ConflictError);
      expect(courseRepo.updateCourse).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when reassigning to a non-existent instructor', async () => {
      courseRepo.findCourseById.mockResolvedValue({
        id: 'course-1', slug: 'slug', instructor: { id: 'instructor-1' },
      });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        courseService.updateCourse('course-1', { instructorId: 'ghost-instructor' })
      ).rejects.toThrow(NotFoundError);
      expect(courseRepo.updateCourse).not.toHaveBeenCalled();
    });
  });

  // ── deleteCourse ────────────────────────────────────────────────────────────
  describe('deleteCourse', () => {
    it('throws NotFoundError when course does not exist', async () => {
      courseRepo.findCourseById.mockResolvedValue(null);
      await expect(courseService.deleteCourse('missing-id')).rejects.toThrow(NotFoundError);
      expect(courseRepo.deleteCourse).not.toHaveBeenCalled();
    });

    it('deletes the course when it exists', async () => {
      courseRepo.findCourseById.mockResolvedValue({ id: 'course-1' });
      courseRepo.deleteCourse.mockResolvedValue(undefined);

      await courseService.deleteCourse('course-1');
      expect(courseRepo.deleteCourse).toHaveBeenCalledWith('course-1');
    });
  });

  // ── listCourses ─────────────────────────────────────────────────────────────
  describe('listCourses', () => {
    it('shapes the result with lessonCount and enrollmentCount', async () => {
      courseRepo.findCourses.mockResolvedValue([
        { id: 'c1', _count: { lessons: 3, enrollments: 10 } },
      ]);
      courseRepo.countCourses.mockResolvedValue(1);

      const result = await courseService.listCourses({});
      expect(result.data[0].lessonCount).toBe(3);
      expect(result.data[0].enrollmentCount).toBe(10);
      expect(result.data[0]._count).toBeUndefined();
    });

    it('filters by isPublished when provided', async () => {
      courseRepo.findCourses.mockResolvedValue([]);
      courseRepo.countCourses.mockResolvedValue(0);

      await courseService.listCourses({ isPublished: 'true' });
      const where = courseRepo.findCourses.mock.calls[0][0].where;
      expect(where.isPublished).toBe(true);
    });

    it('filters by isFeatured when provided', async () => {
      courseRepo.findCourses.mockResolvedValue([]);
      courseRepo.countCourses.mockResolvedValue(0);

      await courseService.listCourses({ isFeatured: 'false' });
      const where = courseRepo.findCourses.mock.calls[0][0].where;
      expect(where.isFeatured).toBe(false);
    });

    it('does not apply isPublished/isFeatured filters when omitted', async () => {
      courseRepo.findCourses.mockResolvedValue([]);
      courseRepo.countCourses.mockResolvedValue(0);

      await courseService.listCourses({});
      const where = courseRepo.findCourses.mock.calls[0][0].where;
      expect(where.isPublished).toBeUndefined();
      expect(where.isFeatured).toBeUndefined();
    });

    it('builds a case-insensitive OR search across title and description', async () => {
      courseRepo.findCourses.mockResolvedValue([]);
      courseRepo.countCourses.mockResolvedValue(0);

      await courseService.listCourses({ search: 'react' });
      const where = courseRepo.findCourses.mock.calls[0][0].where;
      expect(where.OR).toEqual([
        { title:       { contains: 'react', mode: 'insensitive' } },
        { description: { contains: 'react', mode: 'insensitive' } },
      ]);
    });
  });

  // ── getCourseById ───────────────────────────────────────────────────────────
  describe('getCourseById', () => {
    it('throws NotFoundError when course does not exist', async () => {
      courseRepo.findCourseById.mockResolvedValue(null);
      await expect(courseService.getCourseById('missing-id')).rejects.toThrow(NotFoundError);
    });

    it('returns formatted course with counts when found', async () => {
      courseRepo.findCourseById.mockResolvedValue({
        id: 'course-1', title: 'Found Course', _count: { lessons: 5, enrollments: 2 },
      });

      const result = await courseService.getCourseById('course-1');
      expect(result.title).toBe('Found Course');
      expect(result.lessonCount).toBe(5);
      expect(result._count).toBeUndefined();
    });
  });
});
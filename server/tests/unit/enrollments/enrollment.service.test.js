import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/modules/enrollments/enrollment.repository.js', () => ({
  findEnrollments:                  vi.fn(),
  countEnrollments:                 vi.fn(),
  findEnrollmentById:               vi.fn(),
  findEnrollmentByStudentAndCourse: vi.fn(),
  createEnrollment:                 vi.fn(),
  updateEnrollment:                 vi.fn(),
  deleteEnrollment:                 vi.fn(),
}));

vi.mock('../../../src/modules/courses/course.repository.js', () => ({
  findCourseById: vi.fn(),
}));

vi.mock('../../../src/config/db.js', () => ({
  default: { user: { findUnique: vi.fn() } },
}));

import * as enrollmentRepo from '../../../src/modules/enrollments/enrollment.repository.js';
import * as courseRepo from '../../../src/modules/courses/course.repository.js';
import prisma from '../../../src/config/db.js';
import * as enrollmentService from '../../../src/modules/enrollments/enrollment.service.js';
import { NotFoundError, ConflictError, BadRequestError } from '../../../src/shared/errors/AppError.js';

describe('enrollment.service (unit)', () => {

  beforeEach(() => { vi.clearAllMocks(); });

  describe('enrollStudent', () => {
    it('enrolls a student in a published course', async () => {
      courseRepo.findCourseById.mockResolvedValue({ id: 'c1', isPublished: true });
      prisma.user.findUnique.mockResolvedValue({ id: 's1' });
      enrollmentRepo.findEnrollmentByStudentAndCourse.mockResolvedValue(null);
      enrollmentRepo.createEnrollment.mockResolvedValue({
        id: 'e1', studentId: 's1', courseId: 'c1', status: 'active', progress: 0,
      });

      const result = await enrollmentService.enrollStudent({ studentId: 's1', courseId: 'c1' });

      expect(result.status).toBe('active');
      expect(result.progress).toBe(0);
      expect(enrollmentRepo.createEnrollment).toHaveBeenCalledOnce();
    });

    it('throws NotFoundError when course does not exist', async () => {
      courseRepo.findCourseById.mockResolvedValue(null);

      await expect(
        enrollmentService.enrollStudent({ studentId: 's1', courseId: 'ghost' })
      ).rejects.toThrow(NotFoundError);

      expect(enrollmentRepo.createEnrollment).not.toHaveBeenCalled();
    });

    it('throws BadRequestError when course is not published', async () => {
      courseRepo.findCourseById.mockResolvedValue({ id: 'c1', isPublished: false });

      await expect(
        enrollmentService.enrollStudent({ studentId: 's1', courseId: 'c1' })
      ).rejects.toThrow(BadRequestError);

      expect(enrollmentRepo.createEnrollment).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when student does not exist', async () => {
      courseRepo.findCourseById.mockResolvedValue({ id: 'c1', isPublished: true });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        enrollmentService.enrollStudent({ studentId: 'ghost', courseId: 'c1' })
      ).rejects.toThrow(NotFoundError);
    });

    it('throws ConflictError when student is already enrolled', async () => {
      courseRepo.findCourseById.mockResolvedValue({ id: 'c1', isPublished: true });
      prisma.user.findUnique.mockResolvedValue({ id: 's1' });
      enrollmentRepo.findEnrollmentByStudentAndCourse.mockResolvedValue({ id: 'existing' });

      await expect(
        enrollmentService.enrollStudent({ studentId: 's1', courseId: 'c1' })
      ).rejects.toThrow(ConflictError);

      expect(enrollmentRepo.createEnrollment).not.toHaveBeenCalled();
    });
  });

  describe('updateProgress', () => {
    it('updates progress and keeps status active when below 100', async () => {
      enrollmentRepo.findEnrollmentById.mockResolvedValue({ id: 'e1', status: 'active', progress: 0 });
      enrollmentRepo.updateEnrollment.mockImplementation((id, data) =>
        Promise.resolve({ id, ...data })
      );

      const result = await enrollmentService.updateProgress('e1', { progress: 60 });

      expect(result.progress).toBe(60);
      expect(result.status).toBeUndefined(); // not forced to completed
    });

    it('auto-completes when progress reaches 100', async () => {
      enrollmentRepo.findEnrollmentById.mockResolvedValue({ id: 'e1', status: 'active', progress: 80 });
      enrollmentRepo.updateEnrollment.mockImplementation((id, data) =>
        Promise.resolve({ id, ...data })
      );

      const result = await enrollmentService.updateProgress('e1', { progress: 100 });

      expect(result.progress).toBe(100);
      expect(result.status).toBe('completed');
      expect(result.completedAt).toBeDefined();
    });

    it('throws BadRequestError when progress is out of range', async () => {
      enrollmentRepo.findEnrollmentById.mockResolvedValue({ id: 'e1' });

      await expect(enrollmentService.updateProgress('e1', { progress: 150 }))
        .rejects.toThrow(BadRequestError);
      await expect(enrollmentService.updateProgress('e1', { progress: -10 }))
        .rejects.toThrow(BadRequestError);
    });

    it('throws NotFoundError when enrollment does not exist', async () => {
      enrollmentRepo.findEnrollmentById.mockResolvedValue(null);

      await expect(enrollmentService.updateProgress('missing', { progress: 50 }))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('cancelEnrollment', () => {
    it('cancels an active enrollment', async () => {
      enrollmentRepo.findEnrollmentById.mockResolvedValue({ id: 'e1', status: 'active' });
      enrollmentRepo.updateEnrollment.mockResolvedValue({ id: 'e1', status: 'cancelled' });

      const result = await enrollmentService.cancelEnrollment('e1');
      expect(result.status).toBe('cancelled');
    });

    it('throws NotFoundError when enrollment does not exist', async () => {
      enrollmentRepo.findEnrollmentById.mockResolvedValue(null);

      await expect(enrollmentService.cancelEnrollment('missing'))
        .rejects.toThrow(NotFoundError);
    });
  });
});
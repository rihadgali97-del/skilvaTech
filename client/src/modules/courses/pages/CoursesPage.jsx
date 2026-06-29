import { useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import { useUsers } from '../../users/hooks/useUsers';
import { courseApi } from '../api/courseApi';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import {
  Badge, Button, SearchInput, Select,
  FormField, Input, Textarea, ConfirmDialog,
} from '../../../shared/components/ui/index';

const levelColor = { beginner: 'green', intermediate: 'yellow', advanced: 'red' };
const emptyLesson = { title: '', content: '', videoUrl: '', duration: '', order: 0, isPublished: false, isFree: false };
const emptyCourseForm = { title: '', description: '', instructorId: '', level: 'beginner', price: '', isPublished: false, isFeatured: false, duration: '', order: 0 };

const CoursesPage = () => {
  const {
    courses, loading, error, pagination,
    page, setPage, search, setSearch,
    levelFilter, setLevelFilter,
    createCourse, updateCourse, deleteCourse,
  } = useCourses();

  const { users } = useUsers();
  const instructors = users.filter((u) => ['instructor', 'admin', 'super_admin'].includes(u.role?.name));

  // ── Course modal state ──────────────────────────────────────────────────────
  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');
  const [form, setForm]                 = useState(emptyCourseForm);

  // ── Lessons modal state ─────────────────────────────────────────────────────
  const [lessonsTarget, setLessonsTarget]   = useState(null);
  const [lessons, setLessons]               = useState([]);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editLesson, setEditLesson]         = useState(null);
  const [lessonForm, setLessonForm]         = useState(emptyLesson);
  const [lessonSubmitting, setLessonSubmitting] = useState(false);

  const set       = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const setLesson = (k) => (e) => setLessonForm((p) => ({ ...p, [k]: e.target.value }));

  // ── Course handlers ─────────────────────────────────────────────────────────
  const handleOpenEdit = (course) => {
    setEditTarget(course);
    setForm({
      title:        course.title,
      description:  course.description || '',
      instructorId: course.instructor?.id || '',
      level:        course.level,
      price:        course.price || '',
      isPublished:  course.isPublished,
      isFeatured:   course.isFeatured,
      duration:     course.duration || '',
      order:        course.order,
    });
  };

  const handleCloseCourseModal = () => {
    setCreateOpen(false);
    setEditTarget(null);
    setForm(emptyCourseForm);
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())       { setFormError('Title is required');      return; }
    if (!form.instructorId)       { setFormError('Instructor is required'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price:    form.price    ? parseFloat(form.price)  : undefined,
        duration: form.duration ? parseInt(form.duration) : undefined,
      };
      if (editTarget) { await updateCourse(editTarget.id, payload); }
      else            { await createCourse(payload); }
      handleCloseCourseModal();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Something went wrong');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try   { await deleteCourse(deleteTarget.id); setDeleteTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setDeleting(false); }
  };

  // ── Lesson handlers ─────────────────────────────────────────────────────────
  const openLessonsModal = async (course) => {
    setLessonsTarget(course);
    setLessons(course.lessons || []);
    try {
      const { data } = await courseApi.listLessons(course.id);
      setLessons(data.data.lessons);
    } catch (_) {}
  };

  const refreshLessons = async () => {
    if (!lessonsTarget) return;
    const { data } = await courseApi.listLessons(lessonsTarget.id);
    setLessons(data.data.lessons);
  };

  const handleOpenAddLesson = () => {
    setEditLesson(null);
    setLessonForm(emptyLesson);
    setLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson) => {
    setEditLesson(lesson);
    setLessonForm({
      title:       lesson.title,
      content:     lesson.content || '',
      videoUrl:    lesson.videoUrl || '',
      duration:    lesson.duration || '',
      order:       lesson.order,
      isPublished: lesson.isPublished,
      isFree:      lesson.isFree,
    });
    setLessonModalOpen(true);
  };

  const handleCloseLessonModal = () => {
    setLessonModalOpen(false);
    setEditLesson(null);
    setLessonForm(emptyLesson);
  };

  const handleSubmitLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;
    setLessonSubmitting(true);
    try {
      const payload = {
        ...lessonForm,
        duration: lessonForm.duration ? parseInt(lessonForm.duration) : undefined,
        order:    Number(lessonForm.order) || 0,
      };
      if (editLesson) {
        await courseApi.updateLesson(lessonsTarget.id, editLesson.id, payload);
      } else {
        await courseApi.createLesson(lessonsTarget.id, payload);
      }
      handleCloseLessonModal();
      await refreshLessons();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to save lesson');
    } finally { setLessonSubmitting(false); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await courseApi.deleteLesson(lessonsTarget.id, lessonId);
      await refreshLessons();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
  };

  // ── Table columns ───────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'title', label: 'Course',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnail
            ? <img src={row.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            : <div className="w-10 h-10 rounded-lg bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-[#00b3b3] text-lg flex-shrink-0">◷</div>
          }
          <div>
            <p className="font-medium text-gray-900">{row.title}</p>
            <p className="text-xs text-gray-500">{row.lessonCount || 0} lessons · {row.enrollmentCount || 0} enrolled</p>
          </div>
        </div>
      ),
    },
    {
      key: 'instructor', label: 'Instructor',
      render: (row) => <span className="text-gray-600 text-sm">{row.instructor?.firstName} {row.instructor?.lastName}</span>,
    },
    { key: 'level', label: 'Level', render: (row) => <Badge color={levelColor[row.level]}>{row.level}</Badge> },
    {
      key: 'price', label: 'Price',
      render: (row) => <span className="text-gray-700 font-medium">{row.price ? `$${parseFloat(row.price).toFixed(2)}` : 'Free'}</span>,
    },
    {
      key: 'status', label: 'Status',
      render: (row) => (
        <div className="flex gap-1.5">
          <Badge color={row.isPublished ? 'teal' : 'gray'}>{row.isPublished ? 'Published' : 'Draft'}</Badge>
          {row.isFeatured && <Badge color="yellow">Featured</Badge>}
        </div>
      ),
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline"   onClick={() => openLessonsModal(row)}>Lessons</Button>
          <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="danger"    onClick={() => setDeleteTarget(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total courses</p>
        </div>
        <Button onClick={() => { setForm(emptyCourseForm); setCreateOpen(true); }}>+ New Course</Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search courses..." />
        </div>
        <Select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="w-40">
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </Select>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      <Table columns={columns} data={courses} loading={loading} emptyMessage="No courses found" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Create / Edit Course Modal ── */}
      <Modal
        isOpen={createOpen || !!editTarget}
        onClose={handleCloseCourseModal}
        title={editTarget ? 'Edit Course' : 'Create Course'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{formError}</div>
          )}
          <FormField label="Title" required>
            <Input value={form.title} onChange={set('title')} placeholder="Course title" />
          </FormField>
          <FormField label="Description">
            <Textarea rows={3} value={form.description} onChange={set('description')} placeholder="What will students learn?" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Instructor" required>
              <Select value={form.instructorId} onChange={set('instructorId')}>
                <option value="">Select instructor</option>
                {instructors.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
              </Select>
            </FormField>
            <FormField label="Level">
              <Select value={form.level} onChange={set('level')}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Price (USD)">
              <Input type="number" step="0.01" value={form.price} onChange={set('price')} placeholder="0.00" />
            </FormField>
            <FormField label="Duration (min)">
              <Input type="number" value={form.duration} onChange={set('duration')} placeholder="e.g. 120" />
            </FormField>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
              Featured
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleCloseCourseModal}>Cancel</Button>
            <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Course'}</Button>
          </div>
        </form>
      </Modal>

      {/* ── Lessons Modal ── */}
      <Modal
        isOpen={!!lessonsTarget}
        onClose={() => { setLessonsTarget(null); setLessons([]); }}
        title="Manage Lessons"
        size="lg"
      >
        {lessonsTarget && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900 font-semibold">{lessonsTarget.title}</h3>
              <Button size="sm" onClick={handleOpenAddLesson}>+ Add Lesson</Button>
            </div>

            {lessons.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No lessons yet. Add your first lesson.</p>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-gray-400 text-xs w-6">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                      <p className="text-xs text-gray-500">{lesson.duration ? `${lesson.duration} min` : 'No duration'}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {lesson.isFree      && <Badge color="green">Free</Badge>}
                      {lesson.isPublished && <Badge color="teal">Live</Badge>}
                      <Button size="sm" variant="ghost"  onClick={() => handleOpenEditLesson(lesson)}>✏️</Button>
                      <Button size="sm" variant="danger" onClick={() => handleDeleteLesson(lesson.id)}>🗑</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ── Add / Edit Lesson Modal ── */}
      <Modal
        isOpen={lessonModalOpen}
        onClose={handleCloseLessonModal}
        title={editLesson ? 'Edit Lesson' : 'Add Lesson'}
      >
        <form onSubmit={handleSubmitLesson} className="space-y-4">
          <FormField label="Title" required>
            <Input value={lessonForm.title} onChange={setLesson('title')} placeholder="Lesson title" />
          </FormField>
          <FormField label="Video URL">
            <Input value={lessonForm.videoUrl} onChange={setLesson('videoUrl')} placeholder="https://..." />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Duration (min)">
              <Input type="number" value={lessonForm.duration} onChange={setLesson('duration')} />
            </FormField>
            <FormField label="Order">
              <Input type="number" value={lessonForm.order} onChange={(e) => setLessonForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
            </FormField>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={lessonForm.isPublished} onChange={(e) => setLessonForm((p) => ({ ...p, isPublished: e.target.checked }))} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={lessonForm.isFree} onChange={(e) => setLessonForm((p) => ({ ...p, isFree: e.target.checked }))} />
              Free preview
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={handleCloseLessonModal}>Cancel</Button>
            <Button type="submit" loading={lessonSubmitting}>{editLesson ? 'Save' : 'Add Lesson'}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete} loading={deleting}
        title="Delete Course" message={`Delete "${deleteTarget?.title}"? All lessons will be deleted too.`}
      />
    </div>
  );
};

export default CoursesPage;
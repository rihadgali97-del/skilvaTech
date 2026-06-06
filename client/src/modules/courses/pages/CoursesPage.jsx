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

// ─── Level badge colors ───────────────────────────────────────────────────────
const levelColor = { beginner: 'green', intermediate: 'yellow', advanced: 'red' };

// ─── Lesson Manager ───────────────────────────────────────────────────────────
const LessonManager = ({ course, onClose }) => {
  const [lessons, setLessons]     = useState(course.lessons || []);
  const [addOpen, setAddOpen]     = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const emptyLesson = { title: '', content: '', videoUrl: '', duration: '', order: 0, isPublished: false, isFree: false };
  const [form, setForm] = useState(emptyLesson);

  const refreshLessons = async () => {
    const { data } = await courseApi.listLessons(course.id);
    setLessons(data.data.lessons);
  };

  const handleSubmitLesson = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      if (editLesson) {
        await courseApi.updateLesson(course.id, editLesson.id, form);
        setEditLesson(null);
      } else {
        await courseApi.createLesson(course.id, form);
        setAddOpen(false);
      }
      setForm(emptyLesson);
      await refreshLessons();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Delete this lesson?')) return;
    try {
      await courseApi.deleteLesson(course.id, lessonId);
      await refreshLessons();
    } catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
  };

  const LessonForm = () => (
    <form onSubmit={handleSubmitLesson} className="space-y-4">
      <FormField label="Title" required>
        <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Lesson title" />
      </FormField>
      <FormField label="Video URL">
        <Input value={form.videoUrl} onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="https://..." />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Duration (min)">
          <Input type="number" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} />
        </FormField>
        <FormField label="Order">
          <Input type="number" value={form.order} onChange={(e) => setForm((p) => ({ ...p, order: parseInt(e.target.value) || 0 }))} />
        </FormField>
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
          <input type="checkbox" checked={form.isFree} onChange={(e) => setForm((p) => ({ ...p, isFree: e.target.checked }))} />
          Free preview
        </label>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={() => { setAddOpen(false); setEditLesson(null); setForm(emptyLesson); }}>Cancel</Button>
        <Button type="submit" loading={submitting}>{editLesson ? 'Save' : 'Add Lesson'}</Button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">{course.title}</h3>
        <Button size="sm" onClick={() => { setForm(emptyLesson); setAddOpen(true); }}>+ Add Lesson</Button>
      </div>

      {lessons.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-6">No lessons yet. Add your first lesson.</p>
      ) : (
        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="flex items-center gap-3 p-3 bg-[#0d1117] rounded-xl border border-[#00d4d4]/10">
              <span className="text-slate-500 text-xs w-6">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{lesson.title}</p>
                <p className="text-xs text-slate-500">{lesson.duration ? `${lesson.duration} min` : 'No duration'}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                {lesson.isFree      && <Badge color="green">Free</Badge>}
                {lesson.isPublished && <Badge color="teal">Live</Badge>}
                <Button size="sm" variant="ghost" onClick={() => { setEditLesson(lesson); setForm({ title: lesson.title, content: lesson.content || '', videoUrl: lesson.videoUrl || '', duration: lesson.duration || '', order: lesson.order, isPublished: lesson.isPublished, isFree: lesson.isFree }); }}>✏️</Button>
                <Button size="sm" variant="danger" onClick={() => handleDeleteLesson(lesson.id)}>🗑</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={addOpen || !!editLesson} onClose={() => { setAddOpen(false); setEditLesson(null); setForm(emptyLesson); }} title={editLesson ? 'Edit Lesson' : 'Add Lesson'}>
        <LessonForm />
      </Modal>
    </div>
  );
};

// ─── Courses Page ─────────────────────────────────────────────────────────────
const CoursesPage = () => {
  const {
    courses, loading, error, pagination,
    page, setPage, search, setSearch,
    levelFilter, setLevelFilter,
    createCourse, updateCourse, deleteCourse,
  } = useCourses();

  const { users } = useUsers();
  const instructors = users.filter((u) => ['instructor', 'admin', 'super_admin'].includes(u.role?.name));

  const [createOpen, setCreateOpen]     = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [lessonsTarget, setLessonsTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const [formError, setFormError]       = useState('');

  const emptyForm = { title: '', description: '', instructorId: '', level: 'beginner', price: '', isPublished: false, isFeatured: false, duration: '', order: 0 };
  const [form, setForm] = useState(emptyForm);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim())       { setFormError('Title is required');      return; }
    if (!form.instructorId)       { setFormError('Instructor is required'); return; }
    setSubmitting(true);
    try {
      const payload = { ...form, price: form.price ? parseFloat(form.price) : undefined, duration: form.duration ? parseInt(form.duration) : undefined };
      if (editTarget) { await updateCourse(editTarget.id, payload); setEditTarget(null); }
      else            { await createCourse(payload);                 setCreateOpen(false); }
      setForm(emptyForm); setFormError('');
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

  const columns = [
    {
      key: 'title', label: 'Course',
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.thumbnail
            ? <img src={row.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            : <div className="w-10 h-10 rounded-lg bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-[#00d4d4] text-lg flex-shrink-0">◷</div>
          }
          <div>
            <p className="font-medium text-white">{row.title}</p>
            <p className="text-xs text-slate-500">{row.lessonCount} lessons · {row.enrollmentCount} enrolled</p>
          </div>
        </div>
      ),
    },
    {
      key: 'instructor', label: 'Instructor',
      render: (row) => <span className="text-slate-300 text-sm">{row.instructor?.firstName} {row.instructor?.lastName}</span>,
    },
    {
      key: 'level', label: 'Level',
      render: (row) => <Badge color={levelColor[row.level]}>{row.level}</Badge>,
    },
    {
      key: 'price', label: 'Price',
      render: (row) => <span className="text-slate-300">{row.price ? `$${parseFloat(row.price).toFixed(2)}` : 'Free'}</span>,
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
          <Button size="sm" variant="outline" onClick={() => setLessonsTarget(row)}>Lessons</Button>
          <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>Delete</Button>
        </div>
      ),
    },
  ];

  const CourseForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>}
      <FormField label="Title" required>
        <Input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Course title" />
      </FormField>
      <FormField label="Description">
        <Textarea rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="What will students learn?" />
      </FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Instructor" required>
          <Select value={form.instructorId} onChange={(e) => setForm((p) => ({ ...p, instructorId: e.target.value }))}>
            <option value="">Select instructor</option>
            {instructors.map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
          </Select>
        </FormField>
        <FormField label="Level">
          <Select value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </Select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Price (USD)">
          <Input type="number" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" />
        </FormField>
        <FormField label="Duration (min)">
          <Input type="number" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} placeholder="e.g. 120" />
        </FormField>
      </div>
      <div className="flex gap-4">
        {[['isPublished','Published'],['isFeatured','Featured']].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.checked }))} />
            {label}
          </label>
        ))}
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" type="button" onClick={() => { setCreateOpen(false); setEditTarget(null); setForm(emptyForm); setFormError(''); }}>Cancel</Button>
        <Button type="submit" loading={submitting}>{editTarget ? 'Save Changes' : 'Create Course'}</Button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Courses</h1>
          <p className="text-slate-400 text-sm mt-1">{pagination.total} total courses</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setCreateOpen(true); }}>+ New Course</Button>
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

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <Table columns={columns} data={courses} loading={loading} emptyMessage="No courses found" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      <Modal isOpen={createOpen}   onClose={() => { setCreateOpen(false); setForm(emptyForm); setFormError(''); }} title="Create Course" size="lg"><CourseForm /></Modal>
      <Modal isOpen={!!editTarget} onClose={() => { setEditTarget(null);  setForm(emptyForm); setFormError(''); }} title="Edit Course"   size="lg"><CourseForm /></Modal>
      <Modal isOpen={!!lessonsTarget} onClose={() => setLessonsTarget(null)} title="Manage Lessons" size="lg">
        {lessonsTarget && <LessonManager course={lessonsTarget} onClose={() => setLessonsTarget(null)} />}
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
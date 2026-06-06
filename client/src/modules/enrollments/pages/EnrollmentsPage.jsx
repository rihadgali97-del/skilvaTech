import { useState } from 'react';
import { useEnrollments } from '../hooks/useEnrollments';
import { useUsers } from '../../users/hooks/useUsers';
import { useCourses } from '../../courses/hooks/useCourses';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, Select, FormField, ConfirmDialog } from '../../../shared/components/ui/index';

const statusColor = { active: 'teal', completed: 'green', cancelled: 'red' };

const EnrollmentsPage = () => {
  const { enrollments, loading, error, pagination, page, setPage, enroll, updateProgress, cancel } = useEnrollments();
  const { users }   = useUsers();
  const { courses } = useCourses();

  const [enrollOpen, setEnrollOpen]     = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [progressTarget, setProgressTarget] = useState(null);
  const [submitting, setSubmitting]     = useState(false);
  const [formError, setFormError]       = useState('');
  const [enrollForm, setEnrollForm]     = useState({ studentId: '', courseId: '' });
  const [newProgress, setNewProgress]   = useState(0);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!enrollForm.studentId || !enrollForm.courseId) { setFormError('Both fields are required'); return; }
    setSubmitting(true);
    try {
      await enroll(enrollForm.studentId, enrollForm.courseId);
      setEnrollOpen(false);
      setEnrollForm({ studentId: '', courseId: '' });
      setFormError('');
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Enrollment failed');
    } finally { setSubmitting(false); }
  };

  const handleUpdateProgress = async () => {
    setSubmitting(true);
    try   { await updateProgress(progressTarget.id, newProgress); setProgressTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleCancel = async () => {
    setSubmitting(true);
    try   { await cancel(cancelTarget.id); setCancelTarget(null); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const columns = [
    {
      key: 'student', label: 'Student',
      render: (row) => (
        <div>
          <p className="font-medium text-white">{row.student?.firstName} {row.student?.lastName}</p>
          <p className="text-xs text-slate-500">{row.student?.email}</p>
        </div>
      ),
    },
    {
      key: 'course', label: 'Course',
      render: (row) => <span className="text-slate-300">{row.course?.title}</span>,
    },
    {
      key: 'progress', label: 'Progress',
      render: (row) => (
        <div className="flex items-center gap-2 min-w-24">
          <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <div className="h-full bg-[#00d4d4] rounded-full transition-all" style={{ width: `${row.progress}%` }} />
          </div>
          <span className="text-xs text-slate-400 flex-shrink-0">{row.progress}%</span>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <Badge color={statusColor[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'enrolledAt', label: 'Enrolled',
      render: (row) => <span className="text-slate-400 text-xs">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'active' && (
            <>
              <Button size="sm" variant="outline" onClick={() => { setProgressTarget(row); setNewProgress(row.progress); }}>Progress</Button>
              <Button size="sm" variant="danger" onClick={() => setCancelTarget(row)}>Cancel</Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Enrollments</h1>
          <p className="text-slate-400 text-sm mt-1">{pagination.total} total enrollments</p>
        </div>
        <Button onClick={() => setEnrollOpen(true)}>+ Enroll Student</Button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      <Table columns={columns} data={enrollments} loading={loading} emptyMessage="No enrollments found" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* Enroll Modal */}
      <Modal isOpen={enrollOpen} onClose={() => { setEnrollOpen(false); setFormError(''); }} title="Enroll Student">
        <form onSubmit={handleEnroll} className="space-y-4">
          {formError && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>}
          <FormField label="Student" required>
            <Select value={enrollForm.studentId} onChange={(e) => setEnrollForm((p) => ({ ...p, studentId: e.target.value }))}>
              <option value="">Select student</option>
              {users.filter((u) => u.role?.name === 'student').map((u) => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName} — {u.email}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Course" required>
            <Select value={enrollForm.courseId} onChange={(e) => setEnrollForm((p) => ({ ...p, courseId: e.target.value }))}>
              <option value="">Select course</option>
              {courses.filter((c) => c.isPublished).map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </Select>
          </FormField>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setEnrollOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Enroll</Button>
          </div>
        </form>
      </Modal>

      {/* Update Progress Modal */}
      <Modal isOpen={!!progressTarget} onClose={() => setProgressTarget(null)} title="Update Progress" size="sm">
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">
            {progressTarget?.student?.firstName}'s progress in <span className="text-white">{progressTarget?.course?.title}</span>
          </p>
          <div>
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Progress</span>
              <span className="text-[#00d4d4] font-semibold">{newProgress}%</span>
            </div>
            <input type="range" min="0" max="100" value={newProgress}
              onChange={(e) => setNewProgress(parseInt(e.target.value))}
              className="w-full accent-[#00d4d4]" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" onClick={() => setProgressTarget(null)}>Cancel</Button>
            <Button onClick={handleUpdateProgress} loading={submitting}>Save</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel} loading={submitting}
        title="Cancel Enrollment"
        message={`Cancel ${cancelTarget?.student?.firstName}'s enrollment in "${cancelTarget?.course?.title}"?`}
      />
    </div>
  );
};

export default EnrollmentsPage;
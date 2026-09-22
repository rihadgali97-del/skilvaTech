import { useState } from 'react';
import { useEnrollments } from '../hooks/useEnrollments';
import { useUsers } from '../../users/hooks/useUsers';
import { useCourses } from '../../courses/hooks/useCourses';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, SearchInput, Select, FormField, ConfirmDialog } from '../../../shared/components/ui/index';

const statusColor = { active: 'teal', completed: 'green', cancelled: 'red' };

const EnrollmentsPage = () => {
  const {
    enrollments, loading, error, pagination,
    page, setPage, search, setSearch,
    enroll, updateProgress, cancel,
  } = useEnrollments();

  const { users }   = useUsers();
  const { courses } = useCourses();

  const [enrollOpen, setEnrollOpen]         = useState(false);
  const [cancelTarget, setCancelTarget]     = useState(null);
  const [progressTarget, setProgressTarget] = useState(null);
  const [submitting, setSubmitting]         = useState(false);
  const [formError, setFormError]           = useState('');
  const [enrollForm, setEnrollForm]         = useState({ studentId: '', courseId: '' });
  const [newProgress, setNewProgress]       = useState(0);
  const [statusFilter, setStatusFilter]     = useState('');

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!enrollForm.studentId || !enrollForm.courseId) {
      setFormError('Both fields are required'); return;
    }
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-xs font-bold text-[#00b3b3] flex-shrink-0">
            {row.student?.firstName?.[0]}{row.student?.lastName?.[0]}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.student?.firstName} {row.student?.lastName}</p>
            <p className="text-xs text-gray-500">{row.student?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'course', label: 'Course',
      render: (row) => (
        <div>
          <p className="text-gray-900 font-medium">{row.course?.title}</p>
          <p className="text-xs text-gray-400 capitalize">{row.course?.level}</p>
        </div>
      ),
    },
    {
      key: 'progress', label: 'Progress',
      render: (row) => (
        <div className="flex items-center gap-2 min-w-32">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00d4d4] rounded-full transition-all"
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 flex-shrink-0 font-medium">{row.progress}%</span>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (row) => <Badge color={statusColor[row.status]}>{row.status}</Badge>,
    },
    {
      key: 'enrolledAt', label: 'Enrolled',
      render: (row) => (
        <span className="text-gray-400 text-xs">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions', label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          {row.status === 'active' && (
            <>
              <Button size="sm" variant="secondary"
                onClick={() => { setProgressTarget(row); setNewProgress(row.progress); }}>
                Progress
              </Button>
              <Button size="sm" variant="danger" onClick={() => setCancelTarget(row)}>
                Cancel
              </Button>
            </>
          )}
          {row.status === 'completed' && (
            <Badge color="green">✓ Completed</Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total enrollments</p>
        </div>
        <Button onClick={() => setEnrollOpen(true)}>+ Enroll Student</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by student or course..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-40"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <Table columns={columns} data={enrollments} loading={loading} emptyMessage="No enrollments found" />
      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />

      {/* ── Enroll Modal ── */}
      <Modal
        isOpen={enrollOpen}
        onClose={() => { setEnrollOpen(false); setFormError(''); }}
        title="Enroll Student"
      >
        <form onSubmit={handleEnroll} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {formError}
            </div>
          )}
          <FormField label="Student" required>
            <Select
              value={enrollForm.studentId}
              onChange={(e) => setEnrollForm((p) => ({ ...p, studentId: e.target.value }))}
            >
              <option value="">Select student</option>
              {users.filter((u) => u.role?.name === 'student').map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} — {u.email}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Course" required>
            <Select
              value={enrollForm.courseId}
              onChange={(e) => setEnrollForm((p) => ({ ...p, courseId: e.target.value }))}
            >
              <option value="">Select course</option>
              {courses.filter((c) => c.isPublished).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </Select>
          </FormField>
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setEnrollOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>Enroll</Button>
          </div>
        </form>
      </Modal>

      {/* ── Update Progress Modal ── */}
      <Modal
        isOpen={!!progressTarget}
        onClose={() => setProgressTarget(null)}
        title="Update Progress"
        size="sm"
      >
        <div className="space-y-5">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-0.5">Student</p>
            <p className="font-semibold text-gray-900">
              {progressTarget?.student?.firstName} {progressTarget?.student?.lastName}
            </p>
            <p className="text-xs text-gray-400 mt-1">{progressTarget?.course?.title}</p>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 font-medium">Progress</span>
              <span className="text-[#00b3b3] font-bold">{newProgress}%</span>
            </div>
            <input
              type="range" min="0" max="100" value={newProgress}
              onChange={(e) => setNewProgress(parseInt(e.target.value))}
              className="w-full accent-[#00d4d4] h-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {newProgress === 100 && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center">
              🎓 Setting to 100% will mark this enrollment as completed
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <Button variant="secondary" onClick={() => setProgressTarget(null)}>Cancel</Button>
            <Button onClick={handleUpdateProgress} loading={submitting}>Save Progress</Button>
          </div>
        </div>
      </Modal>

      {/* ── Cancel Confirm ── */}
      <ConfirmDialog
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        loading={submitting}
        title="Cancel Enrollment"
        message={`Cancel ${cancelTarget?.student?.firstName}'s enrollment in "${cancelTarget?.course?.title}"? This cannot be undone.`}
      />
    </div>
  );
};

export default EnrollmentsPage;
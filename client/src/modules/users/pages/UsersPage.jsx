import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../../roles/hooks/useRoles';
import Table from '../../../shared/components/ui/Table';
import Pagination from '../../../shared/components/ui/Pagination';
import Modal from '../../../shared/components/ui/Modal';
import UserForm from '../components/UserForm';
import {
  Badge, Button, SearchInput, ConfirmDialog,
} from '../../../shared/components/ui/index';

const UsersPage = () => {
  const {
    users, loading, error, pagination,
    page, setPage, search, setSearch,
    createUser, updateUser, deleteUser, toggleActive,
  } = useUsers();

  const { roles } = useRoles();

  // Modal state
  const [createOpen, setCreateOpen]   = useState(false);
  const [editUser, setEditUser]       = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [deleting, setDeleting]       = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await createUser(formData);
      setCreateOpen(false);
    } finally { setSubmitting(false); }
  };

  const handleEdit = async (formData) => {
    setSubmitting(true);
    try {
      await updateUser(editUser.id, formData);
      setEditUser(null);
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      setDeleteTarget(null);
    } finally { setDeleting(false); }
  };

  const handleToggleActive = async (user) => {
    try { await toggleActive(user.id, user.isActive); }
    catch (err) { alert(err.response?.data?.error?.message || 'Failed'); }
  };

  // ── Table columns ────────────────────────────────────────────────────────────
  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300 flex-shrink-0">
            {row.firstName[0]}{row.lastName[0]}
          </div>
          <div>
            <p className="font-medium text-white">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <Badge color="violet">{row.role?.name || '—'}</Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge color={row.isActive ? 'green' : 'red'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (row) => (
        <span className="text-slate-400 text-xs">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditUser(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant={row.isActive ? 'danger' : 'ghost'}
            onClick={() => handleToggleActive(row)}
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-slate-400 text-sm mt-1">
            {pagination.total} total users
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ New User</Button>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────────── */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 max-w-sm">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <Table
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users found"
      />

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />

      {/* ── Create Modal ───────────────────────────────────────────────────── */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create User">
        <UserForm
          roles={roles}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          loading={submitting}
        />
      </Modal>

      {/* ── Edit Modal ─────────────────────────────────────────────────────── */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        <UserForm
          roles={roles}
          initialData={editUser}
          onSubmit={handleEdit}
          onCancel={() => setEditUser(null)}
          loading={submitting}
        />
      </Modal>

      {/* ── Delete Confirm ─────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}? This cannot be undone.`}
      />
    </div>
  );
};

export default UsersPage;
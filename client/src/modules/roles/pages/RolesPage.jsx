import { useState, useEffect } from 'react';
import { useRoles } from '../hooks/useRoles';
import { permissionApi } from '../../permissions/api/permissionApi';
import Table from '../../../shared/components/ui/Table';
import Modal from '../../../shared/components/ui/Modal';
import { Badge, Button, FormField, Input, ConfirmDialog } from '../../../shared/components/ui/index';

// ─── Permission selector (grouped by resource) ────────────────────────────────
const PermissionSelector = ({ grouped, selected, onChange }) => {
  const toggle = (id) => {
    onChange(
      selected.includes(id)
        ? selected.filter((p) => p !== id)
        : [...selected, id]
    );
  };

  const toggleGroup = (permissions) => {
    const ids = permissions.map((p) => p.id);
    const allSelected = ids.every((id) => selected.includes(id));
    if (allSelected) onChange(selected.filter((id) => !ids.includes(id)));
    else onChange([...new Set([...selected, ...ids])]);
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
      {Object.entries(grouped).map(([resource, permissions]) => {
        const ids = permissions.map((p) => p.id);
        const allSelected = ids.every((id) => selected.includes(id));

        return (
          <div key={resource} className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white capitalize">{resource}</span>
              <button
                type="button"
                onClick={() => toggleGroup(permissions)}
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {permissions.map((perm) => (
                <button
                  key={perm.id}
                  type="button"
                  onClick={() => toggle(perm.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all
                    ${selected.includes(perm.id)
                      ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                      : 'bg-slate-700/50 border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                >
                  {perm.action}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Roles Page ───────────────────────────────────────────────────────────────
const RolesPage = () => {
  const { roles, loading, error, createRole, deleteRole, assignPermissions } = useRoles();

  const [allPermissions, setAllPermissions] = useState({ permissions: [], grouped: {} });
  const [createOpen, setCreateOpen]         = useState(false);
  const [permTarget, setPermTarget]         = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [selectedPerms, setSelectedPerms]   = useState([]);
  const [submitting, setSubmitting]         = useState(false);
  const [deleting, setDeleting]             = useState(false);
  const [newRole, setNewRole]               = useState({ name: '', description: '' });
  const [formError, setFormError]           = useState('');

  // Load all permissions for the selector
  useEffect(() => {
    permissionApi.list()
      .then(({ data }) => setAllPermissions(data.data))
      .catch(() => {});
  }, []);

  const handleOpenPermissions = (role) => {
    setPermTarget(role);
    setSelectedPerms(role.permissions.map((p) => p.id));
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRole.name.trim()) { setFormError('Name is required'); return; }
    setSubmitting(true);
    try {
      await createRole(newRole);
      setCreateOpen(false);
      setNewRole({ name: '', description: '' });
      setFormError('');
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Failed to create role');
    } finally { setSubmitting(false); }
  };

  const handleSavePermissions = async () => {
    setSubmitting(true);
    try {
      await assignPermissions(permTarget.id, selectedPerms);
      setPermTarget(null);
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRole(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to delete role');
    } finally { setDeleting(false); }
  };

  const columns = [
    {
      key: 'name',
      label: 'Role',
      render: (row) => (
        <div>
          <p className="font-medium text-white capitalize">{row.name}</p>
          {row.description && <p className="text-xs text-slate-500 mt-0.5">{row.description}</p>}
        </div>
      ),
    },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-sm">
          {row.permissions.length === 0
            ? <span className="text-slate-500 text-xs">No permissions</span>
            : row.permissions.slice(0, 4).map((p) => (
                <Badge key={p.id} color="violet">{p.name}</Badge>
              ))
          }
          {row.permissions.length > 4 && (
            <Badge color="gray">+{row.permissions.length - 4} more</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'users',
      label: 'Users',
      render: (row) => (
        <Badge color="blue">{row.userCount} users</Badge>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (row) => (
        <Badge color={row.isSystem ? 'yellow' : 'gray'}>
          {row.isSystem ? 'System' : 'Custom'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleOpenPermissions(row)}>
            Permissions
          </Button>
          {!row.isSystem && (
            <Button size="sm" variant="danger" onClick={() => setDeleteTarget(row)}>
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Roles</h1>
          <p className="text-slate-400 text-sm mt-1">{roles.length} roles configured</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>+ New Role</Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <Table columns={columns} data={roles} loading={loading} emptyMessage="No roles found" />

      {/* ── Create Role Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create Role">
        <form onSubmit={handleCreateRole} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{formError}</div>
          )}
          <FormField label="Role Name" required>
            <Input
              value={newRole.name}
              onChange={(e) => setNewRole((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. manager"
            />
          </FormField>
          <FormField label="Description">
            <Input
              value={newRole.description}
              onChange={(e) => setNewRole((p) => ({ ...p, description: e.target.value }))}
              placeholder="Optional description"
            />
          </FormField>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={submitting}>Create Role</Button>
          </div>
        </form>
      </Modal>

      {/* ── Assign Permissions Modal ──────────────────────────────────────── */}
      <Modal
        isOpen={!!permTarget}
        onClose={() => setPermTarget(null)}
        title={`Permissions — ${permTarget?.name}`}
        size="lg"
      >
        <PermissionSelector
          grouped={allPermissions.grouped}
          selected={selectedPerms}
          onChange={setSelectedPerms}
        />
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
          <span className="text-sm text-slate-400">{selectedPerms.length} permissions selected</span>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setPermTarget(null)}>Cancel</Button>
            <Button onClick={handleSavePermissions} loading={submitting}>Save Permissions</Button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm ────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Role"
        message={`Are you sure you want to delete the "${deleteTarget?.name}" role?`}
      />
    </div>
  );
};

export default RolesPage;
import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/userApi';
import useDebounce from '../../../shared/hooks/useDebounce';

export const useUsers = () => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await userApi.list({
        page,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleFilter && { roleId: roleFilter }),
      });
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  const createUser = async (formData) => {
    const { data } = await userApi.create(formData);
    await fetchUsers();
    return data.data.user;
  };

  const updateUser = async (id, formData) => {
    const { data } = await userApi.update(id, formData);
    await fetchUsers();
    return data.data.user;
  };

  const deleteUser = async (id) => {
    await userApi.delete(id);
    await fetchUsers();
  };

  const toggleActive = async (id, isActive) => {
    if (isActive) await userApi.deactivate(id);
    else          await userApi.activate(id);
    await fetchUsers();
  };

  const updateRole = async (id, roleId) => {
    await userApi.updateRole(id, roleId);
    await fetchUsers();
  };

  return {
    users, loading, error, pagination,
    page, setPage,
    search, setSearch,
    roleFilter, setRoleFilter,
    createUser, updateUser, deleteUser, toggleActive, updateRole,
    refetch: fetchUsers,
  };
};
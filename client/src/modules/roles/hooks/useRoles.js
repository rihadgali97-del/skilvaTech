import { useState, useEffect, useCallback } from 'react';
import { roleApi } from '../api/roleApi';

export const useRoles = () => {
  const [roles, setRoles]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await roleApi.list();
      setRoles(data.data.roles);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRoles(); }, [fetchRoles]);

  const createRole = async (formData) => {
    const { data } = await roleApi.create(formData);
    await fetchRoles();
    return data.data.role;
  };

  const updateRole = async (id, formData) => {
    const { data } = await roleApi.update(id, formData);
    await fetchRoles();
    return data.data.role;
  };

  const deleteRole = async (id) => {
    await roleApi.delete(id);
    await fetchRoles();
  };

  const assignPermissions = async (id, permissionIds) => {
    const { data } = await roleApi.assignPermissions(id, permissionIds);
    await fetchRoles();
    return data.data.role;
  };

  return {
    roles, loading, error,
    createRole, updateRole, deleteRole, assignPermissions,
    refetch: fetchRoles,
  };
};

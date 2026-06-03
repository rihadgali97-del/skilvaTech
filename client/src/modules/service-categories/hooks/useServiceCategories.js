import { useState, useEffect, useCallback } from 'react';
import { serviceCategoryApi } from '../api/serviceCategoryApi';

export const useServiceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await serviceCategoryApi.list();
      setCategories(data.data.categories);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load categories');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const createCategory = async (formData) => {
    const { data } = await serviceCategoryApi.create(formData);
    await fetchCategories();
    return data.data.category;
  };

  const updateCategory = async (id, formData) => {
    const { data } = await serviceCategoryApi.update(id, formData);
    await fetchCategories();
    return data.data.category;
  };

  const deleteCategory = async (id) => {
    await serviceCategoryApi.delete(id);
    await fetchCategories();
  };

  return {
    categories, loading, error,
    createCategory, updateCategory, deleteCategory,
    refetch: fetchCategories,
  };
};
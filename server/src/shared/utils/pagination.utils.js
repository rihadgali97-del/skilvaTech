export const parsePagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

export const parseSort = (query, allowedFields = ['createdAt']) => {
  const sortBy    = allowedFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
  return { [sortBy]: sortOrder };
};

export const parseSearch = (query) => {
  return query.search?.trim() || '';
};

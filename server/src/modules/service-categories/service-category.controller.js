import * as categoryService from './service-category.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../../shared/utils/response.utils.js';

export const listCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.listCategories(req.query);
    sendSuccess(res, { categories });
  } catch (err) { next(err); }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    sendSuccess(res, { category });
  } catch (err) { next(err); }
};

export const createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(req.body);
    sendCreated(res, { category }, 'Category created successfully');
  } catch (err) { next(err); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    sendSuccess(res, { category }, 'Category updated successfully');
  } catch (err) { next(err); }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    sendNoContent(res);
  } catch (err) { next(err); }
};
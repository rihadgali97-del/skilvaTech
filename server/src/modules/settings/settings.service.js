import prisma from '../../config/db.js';
import { NotFoundError, BadRequestError } from '../../shared/errors/AppError.js';
import { getCache, setCache, deleteCache } from '../../shared/utils/cache.utils.js';

const CACHE_KEY = 'settings:all';
const CACHE_TTL = 300; // 5 minutes

// ─── Get all settings (grouped) ──────────────────────────────────────────────
export const getAllSettings = async () => {
  const cached = await getCache(CACHE_KEY);
  if (cached) return cached;

  const settings = await prisma.setting.findMany({
    orderBy: [{ group: 'asc' }, { key: 'asc' }],
  });

  // Group by section
  const grouped = settings.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push({
      key:         s.key,
      value:       s.value,
      type:        s.type,
      label:       s.label,
      description: s.description,
      isPublic:    s.isPublic,
    });
    return acc;
  }, {});

  await setCache(CACHE_KEY, grouped, CACHE_TTL);
  return grouped;
};

// ─── Get public settings only (no auth required) ──────────────────────────────
export const getPublicSettings = async () => {
  const all    = await getAllSettings();
  const result = {};

  for (const [group, items] of Object.entries(all)) {
    const publicItems = items.filter((i) => i.isPublic);
    if (publicItems.length > 0) result[group] = publicItems;
  }

  return result;
};

// ─── Get a single setting value ───────────────────────────────────────────────
export const getSetting = async (key) => {
  const setting = await prisma.setting.findUnique({ where: { key } });
  if (!setting) throw new NotFoundError(`Setting "${key}"`);
  return setting.value;
};

// ─── Update a single setting ──────────────────────────────────────────────────
export const updateSetting = async (key, value) => {
  const existing = await prisma.setting.findUnique({ where: { key } });
  if (!existing) throw new NotFoundError(`Setting "${key}"`);

  // Type validation
  if (existing.type === 'boolean' && typeof value !== 'boolean') {
    throw new BadRequestError(`Setting "${key}" must be a boolean`);
  }
  if (existing.type === 'number' && typeof value !== 'number') {
    throw new BadRequestError(`Setting "${key}" must be a number`);
  }

  const updated = await prisma.setting.update({
    where: { key },
    data:  { value },
  });

  // Invalidate cache
  await deleteCache(CACHE_KEY);

  return updated;
};

// ─── Bulk update settings ─────────────────────────────────────────────────────
export const updateManySettings = async (updates) => {
  // updates: [{ key, value }, ...]
  const results = await Promise.all(
    updates.map(({ key, value }) => updateSetting(key, value))
  );
  return results;
};

// ─── Reset a group to defaults ────────────────────────────────────────────────
export const resetGroup = async (group) => {
  // Re-import defaults and reset only the specified group
  const { DEFAULT_SETTINGS } = await import('../../prisma/seedSettings.js');
  const groupDefaults = DEFAULT_SETTINGS.filter((s) => s.group === group);

  for (const setting of groupDefaults) {
    await prisma.setting.update({
      where: { key: setting.key },
      data:  { value: setting.value },
    });
  }

  await deleteCache(CACHE_KEY);
  return { reset: groupDefaults.length, group };
};

// ─── Get system info (for System tab) ────────────────────────────────────────
export const getSystemInfo = async () => {
  const [userCount, clientCount, courseCount, ticketCount] = await Promise.all([
    prisma.user.count(),
    prisma.client.count(),
    prisma.course.count(),
    prisma.ticket.count(),
  ]);

  return {
    version:    '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV,
    uptime:      Math.floor(process.uptime()),
    memoryMB:    Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    database: {
      users:   userCount,
      clients: clientCount,
      courses: courseCount,
      tickets: ticketCount,
    },
  };
};
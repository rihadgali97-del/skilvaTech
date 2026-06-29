import { useState, useEffect, useCallback } from 'react';
import { settingsApi } from '../api/settingsApi';

export const useSettings = () => {
  const [settings, setSettings]   = useState({});
  const [system, setSystem]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState('');

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [settingsRes, systemRes] = await Promise.all([
        settingsApi.getAll(),
        settingsApi.getSystem(),
      ]);
      setSettings(settingsRes.data.data.settings);
      setSystem(systemRes.data.data.system);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load settings');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateSetting = async (key, value) => {
    setSaving(true);
    try {
      await settingsApi.update(key, value);
      // Optimistic local update
      setSettings((prev) => {
        const group = key.split('.')[0];
        return {
          ...prev,
          [group]: prev[group]?.map((s) =>
            s.key === key ? { ...s, value } : s
          ),
        };
      });
      showSuccess('Setting saved');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const resetGroup = async (group) => {
    setSaving(true);
    try {
      await settingsApi.resetGroup(group);
      await fetchSettings();
      showSuccess(`${group} settings reset to defaults`);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to reset');
    } finally { setSaving(false); }
  };

  const sendTestEmail = async (to) => {
    try {
      await settingsApi.sendTestEmail(to);
      showSuccess('Test email sent successfully!');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send test email');
    }
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Get a setting value by key
  const getValue = (key) => {
    const group = key.split('.')[0];
    const item  = settings[group]?.find((s) => s.key === key);
    return item?.value;
  };

  return {
    settings, system, loading, saving, error, success,
    updateSetting, resetGroup, sendTestEmail, getValue,
    refetch: fetchSettings,
  };
};
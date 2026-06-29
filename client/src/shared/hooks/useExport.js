import { useState } from 'react';
import apiClient from '../services/apiClient';

/**
 * Reusable hook for downloading CSV exports from the backend.
 * @param {string} endpoint - e.g. '/exports/clients'
 * @param {string} filename - e.g. 'clients'
 */
export const useExport = (endpoint, filename) => {
  const [exporting, setExporting] = useState(false);

  const exportCSV = async () => {
    setExporting(true);
    try {
      const response = await apiClient.get(endpoint, {
        responseType: 'blob',
      });

      // Create a temporary anchor element and trigger download
      const url  = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed. Please try again.');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return { exportCSV, exporting };
};
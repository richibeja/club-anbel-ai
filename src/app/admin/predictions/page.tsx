'use client';

import { useState, useEffect } from 'react';
import Database from '@/lib/database';
import PredictionManager from '@/lib/prediction-manager';
import { Prediction } from '@/types';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  
  const [importData, setImportData] = useState({
    csv_data: '',
    lottery_type: 'Powerball',
    draw_date: '',
  });

  useEffect(() => {
    loadPredictions();
  }, []);

  async function loadPredictions() {
    setLoading(true);
    try {
      const data = await Database.getAvailablePredictions();
      setPredictions(data);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setImporting(true);

    try {
      const result = await PredictionManager.importPredictionsFromCSV(
        importData.csv_data,
        importData.lottery_type,
        importData.draw_date
      );

      if (result.success) {
        alert(`Successfully imported ${result.imported} predictions!`);
        setImportData({ csv_data: '', lottery_type: 'Powerball', draw_date: '' });
        await loadPredictions();
      } else {
        alert(`Import failed:\n${result.errors.join('\n')}`);
      }
    } catch (error) {
      alert('Error importing predictions');
      console.error(error);
    } finally {
      setImporting(false);
    }
  }

  async function handleAssign() {
    if (!confirm('Assign predictions to all active members?')) return;

    setAssigning(true);
    try {
      const result = await PredictionManager.assignPredictionsToActiveMembers();
      
      if (result.success) {
        alert(`Successfully assigned ${result.assigned} predictions!`);
        await loadPredictions();
      } else {
        alert(`Assignment failed:\n${result.errors.join('\n')}`);
      }
    } catch (error) {
      alert('Error assigning predictions');
      console.error(error);
    } finally {
      setAssigning(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Predictions Management</h1>
        <p className="text-gray-600 mt-2">Import and assign predictions to members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Import Predictions</h2>
          
          <form onSubmit={handleImport} className="space-y-4">
            <div>
              <label className="label">Lottery Type</label>
              <select
                className="input-field"
                value={importData.lottery_type}
                onChange={(e) => setImportData({ ...importData, lottery_type: e.target.value })}
                required
              >
                <option value="Powerball">Powerball</option>
                <option value="MegaMillions">Mega Millions</option>
                <option value="EuroMillions">EuroMillions</option>
              </select>
            </div>

            <div>
              <label className="label">Draw Date</label>
              <input
                type="date"
                className="input-field"
                value={importData.draw_date}
                onChange={(e) => setImportData({ ...importData, draw_date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="label">
                CSV Data
                <span className="text-sm text-gray-500 ml-2">
                  (One prediction per line, comma-separated)
                </span>
              </label>
              <textarea
                className="input-field font-mono text-sm"
                rows={10}
                value={importData.csv_data}
                onChange={(e) => setImportData({ ...importData, csv_data: e.target.value })}
                placeholder="Example for Powerball:
5,12,23,45,67,15
8,19,27,34,52,8
..."
                required
              />
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-800">
                <strong>Format:</strong><br/>
                • Powerball: 5 numbers (1-69), then powerball (1-26)<br/>
                • Mega Millions: 5 numbers (1-70), then megaball (1-25)<br/>
                • EuroMillions: 5 numbers (1-50), then 2 lucky stars (1-12)
              </p>
            </div>

            <button
              type="submit"
              disabled={importing}
              className="btn-primary w-full"
            >
              {importing ? '⏳ Importing...' : '📥 Import Predictions'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Available Predictions</h2>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <p className="text-2xl font-bold text-green-900">{predictions.length}</p>
            <p className="text-sm text-green-800">predictions ready to assign</p>
          </div>

          <button
            onClick={handleAssign}
            disabled={assigning || predictions.length === 0}
            className="btn-secondary w-full mb-4"
          >
            {assigning ? '⏳ Assigning...' : '🎲 Auto-Assign to Active Members'}
          </button>

          <button
            onClick={loadPredictions}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh List'}
          </button>

          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">How It Works:</h3>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
              <li>Import predictions from Gana Fácil (CSV format)</li>
              <li>System stores them as available</li>
              <li>Click "Auto-Assign" to distribute to active members</li>
              <li>Each member gets ONE unique prediction</li>
              <li>Members receive predictions via Telegram bot</li>
            </ol>
          </div>
        </div>
      </div>

      {predictions.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Prediction List</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Lottery</th>
                  <th className="text-left py-3 px-4">Numbers</th>
                  <th className="text-left py-3 px-4">Draw Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {predictions.slice(0, 20).map((prediction) => (
                  <tr key={prediction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{prediction.lottery_type}</td>
                    <td className="py-3 px-4 font-mono text-sm">
                      {PredictionManager.formatPredictionForDisplay(prediction)}
                    </td>
                    <td className="py-3 px-4">{prediction.draw_date}</td>
                    <td className="py-3 px-4">
                      <span className={`badge-${prediction.status === 'available' ? 'active' : 'inactive'}`}>
                        {prediction.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {prediction.assigned_member_name || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {predictions.length > 20 && (
              <p className="text-center py-4 text-gray-500">
                Showing 20 of {predictions.length} predictions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


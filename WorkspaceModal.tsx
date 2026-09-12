import React, { useState } from 'react';
import { Building2, X, Plus, Check, MapPin, Users, Download, Upload } from 'lucide-react';
import { Workspace } from '../types';

interface WorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSelectWorkspace: (ws: Workspace) => void;
  onCreateWorkspace: (newWs: Workspace) => void;
}

export const WorkspaceModal: React.FC<WorkspaceModalProps> = ({
  isOpen,
  onClose,
  workspaces,
  activeWorkspaceId,
  onSelectWorkspace,
  onCreateWorkspace,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [capacityPortions, setCapacityPortions] = useState(2500);
  const [headOfKitchen, setHeadOfKitchen] = useState('');
  const [nutritionistName, setNutritionistName] = useState('');
  const [qaOfficerName, setQaOfficerName] = useState('');

  if (!isOpen) return null;

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      code: code || `BGN-${Math.floor(100 + Math.random() * 900)}`,
      location: location || 'Jawa Barat, Indonesia',
      capacityPortions: Number(capacityPortions) || 2000,
      headOfKitchen: headOfKitchen || 'Kepala Dapur Pelayanan BGN',
      nutritionistName: nutritionistName || 'Nutrisionis Terdaftar (RD)',
      qaOfficerName: qaOfficerName || 'Petugas Keamanan Pangan HACCP',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onCreateWorkspace(newWs);
    setIsCreating(false);
    setName('');
    setCode('');
    setLocation('');
  };

  const handleExportAll = () => {
    const backupData = {
      app: 'BGN Quality & Safety Hub',
      exportDate: new Date().toISOString(),
      workspaces,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BGN_Workspaces_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0052CC] flex items-center justify-center text-[#38BDF8]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Multi-Workspace Satuan Pelayanan (SPPG)</h3>
              <p className="text-xs text-slate-300">Kelola dan isolasi basis data operasional per dapur sentral BGN</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isCreating ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daftar SPPG Terdaftar ({workspaces.length})
                </span>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0052CC] hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Tambah SPPG Baru
                </button>
              </div>

              {/* Workspaces list */}
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {workspaces.map((ws) => {
                  const isActive = ws.id === activeWorkspaceId;
                  return (
                    <div
                      key={ws.id}
                      onClick={() => onSelectWorkspace(ws)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isActive
                          ? 'border-[#0052CC] bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-sm sm:text-base">{ws.name}</h4>
                            <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                              {ws.code}
                            </span>
                            {isActive && (
                              <span className="text-[11px] font-bold px-2 py-0.5 bg-[#0052CC] text-white rounded-full flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Aktif
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {ws.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5 text-[#0052CC]" />
                              Kapasitas: <strong className="font-semibold text-slate-800">{ws.capacityPortions.toLocaleString()}</strong> Porsi/hari
                            </span>
                          </div>

                          <div className="mt-2 text-[11px] text-slate-500 border-t border-slate-100 pt-2 flex flex-wrap gap-x-4">
                            <span>Ahli Gizi: <strong>{ws.nutritionistName}</strong></span>
                            <span>Petugas QA: <strong>{ws.qaOfficerName}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Seluruh data (resep, HACCP, Posyandu 3B) diisolasi per ruang kerja.</span>
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-1 text-[#0052CC] hover:underline font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Cadangkan Seluruh Workspace (JSON)
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitNew} className="space-y-4">
              <div className="border-b border-slate-100 pb-3 mb-2">
                <h4 className="text-sm font-bold text-slate-800">Pendaftaran Dapur Sentral SPPG Baru</h4>
                <p className="text-xs text-slate-500">Masukkan detail operasional dan penanggung jawab teknis dapur.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Satuan Pelayanan (SPPG) *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="misal: SPPG Dapur Sehat Cimahi Tengah"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kode Registrasi Dapur</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="misal: BGN-SPPG-CMH-004"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Kapasitas (Porsi/Hari) *</label>
                  <input
                    type="number"
                    min="100"
                    max="10000"
                    step="100"
                    required
                    value={capacityPortions}
                    onChange={(e) => setCapacityPortions(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wilayah / Alamat Satker *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Kecamatan, Kabupaten/Kota, Provinsi"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kepala Satuan Pelayanan</label>
                  <input
                    type="text"
                    value={headOfKitchen}
                    onChange={(e) => setHeadOfKitchen(e.target.value)}
                    placeholder="Nama & Gelar Kepala SPPG"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ahli Gizi Penanggung Jawab (RD)</label>
                  <input
                    type="text"
                    value={nutritionistName}
                    onChange={(e) => setNutritionistName(e.target.value)}
                    placeholder="Nama & Gelar Nutrisionis"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Petugas QA / Keamanan Pangan</label>
                  <input
                    type="text"
                    value={qaOfficerName}
                    onChange={(e) => setQaOfficerName(e.target.value)}
                    placeholder="Nama Petugas Pengawas Mutu HACCP"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#0052CC] hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Simpan & Masuk ke SPPG
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

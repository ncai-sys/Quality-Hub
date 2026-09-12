import React, { useState } from 'react';
import { Database, Search, Filter, Info, Award, FileSpreadsheet } from 'lucide-react';
import { MASTER_TKPI_DATABASE, BGN_TARGET_AKG_2026 } from '../data/masterData';

export const MasterDatabaseViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'TKPI' | 'AKG'>('TKPI');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredFoods = MASTER_TKPI_DATABASE.filter((f) => {
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-[#0052CC]">
                MASTER DATABASE RESMI
              </span>
              <span className="text-xs text-slate-500">
                Kemenkes RI & Badan Gizi Nasional
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1">
              Tabel Komposisi Pangan Indonesia (TKPI) & Target AKG 2026
            </h2>
            <p className="text-xs text-slate-500">
              Basis data referensi nilai gizi per 100g Bagian Dapat Dimakan (BDD) serta kecukupan gizi makan siang.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveSubTab('TKPI')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'TKPI'
                  ? 'bg-white text-[#0052CC] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tabel TKPI ({MASTER_TKPI_DATABASE.length} Bahan)
            </button>
            <button
              onClick={() => setActiveSubTab('AKG')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'AKG'
                  ? 'bg-white text-[#0052CC] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Target AKG 2026 (6 Kelompok)
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'TKPI' && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#0052CC]" />
              <h3 className="text-sm font-bold text-slate-800">
                Katalog Bahan Pangan Indonesia per 100g BDD
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama bahan pangan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg w-48 sm:w-60 focus:outline-hidden focus:ring-2 focus:ring-[#0052CC]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium"
              >
                <option value="ALL">Semua Golongan</option>
                <option value="Serealia">Serealia</option>
                <option value="Daging/Unggas">Daging/Unggas</option>
                <option value="Ikan/Seafood">Ikan/Seafood</option>
                <option value="Telur">Telur</option>
                <option value="Kacang-kacangan">Kacang-kacangan</option>
                <option value="Sayuran">Sayuran</option>
                <option value="Buah">Buah</option>
                <option value="Susu/Olahan">Susu/Olahan</option>
                <option value="Minyak/Lemak">Minyak/Lemak</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Kode & Nama Bahan</th>
                  <th className="py-2.5 px-2">Golongan</th>
                  <th className="py-2.5 px-2 text-center bg-blue-50/50 text-[#0052CC]">BDD (%)</th>
                  <th className="py-2.5 px-2 text-right">Energi (kkal)</th>
                  <th className="py-2.5 px-2 text-right">Protein (g)</th>
                  <th className="py-2.5 px-2 text-right">Lemak (g)</th>
                  <th className="py-2.5 px-2 text-right">Karbo (g)</th>
                  <th className="py-2.5 px-2 text-right">Besi Fe (mg)</th>
                  <th className="py-2.5 px-2 text-right">Kalsium (mg)</th>
                  <th className="py-2.5 px-2 text-right">Vit A (mcg)</th>
                  <th className="py-2.5 px-3 text-right">Harga Std/kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoods.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{f.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">{f.code}</div>
                    </td>
                    <td className="py-2.5 px-2 text-slate-600">{f.category}</td>
                    <td className="py-2.5 px-2 text-center font-mono font-bold bg-blue-50/30">
                      <span className={`px-1.5 py-0.5 rounded ${f.bdd === 100 ? 'text-emerald-700 bg-emerald-100' : 'text-amber-800 bg-amber-100'}`}>
                        {f.bdd}%
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-800">{f.energyKcal}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-blue-700 font-semibold">{f.proteinG}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-amber-700">{f.fatG}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-emerald-700">{f.carbsG}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-pink-700">{f.ironMg}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-indigo-700">{f.calciumMg}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-600">{f.retinolMcg}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      Rp {f.standardPricePerKg.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {activeSubTab === 'AKG' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.values(BGN_TARGET_AKG_2026).map((tg) => (
            <div
              key={tg.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0052CC]">
                    Standar Makan Siang (35% Harian)
                  </span>
                  <span className="text-xs font-mono text-slate-400">{tg.ageRange}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{tg.name}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tg.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Energi Minimal:</span>
                  <span className="font-mono font-bold text-slate-900">{tg.energyKcal} kcal</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Protein:</span>
                  <span className="font-mono font-bold text-blue-700">{tg.proteinG} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Lemak:</span>
                  <span className="font-mono font-bold text-amber-700">{tg.fatG} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Karbohidrat:</span>
                  <span className="font-mono font-bold text-emerald-700">{tg.carbsG} g</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Zat Besi (Fe):</span>
                  <span className="font-mono font-bold text-pink-700">{tg.ironMg} mg</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Kalsium:</span>
                  <span className="font-mono font-bold text-indigo-700">{tg.calciumMg} mg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

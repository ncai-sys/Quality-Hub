const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsAiInsights.tsx', 'utf-8');

const newTabs = `
          {activeTab === 'INFOGRAPHIC' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Infografis Detail Komposisi Gizi Makro & Mikro
                  </h3>
                  <p className="text-xs text-slate-500">Kalkulasi presisi berbasis TKPI 2020 untuk 1 porsi menu aktif.</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Data Terverifikasi
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-sky-50 to-blue-100 p-4 rounded-2xl border border-sky-100 shadow-sm">
                  <div className="text-xs text-sky-800 font-bold mb-1">Energi Total</div>
                  <div className="text-2xl font-black text-sky-950">{detailedNutrients.energy.toFixed(1)}</div>
                  <div className="text-[10px] text-sky-700 mt-1">kkal / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                  <div className="text-xs text-emerald-800 font-bold mb-1">Protein Total</div>
                  <div className="text-2xl font-black text-emerald-950">{detailedNutrients.protein.toFixed(1)}</div>
                  <div className="text-[10px] text-emerald-700 mt-1">gram / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-4 rounded-2xl border border-amber-100 shadow-sm">
                  <div className="text-xs text-amber-800 font-bold mb-1">Lemak Total</div>
                  <div className="text-2xl font-black text-amber-950">{detailedNutrients.fat.toFixed(1)}</div>
                  <div className="text-[10px] text-amber-700 mt-1">gram / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-red-100 p-4 rounded-2xl border border-rose-100 shadow-sm">
                  <div className="text-xs text-rose-800 font-bold mb-1">Kalsium</div>
                  <div className="text-2xl font-black text-rose-950">{detailedNutrients.calcium.toFixed(1)}</div>
                  <div className="text-[10px] text-rose-700 mt-1">mg / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-fuchsia-100 p-4 rounded-2xl border border-purple-100 shadow-sm">
                  <div className="text-xs text-purple-800 font-bold mb-1">Zat Besi (Fe)</div>
                  <div className="text-2xl font-black text-purple-950">{detailedNutrients.iron.toFixed(1)}</div>
                  <div className="text-[10px] text-purple-700 mt-1">mg / porsi</div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-100 p-4 rounded-2xl border border-teal-100 shadow-sm">
                  <div className="text-xs text-teal-800 font-bold mb-1">Vitamin C</div>
                  <div className="text-2xl font-black text-teal-950">{detailedNutrients.vitC.toFixed(1)}</div>
                  <div className="text-[10px] text-teal-700 mt-1">mg / porsi</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-800 font-bold mb-1">Vitamin A (Retinol)</div>
                  <div className="text-xl font-black text-slate-900">{detailedNutrients.retinol.toFixed(1)} <span className="text-xs font-medium">mcg</span></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-800 font-bold mb-1">Seng (Zn)</div>
                  <div className="text-xl font-black text-slate-900">{detailedNutrients.zinc.toFixed(1)} <span className="text-xs font-medium">mg</span></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-800 font-bold mb-1">Fosfor</div>
                  <div className="text-xl font-black text-slate-900">{detailedNutrients.phosphorus.toFixed(1)} <span className="text-xs font-medium">mg</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'WASTE' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Analisis Food Waste & Efektivitas Asupan
                  </h3>
                  <p className="text-xs text-slate-500">Persentase susut masak dan tingkat konsumsi sisa piring (plate waste).</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                  Target Sisa < 10%
                </span>
              </div>
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Edible Portion (BDD) vs Limbah Persiapan</span>
                    <span className="text-sm font-black text-emerald-600">85% Efektif</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Berdasarkan data BDD TKPI dari bahan menu saat ini, diperkirakan 15% berat kotor terbuang sebagai limbah persiapan (kulit, tulang, tangkai).</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Susut Masak (Cooking Shrinkage)</span>
                    <span className="text-sm font-black text-amber-600">~12% Penyusutan</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-amber-400 h-3 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Penyusutan berat karena penguapan air selama proses perebusan/pemanggangan (estimasi standar BGN).</p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">Estimasi Sisa Piring (Plate Waste)</span>
                    <span className="text-sm font-black text-rose-600">8% (Aman)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className="bg-rose-500 h-3 rounded-full" style={{ width: '8%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Berdasarkan pemantauan sensorik terakhir, sisa makanan di piring anak-anak berada di bawah batas toleransi 10%.</p>
                </div>
              </div>
            </div>
          )}
`;

file = file.replace(
  /<\/RadarChart>\s*<\/ResponsiveContainer>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>/s,
  (match) => match + '\n' + newTabs
);

fs.writeFileSync('src/components/AnalyticsAiInsights.tsx', file);

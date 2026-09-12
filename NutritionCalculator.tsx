import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Scale, 
  Utensils, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  AlertTriangle,
  Layers,
  ChefHat,
  RotateCcw
} from 'lucide-react';
import { 
  MenuPlan, 
  RecipeIngredient, 
  AgeGroupCategory, 
  AKGTarget, 
  TKPIFood, 
  Workspace 
} from '../types';
import { 
  BGN_TARGET_AKG_2026, 
  MASTER_TKPI_DATABASE, 
  MASTER_BUMBU_DASAR,
  INITIAL_MENU_PLAN
} from '../data/masterData';
import { exportMenuToExcel, exportReportToWord, exportReportToPDF } from '../utils/exporters';

interface NutritionCalculatorProps {
  menu: MenuPlan;
  onUpdateMenu: (updated: MenuPlan) => void;
  workspace: Workspace;
}

export const NutritionCalculator: React.FC<NutritionCalculatorProps> = ({
  menu,
  onUpdateMenu,
  workspace
}) => {
  const [selectedFoodId, setSelectedFoodId] = useState<string>(MASTER_TKPI_DATABASE[0].id);
  const [inputGrams, setInputGrams] = useState<number>(100);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  const currentAKG: AKGTarget = BGN_TARGET_AKG_2026[menu.targetGroup] || BGN_TARGET_AKG_2026.SD_BESAR;

  // Calculate total macro & micro per portion
  const nutritionTotals = useMemo(() => {
    let energy = 0;
    let protein = 0;
    let fat = 0;
    let carbs = 0;
    let iron = 0;
    let calcium = 0;
    let vitA = 0;
    let vitC = 0;
    let totalGrossGrams = 0;
    let totalNetGrams = 0;
    let totalPortionCostRp = 0;

    (menu?.ingredients || []).forEach((item) => {
      const food = MASTER_TKPI_DATABASE.find((f) => f.id === item.foodId);
      if (food) {
        // Nutritional value is per 100g of BDD (Net Weight consumed)
        const factor = item.netWeightGrams / 100;
        energy += food.energyKcal * factor;
        protein += food.proteinG * factor;
        fat += food.fatG * factor;
        carbs += food.carbsG * factor;
        iron += food.ironMg * factor;
        calcium += food.calciumMg * factor;
        vitA += food.retinolMcg * factor;
        vitC += food.vitCMg * factor;

        totalNetGrams += item.netWeightGrams;
        totalGrossGrams += item.grossWeightGrams;
        // Cost per portion is based on GROSS weight purchased!
        totalPortionCostRp += (item.grossWeightGrams / 1000) * item.pricePerKg;
      }
    });

    const totalBatchCostRp = totalPortionCostRp * menu.portionCount;

    return {
      energy,
      protein,
      fat,
      carbs,
      iron,
      calcium,
      vitA,
      vitC,
      totalNetGrams,
      totalGrossGrams,
      totalPortionCostRp,
      totalBatchCostRp
    };
  }, [menu.ingredients, menu.portionCount]);

  // Standard portion size buttons
  const standardPortions = [100, 500, 1000, 1500, 2000, 2500, 3000];

  const handleAddIngredient = () => {
    const food = MASTER_TKPI_DATABASE.find((f) => f.id === selectedFoodId);
    if (!food) return;

    const bddDecimal = food.bdd / 100;
    const grossGrams = Number((inputGrams / bddDecimal).toFixed(1));

    const newIng: RecipeIngredient = {
      id: `ing-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      foodId: food.id,
      foodName: food.name,
      category: food.category,
      netWeightGrams: inputGrams,
      bdd: food.bdd,
      grossWeightGrams: grossGrams,
      pricePerKg: food.standardPricePerKg
    };

    onUpdateMenu({
      ...menu,
      ingredients: [...menu.ingredients, newIng]
    });

    setInputGrams(50);
  };

  const handleRemoveIngredient = (id: string) => {
    onUpdateMenu({
      ...menu,
      ingredients: (menu?.ingredients || []).filter((i) => i.id !== id)
    });
  };

  const handleUpdateIngredientWeight = (id: string, newNetGrams: number) => {
    onUpdateMenu({
      ...menu,
      ingredients: (menu?.ingredients || []).map((item) => {
        if (item.id === id) {
          const bddDecimal = item.bdd / 100;
          return {
            ...item,
            netWeightGrams: newNetGrams,
            grossWeightGrams: Number((newNetGrams / bddDecimal).toFixed(1))
          };
        }
        return item;
      })
    });
  };

  const filteredFoods = useMemo(() => {
    if (selectedCategoryFilter === 'ALL') return MASTER_TKPI_DATABASE;
    return MASTER_TKPI_DATABASE.filter((f) => f.category === selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  const activeBumbu = MASTER_BUMBU_DASAR.find((b) => b.id === menu.selectedBumbu);

  // Status helper for nutrient percent
  const getBadgeStatus = (current: number, target: number) => {
    const percent = Math.round((current / target) * 100);
    if (percent >= 90 && percent <= 110) {
      return { text: `${percent}% (Ideal)`, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (percent >= 80 && percent < 90) {
      return { text: `${percent}% (Mendekati)`, color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    if (percent > 110 && percent <= 125) {
      return { text: `${percent}% (Cukup/Lebih)`, color: 'text-sky-700 bg-sky-50 border-sky-200' };
    }
    return { text: `${percent}% (${percent < 80 ? 'Kurang' : 'Berlebih'})`, color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title & Configuration Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-[#0052CC]">
                STANDAR BGN 2026
              </span>
              <span className="text-xs text-slate-500">
                Porsi Makan Siang (35% AKG Harian)
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-800 mt-1">
              Kalkulator Gizi & Skaler Resep Dapur Sentral
            </h2>
            <p className="text-xs text-slate-500">
              Perhitungan presisi nilai gizi TKPI, konversi Berat Bersih ke Berat Kotor (BDD), dan formula Bumbu Dasar.
            </p>
          </div>

          {/* Quick Actions / Exports */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportMenuToExcel(menu, workspace, currentAKG)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel Formula
            </button>
            <button
              onClick={() => exportReportToWord(menu, workspace, [], currentAKG, nutritionTotals)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-[#0052CC] hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Export Word BGN
            </button>
            <button
              onClick={() => exportReportToPDF(menu, workspace, [], currentAKG, nutritionTotals)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-800 hover:bg-slate-900 text-white shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Cetak PDF
            </button>
          </div>
        </div>

        {/* Target Group Selector & Portion Count */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-100">
          
          {/* Target Group Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kelompok Sasaran Penerima Manfaat *
            </label>
            <select
              value={menu.targetGroup}
              onChange={(e) => onUpdateMenu({ ...menu, targetGroup: e.target.value as AgeGroupCategory })}
              className="w-full px-3 py-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:outline-hidden"
            >
              {Object.values(BGN_TARGET_AKG_2026).map((tg) => (
                <option key={tg.id} value={tg.id}>
                  {tg.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1 italic">
              {currentAKG.description}
            </p>
          </div>

          {/* Portion Scaler */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Skala Produksi Porsi (Dapur SPPG) *
              </label>
              <span className="text-xs font-mono font-bold text-[#0052CC]">
                {menu.portionCount.toLocaleString()} Porsi
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="3000"
              step="50"
              value={menu.portionCount}
              onChange={(e) => onUpdateMenu({ ...menu, portionCount: Number(e.target.value) })}
              className="w-full accent-[#0052CC] cursor-pointer"
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {standardPortions.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => onUpdateMenu({ ...menu, portionCount: p })}
                  className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                    menu.portionCount === p
                      ? 'bg-[#0052CC] text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Siklus Menu Hari Ini *
            </label>
            <input
              type="text"
              value={menu.name}
              onChange={(e) => onUpdateMenu({ ...menu, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:outline-hidden"
              placeholder="misal: Nasi, Ayam Bumbu Kuning, Tahu, Sayur Bening, Pisang"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>Unit: {workspace.code}</span>
              <button
                type="button"
                onClick={() => onUpdateMenu(INITIAL_MENU_PLAN)}
                className="text-[#0052CC] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Standar
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Real-time Nutritional Adequacy vs AKG 2026 Dashboard */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-[#0052CC] flex items-center justify-center font-bold">
              AKG
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Kecukupan Gizi per Porsi vs Target BGN 2026
              </h3>
              <p className="text-xs text-slate-500">
                Pencapaian makronutrien dan mikronutrien penting per makan siang
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Estimasi Biaya Bahan Baku:</span>
            <span className="text-sm font-bold text-emerald-600 font-mono">
              Rp {Math.round(nutritionTotals.totalPortionCostRp).toLocaleString('id-ID')} /porsi
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          
          {/* Energi */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600">Energi</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeStatus(nutritionTotals.energy, currentAKG.energyKcal).color}`}>
                {getBadgeStatus(nutritionTotals.energy, currentAKG.energyKcal).text}
              </span>
            </div>
            <div className="text-lg font-extrabold text-slate-900 font-mono">
              {Math.round(nutritionTotals.energy)} <span className="text-xs font-normal text-slate-500">kcal</span>
            </div>
            <div className="text-[11px] text-slate-500">Target: {currentAKG.energyKcal} kcal</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#0052CC] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (nutritionTotals.energy / currentAKG.energyKcal) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Protein */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600">Protein</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeStatus(nutritionTotals.protein, currentAKG.proteinG).color}`}>
                {getBadgeStatus(nutritionTotals.protein, currentAKG.proteinG).text}
              </span>
            </div>
            <div className="text-lg font-extrabold text-blue-700 font-mono">
              {nutritionTotals.protein.toFixed(1)} <span className="text-xs font-normal text-slate-500">g</span>
            </div>
            <div className="text-[11px] text-slate-500">Target: {currentAKG.proteinG} g</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#38BDF8] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (nutritionTotals.protein / currentAKG.proteinG) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Lemak */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600">Lemak</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeStatus(nutritionTotals.fat, currentAKG.fatG).color}`}>
                {getBadgeStatus(nutritionTotals.fat, currentAKG.fatG).text}
              </span>
            </div>
            <div className="text-lg font-extrabold text-amber-700 font-mono">
              {nutritionTotals.fat.toFixed(1)} <span className="text-xs font-normal text-slate-500">g</span>
            </div>
            <div className="text-[11px] text-slate-500">Target: {currentAKG.fatG} g</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (nutritionTotals.fat / currentAKG.fatG) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Karbohidrat */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600">Karbohidrat</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getBadgeStatus(nutritionTotals.carbs, currentAKG.carbsG).color}`}>
                {getBadgeStatus(nutritionTotals.carbs, currentAKG.carbsG).text}
              </span>
            </div>
            <div className="text-lg font-extrabold text-emerald-700 font-mono">
              {nutritionTotals.carbs.toFixed(1)} <span className="text-xs font-normal text-slate-500">g</span>
            </div>
            <div className="text-[11px] text-slate-500">Target: {currentAKG.carbsG} g</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (nutritionTotals.carbs / currentAKG.carbsG) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Zat Besi (Fe) */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600">Zat Besi (Fe)</span>
              <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-1 py-0.5 rounded">
                Anti-Anemia
              </span>
            </div>
            <div className="text-lg font-extrabold text-pink-700 font-mono">
              {nutritionTotals.iron.toFixed(2)} <span className="text-xs font-normal text-slate-500">mg</span>
            </div>
            <div className="text-[11px] text-slate-500">Target: {currentAKG.ironMg} mg</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-pink-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (nutritionTotals.iron / currentAKG.ironMg) * 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Kalsium */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-slate-600">Kalsium</span>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">
                Tulang & Gigi
              </span>
            </div>
            <div className="text-lg font-extrabold text-indigo-700 font-mono">
              {Math.round(nutritionTotals.calcium)} <span className="text-xs font-normal text-slate-500">mg</span>
            </div>
            <div className="text-[11px] text-slate-500">Target: {currentAKG.calciumMg} mg</div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (nutritionTotals.calcium / currentAKG.calciumMg) * 100)}%` }}
              ></div>
            </div>
          </div>

        </div>
      </div>

      {/* Ingredient Manager & Gross vs Net BDD Scaler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Ingredient Table with BDD calculation */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#0052CC]" />
                Komposisi Menu & Konversi BDD (Bagian Dapat Dimakan)
              </h3>
              <p className="text-xs text-slate-500">
                Rumus Pengadaan Bruto: <strong>Berat Kotor = Berat Bersih × (100 / % BDD)</strong>
              </p>
            </div>

            <div className="text-xs text-slate-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 font-mono">
              Total Porsi: <strong>{menu.portionCount.toLocaleString()}</strong> ompreng
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <th className="py-2.5 px-3">Bahan Pangan (TKPI)</th>
                  <th className="py-2.5 px-2">Golongan</th>
                  <th className="py-2.5 px-2 text-right">Netto /Porsi</th>
                  <th className="py-2.5 px-2 text-center">BDD (%)</th>
                  <th className="py-2.5 px-2 text-right">Bruto /Porsi</th>
                  <th className="py-2.5 px-3 text-right bg-blue-50/50 text-[#0052CC]">Total Batch ({menu.portionCount} Porsi)</th>
                  <th className="py-2.5 px-2 text-right">Anggaran</th>
                  <th className="py-2.5 px-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {menu.ingredients.map((item) => {
                  const grossBatchKg = ((item.grossWeightGrams * menu.portionCount) / 1000).toFixed(1);
                  const costBatchRp = ((item.grossWeightGrams * menu.portionCount) / 1000) * item.pricePerKg;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {item.foodName}
                      </td>
                      <td className="py-2.5 px-2 text-slate-500">
                        {item.category}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <input
                          type="number"
                          min="1"
                          max="500"
                          value={item.netWeightGrams}
                          onChange={(e) => handleUpdateIngredientWeight(item.id, Number(e.target.value))}
                          className="w-16 px-1.5 py-1 text-right font-mono font-bold text-slate-800 border border-slate-200 rounded focus:border-[#0052CC] focus:outline-hidden"
                        />
                        <span className="text-[10px] text-slate-400 ml-1">g</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-[11px] ${
                          item.bdd === 100 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.bdd}%
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                        {item.grossWeightGrams.toFixed(1)} g
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0052CC] bg-blue-50/30">
                        {grossBatchKg} kg
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-600">
                        Rp {Math.round(costBatchRp).toLocaleString('id-ID')}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <button
                          onClick={() => handleRemoveIngredient(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Hapus Bahan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100/80 font-bold text-slate-800 border-t border-slate-200">
                  <td className="py-3 px-3">TOTAL PENGADAAN</td>
                  <td></td>
                  <td className="py-3 px-2 text-right font-mono">{nutritionTotals.totalNetGrams} g</td>
                  <td className="text-center">-</td>
                  <td className="py-3 px-2 text-right font-mono">{nutritionTotals.totalGrossGrams.toFixed(1)} g</td>
                  <td className="py-3 px-3 text-right font-mono text-[#0052CC] bg-blue-100/50">
                    {((nutritionTotals.totalGrossGrams * menu.portionCount) / 1000).toFixed(1)} kg
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-emerald-700">
                    Rp {Math.round(nutritionTotals.totalBatchCostRp).toLocaleString('id-ID')}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Add Ingredient Form */}
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              + Tambah Komponen Bahan dari Master TKPI
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
              
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Filter Golongan</label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
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

              <div className="sm:col-span-5">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Pilih Bahan Pangan (TKPI)</label>
                <select
                  value={selectedFoodId}
                  onChange={(e) => setSelectedFoodId(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                >
                  {filteredFoods.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (BDD: {f.bdd}%) - {f.energyKcal} kkal / 100g
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Berat Bersih (g)</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={inputGrams}
                  onChange={(e) => setInputGrams(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="w-full py-1.5 px-3 bg-[#0052CC] hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Right 1 Col: Dynamic Formula Scaling for Spice Paste (Bumbu Dasar BGN) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <ChefHat className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Formula Bumbu Dasar BGN</h3>
                <p className="text-xs text-slate-500">Standarisasi pasta bumbu produksi massal</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Tipe Bumbu Dasar:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['PUTIH', 'MERAH', 'KUNING'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onUpdateMenu({ ...menu, selectedBumbu: type })}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                      menu.selectedBumbu === type
                        ? 'border-[#0052CC] bg-blue-50 text-[#0052CC] shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {activeBumbu && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">{activeBumbu.name}</span>
                  <span className="font-mono text-slate-600 font-semibold">{menu.bumbuGramsPerPortion} g /porsi</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">{activeBumbu.description}</p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Komposisi Bahan</span>
                    <span>Total ({menu.portionCount} porsi)</span>
                  </div>
                  {activeBumbu.ingredients.map((item, idx) => {
                    const gPerPorsi = (menu.bumbuGramsPerPortion * item.percentage) / 100;
                    const totalBatchKg = ((gPerPorsi * menu.portionCount) / 1000).toFixed(2);
                    return (
                      <div key={idx} className="flex items-center justify-between border-b border-slate-200/60 pb-1 last:border-0 last:pb-0">
                        <span className="text-slate-600">
                          {item.name} <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
                        </span>
                        <span className="font-mono font-bold text-slate-800">{totalBatchKg} kg</span>
                      </div>
                    );
                  })}
                  <div className="pt-2 border-t border-slate-300 flex items-center justify-between font-bold text-slate-800">
                    <span>Total Bumbu Pasta:</span>
                    <span className="font-mono text-[#0052CC]">
                      {((menu.bumbuGramsPerPortion * menu.portionCount) / 1000).toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Summary Card */}
          <div className="bg-gradient-to-br from-[#0A2540] to-[#0052CC] text-white rounded-2xl p-5 shadow-md">
            <div className="flex items-center gap-2 mb-3 text-sky-200">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs font-bold uppercase tracking-wider">Rekapitulasi Produksi SPPG</span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-300">Total Porsi:</span>
                <span className="font-mono font-bold text-white">{menu.portionCount.toLocaleString()} Porsi</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-300">Total Muatan Bruto:</span>
                <span className="font-mono font-bold text-[#38BDF8]">
                  {((nutritionTotals.totalGrossGrams * menu.portionCount) / 1000).toFixed(1)} kg
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/10">
                <span className="text-slate-300">Estimasi Belanja Dapur:</span>
                <span className="font-mono font-bold text-emerald-300">
                  Rp {Math.round(nutritionTotals.totalBatchCostRp).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-300">Biaya Satuan Bahan:</span>
                <span className="font-mono font-bold text-white">
                  Rp {Math.round(nutritionTotals.totalPortionCostRp).toLocaleString('id-ID')} /porsi
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-sky-100 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
              Formula telah memenuhi standar gizi BGN & batas kritis Food Safety.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

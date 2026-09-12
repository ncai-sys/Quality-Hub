const fs = require('fs');
let file = fs.readFileSync('src/components/AnalyticsAiInsights.tsx', 'utf-8');

// Update imports
file = file.replace(
  "import { MenuPlan, HACCPLog, AKGTarget } from '../types';",
  "import { MenuPlan, HACCPLog, AKGTarget, DetailedNutrientAnalysis } from '../types';\nimport { calculateMacroNutrients } from '../utils/storage';"
);

// Update activeTab state
file = file.replace(
  "useState<'TRENDS' | 'COMPLIANCE' | 'COST' | 'HEATMAP'>('TRENDS');",
  "useState<'TRENDS' | 'COMPLIANCE' | 'COST' | 'HEATMAP' | 'INFOGRAPHIC' | 'WASTE'>('INFOGRAPHIC');\n  const detailedNutrients = calculateMacroNutrients(currentMenu.ingredients);"
);

// Add new buttons
const newButtons = `
          <button
            onClick={() => setActiveTab('HEATMAP')}
            className={\`px-4 py-2 text-xs font-bold rounded-xl transition-all \${
              activeTab === 'HEATMAP'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }\`}
          >
            Radar Risiko Keamanan Pangan
          </button>
          <button
            onClick={() => setActiveTab('INFOGRAPHIC')}
            className={\`px-4 py-2 text-xs font-bold rounded-xl transition-all \${
              activeTab === 'INFOGRAPHIC'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }\`}
          >
            Infografis Detail Gizi
          </button>
          <button
            onClick={() => setActiveTab('WASTE')}
            className={\`px-4 py-2 text-xs font-bold rounded-xl transition-all \${
              activeTab === 'WASTE'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }\`}
          >
            Analisis Waste & Asupan
          </button>
`;
file = file.replace(
  /          <button\s+onClick=\{\(\) => setActiveTab\('HEATMAP'\)\}.*?Radar Risiko Keamanan Pangan\s+<\/button>/s,
  newButtons
);

fs.writeFileSync('src/components/AnalyticsAiInsights.tsx', file);

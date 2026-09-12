export type AgeGroupCategory = 
  | 'PAUD_TK' 
  | 'SD_KECIL' 
  | 'SD_BESAR' 
  | 'SMP_SMA' 
  | 'BUMIL' 
  | 'BUSUI';

export interface AKGTarget {
  id: AgeGroupCategory;
  name: string;
  ageRange: string;
  energyKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  ironMg: number;
  calciumMg: number;
  vitAMcg: number;
  vitCMg: number;
  fiberG: number;
  sodiumMg: number;
  portionRatio: number; // e.g. 0.33 for lunch
  description: string;
}

export interface TKPIFood {
  id: string;
  code: string;
  name: string;
  category: 'Serealia' | 'Umbi Berpati' | 'Kacang/Biji/Bean' | 'Sayuran' | 'Buah' | 'Daging/Unggas' | 'Ikan/Kerang/Udang' | 'Telur' | 'Susu/Olahan' | 'Lemak/Minyak' | 'Gula/Sirup/Konfeksioneri' | 'Bumbu' | 'Minuman';
  bdd: number; // Bagian Dapat Dimakan % (e.g. 100, 58, 80)
  
  // Macronutrients (per 100g BDD)
  waterG: number; // Air
  energyKcal: number; // Energi
  proteinG: number; // Protein
  fatG: number; // Lemak
  carbsG: number; // KH
  fiberG: number; // Serat
  ashG: number; // Abu
  
  // Micronutrients - Minerals (per 100g BDD)
  calciumMg: number; // Kalsium
  phosphorusMg: number; // Fosfor
  ironMg: number; // Besi
  sodiumMg: number; // Natrium
  potassiumMg: number; // Kalium
  copperMg: number; // Tembaga
  zincMg: number; // Seng
  
  // Micronutrients - Vitamins (per 100g BDD)
  retinolMcg: number; // Retinol
  betaCaroteneMcg: number; // B-Karoten
  totalCaroteneMcg: number; // Karoten Total
  thiaminMg: number; // Thiamin (B1)
  riboflavinMg: number; // Riboflavin (B2)
  niacinMg: number; // Niasin
  vitCMg: number; // Vitamin C
  
  standardPricePerKg: number; // in IDR
}

export interface RecipeIngredient {
  id: string;
  foodId: string;
  foodName: string;
  category: string;
  netWeightGrams: number; // per portion (bersih)
  bdd: number; // %
  grossWeightGrams: number; // net * (100 / bdd)
  pricePerKg: number;
}

export interface DetailedNutrientAnalysis {
  energy: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  calcium: number;
  phosphorus: number;
  iron: number;
  sodium: number;
  potassium: number;
  copper: number;
  zinc: number;
  retinol: number;
  betaCarotene: number;
  totalCarotene: number;
  thiamin: number;
  riboflavin: number;
  niacin: number;
  vitC: number;
}

export interface BumbuDasarComponent {
  name: string;
  ratioGrams: number; // grams per 100 portions
}

export interface BumbuDasarRecipe {
  id: 'PUTIH' | 'MERAH' | 'KUNING';
  name: string;
  description: string;
  gramPerPortion: number;
  ingredients: { name: string; percentage: number }[];
}

export interface MenuPlan {
  id: string;
  name: string;
  targetGroup: AgeGroupCategory;
  portionCount: number; // e.g., 100 to 3000
  mealType: 'Makan Siang' | 'Snack Pagi' | 'Paket PMT Posyandu';
  date: string;
  ingredients: RecipeIngredient[];
  selectedBumbu: 'PUTIH' | 'MERAH' | 'KUNING' | 'NONE';
  bumbuGramsPerPortion: number;
  notes?: string;
}

export type CCPType = 'CCP-1' | 'CCP-2' | 'CCP-3';

export interface HACCPLog {
  id: string;
  timestamp: string;
  ccpType: CCPType;
  stepName: string;
  parameterChecked: string;
  standardThreshold: string;
  measuredValue: number;
  unit: string;
  isCompliant: boolean;
  batchNumber: string;
  inspectorName: string;
  correctiveAction?: string;
  hazardRisk: 'RENDAH' | 'SEDANG' | 'KRITIS';
  foodItemName?: string;
}

export interface MotherRecord {
  id: string;
  type: 'BUMIL' | 'BUSUI';
  nik: string;
  name: string;
  age: number;
  gestationalWeek?: number; // for bumil
  childAgeMonths?: number; // for busui
  prePregnancyWeightKg?: number;
  currentWeightKg: number;
  heightCm: number;
  lilaCm: number; // Lingkar Lengan Atas, alert if < 23.5
  hbLevelGdl?: number; // Hemoglobin, alert if < 11
  hasKEK: boolean;
  hasAnemia: boolean;
  posyanduName: string;
  notes?: string;
  lastUpdated: string;
}

export interface ToddlerMeasurement {
  id: string;
  date: string;
  ageMonths: number;
  weightKg: number;
  heightCm: number;
  headCircumferenceCm?: number;
  t2Faltering: boolean; // Tidak naik 2x berturut-turut
  zScoreBBU: number; // Berat Badan per Umur
  zScoreTBU: number; // Tinggi Badan per Umur (Stunting flag if < -2 SD)
  zScoreBBTB: number; // Berat Badan per Tinggi (Wasting flag if < -2 SD)
}

export interface ToddlerRecord {
  id: string;
  nik: string;
  name: string;
  gender: 'L' | 'P';
  dob: string;
  parentName: string;
  phone: string;
  posyanduName: string;
  measurements: ToddlerMeasurement[];
  isStuntingRisk: boolean;
  isUnderweight: boolean;
  isFalteringT2: boolean;
  lastUpdated: string;
}

export interface BgnSOP {
  id: string;
  code: string;
  title: string;
  category: 'Penerimaan' | 'Penyimpanan' | 'Pengolahan' | 'Distribusi' | 'Sanitasi' | 'Retensi Lab';
  version: string;
  effectiveDate: string;
  objective: string;
  criticalPoints: string[];
  steps: string[];
  verificationFrequency: string;
}

export interface Workspace {
  id: string;
  name: string;
  code: string;
  location: string;
  capacityPortions: number;
  headOfKitchen: string;
  nutritionistName: string;
  qaOfficerName: string;
  createdAt: string;
}

export interface SOPChecklistItem {
  id: string;
  code: string;
  sopRef: string;
  title: string;
  category: 'Penerimaan' | 'Pengolahan' | 'Higiene' | 'Sanitasi' | 'Distribusi' | 'Sampling & Lab';
  standard: string;
  isCompliant: boolean;
  notes?: string;
  photoUrl?: string;
  isCCP: boolean;
  ccpCode?: string;
  checkedAt?: string;
  checkedBy?: string;
}

export interface DailyChecklistSession {
  id: string;
  date: string;
  workspaceId: string;
  supervisorName: string;
  verified: boolean;
  complianceRate: number;
  items: SOPChecklistItem[];
  lastUpdated: string;
}

export interface FlowchartNode {
  id: string;
  title: string;
  stageName: string;
  sopNumber: string;
  sopTitle: string;
  responsibleRole: string;
  standardDuration: string;
  ccpTarget?: string;
  criticalLimit?: string;
  requiredEquipment: string[];
  outputDocument: string;
  colorScheme: 'blue' | 'emerald' | 'amber' | 'rose' | 'pink' | 'indigo';
  steps: string[];
}

export interface FoodExchangeItem {
  id: string;
  name: string;
  category: 'Karbohidrat' | 'Protein Hewani Rendah Lemak' | 'Protein Hewani Sedang Lemak' | 'Protein Hewani Tinggi Lemak' | 'Protein Nabati' | 'Sayuran A' | 'Sayuran B' | 'Sayuran C' | 'Buah-buahan' | 'Minyak/Lemak';
  urt: string;
  gram: number;
  energyKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  micronutrientHighlight?: string;
}

export interface ScannedLogDraft {
  id: string;
  extractedText: string;
  detectedDate?: string;
  detectedTemp?: number;
  detectedSupplier?: string;
  detectedBatch?: string;
  detectedItems?: string[];
  scanStatus: 'pending' | 'parsed' | 'imported';
  timestamp: string;
  imageUrl?: string;
}

export interface BgnDatabaseBackup {
  appName: string;
  exportedAt: string;
  version: string;
  activeWorkspaceId: string;
  workspaces: Workspace[];
  workspaceData: Record<string, {
    menu: MenuPlan;
    haccpLogs: HACCPLog[];
    mothers: MotherRecord[];
    toddlers: ToddlerRecord[];
    sops?: BgnSOP[];
    checklists?: DailyChecklistSession[];
  }>;
}


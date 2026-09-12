import { 
  Workspace, 
  MenuPlan, 
  HACCPLog, 
  MotherRecord, 
  ToddlerRecord, 
  ScannedLogDraft, 
  BgnSOP,
  RecipeIngredient,
  DetailedNutrientAnalysis
} from '../types';
import { 
  DEFAULT_WORKSPACES, 
  INITIAL_MENU_PLAN, 
  INITIAL_HACCP_LOGS, 
  INITIAL_MOTHERS, 
  INITIAL_TODDLERS, 
  BGN_SOPS,
  MASTER_TKPI_DATABASE
} from '../data/masterData';

const STORAGE_PREFIX = 'BGN_HUB_v1';

export interface AppDataState {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  menus: MenuPlan[];
  haccpLogs: HACCPLog[];
  mothers: MotherRecord[];
  toddlers: ToddlerRecord[];
  sops: BgnSOP[];
  scannedDrafts: ScannedLogDraft[];
}

export function calculateMacroNutrients(ingredients: RecipeIngredient[] = []): DetailedNutrientAnalysis {
  return ingredients.reduce(
    (acc, ing) => {
      const food = MASTER_TKPI_DATABASE.find((f) => f.id === ing.foodId);
      if (!food) return acc;
      const ratio = (ing.netWeightGrams || 0) / 100;
      return {
        energy: acc.energy + (food.energyKcal || 0) * ratio,
        protein: acc.protein + (food.proteinG || 0) * ratio,
        fat: acc.fat + (food.fatG || 0) * ratio,
        carbs: acc.carbs + (food.carbsG || 0) * ratio,
        fiber: acc.fiber + (food.fiberG || 0) * ratio,
        calcium: acc.calcium + (food.calciumMg || 0) * ratio,
        phosphorus: acc.phosphorus + (food.phosphorusMg || 0) * ratio,
        iron: acc.iron + (food.ironMg || 0) * ratio,
        sodium: acc.sodium + (food.sodiumMg || 0) * ratio,
        potassium: acc.potassium + (food.potassiumMg || 0) * ratio,
        copper: acc.copper + (food.copperMg || 0) * ratio,
        zinc: acc.zinc + (food.zincMg || 0) * ratio,
        retinol: acc.retinol + (food.retinolMcg || 0) * ratio,
        betaCarotene: acc.betaCarotene + (food.betaCaroteneMcg || 0) * ratio,
        totalCarotene: acc.totalCarotene + (food.totalCaroteneMcg || 0) * ratio,
        thiamin: acc.thiamin + (food.thiaminMg || 0) * ratio,
        riboflavin: acc.riboflavin + (food.riboflavinMg || 0) * ratio,
        niacin: acc.niacin + (food.niacinMg || 0) * ratio,
        vitC: acc.vitC + (food.vitCMg || 0) * ratio,
      };
    },
    { 
      energy: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, 
      calcium: 0, phosphorus: 0, iron: 0, sodium: 0, potassium: 0, 
      copper: 0, zinc: 0, retinol: 0, betaCarotene: 0, totalCarotene: 0, 
      thiamin: 0, riboflavin: 0, niacin: 0, vitC: 0 
    }
  );
}

export function loadAppData(): AppDataState {
  const workspaces = getStoredWorkspaces();
  const safeWorkspaces = Array.isArray(workspaces) && workspaces.length > 0 ? workspaces : DEFAULT_WORKSPACES;
  const activeWorkspaceId = getActiveWorkspaceId() || safeWorkspaces[0].id;
  const menu = getWorkspaceMenu(activeWorkspaceId) || { ...INITIAL_MENU_PLAN, id: `menu-${activeWorkspaceId}` };
  const haccpLogs = getWorkspaceHACCP(activeWorkspaceId);
  const mothers = getWorkspaceMothers(activeWorkspaceId);
  const toddlers = getWorkspaceToddlers(activeWorkspaceId);
  const sops = getWorkspaceSOPs(activeWorkspaceId);
  const scannedDrafts = getWorkspaceScannedDrafts(activeWorkspaceId);

  return {
    workspaces: safeWorkspaces,
    activeWorkspaceId,
    menus: [menu],
    haccpLogs: Array.isArray(haccpLogs) ? haccpLogs : INITIAL_HACCP_LOGS,
    mothers: Array.isArray(mothers) ? mothers : INITIAL_MOTHERS,
    toddlers: Array.isArray(toddlers) ? toddlers : INITIAL_TODDLERS,
    sops: Array.isArray(sops) ? sops : BGN_SOPS,
    scannedDrafts: Array.isArray(scannedDrafts) ? scannedDrafts : [],
  };
}

export function saveAppData(state: AppDataState) {
  saveWorkspaces(state.workspaces);
  setActiveWorkspaceId(state.activeWorkspaceId);
  if (state.menus.length > 0) {
    const currentMenu = state.menus.find((m) => m.id.includes(state.activeWorkspaceId)) || state.menus[0];
    saveWorkspaceMenu(state.activeWorkspaceId, currentMenu);
  }
  saveWorkspaceHACCP(state.activeWorkspaceId, state.haccpLogs);
  saveWorkspaceMothers(state.activeWorkspaceId, state.mothers);
  saveWorkspaceToddlers(state.activeWorkspaceId, state.toddlers);
  saveWorkspaceSOPs(state.activeWorkspaceId, state.sops);
  saveWorkspaceScannedDrafts(state.activeWorkspaceId, state.scannedDrafts);
}

export function getStoredWorkspaces(): Workspace[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_workspaces`);
    if (!raw) {
      localStorage.setItem(`${STORAGE_PREFIX}_workspaces`, JSON.stringify(DEFAULT_WORKSPACES));
      return DEFAULT_WORKSPACES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load workspaces from localStorage', e);
    return DEFAULT_WORKSPACES;
  }
}

export function saveWorkspaces(workspaces: Workspace[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_workspaces`, JSON.stringify(workspaces));
  } catch (e) {
    console.error('Failed to save workspaces', e);
  }
}

export function getActiveWorkspaceId(): string {
  try {
    const id = localStorage.getItem(`${STORAGE_PREFIX}_active_ws`);
    return id || DEFAULT_WORKSPACES[0].id;
  } catch {
    return DEFAULT_WORKSPACES[0].id;
  }
}

export function setActiveWorkspaceId(id: string) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_active_ws`, id);
  } catch (e) {
    console.error('Failed to set active workspace', e);
  }
}

export function getWorkspaceMenu(wsId: string): MenuPlan {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_${wsId}_menu`);
    if (!raw) {
      return { ...INITIAL_MENU_PLAN, id: `menu-${wsId}` };
    }
    return JSON.parse(raw);
  } catch {
    return { ...INITIAL_MENU_PLAN, id: `menu-${wsId}` };
  }
}

export function saveWorkspaceMenu(wsId: string, menu: MenuPlan) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_menu`, JSON.stringify(menu));
  } catch (e) {
    console.error('Failed to save menu', e);
  }
}

export function getWorkspaceHACCP(wsId: string): HACCPLog[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_${wsId}_haccp`);
    if (!raw) {
      localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_haccp`, JSON.stringify(INITIAL_HACCP_LOGS));
      return INITIAL_HACCP_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_HACCP_LOGS;
  }
}

export function saveWorkspaceHACCP(wsId: string, logs: HACCPLog[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_haccp`, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save HACCP logs', e);
  }
}

export function getWorkspaceMothers(wsId: string): MotherRecord[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_${wsId}_mothers`);
    if (!raw) {
      localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_mothers`, JSON.stringify(INITIAL_MOTHERS));
      return INITIAL_MOTHERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOTHERS;
  }
}

export function saveWorkspaceMothers(wsId: string, mothers: MotherRecord[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_mothers`, JSON.stringify(mothers));
  } catch (e) {
    console.error('Failed to save mothers', e);
  }
}

export function getWorkspaceToddlers(wsId: string): ToddlerRecord[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_${wsId}_toddlers`);
    if (!raw) {
      localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_toddlers`, JSON.stringify(INITIAL_TODDLERS));
      return INITIAL_TODDLERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TODDLERS;
  }
}

export function saveWorkspaceToddlers(wsId: string, toddlers: ToddlerRecord[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_toddlers`, JSON.stringify(toddlers));
  } catch (e) {
    console.error('Failed to save toddlers', e);
  }
}

export function getWorkspaceScannedDrafts(wsId: string): ScannedLogDraft[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_${wsId}_scanned_drafts`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveWorkspaceScannedDrafts(wsId: string, drafts: ScannedLogDraft[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_scanned_drafts`, JSON.stringify(drafts));
  } catch (e) {
    console.error('Failed to save scanned drafts', e);
  }
}

export function getWorkspaceSOPs(wsId: string): BgnSOP[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}_${wsId}_sops`);
    if (!raw) {
      return BGN_SOPS;
    }
    return JSON.parse(raw);
  } catch {
    return BGN_SOPS;
  }
}

export function saveWorkspaceSOPs(wsId: string, sops: BgnSOP[]) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}_${wsId}_sops`, JSON.stringify(sops));
  } catch (e) {
    console.error('Failed to save SOPs', e);
  }
}

export type TodoItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Reflection = {
  bad: string; // 悪かったこと（昨日）
  improvement: string; // 改善案（昨日悪かったことに対する）
  good: string; // 良かったこと（昨日）
  enhancement: string; // 改良案（昨日良かったことの強化）
};

export type DayData = {
  todos: TodoItem[];
  reflection: Reflection;
};

const KEY_PREFIX = 'fukuri-nikki:v1:';

export function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getYesterday(date: Date) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d;
}

export function loadDay(dateStr: string): DayData | null {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + dateStr);
    if (!raw) return null;
    return JSON.parse(raw) as DayData;
  } catch {
    return null;
  }
}

export function saveDay(dateStr: string, data: DayData) {
  localStorage.setItem(KEY_PREFIX + dateStr, JSON.stringify(data));
}

export function ensureDay(dateStr: string): DayData {
  const existing = loadDay(dateStr);
  if (existing) return existing;
  const empty: DayData = {
    todos: [],
    reflection: { bad: '', improvement: '', good: '', enhancement: '' },
  };
  saveDay(dateStr, empty);
  return empty;
}


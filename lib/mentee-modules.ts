import type { ModuleSyllabus } from '@/types';

export const moduleFields = ['recommended_modules', 'selected_modules'] as const;
export type ModuleField = typeof moduleFields[number];

export function readModuleChoices(value: string, modules: Pick<ModuleSyllabus, 'id' | 'title'>[]) {
  const list = value.trim();
  let entries = list.split(/[,\n]/).map((entry) => entry.trim()).filter(Boolean);
  if (modules.some(({ title }) => title.toLowerCase() === list.toLowerCase())) entries = [list];
  if (value.startsWith('[')) {
    try {
      const saved: unknown = JSON.parse(value);
      if (Array.isArray(saved) && saved.every((entry) => typeof entry === 'string')) entries = saved;
    } catch {
      // Older profiles store a plain-text list.
    }
  }
  const selected = new Map<string, (typeof modules)[number]>();
  const earlier = new Set<string>();
  for (const entry of entries) {
    const match = modules.find(({ id, title }) => entry === id || entry.toLowerCase() === title.toLowerCase());
    if (match) selected.set(match.id, match);
    else earlier.add(entry);
  }
  return { selected: [...selected.values()], earlier: [...earlier] };
}

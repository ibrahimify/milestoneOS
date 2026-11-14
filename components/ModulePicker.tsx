import { useId, useState } from 'react';
import { BookOpen, ChevronDown, X } from 'lucide-react';
import { saveModuleChoices } from '@/app/actions';
import { readModuleChoices, type ModuleField } from '@/lib/mentee-modules';
import type { ModuleSyllabus } from '@/types';
import { RecordForm } from './Forms';

export default function ModulePicker({ label, name, value, modules, menteeId }: {
  label: string; name: ModuleField; value: string; modules: ModuleSyllabus[]; menteeId: string;
}) {
  const selectId = useId();
  const { selected } = readModuleChoices(value, modules);
  const saved = selected.map(({ id }) => id);
  const [draft, setDraft] = useState<string[]>();
  const choices = draft ?? saved;
  const available = modules.filter(({ id }) => !choices.includes(id));

  return <section className="panel profile-field">
    <h2 className="card-caption mb-3"><BookOpen size={16} aria-hidden="true" />{label}</h2>
    <RecordForm save={() => saveModuleChoices(menteeId, name, choices)} complete={() => setDraft(undefined)}
      disabled={JSON.stringify(choices) === JSON.stringify(saved)}>
      {choices.length > 0 && <ol className="module-selection">
        {choices.map((id) => {
          const entry = modules.find((item) => item.id === id);
          return <li key={id}><div><span>{entry?.title ?? 'Unavailable module'}</span>
            <button type="button" className="icon-button" aria-label={'Remove ' + (entry?.title ?? 'unavailable module')}
              onClick={() => setDraft(choices.filter((choice) => choice !== id))}><X size={15} aria-hidden="true" /></button>
          </div></li>;
        })}
      </ol>}
      {available.length > 0 && <div className="field">
        <label className="sr-only" htmlFor={selectId}>{'Add to ' + label.toLowerCase()}</label>
        <div className="field-select"><select id={selectId} value="" onChange={(event) => setDraft([...choices, event.target.value])}>
          <option disabled value="">Add a module</option>
          {available.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
        </select><ChevronDown size={16} aria-hidden="true" /></div>
      </div>}
      {!modules.length && <p className="muted">The catalogue has no modules yet.</p>}
    </RecordForm>
  </section>;
}

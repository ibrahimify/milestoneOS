import { useState } from 'react';
import { ArrowUpRight, BookOpen, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { deleteRecord, saveRecord } from '@/app/actions';
import { safeLink } from '@/lib/utils';
import type { ModuleCategory, ModuleSyllabus } from '@/types';
import { ActionButton, Field, FormDialog } from './Forms';

export default function SyllabusCatalogue({ modules, categories, admin }: {
  modules: ModuleSyllabus[]; categories: ModuleCategory[]; admin: boolean;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [editingModule, setModule] = useState<ModuleSyllabus | 'new'>();
  const [editingCategory, setEditingCategory] = useState<ModuleCategory | 'new'>();
  const moduleItem = editingModule === 'new' ? undefined : editingModule;
  const categoryItem = editingCategory === 'new' ? undefined : editingCategory;
  const selected = categories.find(({ id }) => id === category);
  const results = modules.filter((item) => (!selected || item.category_id === selected.id)
    && [item.title, item.division, item.faculty].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  return <div className="view-stack">
    <div className="section-heading workspace-hero"><h1>Modules</h1>
      {admin && <div className="actions">
        <button className="button hero-secondary" onClick={() => setEditingCategory('new')}>Add category</button>
        {categories.length > 0 && <button className="button primary" onClick={() => setModule('new')}><Plus size={17} />Add module</button>}
      </div>}
    </div>
    {categories.length > 0 && <>
      <div className="panel module-filters">
        <label className="search"><Search size={18} /><input type="search" aria-label="Search modules"
          placeholder="Search modules" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        <div className="category-filters" role="group" aria-label="Filter by category">
          <button type="button" aria-pressed={!selected} onClick={() => setCategory('')}>All</button>
          {categories.map(({ id, name }) => <button type="button" key={id} aria-pressed={selected?.id === id}
            onClick={() => setCategory(id)}>{name}</button>)}
        </div>
      </div>
      {admin && selected && <div className="actions">
        <button className="button" onClick={() => setEditingCategory(selected)}>Edit category</button>
        <ActionButton confirm="Delete this category?" className="button danger" run={() => deleteRecord('module_categories', selected.id)}>Delete category</ActionButton>
      </div>}
    </>}
    {!results.length && <div className="panel empty">{modules.length ? 'No modules match these filters.' : 'No modules have been published.'}</div>}
    <div className="module-grid">
      {results.map((item) => {
        const link = safeLink(item.form_link);
        return <article className="panel module-card" key={item.id}>
          <div>
            <p className="card-caption">{categories.find((parent) => parent.id === item.category_id)?.name}</p>
            <h2 className="mt-2 break-words">{item.title}</h2>
            {item.division && <p className="muted mt-3 break-words">Division: <strong>{item.division}</strong></p>}
            {item.faculty && <p className="muted mt-1 break-words">Faculty: <strong>{item.faculty}</strong></p>}
            {item.description && <p className="mt-3 whitespace-pre-wrap break-words">{item.description}</p>}
          </div>
          {(link || admin) && <div className="module-card-footer">
            {link && <a className="module-form-link" href={link} target="_blank" rel="noreferrer">
              <BookOpen size={16} aria-hidden="true" /><span>Open form</span><ArrowUpRight size={14} aria-hidden="true" />
            </a>}
            {admin && <div className="module-card-tools">
              <button className="icon-button" title="Edit module" aria-label={'Edit module: ' + item.title}
                onClick={() => setModule(item)}><Pencil size={15} /></button>
              <ActionButton confirm="Delete this module?" className="icon-button danger" label={'Delete module: ' + item.title}
                run={() => deleteRecord('modules', item.id)}><Trash2 size={15} /></ActionButton>
            </div>}
          </div>}
        </article>;
      })}
    </div>
    {editingCategory && <FormDialog title={categoryItem ? 'Edit category' : 'Add category'} close={() => setEditingCategory(undefined)}
      save={(values) => saveRecord('module_categories', values, categoryItem?.id)}>
      <Field name="name" label="Name" value={categoryItem?.name} limit={80} required />
    </FormDialog>}
    {editingModule && <FormDialog title={moduleItem ? 'Edit module' : 'Add module'} close={() => setModule(undefined)}
      save={(values) => saveRecord('modules', values, moduleItem?.id)}>
      <Field name="title" label="Title" value={moduleItem?.title} required />
      <Field name="category_id" label="Category" required value={moduleItem?.category_id || selected?.id}
        options={categories.map(({ id, name }) => ({ value: id, label: name }))} />
      <Field name="division" label="Division" value={moduleItem?.division} />
      <Field name="faculty" label="Faculty" value={moduleItem?.faculty} />
      <Field name="description" label="Description" type="textarea" value={moduleItem?.description} />
      <Field name="form_link" label="Form link" type="url" limit={2048} value={moduleItem?.form_link} />
    </FormDialog>}
  </div>;
}

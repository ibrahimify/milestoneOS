import { useState } from 'react';
import { Check, Pencil, Plus, Trash2 } from 'lucide-react';
import { deleteRecord, saveRecord, settlePayment } from '@/app/actions';
import { formatCurrency, formatDate, localDate } from '@/lib/utils';
import { currencies, type FinanceSettings, type Payment } from '@/types';
import { ActionButton, Field, FormDialog, numberValue } from './Forms';

export default function FinanceTracker({ finance, payments }: { finance: FinanceSettings; payments: Payment[] }) {
  const [settings, setSettings] = useState(false);
  const [payment, setPayment] = useState<Payment | 'new'>();
  const item = payment === 'new' ? undefined : payment;
  const tax = Math.round(finance.gross * finance.tax_rate) / 100;
  const received = payments.filter((row) => row.received_at).reduce((sum, row) => sum + row.amount, 0);
  const scheduled = payments.reduce((sum, row) => sum + row.amount, 0);
  const progress = scheduled > 0 ? Math.min(100, Math.round(received / scheduled * 100)) : 0;
  const money = (amount: number) => formatCurrency(amount, finance.currency);
  const metrics = [
    { label: 'Gross pay', amount: finance.gross },
    { label: 'Estimated net pay', amount: finance.gross - tax },
    { label: 'Money received', amount: received },
  ];
  return <div className="view-stack">
    <div className="section-heading workspace-hero"><h1>Finance</h1>
      <button className="button hero-secondary" onClick={() => setSettings(true)}>Edit pay and tax</button>
    </div>
    <div className="card-grid stats finance-kpis">
      {metrics.map(({ label, amount }) =>
        <div className={'panel' + (label === 'Money received' ? ' received-kpi' : '')} key={label}>
          <p className="muted">{label}</p><strong className="stat-value">{money(amount)}</strong>
          {label === 'Estimated net pay' && finance.tax_rate > 0 && <p className="muted tax-detail">Estimated tax {money(tax)}</p>}
        </div>)}
    </div>
    <section className="panel">
      <div className="section-heading">
        <h2>Installments</h2>
        <button className="button primary" onClick={() => setPayment('new')}><Plus size={17} />Add installment</button>
      </div>
      {!!payments.length && <div className="payment-progress">
        <p className="muted">{progress}% of {money(scheduled)} scheduled</p>
        <progress aria-label="Installments paid" max={100} value={progress} aria-valuetext={money(received) + ' of ' + money(scheduled) + ' received'} />
      </div>}
      {!payments.length && <p className="empty">No installments added.</p>}
      {payments.map((row) => <article className="payment-row" key={row.id}>
        <ActionButton className="icon-button payment-tick" pressed={!!row.received_at}
          label={(row.received_at ? 'Mark unpaid: ' : 'Mark received: ') + row.description}
          run={() => settlePayment(row.id, !row.received_at)}>
          {row.received_at && <Check size={18} aria-hidden="true" />}
        </ActionButton>
        <div className="min-w-0"><strong className="break-words">{row.description}</strong>
          <p className="muted">{row.received_at ? 'Received ' + formatDate(localDate(new Date(row.received_at))) : 'Due ' + formatDate(row.due_date)}</p>
        </div>
        <div className="payment-amount"><strong className="amount">{money(row.amount)}</strong></div>
        <div className="actions payment-tools">
          <button className="icon-button" title="Edit installment" aria-label={'Edit installment: ' + row.description}
            onClick={() => setPayment(row)}><Pencil size={16} /></button>
          <ActionButton className="icon-button danger" label={'Delete installment: ' + row.description}
            confirm="Delete this installment?" run={() => deleteRecord('payments', row.id)}><Trash2 size={16} /></ActionButton>
        </div>
      </article>)}
    </section>
    {settings && <FormDialog title="Pay and tax" close={() => setSettings(false)} save={(values) => {
      if (payments.length && values.currency !== finance.currency && !window.confirm('Change the currency label for all existing installments? Amounts stay the same.')) {
        return { error: 'Currency change cancelled.' };
      }
      return saveRecord('finance_settings', { currency: values.currency, gross: numberValue(values, 'gross'), tax_rate: numberValue(values, 'tax_rate') });
    }}>
      <Field name="currency" label="Currency" options={currencies} value={finance.currency} required />
      <Field name="gross" label="Gross pay" type="number" value={finance.gross} min={0} max={999999999999} step={0.01} required />
      <Field name="tax_rate" label="Estimated tax rate (%)" type="number" value={finance.tax_rate || undefined} min={0} max={100} step={0.01} />
    </FormDialog>}
    {payment && <FormDialog title={item ? 'Edit installment' : 'Add installment'} close={() => setPayment(undefined)}
      save={(values) => saveRecord('payments', { ...values, amount: numberValue(values, 'amount') }, item?.id)}>
      <Field name="description" label="Description" value={item?.description} required />
      <Field name="amount" label={'Amount (' + finance.currency + ')'} type="number" min={0.01} max={999999999999} step={0.01} value={item?.amount} required />
      <Field name="due_date" label="Due date" type="date" value={item?.due_date || localDate()} required />
    </FormDialog>}
  </div>;
}

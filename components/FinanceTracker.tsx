import React from 'react';
import type { MonthlySalary } from '@/types';
import { CheckCircle2, Circle, WalletCards, TrendingUp, Hourglass } from 'lucide-react';

interface FinanceTrackerProps {
  salary: MonthlySalary;
  onTogglePayment: (paymentId: string) => void;
}

export default function FinanceTracker({
  salary,
  onTogglePayment,
}: FinanceTrackerProps) {
  const totalContract = salary.total;
  const receivedTotal = salary.payments
    .filter((p) => p.received)
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingTotal = totalContract - receivedTotal;
  const clearedPct = Math.round((receivedTotal / totalContract) * 100);

  return (
    <div className="space-y-7 animate-fade-in select-none">
      <div className="glass-panel-dark relative overflow-hidden rounded-[32px] p-7 text-white md:p-10">
        <div className="absolute -right-14 -bottom-14 h-56 w-56 rounded-full bg-lime-200/14 blur-3xl" />
        <div className="max-w-3xl">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-lime-100/80">
            Finance link
          </p>
          <h1 className="text-4xl md:text-6xl font-space font-bold leading-tight tracking-tight">
            Delivery ledger
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200/70">
            Payment tracking is kept close to the mentor workload so logged minutes and settlement state are always in the same system.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: 'Gross contract', value: totalContract, detail: 'HUF total', icon: WalletCards },
          { label: 'Cleared', value: receivedTotal, detail: `${clearedPct}% received`, icon: TrendingUp },
          { label: 'Pending', value: pendingTotal, detail: 'awaiting deposit', icon: Hourglass },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="liquid-card rounded-[30px] p-6">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {metric.label}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-lime-200">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="text-3xl font-space font-bold tracking-tight text-slate-950">
                {metric.value.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500">{metric.detail}</div>
            </div>
          );
        })}
      </div>

      <div className="liquid-card overflow-hidden rounded-[30px]">
        <div className="border-b border-white/50 p-6">
          <h3 className="text-xl font-space font-bold text-slate-950 tracking-tight">
            Installment schedule
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Click a settlement row when money arrives.
          </p>
        </div>

        <div className="divide-y divide-white/50">
          {salary.payments.map((payment, idx) => (
            <button
              key={payment.id}
              onClick={() => onTogglePayment(payment.id)}
              className={`w-full p-6 text-left transition hover:bg-white/42 ${
                payment.received ? 'bg-emerald-50/40' : 'bg-white/18'
              }`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex-shrink-0">
                    {payment.received ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </span>

                  <div>
                    <div className="text-xs font-space font-bold text-slate-500 mb-1">
                      Installment #{idx + 1}
                    </div>
                    <h4 className="text-lg font-space font-bold text-slate-950 leading-tight mb-1">
                      {payment.description}
                    </h4>
                    <div className="text-xs text-slate-500">
                      Expected settlement: {payment.dueDate}
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-2xl font-space font-bold text-slate-950 tracking-tight">
                    {payment.amount.toLocaleString()} HUF
                  </div>
                  <div className={`text-xs font-space font-bold mt-1 ${payment.received ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {payment.received ? 'Cleared and settled' : 'Pending deposit'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

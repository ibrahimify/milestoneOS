import React from 'react';
import type { MonthlySalary } from '@/types';
import { DollarSign, CheckCircle2, Circle } from 'lucide-react';

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

  return (
    <div className="space-y-8 animate-fade-in select-none max-w-6xl mx-auto">
      {/* Huge clean bold header container */}
      <div className="bg-[#0b1120] rounded-[32px] p-8 md:p-12 text-white">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-6xl font-space font-bold leading-tight tracking-tight text-white">
            Finance Engine
          </h1>
          <p className="text-sm text-slate-400 font-medium max-w-lg">
            Fixed delivery revenue tracking across active lines. Click any scheduled settlement indicator below to update its clearance state instantly.
          </p>
        </div>
      </div>

      {/* Main Stats Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-8">
        {/* Gross Cap */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Gross Cap
            </span>
            <div className="text-3xl sm:text-4xl font-space font-bold text-slate-900 tracking-tight">
              {totalContract.toLocaleString()} <span className="text-xs font-normal text-slate-400">HUF</span>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
            4 Lines × 210,000 HUF Base
          </div>
        </div>

        {/* Cleared Escrow */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Cleared Escrow
            </span>
            <div className="text-3xl sm:text-4xl font-space font-bold text-emerald-600 tracking-tight">
              {receivedTotal.toLocaleString()} <span className="text-xs font-normal text-slate-400">HUF</span>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
            Verified direct deposits
          </div>
        </div>

        {/* Pending Ledger */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Pending Ledger
            </span>
            <div className="text-3xl sm:text-4xl font-space font-bold text-slate-900 tracking-tight">
              {pendingTotal.toLocaleString()} <span className="text-xs font-normal text-slate-400">HUF</span>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-slate-50 text-xs text-slate-400 font-medium">
            Guaranteed disbursement target
          </div>
        </div>
      </div>

      {/* Contract Schedule Timeline Box */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-space font-bold text-slate-900 tracking-tight">
            Installment Schedule Audit
          </h3>
        </div>

        <div className="divide-y divide-slate-50">
          {salary.payments.map((payment, idx) => (
            <div
              key={payment.id}
              onClick={() => onTogglePayment(payment.id)}
              className={`p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors cursor-pointer ${
                payment.received ? 'bg-emerald-50/20 hover:bg-emerald-50/40' : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  className="mt-1 flex-shrink-0"
                  aria-label="Toggle state"
                >
                  {payment.received ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300" />
                  )}
                </button>

                <div>
                  <div className="text-xs font-space font-bold text-slate-400 mb-1">
                    Installment #{idx + 1}
                  </div>
                  <h4 className="text-lg font-space font-bold text-slate-900 leading-tight mb-1">
                    {payment.description}
                  </h4>
                  <div className="text-xs text-slate-400 font-medium">
                    Expected Settlement: {payment.dueDate}
                  </div>
                </div>
              </div>

              <div className="sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0">
                <div className="text-2xl font-space font-bold text-slate-900 tracking-tight">
                  {payment.amount.toLocaleString()} HUF
                </div>
                <div className={`text-xs font-space font-bold mt-1 ${payment.received ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {payment.received ? 'Cleared & Settled' : 'Pending Deposit'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

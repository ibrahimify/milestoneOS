import React from 'react';
import type { MonthlySalary } from '@/types';
import { DollarSign, CheckCircle2, Circle, ArrowUpRight, TrendingUp, ShieldCheck, CreditCard } from 'lucide-react';

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

  const pctReceived = Math.round((receivedTotal / totalContract) * 100);

  return (
    <div className="space-y-6 animate-fade-in select-none max-w-6xl mx-auto">
      {/* Premium Fintech Command Header */}
      <div className="bg-[#0b1120] rounded-[32px] p-6 md:p-10 text-white shadow-premium relative overflow-hidden border border-slate-800">
        {/* Ambient subtle green mesh */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.12),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern-dark opacity-10 pointer-events-none" />

        <div className="max-w-xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-[10px] tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Self-Employed (EV) Payout Framework</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-space font-bold leading-tight tracking-tight text-slate-100">
            Milestone Contract Ledger
          </h1>
          
          <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed max-w-lg">
            Fixed contract delivery revenue calculations across 4 active instructional paths. Financial escrow triggers map directly to accredited milestone delivery outputs.
          </p>
        </div>
      </div>

      {/* Main KPI Status Dashboard Cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        {/* Gross Contract Cap */}
        <div className="bg-white rounded-[28px] p-6 md:p-7 border border-slate-100 shadow-premium flex flex-col justify-between relative overflow-hidden group hover:border-slate-200 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Gross Contract Cap
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs">
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-space font-bold text-slate-900 tracking-tight">
              {totalContract.toLocaleString()} <span className="text-xs font-normal text-slate-400">HUF</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>4 Lines × 210,000 HUF Base</span>
          </div>
        </div>

        {/* Settled Disbursements */}
        <div className="bg-white rounded-[28px] p-6 md:p-7 border border-slate-100 shadow-premium flex flex-col justify-between relative overflow-hidden group hover:border-slate-200 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Cleared Escrow
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-space font-bold text-emerald-600 tracking-tight">
              {receivedTotal.toLocaleString()} <span className="text-xs font-normal text-slate-400">HUF</span>
            </div>
          </div>
          
          {/* Progress bar state */}
          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2.5">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${pctReceived}%` }}
              />
            </div>
            <span className="text-[10px] font-space font-bold text-slate-700 leading-none">{pctReceived}%</span>
          </div>
        </div>

        {/* Pending Ledger */}
        <div className="bg-white rounded-[28px] p-6 md:p-7 border border-slate-100 shadow-premium flex flex-col justify-between relative overflow-hidden group hover:border-slate-200 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                Pending Ledger
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xs">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-space font-bold text-slate-900 tracking-tight">
              {pendingTotal.toLocaleString()} <span className="text-xs font-normal text-slate-400">HUF</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Guaranteed fixed schedule</span>
          </div>
        </div>
      </div>

      {/* Contract Schedule Timeline Box */}
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-premium overflow-hidden">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-space font-bold text-slate-900 text-sm tracking-tight">
              Disbursement Schedule Audit
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Click interactive clearance indicators to toggle settled state status natively in persistent client arrays.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 flex-shrink-0">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Active EV ID Verified</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {salary.payments.map((payment, idx) => {
            const pctText = idx === 1 ? '34%' : '33%';

            return (
              <div
                key={payment.id}
                onClick={() => onTogglePayment(payment.id)}
                className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all cursor-pointer group ${
                  payment.received
                    ? 'bg-emerald-50/30 hover:bg-emerald-50/50'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                {/* Left info column */}
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    className="mt-0.5 flex-shrink-0 transition-transform group-hover:scale-110 active:scale-95"
                    aria-label="Toggle payment received status"
                  >
                    {payment.received ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
                    )}
                  </button>
                  
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md tracking-wide">
                        Installment #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md tracking-wide border border-blue-100/50">
                        {pctText} Allocation
                      </span>
                    </div>
                    
                    <h4 className="text-xs font-space font-bold text-slate-900 leading-tight">
                      {payment.description}
                    </h4>
                    
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                      Expected Settlement Target: <strong className="text-slate-800 font-bold">{payment.dueDate}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Value Indicator */}
                <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end">
                  <div className="text-base font-space font-bold text-slate-900 tracking-tight">
                    {payment.amount.toLocaleString()} HUF
                  </div>
                  
                  <span
                    className={`text-[9px] font-bold tracking-wide px-2.5 py-1 rounded-md mt-1 block ${
                      payment.received
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                        : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                    }`}
                  >
                    {payment.received ? '✓ Cleared & Settled' : '⌛ Pending Deposit'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax Info block */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-center text-[11px] text-slate-400 font-medium">
        <span>* Disbursements are structured automatically post active term delivery markers. Flat-rate single contract lines guarantee equalized pre-tax cashflow alignment.</span>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { CheckCircle2, AlertTriangle, Clock, Target, PieChart, TrendingUp } from 'lucide-react';

const PhaseBadge = ({ phase }) => {
  const colors = {
    Planning: 'bg-sky-100 text-sky-700',
    Design: 'bg-fuchsia-100 text-fuchsia-700',
    Development: 'bg-amber-100 text-amber-700',
    Testing: 'bg-violet-100 text-violet-700',
    Deployment: 'bg-emerald-100 text-emerald-700',
    Complete: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${colors[phase] || 'bg-slate-100 text-slate-700'}`}>
      {phase}
    </span>
  );
};

const StatusSummary = ({ projects }) => {
  const totals = useMemo(() => {
    const count = projects.length;
    const avg = (projects.reduce((a, p) => a + p.percent, 0) / count).toFixed(0);
    const risks = { Red: projects.filter(p => p.risk === 'Red').length, Amber: projects.filter(p => p.risk === 'Amber').length, Green: projects.filter(p => p.risk === 'Green').length };
    const phases = projects.reduce((acc, p) => { acc[p.phase] = (acc[p.phase] || 0) + 1; return acc; }, {});
    const etaDays = Math.round(projects.reduce((a, p) => a + (p.etaDays || 0), 0) / count || 0);
    const totalHoursAllocated = projects.reduce((a,p)=>a+p.hoursAllocated,0);
    const totalHoursConsumed = projects.reduce((a,p)=>a+p.timeInvestedHours,0);
    const onTrack = projects.filter(p => {
      const remaining = Math.max(0, p.hoursAllocated - p.timeInvestedHours);
      const projected = p.burnRatePerWeek > 0 ? new Date(Date.now() + (remaining / p.burnRatePerWeek) * 7 * 24 * 60 * 60 * 1000) : null;
      return projected && projected <= new Date(p.targetDate);
    }).length;
    return { count, avg, risks, phases, etaDays, totalHoursAllocated, totalHoursConsumed, onTrack };
  }, [projects]);

  return (
    <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-sm">Overall Progress</span>
          <Target size={16} />
        </div>
        <div className="mt-2 text-3xl font-semibold">{totals.avg}%</div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all" style={{ width: `${totals.avg}%` }} />
        </div>
        <p className="mt-2 text-xs text-slate-500">Across {totals.count} active projects</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-sm">Portfolio Hours</span>
          <PieChart size={16} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-slate-500">Allocated</div>
            <div className="font-['Roboto_Mono',monospace] text-lg font-semibold tabular-nums">{totals.totalHoursAllocated.toFixed(1)}h</div>
          </div>
          <div>
            <div className="text-slate-500">Consumed</div>
            <div className="font-['Roboto_Mono',monospace] text-lg font-semibold tabular-nums">{totals.totalHoursConsumed.toFixed(1)}h</div>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500">Efficiency {(totals.totalHoursAllocated / Math.max(1, totals.totalHoursConsumed) * 100).toFixed(0)}%</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-sm">On Track</span>
          <TrendingUp size={16} />
        </div>
        <div className="mt-2 text-3xl font-semibold">{totals.onTrack}</div>
        <p className="mt-2 text-xs text-slate-500">Projects likely to meet target date</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span className="text-sm">Risk Overview</span>
          <AlertTriangle size={16} />
        </div>
        <div className="mt-2 flex items-end gap-4">
          {['Green','Amber','Red'].map((r) => (
            <div key={r} className="flex flex-1 flex-col">
              <div className="flex items-center gap-2 text-sm">
                <span className={`h-2 w-2 rounded-full ${r==='Green'?'bg-emerald-500':r==='Amber'?'bg-amber-500':'bg-rose-500'}`} />
                {r}
              </div>
              <div className="mt-1 text-2xl font-semibold">{totals.risks[r]}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">Lower is better for Red/Amber</p>
      </div>

      <div className="md:col-span-4">
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {Object.entries(totals.phases).map(([phase, count]) => (
            <div key={phase} className="flex items-center gap-2 rounded-lg bg-slate-50 px-2 py-1 text-sm">
              <PhaseBadge phase={phase} />
              <span className="text-slate-600">× {count}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatusSummary;

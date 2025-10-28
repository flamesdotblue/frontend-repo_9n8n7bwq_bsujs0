import React, { useMemo, useState } from 'react';
import { Calendar, Users, Clock, Link as LinkIcon, AlertTriangle, CheckCircle2, Eye, Edit, BarChart2, Archive } from 'lucide-react';

const formatDateUK = (iso) => {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const ProgressCircle = ({ percent = 0, size = 120 }) => {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, percent));
  const offset = c - (p / 100) * c;
  return (
    <svg width={size} height={size} className="shrink-0" role="img" aria-label={`Progress ${p}%`}>
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} stroke="#e5e7eb" strokeWidth="12" fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke="url(#grad)" strokeLinecap="round" strokeWidth="12" fill="none" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.7s ease' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-slate-800" style={{ fontSize: 18, fontWeight: 700 }}>
        {p}%
      </text>
    </svg>
  );
};

const RAGDot = ({ risk }) => {
  const color = risk === 'Red' ? 'bg-rose-500' : risk === 'Amber' ? 'bg-amber-500' : 'bg-emerald-500';
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
};

const DependencyGraph = ({ nodes = [], links = [] }) => {
  const [hover, setHover] = useState(null);
  const size = 160;
  const center = size / 2;
  const radius = 55;
  const layout = useMemo(() => {
    return nodes.map((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      return { id: n, x: center + Math.cos(angle) * radius, y: center + Math.sin(angle) * radius };
    });
  }, [nodes]);
  const byId = Object.fromEntries(layout.map((n) => [n.id, n]));

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full" role="img" aria-label="Dependency graph">
      {links.map((l, idx) => (
        <line key={idx} x1={byId[l.from]?.x || center} y1={byId[l.from]?.y || center} x2={byId[l.to]?.x || center} y2={byId[l.to]?.y || center} stroke={hover === l.from || hover === l.to ? '#6366f1' : '#cbd5e1'} strokeWidth={hover === l.from || hover === l.to ? 2.5 : 1.5} strokeOpacity={0.9} />
      ))}
      {layout.map((n) => (
        <g key={n.id} onMouseEnter={() => setHover(n.id)} onMouseLeave={() => setHover(null)}>
          <circle cx={n.x} cy={n.y} r={12} fill={hover === n.id ? '#4f46e5' : '#0ea5e9'} opacity={0.9} />
          <text x={n.x} y={n.y + 22} textAnchor="middle" fontSize="10" fill="#334155">{n.id}</text>
        </g>
      ))}
      <circle cx={center} cy={center} r={8} fill="#10b981" />
    </svg>
  );
};

const ProjectCard = ({ project }) => {
  const {
    id,
    title,
    client,
    contact,
    phase,
    timeInvestedHours,
    hoursAllocated,
    burnRatePerWeek,
    percent,
    targetDate,
    startDate,
    milestones,
    dependencies,
    risk,
  } = project;

  const hoursRemaining = Math.max(0, hoursAllocated - timeInvestedHours);
  const efficiency = timeInvestedHours > 0 ? (hoursAllocated / timeInvestedHours) * 100 : 100;
  const weeksToComplete = burnRatePerWeek > 0 ? hoursRemaining / burnRatePerWeek : null;
  const projectedCompletion = weeksToComplete !== null ? new Date(new Date().getTime() + weeksToComplete * 7 * 24 * 60 * 60 * 1000) : null;
  const scheduleVarianceDays = projectedCompletion ? Math.round((projectedCompletion - new Date(targetDate)) / (1000*60*60*24)) : null;
  const budgetVariance = timeInvestedHours - hoursAllocated; // +ve over budget

  return (
    <div className="flex h-[320px] w-full max-w-[380px] flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{id} • {title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1"><Users size={14} /> {client}</span>
            <span className="inline-flex items-center gap-1"><Calendar size={14} /> {formatDateUK(targetDate)}</span>
            <span className="inline-flex items-center gap-1"><Clock size={14} /> {timeInvestedHours.toFixed(2)}h</span>
            <span className="inline-flex items-center gap-1"><RAGDot risk={risk} /> {risk}</span>
          </div>
        </div>
        <a href={contact?.sharepoint || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline">
          <LinkIcon size={14} /> SharePoint
        </a>
      </div>

      <div className="mt-3 grid grid-cols-[120px_1fr] gap-4">
        <ProgressCircle percent={percent} />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[11px] text-slate-500">Allocated</div>
            <div className="font-['Roboto_Mono',monospace] text-sm font-semibold tabular-nums">{hoursAllocated.toFixed(2)}h</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[11px] text-slate-500">Consumed</div>
            <div className="font-['Roboto_Mono',monospace] text-sm font-semibold tabular-nums">{timeInvestedHours.toFixed(2)}h</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[11px] text-slate-500">Remaining</div>
            <div className="font-['Roboto_Mono',monospace] text-sm font-semibold tabular-nums">{hoursRemaining.toFixed(2)}h</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <div className="text-[11px] text-slate-500">Efficiency</div>
            <div className={`font-['Roboto_Mono',monospace] text-sm font-semibold tabular-nums ${efficiency>=100?'text-emerald-600':'text-amber-600'}`}>{efficiency.toFixed(0)}%</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2 col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Phase</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">{phase}</span>
            </div>
            <div className="mt-1 grid grid-cols-3 gap-2 text-xs text-slate-600">
              <div>Burn: <span className="font-['Roboto_Mono',monospace] tabular-nums">{burnRatePerWeek.toFixed(1)}h/w</span></div>
              <div>ETA: <span className="font-['Roboto_Mono',monospace] tabular-nums">{hoursRemaining > 0 ? `${(hoursRemaining / Math.max(1, burnRatePerWeek)).toFixed(1)}w` : '0w'}</span></div>
              <div>Due: <span className="font-['Roboto_Mono',monospace] tabular-nums">{formatDateUK(targetDate)}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-slate-500">Projected</div>
          <div className="font-['Roboto_Mono',monospace] tabular-nums">{projectedCompletion ? formatDateUK(projectedCompletion) : 'N/A'}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-slate-500">Schedule Var</div>
          <div className={`font-['Roboto_Mono',monospace] tabular-nums ${scheduleVarianceDays!==null && scheduleVarianceDays<=0 ? 'text-emerald-600':'text-amber-600'}`}>{scheduleVarianceDays===null?'N/A':`${scheduleVarianceDays}d`}</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-slate-500">Budget Var</div>
          <div className={`font-['Roboto_Mono',monospace] tabular-nums ${budgetVariance<=0 ? 'text-emerald-600':'text-rose-600'}`}>{budgetVariance.toFixed(1)}h</div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <div className="text-slate-500">Start</div>
          <div className="font-['Roboto_Mono',monospace] tabular-nums">{formatDateUK(startDate)}</div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="rounded bg-slate-100 px-2 py-0.5">Milestones: {milestones.filter(m=>m.done).length}/{milestones.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="View Details"><Eye size={16} /></button>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Edit"><Edit size={16} /></button>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Report"><BarChart2 size={16} /></button>
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Archive"><Archive size={16} /></button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

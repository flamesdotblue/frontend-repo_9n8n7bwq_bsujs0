import React, { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';

function daysBetween(a, b){
  return Math.round((new Date(b) - new Date(a)) / (1000*60*60*24));
}

const GanttTimeline = ({ projects }) => {
  const [rows, setRows] = useState(projects.map(p => ({ id: p.id, title: p.title, start: new Date(p.startDate), end: new Date(p.targetDate), color: '#6366f1' })));
  const [drag, setDrag] = useState(null);

  const minDate = useMemo(() => new Date(Math.min(...rows.map(r => r.start.valueOf()))), [rows]);
  const maxDate = useMemo(() => new Date(Math.max(...rows.map(r => r.end.valueOf()))), [rows]);
  const totalDays = useMemo(() => daysBetween(minDate, maxDate) + 1, [minDate, maxDate]);

  const onMouseDown = (e, id, type) => {
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    setDrag({ id, type, startX: e.clientX, rectLeft: rect.left, rectWidth: rect.width });
  };

  const onMouseMove = (e) => {
    if (!drag) return;
    const { id, type, startX, rectLeft, rectWidth } = drag;
    const deltaPx = e.clientX - startX;
    const dayPx = rectWidth / totalDays;
    const deltaDays = Math.round(deltaPx / dayPx);
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const n = { ...r };
      if (type === 'start') n.start = new Date(n.start.valueOf() + deltaDays * 24 * 60 * 60 * 1000);
      if (type === 'end') n.end = new Date(n.end.valueOf() + deltaDays * 24 * 60 * 60 * 1000);
      if (type === 'bar') { n.start = new Date(n.start.valueOf() + deltaDays * 24 * 60 * 60 * 1000); n.end = new Date(n.end.valueOf() + deltaDays * 24 * 60 * 60 * 1000); }
      return n;
    }));
    setDrag(d => d && { ...d, startX: e.clientX });
  };

  const onMouseUp = () => setDrag(null);

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
      <div className="mb-2 text-sm font-semibold text-slate-800">Interactive Gantt Timeline</div>
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[720px]">
          {rows.map((r, idx) => {
            const startOffsetDays = daysBetween(minDate, r.start);
            const durationDays = Math.max(1, daysBetween(r.start, r.end));
            const leftPct = (startOffsetDays / totalDays) * 100;
            const widthPct = (durationDays / totalDays) * 100;
            return (
              <div key={r.id} className="relative mb-3 h-10 w-full rounded bg-slate-50">
                <div className="absolute left-0 top-0 h-full w-full">
                  <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded bg-indigo-200" style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
                    <div className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 cursor-ew-resize rounded-full bg-indigo-600" onMouseDown={(e)=>onMouseDown(e, r.id, 'start')} />
                    <div className="absolute right-0 top-0 h-2 w-2 translate-x-1/2 cursor-ew-resize rounded-full bg-indigo-600" onMouseDown={(e)=>onMouseDown(e, r.id, 'end')} />
                    <div className="absolute inset-0 cursor-grab" onMouseDown={(e)=>onMouseDown(e, r.id, 'bar')} />
                  </div>
                </div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-700">{r.title}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500">Drag the ends to reschedule, or the bar to shift.</div>
    </div>
  );
};

const PortfolioGrid = ({ projects }) => {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Active Projects</h2>
        <p className="text-sm text-slate-600">{projects.length} items</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
      <GanttTimeline projects={projects} />
    </section>
  );
};

export default PortfolioGrid;

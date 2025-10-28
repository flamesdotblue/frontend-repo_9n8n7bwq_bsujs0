import React from 'react';
import { Activity, Clock } from 'lucide-react';

const ActivityFeed = ({ activities = [] }) => {
  return (
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Activity size={18} />
          <h3 className="text-base font-semibold">Recent Activity</h3>
        </div>
        <span className="text-xs text-slate-500">Last 5 events</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {activities.slice(0, 5).map((a, idx) => (
          <li key={idx} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-slate-800">
                <span className="font-medium text-indigo-700">{a.project}</span>: {a.message}
              </p>
              <p className="text-xs text-slate-500">{a.user} • {new Date(a.timestamp).toLocaleString('en-GB')}</p>
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock size={14} />
              <span>{a.relative}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ActivityFeed;

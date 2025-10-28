import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Upload, Filter, Mail } from 'lucide-react';

const brand = {
  primary: '#001d31',
  accent: '#820021',
  green: '#002718',
  gold: '#B8860B',
};

function generateId(date = new Date()) {
  const year = date.getFullYear();
  const n = Math.floor(Math.random() * 9000) + 1000; // 4 digits
  return `SPS-${year}-${n}`;
}

const initialRequests = [
  { id: generateId(new Date()), title: 'IB Open Day', purpose: 'Event', audience: ['Parents','Students'], priority: 'High', status: 'In Review', submittedAt: new Date(Date.now()-1000*60*60*12).toISOString() },
  { id: generateId(new Date()), title: 'Uniform Policy Update', purpose: 'Policy', audience: ['General'], priority: 'Medium', status: 'Published', submittedAt: new Date(Date.now()-1000*60*60*36).toISOString() },
  { id: generateId(new Date()), title: 'Newsletter – November', purpose: 'Newsletter', audience: ['Alumni','General'], priority: 'Low', status: 'In Progress', submittedAt: new Date(Date.now()-1000*60*60*72).toISOString() },
];

const SharePointPanel = ({ requester = 'Roney Lima do Nascimento' }) => {
  const [open, setOpen] = useState(true);
  const [requests, setRequests] = useState(initialRequests);
  const [form, setForm] = useState({
    title: '', purpose: 'Event', audience: [], description: '', priority: 'Medium', targetDate: '', files: [],
  });
  const [errors, setErrors] = useState({});

  const pendingCount = useMemo(() => requests.filter(r => ['Submitted','In Review','In Progress','Approved'].includes(r.status)).length, [requests]);

  const onFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const total = files.reduce((a,f)=>a+f.size,0);
    if (files.length > 5 || total > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, files: 'Max 5 files and 10MB total' }));
      return;
    }
    setErrors(prev => ({ ...prev, files: null }));
    setForm(prev => ({ ...prev, files }));
  };

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length > 100) e.title = 'Required (max 100 chars)';
    if (form.description.length > 500) e.description = 'Max 500 chars';
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    if (Object.keys(eMap).length) return;
    const newReq = {
      id: generateId(),
      title: form.title,
      purpose: form.purpose,
      audience: form.audience,
      priority: form.priority,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    };
    setRequests([newReq, ...requests]);
    setForm({ title: '', purpose: 'Event', audience: [], description: '', priority: 'Medium', targetDate: '', files: [] });
  };

  const [sortBy, setSortBy] = useState('submittedAt');
  const [asc, setAsc] = useState(false);
  const sorted = useMemo(() => {
    const arr = [...requests];
    arr.sort((a,b)=>{
      const av = a[sortBy];
      const bv = b[sortBy];
      if (sortBy === 'submittedAt') return (new Date(av)-new Date(bv)) * (asc?1:-1);
      return (''+av).localeCompare(''+bv) * (asc?1:-1);
    });
    return arr;
  }, [requests, sortBy, asc]);

  return (
    <aside className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="mb-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
        aria-expanded={open}
      >
        {open ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        SharePoint Quick Access
      </button>

      {open && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: brand.gold }} />
              <h3 className="text-base font-semibold" style={{ color: brand.primary }}>New Page Request</h3>
            </div>
            <span className="text-xs text-slate-500">Pending: {pendingCount}</span>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-sm text-slate-700">Page Title</label>
              <input
                value={form.title}
                onChange={(e)=>setForm(prev=>({ ...prev, title: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-inner focus:border-indigo-500 focus:outline-none"
                placeholder="e.g., Sixth Form Admissions"
                maxLength={100}
                required
              />
              {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-700">Purpose</label>
                <select value={form.purpose} onChange={(e)=>setForm(prev=>({ ...prev, purpose: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  {['Event','Notice','Resource','Policy','Newsletter','Other'].map(p=> <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-700">Priority</label>
                <select value={form.priority} onChange={(e)=>setForm(prev=>({ ...prev, priority: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  {['Low','Medium','High','Critical'].map(p=> <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-700">Target Audience</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {['Students','Parents','Faculty','Alumni','General'].map(a => {
                  const active = form.audience.includes(a);
                  return (
                    <button type="button" key={a} onClick={()=> setForm(prev => ({ ...prev, audience: active ? prev.audience.filter(x=>x!==a) : [...prev.audience, a] }))} className={`rounded-full px-3 py-1 text-xs ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-700">Content Description</label>
              <textarea value={form.description} onChange={(e)=>setForm(prev=>({ ...prev, description: e.target.value }))} maxLength={500} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Brief summary (max 500 characters)" />
              {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-700">Requested By</label>
                <input value={requester} readOnly className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-sm text-slate-700">Requested Date</label>
                <input value={new Date().toLocaleDateString('en-GB')} readOnly className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-700">Target Publication Date</label>
                <input type="date" value={form.targetDate} onChange={(e)=>setForm(prev=>({ ...prev, targetDate: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-700"><Upload size={14} /> Supporting Documents</label>
                <input type="file" multiple onChange={onFileChange} className="mt-1 w-full text-sm" />
                {errors.files && <p className="mt-1 text-xs text-rose-600">{errors.files}</p>}
              </div>
            </div>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-indigo-700 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-800"><Plus size={16} /> Submit Request</button>
          </form>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Filter size={16} />
                <span className="text-sm">Pending Requests</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <label>Sort by</label>
                <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="rounded border border-slate-300 px-2 py-1">
                  <option value="submittedAt">Submitted</option>
                  <option value="title">Title</option>
                  <option value="purpose">Purpose</option>
                  <option value="priority">Priority</option>
                </select>
                <button onClick={()=>setAsc(v=>!v)} className="rounded border border-slate-300 px-2 py-1">{asc?'Asc':'Desc'}</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-2 py-2">ID</th>
                    <th className="px-2 py-2">Title</th>
                    <th className="px-2 py-2">Purpose</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Priority</th>
                    <th className="px-2 py-2">Submitted</th>
                    <th className="px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(r => (
                    <tr key={r.id} className="border-t border-slate-100">
                      <td className="px-2 py-2 font-mono">{r.id}</td>
                      <td className="px-2 py-2">{r.title}</td>
                      <td className="px-2 py-2">{r.purpose}</td>
                      <td className="px-2 py-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${r.status==='Published'?'bg-emerald-100 text-emerald-700':r.status==='In Progress'?'bg-amber-100 text-amber-700':'bg-slate-100 text-slate-700'}`}>{r.status}</span>
                      </td>
                      <td className="px-2 py-2">{r.priority}</td>
                      <td className="px-2 py-2">{new Date(r.submittedAt).toLocaleDateString('en-GB')}</td>
                      <td className="px-2 py-2">
                        <button className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-1 text-xs text-white"><Mail size={14} /> Notify</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SharePointPanel;

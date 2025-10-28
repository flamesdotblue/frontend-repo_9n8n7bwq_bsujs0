import React, { useMemo } from 'react';
import Hero from './components/Hero';
import StatusSummary from './components/StatusSummary';
import PortfolioGrid from './components/PortfolioGrid';
import SharePointPanel from './components/SharePointPanel';

const projectsSeed = [
  {
    id: 'PRJ-001',
    title: 'Paulean AI v2.0',
    client: 'Mathematics Department',
    contact: { name: 'Roney Lima do Nascimento', role: 'Head of EdTech', email: 'roney.nascimento@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/paulean-ai' },
    phase: 'Development',
    timeInvestedHours: 186.5,
    hoursAllocated: 220,
    burnRatePerWeek: 24,
    percent: 80,
    startDate: '2024-08-01',
    targetDate: '2024-12-15',
    milestones: [
      { name: 'Model fine‑tuning', done: true },
      { name: 'Curriculum alignment', done: true },
      { name: 'Safety & bias review', done: true },
      { name: 'Classroom pilot v2', done: false },
      { name: 'Deployment playbook', done: false },
    ],
    dependencies: { nodes: ['NLP', 'UI', 'Data', 'API', 'Auth'], links: [{ from: 'UI', to: 'API' }, { from: 'NLP', to: 'Data' }, { from: 'API', to: 'Auth' }] },
    risk: 'Amber',
    etaDays: 18,
  },
  {
    id: 'PRJ-002',
    title: 'Advanced Grades & Assessment System',
    client: 'Academic Administration',
    contact: { name: 'Ana Souza', role: 'Assessment Lead', email: 'ana.souza@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/grades' },
    phase: 'Testing',
    timeInvestedHours: 142.25,
    hoursAllocated: 210,
    burnRatePerWeek: 20,
    percent: 65,
    startDate: '2024-07-10',
    targetDate: '2025-01-10',
    milestones: [
      { name: 'Gradebook engine', done: true },
      { name: 'Rubrics builder', done: true },
      { name: 'Audit trails', done: false },
      { name: 'QA scenarios', done: false },
    ],
    dependencies: { nodes: ['DB', 'UI', 'API', 'SSO'], links: [{ from: 'UI', to: 'API' }, { from: 'API', to: 'DB' }, { from: 'API', to: 'SSO' }] },
    risk: 'Amber',
    etaDays: 24,
  },
  {
    id: 'PRJ-003',
    title: 'Form Three Portal',
    client: 'Lower School',
    contact: { name: 'Carlos Mendes', role: 'Year Lead', email: 'c.mendes@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/form-three' },
    phase: 'Development',
    timeInvestedHours: 98.75,
    hoursAllocated: 180,
    burnRatePerWeek: 18,
    percent: 55,
    startDate: '2024-08-12',
    targetDate: '2024-11-30',
    milestones: [
      { name: 'Student dashboard', done: true },
      { name: 'Parent notices', done: false },
      { name: 'Attendance sync', done: false },
      { name: 'Mobile QA', done: false },
    ],
    dependencies: { nodes: ['API', 'UI', 'Comms', 'SSO'], links: [{ from: 'UI', to: 'API' }, { from: 'Comms', to: 'API' }] },
    risk: 'Green',
    etaDays: 21,
  },
  {
    id: 'PRJ-004',
    title: 'Careers Guidance Platform',
    client: 'Student Services',
    contact: { name: 'Julia Ferreira', role: 'Careers Lead', email: 'j.ferreira@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/careers' },
    phase: 'Testing',
    timeInvestedHours: 155.1,
    hoursAllocated: 210,
    burnRatePerWeek: 21,
    percent: 70,
    startDate: '2024-07-25',
    targetDate: '2024-12-05',
    milestones: [
      { name: 'Profile matching', done: true },
      { name: 'Universities DB', done: true },
      { name: 'Counsellor tools', done: false },
      { name: 'Accessibility pass', done: false },
    ],
    dependencies: { nodes: ['DB', 'Search', 'UI', 'API'], links: [{ from: 'Search', to: 'DB' }, { from: 'UI', to: 'API' }] },
    risk: 'Green',
    etaDays: 16,
  },
  {
    id: 'PRJ-005',
    title: 'Feedback & Lesson Observations v2',
    client: 'Teaching & Learning',
    contact: { name: 'Pedro Alves', role: 'CPD Lead', email: 'p.alves@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/feedback' },
    phase: 'Design',
    timeInvestedHours: 44.8,
    hoursAllocated: 160,
    burnRatePerWeek: 12,
    percent: 25,
    startDate: '2024-09-01',
    targetDate: '2025-02-15',
    milestones: [
      { name: 'Observation templates', done: true },
      { name: 'Calibration flow', done: false },
      { name: 'Analytics views', done: false },
      { name: 'Pilot cohort', done: false },
    ],
    dependencies: { nodes: ['UI', 'API', 'SSO'], links: [{ from: 'UI', to: 'API' }, { from: 'API', to: 'SSO' }] },
    risk: 'Amber',
    etaDays: 45,
  },
  {
    id: 'PRJ-006',
    title: 'IB Mathematics Resources Hub',
    client: 'IB Programme',
    contact: { name: 'Isabela Rocha', role: 'IB Coordinator', email: 'i.rocha@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/ib-math' },
    phase: 'Design',
    timeInvestedHours: 56.2,
    hoursAllocated: 170,
    burnRatePerWeek: 14,
    percent: 30,
    startDate: '2024-08-22',
    targetDate: '2025-03-10',
    milestones: [
      { name: 'Syllabus mapping', done: true },
      { name: 'Resource ingestion', done: false },
      { name: 'Search UX', done: false },
      { name: 'Permissions', done: false },
    ],
    dependencies: { nodes: ['Search', 'UI', 'DB'], links: [{ from: 'Search', to: 'DB' }, { from: 'UI', to: 'DB' }] },
    risk: 'Green',
    etaDays: 52,
  },
  {
    id: 'PRJ-007',
    title: 'Institutional Learning Management',
    client: 'Whole School',
    contact: { name: 'Marina Costa', role: 'Deputy Head', email: 'm.costa@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/ilm' },
    phase: 'Planning',
    timeInvestedHours: 28.4,
    hoursAllocated: 200,
    burnRatePerWeek: 10,
    percent: 20,
    startDate: '2024-09-15',
    targetDate: '2025-05-01',
    milestones: [
      { name: 'Requirements capture', done: true },
      { name: 'Vendor matrix', done: false },
      { name: 'Procurement plan', done: false },
      { name: 'Data model', done: false },
    ],
    dependencies: { nodes: ['Data', 'SSO', 'LMS'], links: [{ from: 'LMS', to: 'SSO' }, { from: 'Data', to: 'LMS' }] },
    risk: 'Amber',
    etaDays: 80,
  },
  {
    id: 'PRJ-008',
    title: 'Educational Tools Suite',
    client: 'Faculty Development',
    contact: { name: 'Thiago Ramos', role: 'PD Lead', email: 't.ramos@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/tools' },
    phase: 'Planning',
    timeInvestedHours: 22.15,
    hoursAllocated: 140,
    burnRatePerWeek: 9,
    percent: 15,
    startDate: '2024-09-20',
    targetDate: '2025-04-12',
    milestones: [
      { name: 'Tool audit', done: true },
      { name: 'Single sign‑on', done: false },
      { name: 'Training paths', done: false },
      { name: 'Roll‑out plan', done: false },
    ],
    dependencies: { nodes: ['SSO', 'Docs', 'UI'], links: [{ from: 'UI', to: 'Docs' }, { from: 'SSO', to: 'UI' }] },
    risk: 'Green',
    etaDays: 66,
  },
  {
    id: 'PRJ-009',
    title: 'School News & Communications',
    client: 'Marketing & Comms',
    contact: { name: 'Fernanda Lima', role: 'Comms Manager', email: 'f.lima@sps.edu.br', sharepoint: 'https://sharepoint.com/sites/news' },
    phase: 'Testing',
    timeInvestedHours: 120.0,
    hoursAllocated: 190,
    burnRatePerWeek: 19,
    percent: 60,
    startDate: '2024-08-05',
    targetDate: '2024-12-20',
    milestones: [
      { name: 'Editorial workflow', done: true },
      { name: 'Media CDN', done: true },
      { name: 'Notifications', done: false },
      { name: 'Policy review', done: false },
    ],
    dependencies: { nodes: ['CDN', 'API', 'UI', 'Comms'], links: [{ from: 'UI', to: 'API' }, { from: 'API', to: 'CDN' }] },
    risk: 'Green',
    etaDays: 20,
  },
];

export default function App() {
  const projects = useMemo(() => projectsSeed, []);
  const medianPercent = useMemo(() => {
    const arr = projects.map(p => p.percent).sort((a,b)=>a-b);
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 ? arr[mid] : Math.round((arr[mid - 1] + arr[mid]) / 2);
  }, [projects]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-6 md:px-8">
        <Hero medianPercent={medianPercent} />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div>
            <StatusSummary projects={projects} />
            <PortfolioGrid projects={projects} />
          </div>
          <div>
            <SharePointPanel />
          </div>
        </div>
      </div>
      <footer className="mt-8 border-t border-slate-200 bg-white/60 py-4 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} St Paul’s School, São Paulo • Dashboard by EdTech</p>
        </div>
      </footer>
    </div>
  );
}

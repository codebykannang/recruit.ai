import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Sidebar from '../shared/Sidebar';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const ax = axios.create({ baseURL: API, withCredentials: true });

/* ── shared ui components ──────────────────────────────────── */
function Card({ children, style }) {
  return (
    <div style={{
      background: '#131320', border: '1px solid rgba(255,255,255,.08)',
      borderRadius: 18, padding: '24px 22px', ...style,
    }}>{children}</div>
  );
}

function StatCard({ label, value, icon, color, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      style={{
        background: '#131320', border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 18, padding: 22, position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '.8px', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 22 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '2rem', fontWeight: 800, color: '#f0f4ff', lineHeight: 1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize: 11, color: '#8b9bbf', marginTop: 8 }}>{sub}</div>}
    </motion.div>
  );
}

function Hero({ title, accent, desc, badge, badgeColor, children }) {
  return (
    <div style={{
      position: 'relative', borderRadius: 20, overflow: 'hidden',
      marginBottom: 28, padding: '40px 36px',
      background: 'linear-gradient(135deg, #131320 0%, #0f0f1a 100%)',
      border: '1px solid rgba(255,255,255,.08)',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(124,58,237,.12) 0%, transparent 70%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
          borderRadius: 100, background: `rgba(${badgeColor || '124,58,237'},.12)`,
          border: `1px solid rgba(${badgeColor || '124,58,237'},.3)`,
          color: `rgb(${badgeColor || '167,139,250'})`, fontSize: 11, fontWeight: 700,
          letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 14,
        }}>{badge}</div>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-.02em' }}>
          {title} <span style={{ background: 'linear-gradient(90deg,#a78bfa,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{accent}</span>
        </h1>
        <p style={{ fontSize: 14, color: '#8b9bbf', marginBottom: children ? 20 : 0 }}>{desc}</p>
        {children}
      </div>
    </div>
  );
}

function Badge({ text, color }) {
  const colorMap = {
    new: '#38bdf8', screening: '#a78bfa', shortlisted: '#34d399',
    interview: '#fbbf24', offered: '#fb923c', hired: '#10b981', rejected: '#f43f5e',
  };
  const c = colorMap[text] || '#8b9bbf';
  return (
    <span style={{
      padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700,
      background: `${c}22`, color: c, border: `1px solid ${c}44`,
      textTransform: 'capitalize',
    }}>{text}</span>
  );
}

/* ── DASHBOARD PAGE ─────────────────────────────────────────── */
function DashboardPage({ user }) {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [funnel, setFunnel] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    ax.get('/api/dashboard').then(r => {
      const d = r.data;
      setStats({ total_candidates: d.total_candidates, active_jobs: d.active_jobs, screened_today: d.screened_today, avg_score: d.avg_score });
      // Build trend from monthly_trend if present
      if (d.monthly_trend) setTrend(d.monthly_trend.map(x => ({ date: x.month || x.date, count: x.count })));
      // Build funnel from pipeline_stages
      if (d.pipeline_stages) setFunnel(Object.entries(d.pipeline_stages).map(([stage, count]) => ({ stage, count })));
    }).catch(() => {});
    ax.get('/api/candidates').then(r => setCandidates((r.data.candidates || []).slice(0, 5))).catch(() => {});
  }, []);

  return (
    <div>
      <Hero
        title="Recruitment" accent="Intelligence"
        desc="Your real-time hiring operations — all in one place"
        badge="⬤  Live Dashboard" badgeColor="167,139,250"
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Candidates" value={stats?.total_candidates} icon="👥" color="#7c3aed" sub="All-time pipeline" />
        <StatCard label="Active Jobs" value={stats?.active_jobs} icon="💼" color="#0ea5e9" sub="Open positions" />
        <StatCard label="Screened Today" value={stats?.screened_today} icon="🤖" color="#10b981" sub="AI processed" />
        <StatCard label="Avg ATS Score" value={stats?.avg_score ? `${Math.round(stats.avg_score)}%` : null} icon="⭐" color="#f59e0b" sub="Resume quality" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', fontWeight: 700, color: '#f0f4ff' }}>Applications Trend</h3>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: 'rgba(124,58,237,.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,.25)' }}>30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trend}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#4a5568' }} />
              <YAxis tick={{ fontSize: 10, fill: '#4a5568' }} />
              <Tooltip contentStyle={{ background: '#131320', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: '#f0f4ff', fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 20 }}>Pipeline Funnel</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={funnel} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10, fill: '#4a5568' }} />
              <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#8b9bbf' }} width={80} />
              <Tooltip contentStyle={{ background: '#131320', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: '#f0f4ff', fontSize: 12 }} />
              <Bar dataKey="count" fill="#7c3aed" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <Card>
        <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 18 }}>Recent Candidates</h3>
        {candidates.length === 0 ? (
          <p style={{ color: '#4a5568', fontSize: 14, textAlign: 'center', padding: '30px 0' }}>No candidates yet — upload resumes to get started</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Job', 'ATS Score', 'Status'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '.8px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,.06)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <td style={{ padding: '12px 12px', fontSize: 13, color: '#f0f4ff', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#8b9bbf' }}>{c.email}</td>
                    <td style={{ padding: '12px 12px', fontSize: 12, color: '#8b9bbf' }}>{c.job_title || '—'}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${c.ats_score || 0}%`, background: 'linear-gradient(90deg,#7c3aed,#0ea5e9)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, minWidth: 32 }}>{c.ats_score || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 12px' }}><Badge text={c.status || 'new'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── SCREENING PAGE ─────────────────────────────────────────── */
function ScreeningPage() {
  const [jobs, setJobs] = useState([]);
  const [selJob, setSelJob] = useState('');
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    ax.get('/api/jobs').then(r => setJobs(r.data.jobs || [])).catch(() => {});
  }, []);

  const addFiles = (newFiles) => {
    setFiles(prev => [...prev, ...Array.from(newFiles)]);
  };

  const runScreening = async () => {
    if (!files.length) { toast.error('Please upload at least one resume'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      files.forEach(f => fd.append('files', f));
      if (selJob) fd.append('job_id', selJob);
      fd.append('source', 'direct');
      const { data } = await ax.post('/api/screen', fd);
      setResults(data.results || []);
      setFiles([]);
      toast.success(`Screened ${data.results?.length || 0} resumes!`);
    } catch (e) {
      toast.error('Screening failed — ' + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s) => s >= 75 ? '#34d399' : s >= 50 ? '#fbbf24' : '#f43f5e';

  return (
    <div>
      <Hero title="Resume" accent="Screening" desc="Upload PDFs and DOCXs — get instant AI-ranked results" badge="🤖 AI Engine" badgeColor="192,132,252" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', color: '#f0f4ff', marginBottom: 18 }}>Upload & Screen</h3>
          <label style={{ display: 'block', fontSize: 11, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '.8px', fontWeight: 600, marginBottom: 6 }}>Target Job (optional)</label>
          <select value={selJob} onChange={e => setSelJob(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 11, padding: '10px 14px', color: '#f0f4ff', fontSize: 13, outline: 'none', marginBottom: 16 }}>
            <option value="">Any job</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${drag ? '#a78bfa' : 'rgba(255,255,255,.12)'}`,
              borderRadius: 14, padding: '36px 24px', textAlign: 'center', cursor: 'pointer',
              background: drag ? 'rgba(124,58,237,.07)' : 'rgba(255,255,255,.02)',
              transition: 'all .2s', marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 10 }}>📄</div>
            <div style={{ fontSize: 14, color: '#f0f4ff', fontWeight: 600, marginBottom: 4 }}>Drop resumes here or click to browse</div>
            <div style={{ fontSize: 12, color: '#4a5568' }}>PDF, DOCX, DOC, TXT · Multiple files supported</div>
          </div>
          <input ref={inputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt" style={{ display: 'none' }} onChange={e => addFiles(e.target.files)} />

          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'rgba(124,58,237,.08)', border: '1px solid rgba(124,58,237,.2)', borderRadius: 10, marginBottom: 6, fontSize: 12, color: '#a78bfa' }}>
              📎 {f.name}
              <span onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#4a5568' }}>✕</span>
            </div>
          ))}

          <button onClick={runScreening} disabled={loading || !files.length} style={{
            width: '100%', padding: '13px', borderRadius: 12, marginTop: 8,
            background: loading ? 'rgba(124,58,237,.4)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            border: 'none', color: '#fff', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(124,58,237,.35)',
          }}>
            {loading ? '⏳ Screening...' : '🧠 Run AI Screening'}
          </button>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: '1rem', color: '#f0f4ff' }}>Results</h3>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 100, background: 'rgba(192,132,252,.12)', color: '#c084fc', border: '1px solid rgba(192,132,252,.25)' }}>{results.length} processed</span>
          </div>
          {results.length === 0 ? (
            <p style={{ color: '#4a5568', fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Upload resumes to see AI results</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 500, overflowY: 'auto' }}>
              {[...results].sort((a, b) => (b.ats_score || 0) - (a.ats_score || 0)).map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f0f4ff', fontSize: 14 }}>{r.name || r.filename}</div>
                      <div style={{ fontSize: 11, color: '#8b9bbf', marginTop: 2 }}>{r.email || '—'}</div>
                    </div>
                    <div style={{
                      fontFamily: "'Syne',sans-serif", fontSize: '1.4rem', fontWeight: 800,
                      color: scoreColor(r.ats_score || 0),
                    }}>{r.ats_score || 0}%</div>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${r.ats_score || 0}%` }} transition={{ delay: 0.3, duration: 0.8 }}
                      style={{ height: '100%', background: `linear-gradient(90deg, ${scoreColor(r.ats_score || 0)}, #7c3aed)`, borderRadius: 2 }} />
                  </div>
                  {r.skills?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
                      {r.skills.slice(0, 6).map((s, j) => (
                        <span key={j} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(124,58,237,.12)', color: '#a78bfa', border: '1px solid rgba(124,58,237,.2)' }}>{s}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ── CANDIDATES PAGE ─────────────────────────────────────────── */
function CandidatesPage() {
  const [cands, setCands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [filterJob, setFilterJob] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filterJob) params.job_id = filterJob;
    if (filterStatus) params.status = filterStatus;
    ax.get('/api/candidates', { params }).then(r => { setCands(r.data.candidates || []); setLoading(false); }).catch(() => setLoading(false));
  }, [filterJob, filterStatus]);

  useEffect(() => {
    load();
    ax.get('/api/jobs').then(r => setJobs(r.data.jobs || [])).catch(() => {});
  }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await ax.put(`/api/candidates/${id}/status`, { status });
      setCands(cs => cs.map(c => c.id === id ? { ...c, status } : c));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div>
      <Hero title="All" accent="Candidates" desc="Browse, filter and manage your entire talent pipeline" badge="👥 Talent Pool" badgeColor="251,191,36" />
      <Card>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          <select value={filterJob} onChange={e => setFilterJob(e.target.value)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '8px 12px', color: '#f0f4ff', fontSize: 12, outline: 'none' }}>
            <option value="">All Jobs</option>
            {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, padding: '8px 12px', color: '#f0f4ff', fontSize: 12, outline: 'none' }}>
            <option value="">All Statuses</option>
            {['new','screening','shortlisted','interview','offered','hired','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <p style={{ color: '#4a5568', textAlign: 'center', padding: '40px 0' }}>Loading candidates...</p>
        ) : cands.length === 0 ? (
          <p style={{ color: '#4a5568', textAlign: 'center', padding: '40px 0' }}>No candidates found</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Name','Email','Job','ATS Score','Skills','Status','Action'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 10, color: '#4a5568', textTransform: 'uppercase', letterSpacing: '.8px', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,.07)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cands.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                    <td style={{ padding: '13px 12px', fontSize: 13, color: '#f0f4ff', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '13px 12px', fontSize: 12, color: '#8b9bbf' }}>{c.email}</td>
                    <td style={{ padding: '13px 12px', fontSize: 12, color: '#8b9bbf' }}>{c.job_title || '—'}</td>
                    <td style={{ padding: '13px 12px', minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${c.ats_score || 0}%`, background: 'linear-gradient(90deg,#7c3aed,#0ea5e9)', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, minWidth: 32 }}>{c.ats_score || 0}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 12px', maxWidth: 160 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {(c.skills || []).slice(0, 3).map((s, i) => <span key={i} style={{ fontSize: 9, padding: '2px 6px', borderRadius: 100, background: 'rgba(124,58,237,.12)', color: '#a78bfa' }}>{s}</span>)}
                      </div>
                    </td>
                    <td style={{ padding: '13px 12px' }}><Badge text={c.status || 'new'} /></td>
                    <td style={{ padding: '13px 12px' }}>
                      <select value={c.status || 'new'} onChange={e => updateStatus(c.id, e.target.value)}
                        style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '5px 8px', color: '#f0f4ff', fontSize: 11, outline: 'none', cursor: 'pointer' }}>
                        {['new','screening','shortlisted','interview','offered','hired','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── JOBS PAGE ─────────────────────────────────────────── */
function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', department: '', location: '', description: '', required_skills: '', min_experience: 0 });

  const load = () => ax.get('/api/jobs').then(r => setJobs(r.data.jobs || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      await ax.post('/api/jobs', { ...form, required_skills: form.required_skills.split(',').map(s => s.trim()) });
      toast.success('Job created!'); setModal(false); setForm({ title: '', department: '', location: '', description: '', required_skills: '', min_experience: 0 }); load();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed'); }
  };

  const F = ({ label, ...props }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
      <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.8px', textTransform: 'uppercase', color: '#4a5568' }}>{label}</label>
      <input style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 11, padding: '11px 14px', color: '#f0f4ff', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} {...props} />
    </div>
  );

  return (
    <div>
      <Hero title="Job" accent="Positions" desc="Create and manage open roles with AI-defined screening criteria" badge="💼 Positions" badgeColor="52,211,153">
        <button onClick={() => setModal(true)} style={{ padding: '11px 22px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 6px 20px rgba(124,58,237,.35)' }}>
          + New Position
        </button>
      </Hero>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
        {jobs.map(j => (
          <motion.div key={j.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
            style={{ background: '#131320', border: '1px solid rgba(255,255,255,.08)', borderRadius: 18, padding: 22, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#10b981,transparent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: 15, fontWeight: 700, color: '#f0f4ff' }}>{j.title}</h3>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(16,185,129,.12)', color: '#34d399', border: '1px solid rgba(16,185,129,.25)', fontWeight: 700 }}>OPEN</span>
            </div>
            <p style={{ fontSize: 12, color: '#8b9bbf', marginBottom: 14, lineHeight: 1.6 }}>{j.department} · {j.location}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {(j.required_skills || []).slice(0, 4).map((s, i) => (
                <span key={i} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: 'rgba(124,58,237,.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,.2)' }}>{s}</span>
              ))}
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: '#4a5568' }}>{j.candidates_count || 0} candidates · Min {j.min_experience || 0}yr exp</div>
          </motion.div>
        ))}
        {jobs.length === 0 && <p style={{ color: '#4a5568', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>No jobs yet — create your first position</p>}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setModal(false)}>
            <motion.div initial={{ scale: .9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .9, y: 30 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#131320', border: '1px solid rgba(255,255,255,.1)', borderRadius: 22, padding: '32px 28px', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: '#fff', marginBottom: 24 }}>New Job Position</h3>
              <F label="Job Title" placeholder="Senior React Developer" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <F label="Department" placeholder="Engineering" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
              <F label="Location" placeholder="Remote / Chennai" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              <F label="Required Skills (comma-separated)" placeholder="React, Node.js, Python" value={form.required_skills} onChange={e => setForm(f => ({ ...f, required_skills: e.target.value }))} />
              <F label="Min Experience (years)" type="number" value={form.min_experience} onChange={e => setForm(f => ({ ...f, min_experience: +e.target.value }))} />
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={save} style={{ flex: 1, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Create Position</button>
                <button onClick={() => setModal(false)} style={{ padding: '12px 18px', borderRadius: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#8b9bbf', cursor: 'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── GENERIC PLACEHOLDER ─────────────────────────────────────── */
function PlaceholderPage({ title, accent, desc, badge, badgeColor }) {
  return (
    <div>
      <Hero title={title} accent={accent} desc={desc} badge={badge} badgeColor={badgeColor} />
      <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
        <h3 style={{ fontFamily: "'Syne',sans-serif", color: '#f0f4ff', marginBottom: 10 }}>Coming Soon</h3>
        <p style={{ color: '#8b9bbf', fontSize: 14 }}>This section is being integrated with the Flask backend API.</p>
      </Card>
    </div>
  );
}

/* ── MAIN APP ────────────────────────────────────────────────── */
export default function RecruiterApp({ user }) {
  const [page, setPage] = useState('dashboard');

  const pages = {
    dashboard: <DashboardPage user={user} />,
    jobs: <JobsPage />,
    screening: <ScreeningPage />,
    candidates: <CandidatesPage />,
    recommendations: <PlaceholderPage title="AI" accent="Recommendations" desc="Intelligent candidate-role matching powered by deep learning" badge="💡 Smart Matching" badgeColor="232,121,249" />,
    ml: <PlaceholderPage title="ML" accent="Classification" desc="Machine learning models for candidate classification and prediction" badge="🤖 ML Engine" badgeColor="96,165,250" />,
    feedback: <PlaceholderPage title="Feedback" accent="Learning" desc="Continuously improve AI accuracy from recruiter feedback signals" badge="💬 Learning" badgeColor="52,211,153" />,
    bias: <PlaceholderPage title="Bias" accent="Reduction" desc="Ensure fair, diverse hiring with blind screening and audit tools" badge="🛡 Fairness" badgeColor="251,191,36" />,
    email: <PlaceholderPage title="Email" accent="Notifications" desc="Automated candidate communication across all pipeline stages" badge="✉️ Outreach" badgeColor="96,165,250" />,
    reports: <PlaceholderPage title="Reports &" accent="Analytics" desc="Deep hiring intelligence and pipeline analytics in one view" badge="📊 Reports" badgeColor="251,146,60" />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#09090f' }}>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#131320', border: '1px solid rgba(255,255,255,.1)', color: '#f0f4ff', borderRadius: 12, fontSize: 13 },
      }} />
      <Sidebar page={page} setPage={setPage} user={user} />
      <main style={{
        marginLeft: 66, padding: '28px 28px 60px',
        minHeight: '100vh',
      }}>
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {pages[page] || pages.dashboard}
          </motion.div>
        </AnimatePresence>
      </main>
      <style>{`
        @media (max-width: 768px) {
          main { margin-left: 0 !important; padding: 70px 16px 60px !important; }
          .g2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

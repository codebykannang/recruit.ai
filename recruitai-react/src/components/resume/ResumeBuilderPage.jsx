import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { RESUME_TEMPLATES, emptyResumeData, sampleResumeData } from './resumeTemplates';
import { downloadResumePDF } from './generateResumePDF';

function Field({ label, value, onChange, placeholder, textarea, half }) {
  return (
    <label className={`rb-field ${half ? 'rb-half' : ''}`}>
      <span className="rb-label">{label}</span>
      {textarea ? (
        <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={4} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function BulletEditor({ bullets, onChange }) {
  const update = (i, v) => onChange(bullets.map((b, idx) => (idx === i ? v : b)));
  const add = () => onChange([...bullets, '']);
  const remove = (i) => onChange(bullets.filter((_, idx) => idx !== i));
  return (
    <div className="rb-bullets">
      {bullets.map((b, i) => (
        <div className="rb-bullet-row" key={i}>
          <span>•</span>
          <input value={b} placeholder="Describe an achievement or responsibility..." onChange={(e) => update(i, e.target.value)} />
          {bullets.length > 1 && <button type="button" className="rb-x" onClick={() => remove(i)}>✕</button>}
        </div>
      ))}
      <button type="button" className="rb-add" onClick={add}>+ Add bullet point</button>
    </div>
  );
}

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('template'); // 'template' | 'editor'
  const [templateId, setTemplateId] = useState(RESUME_TEMPLATES[0].id);
  const [data, setData] = useState(emptyResumeData());

  const template = useMemo(() => RESUME_TEMPLATES.find((t) => t.id === templateId), [templateId]);

  const updateField = (key, value) => setData((d) => ({ ...d, [key]: value }));

  const updateSkill = (i, value) => setData((d) => ({ ...d, skills: d.skills.map((s, idx) => (idx === i ? { ...s, value } : s)) }));
  const updateSkillLabel = (i, label) => setData((d) => ({ ...d, skills: d.skills.map((s, idx) => (idx === i ? { ...s, label } : s)) }));
  const addSkill = () => setData((d) => ({ ...d, skills: [...d.skills, { label: '', value: '' }] }));
  const removeSkill = (i) => setData((d) => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }));

  const updateProject = (i, key, value) => setData((d) => ({ ...d, projects: d.projects.map((p, idx) => (idx === i ? { ...p, [key]: value } : p)) }));
  const updateProjectBullets = (i, bullets) => setData((d) => ({ ...d, projects: d.projects.map((p, idx) => (idx === i ? { ...p, bullets } : p)) }));
  const addProject = () => setData((d) => ({ ...d, projects: [...d.projects, { title: '', tech: '', link: '', bullets: [''] }] }));
  const removeProject = (i) => setData((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }));

  const updateExp = (i, key, value) => setData((d) => ({ ...d, experience: d.experience.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)) }));
  const updateExpBullets = (i, bullets) => setData((d) => ({ ...d, experience: d.experience.map((e, idx) => (idx === i ? { ...e, bullets } : e)) }));
  const addExp = () => setData((d) => ({ ...d, experience: [...d.experience, { role: '', company: '', duration: '', bullets: [''] }] }));
  const removeExp = (i) => setData((d) => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }));

  const updateEdu = (i, key, value) => setData((d) => ({ ...d, education: d.education.map((e, idx) => (idx === i ? { ...e, [key]: value } : e)) }));
  const addEdu = () => setData((d) => ({ ...d, education: [...d.education, { degree: '', institution: '', duration: '', score: '' }] }));
  const removeEdu = (i) => setData((d) => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }));

  const updateCert = (i, value) => setData((d) => ({ ...d, certifications: d.certifications.map((c, idx) => (idx === i ? value : c)) }));
  const addCert = () => setData((d) => ({ ...d, certifications: [...d.certifications, ''] }));
  const removeCert = (i) => setData((d) => ({ ...d, certifications: d.certifications.filter((_, idx) => idx !== i) }));

  const loadSample = () => {
    setData(sampleResumeData());
    toast.success('Sample resume loaded — edit any field to make it yours');
  };

  const handleDownload = () => {
    if (!data.fullName.trim()) {
      toast.error('Add your name before downloading');
      return;
    }
    downloadResumePDF(data, template);
    toast.success('ATS-format PDF downloaded!');
  };

  const fontFamily = template.font === 'times' ? "'Times New Roman', Times, serif" : "Arial, Helvetica, sans-serif";
  const pad = template.compact ? '26px 30px' : '34px 38px';

  return (
    <div className="rb-root">
      <Toaster position="top-right" />
      <style>{`
        .rb-root { min-height: 100vh; background: #fafafb; font-family: 'DM Sans', sans-serif; }
        .rb-nav {
          height: 64px; display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%; background: rgba(255,255,255,.9); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,.07); position: sticky; top: 0; z-index: 50;
        }
        .rb-brand { display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 17px; color: #18181b; cursor: pointer; }
        .rb-brand-ic { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg,#dc2626,#b91c1c); display:flex; align-items:center; justify-content:center; font-size:15px; }
        .rb-steps { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #71717a; font-weight: 600; }
        .rb-step-dot { width: 22px; height: 22px; border-radius: 50%; display:flex; align-items:center; justify-content:center; font-size: 11px; background:#e9ecf1; color:#71717a; }
        .rb-step-dot.active { background: linear-gradient(135deg,#dc2626,#b91c1c); color:#fff; }
        .rb-back { font-size: 13px; color: #52525b; border: 1px solid rgba(0,0,0,.14); padding: 7px 14px; border-radius: 8px; background:#fff; }

        /* Template picker */
        .rb-tpl-wrap { max-width: 980px; margin: 0 auto; padding: 60px 5% 80px; text-align: center; }
        .rb-tpl-tag { display:inline-block; padding: 6px 16px; border-radius: 100px; background: rgba(220,38,38,.08); border: 1px solid rgba(220,38,38,.3); color:#dc2626; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 18px; }
        .rb-tpl-title { font-family:'Syne',sans-serif; font-size: clamp(1.8rem,4vw,2.6rem); font-weight: 800; color:#18181b; margin-bottom: 10px; }
        .rb-tpl-sub { color:#71717a; font-size: 15px; margin-bottom: 44px; }
        .rb-tpl-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 22px; text-align: left; }
        .rb-tpl-card { background:#fff; border: 2px solid rgba(0,0,0,.08); border-radius: 16px; padding: 22px; cursor: pointer; transition: all .2s; }
        .rb-tpl-card:hover { border-color: rgba(220,38,38,.4); transform: translateY(-3px); }
        .rb-tpl-card.sel { border-color: #dc2626; box-shadow: 0 12px 30px rgba(220,38,38,.15); }
        .rb-tpl-preview { height: 130px; border-radius: 10px; background: #f8f9fb; border: 1px solid rgba(0,0,0,.06); margin-bottom: 16px; padding: 14px; display:flex; flex-direction:column; gap:5px; }
        .rb-tpl-preview .l1 { height: 8px; width: 55%; background:#18181b; border-radius: 2px; margin: 0 auto 6px; }
        .rb-tpl-preview .l2 { height: 4px; width: 80%; background:#d4d4d8; border-radius: 2px; }
        .rb-tpl-preview .l3 { height: 4px; width: 65%; background:#d4d4d8; border-radius: 2px; }
        .rb-tpl-preview .l4 { height: 5px; width: 30%; background: var(--tacc); border-radius: 2px; margin-top: 8px; }
        .rb-tpl-preview .l5 { height: 3px; width: 90%; background:#e4e4e7; border-radius: 2px; }
        .rb-tpl-name { font-family:'Syne',sans-serif; font-weight: 700; font-size: 16px; color:#18181b; margin-bottom: 4px; }
        .rb-tpl-tagline { display:inline-block; font-size: 10px; font-weight: 700; color:#dc2626; text-transform: uppercase; letter-spacing:.4px; margin-bottom: 8px; }
        .rb-tpl-desc { font-size: 13px; color:#71717a; line-height: 1.5; }
        .rb-tpl-cta { margin-top: 40px; }
        .rb-btn-primary { padding: 13px 34px; border-radius: 10px; background: linear-gradient(135deg,#dc2626,#b91c1c); border:none; color:#fff; font-size:15px; font-weight:700; box-shadow: 0 8px 24px rgba(220,38,38,.35); }
        .rb-btn-primary:disabled { opacity: .4; }

        /* Editor layout */
        .rb-editor { display: grid; grid-template-columns: minmax(0,1fr) 420px; gap: 0; align-items: start; }
        .rb-form-col { padding: 32px 5% 100px 5%; max-width: 720px; }
        .rb-preview-col { position: sticky; top: 64px; height: calc(100vh - 64px); background: #f1f3f6; border-left: 1px solid rgba(0,0,0,.07); display:flex; flex-direction:column; }
        .rb-preview-toolbar { padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,.07); display:flex; align-items:center; justify-content:space-between; background: #fff; }
        .rb-preview-toolbar .tname { font-size: 12px; font-weight: 700; color:#52525b; text-transform: uppercase; letter-spacing:.4px; }
        .rb-change-tpl { font-size: 12px; color:#dc2626; font-weight: 600; }
        .rb-preview-scroll { flex: 1; overflow-y: auto; padding: 24px; display:flex; justify-content:center; }
        .rb-paper { width: 100%; max-width: 380px; min-height: 520px; background:#fff; box-shadow: 0 10px 34px rgba(0,0,0,.14); font-size: 8.4px; color: #28282d; line-height: 1.5; }
        .rb-download-bar { padding: 16px 20px; border-top: 1px solid rgba(0,0,0,.07); background:#fff; }
        .rb-download-bar button { width: 100%; }

        .rb-section { background:#fff; border: 1px solid rgba(0,0,0,.08); border-radius: 14px; padding: 22px 24px; margin-bottom: 20px; }
        .rb-section h3 { font-family:'Syne',sans-serif; font-size: 15px; color:#18181b; margin-bottom: 4px; }
        .rb-section-sub { font-size: 12px; color:#a1a1aa; margin-bottom: 16px; }
        .rb-row { display: flex; gap: 14px; flex-wrap: wrap; }
        .rb-field { display:flex; flex-direction:column; gap: 6px; margin-bottom: 14px; flex: 1; min-width: 220px; }
        .rb-half { flex: 1 1 45%; }
        .rb-label { font-size: 12px; font-weight: 600; color:#52525b; }
        .rb-field input, .rb-field textarea {
          padding: 10px 12px; border-radius: 9px; border: 1px solid rgba(0,0,0,.14);
          font-size: 13.5px; font-family: 'DM Sans', sans-serif; color:#18181b; background:#fff;
        }
        .rb-field input:focus, .rb-field textarea:focus { outline: none; border-color: #dc2626; }
        .rb-block { border: 1px dashed rgba(0,0,0,.15); border-radius: 12px; padding: 16px; margin-bottom: 14px; position: relative; }
        .rb-block-remove { position:absolute; top: 10px; right: 10px; font-size: 12px; color:#dc2626; border:none; background:none; font-weight:700; }
        .rb-bullets { display:flex; flex-direction:column; gap: 8px; margin-top: 6px; }
        .rb-bullet-row { display:flex; align-items:center; gap: 8px; }
        .rb-bullet-row span { color:#dc2626; font-weight:700; }
        .rb-bullet-row input { flex:1; padding: 8px 10px; border-radius: 8px; border: 1px solid rgba(0,0,0,.14); font-size: 13px; }
        .rb-x { border:none; background:none; color:#a1a1aa; font-size: 13px; }
        .rb-add { align-self: flex-start; font-size: 12.5px; font-weight: 700; color:#dc2626; border: 1px dashed rgba(220,38,38,.4); background: rgba(220,38,38,.05); padding: 7px 14px; border-radius: 8px; margin-top: 4px; }
        .rb-add-block { font-size: 13px; font-weight: 700; color:#dc2626; border: 1px solid rgba(220,38,38,.4); background: rgba(220,38,38,.05); padding: 9px 16px; border-radius: 9px; }
        .rb-sample-btn { font-size: 12.5px; font-weight: 600; color:#18181b; border: 1px solid rgba(0,0,0,.14); padding: 8px 14px; border-radius: 8px; background:#fff; }

        @media (max-width: 980px) {
          .rb-editor { grid-template-columns: 1fr; }
          .rb-preview-col { position: relative; height: auto; border-left:none; border-top: 1px solid rgba(0,0,0,.07); }
        }
      `}</style>

      <nav className="rb-nav">
        <div className="rb-brand" onClick={() => navigate('/')}>
          <div className="rb-brand-ic">🧠</div> Recruit AI
        </div>
        <div className="rb-steps">
          <span className={`rb-step-dot ${phase === 'template' ? 'active' : ''}`}>1</span> Template
          <span style={{ width: 20, height: 1, background: '#d4d4d8' }} />
          <span className={`rb-step-dot ${phase === 'editor' ? 'active' : ''}`}>2</span> Edit &amp; Download
        </div>
        <button className="rb-back" onClick={() => navigate('/')}>← Back to Home</button>
      </nav>

      <AnimatePresence mode="wait">
        {phase === 'template' ? (
          <motion.div key="tpl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rb-tpl-wrap">
            <div className="rb-tpl-tag">Free Resume Builder</div>
            <h1 className="rb-tpl-title">Pick an ATS-Safe Template</h1>
            <p className="rb-tpl-sub">Every template is single-column, plain-text and parser-tested — enter your details next and export a proper ATS-format PDF.</p>
            <div className="rb-tpl-grid">
              {RESUME_TEMPLATES.map((t) => (
                <div
                  key={t.id}
                  className={`rb-tpl-card ${templateId === t.id ? 'sel' : ''}`}
                  style={{ '--tacc': t.accent }}
                  onClick={() => setTemplateId(t.id)}
                >
                  <div className="rb-tpl-preview">
                    <div className="l1" /><div className="l2" /><div className="l3" />
                    <div className="l4" /><div className="l5" /><div className="l5" />
                  </div>
                  <div className="rb-tpl-name">{t.name}</div>
                  <div className="rb-tpl-tagline">{t.tag}</div>
                  <p className="rb-tpl-desc">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="rb-tpl-cta">
              <button className="rb-btn-primary" onClick={() => setPhase('editor')}>Continue with {template.name} →</button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rb-editor">
            <div className="rb-form-col">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, color: '#18181b' }}>Enter Your Details</h2>
                <button className="rb-sample-btn" onClick={loadSample}>✨ Load Sample Data</button>
              </div>

              <div className="rb-section">
                <h3>Personal Info</h3>
                <p className="rb-section-sub">This becomes the header of your resume.</p>
                <div className="rb-row">
                  <Field label="Full Name" value={data.fullName} onChange={(v) => updateField('fullName', v)} placeholder="Kannan G" half />
                  <Field label="Professional Title" value={data.title} onChange={(v) => updateField('title', v)} placeholder="Full Stack Web Developer" half />
                </div>
                <div className="rb-row">
                  <Field label="Phone" value={data.phone} onChange={(v) => updateField('phone', v)} placeholder="+91 XXXXXXXXXX" half />
                  <Field label="Email" value={data.email} onChange={(v) => updateField('email', v)} placeholder="you@email.com" half />
                </div>
                <div className="rb-row">
                  <Field label="Portfolio" value={data.portfolio} onChange={(v) => updateField('portfolio', v)} placeholder="yoursite.netlify.app" half />
                  <Field label="GitHub" value={data.github} onChange={(v) => updateField('github', v)} placeholder="github.com/username" half />
                </div>
                <div className="rb-row">
                  <Field label="LinkedIn" value={data.linkedin} onChange={(v) => updateField('linkedin', v)} placeholder="linkedin.com/in/username" half />
                  <Field label="Location" value={data.location} onChange={(v) => updateField('location', v)} placeholder="City, State" half />
                </div>
              </div>

              <div className="rb-section">
                <h3>Professional Summary</h3>
                <Field label="" value={data.summary} onChange={(v) => updateField('summary', v)} placeholder="2-3 sentences summarizing your experience and strengths..." textarea />
              </div>

              <div className="rb-section">
                <h3>Technical Skills</h3>
                <p className="rb-section-sub">Each row becomes a "Category: skill, skill, skill" line — the format ATS parsers key on most.</p>
                {data.skills.map((s, i) => (
                  <div className="rb-row" key={i}>
                    <Field label="Category" value={s.label} onChange={(v) => updateSkillLabel(i, v)} placeholder="Frontend" half />
                    <div style={{ display: 'flex', gap: 8, flex: '1 1 45%', minWidth: 220 }}>
                      <Field label="Skills (comma separated)" value={s.value} onChange={(v) => updateSkill(i, v)} placeholder="React.js, Tailwind CSS" />
                      {data.skills.length > 1 && <button type="button" className="rb-x" style={{ marginTop: 22 }} onClick={() => removeSkill(i)}>✕</button>}
                    </div>
                  </div>
                ))}
                <button type="button" className="rb-add-block" onClick={addSkill}>+ Add skill category</button>
              </div>

              <div className="rb-section">
                <h3>Projects</h3>
                {data.projects.map((p, i) => (
                  <div className="rb-block" key={i}>
                    {data.projects.length > 1 && <button className="rb-block-remove" onClick={() => removeProject(i)}>✕ Remove</button>}
                    <div className="rb-row">
                      <Field label="Project Title" value={p.title} onChange={(v) => updateProject(i, 'title', v)} placeholder="ResumeScreen: AI Resume Platform" half />
                      <Field label="Tech Stack" value={p.tech} onChange={(v) => updateProject(i, 'tech', v)} placeholder="FastAPI, MySQL, NLP" half />
                    </div>
                    <Field label="Link" value={p.link} onChange={(v) => updateProject(i, 'link', v)} placeholder="github.com/username/repo" />
                    <span className="rb-label">Bullet Points</span>
                    <BulletEditor bullets={p.bullets} onChange={(b) => updateProjectBullets(i, b)} />
                  </div>
                ))}
                <button type="button" className="rb-add-block" onClick={addProject}>+ Add project</button>
              </div>

              <div className="rb-section">
                <h3>Experience / Internship</h3>
                {data.experience.map((e, i) => (
                  <div className="rb-block" key={i}>
                    {data.experience.length > 1 && <button className="rb-block-remove" onClick={() => removeExp(i)}>✕ Remove</button>}
                    <div className="rb-row">
                      <Field label="Role" value={e.role} onChange={(v) => updateExp(i, 'role', v)} placeholder="Web Development Intern" half />
                      <Field label="Company" value={e.company} onChange={(v) => updateExp(i, 'company', v)} placeholder="CodSoft" half />
                    </div>
                    <Field label="Duration" value={e.duration} onChange={(v) => updateExp(i, 'duration', v)} placeholder="Jan 2026 | 4 Weeks" />
                    <span className="rb-label">Bullet Points</span>
                    <BulletEditor bullets={e.bullets} onChange={(b) => updateExpBullets(i, b)} />
                  </div>
                ))}
                <button type="button" className="rb-add-block" onClick={addExp}>+ Add experience</button>
              </div>

              <div className="rb-section">
                <h3>Education</h3>
                {data.education.map((ed, i) => (
                  <div className="rb-block" key={i}>
                    {data.education.length > 1 && <button className="rb-block-remove" onClick={() => removeEdu(i)}>✕ Remove</button>}
                    <div className="rb-row">
                      <Field label="Degree" value={ed.degree} onChange={(v) => updateEdu(i, 'degree', v)} placeholder="Master of Computer Applications (MCA)" half />
                      <Field label="Duration" value={ed.duration} onChange={(v) => updateEdu(i, 'duration', v)} placeholder="Aug 2024 - Mar 2026" half />
                    </div>
                    <div className="rb-row">
                      <Field label="Institution" value={ed.institution} onChange={(v) => updateEdu(i, 'institution', v)} placeholder="Nehru College of Management" half />
                      <Field label="Score" value={ed.score} onChange={(v) => updateEdu(i, 'score', v)} placeholder="CGPA: 7.3" half />
                    </div>
                  </div>
                ))}
                <button type="button" className="rb-add-block" onClick={addEdu}>+ Add education</button>
              </div>

              <div className="rb-section">
                <h3>Certifications</h3>
                <div className="rb-bullets">
                  {data.certifications.map((c, i) => (
                    <div className="rb-bullet-row" key={i}>
                      <span>•</span>
                      <input value={c} placeholder="Certification - Provider (Date)" onChange={(e) => updateCert(i, e.target.value)} />
                      {data.certifications.length > 1 && <button type="button" className="rb-x" onClick={() => removeCert(i)}>✕</button>}
                    </div>
                  ))}
                  <button type="button" className="rb-add" onClick={addCert}>+ Add certification</button>
                </div>
              </div>
            </div>

            <div className="rb-preview-col">
              <div className="rb-preview-toolbar">
                <span className="tname">{template.name} preview</span>
                <span className="rb-change-tpl" onClick={() => setPhase('template')}>Change template</span>
              </div>
              <div className="rb-preview-scroll">
                <div className="rb-paper" style={{ fontFamily, padding: pad }}>
                  <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 15, letterSpacing: '.3px' }}>
                    {(data.fullName || 'YOUR NAME').toUpperCase()}
                  </div>
                  {data.title && <div style={{ textAlign: 'center', fontSize: 9, color: '#555', marginTop: 3 }}>{data.title}</div>}
                  {[data.phone, data.email, data.portfolio, data.github, data.linkedin, data.location].some(Boolean) && (
                    <div style={{ textAlign: 'center', fontSize: 7.4, color: '#666', marginTop: 6 }}>
                      {[data.phone, data.email, data.portfolio, data.github, data.linkedin, data.location].filter(Boolean).join('  |  ')}
                    </div>
                  )}

                  {data.summary && (
                    <PreviewSection title="Professional Summary" template={template}>
                      <div>{data.summary}</div>
                    </PreviewSection>
                  )}

                  {data.skills.some((s) => s.value) && (
                    <PreviewSection title="Technical Skills" template={template}>
                      {data.skills.filter((s) => s.value).map((s, i) => (
                        <div key={i}><b>{s.label}:</b> {s.value}</div>
                      ))}
                    </PreviewSection>
                  )}

                  {data.projects.some((p) => p.title) && (
                    <PreviewSection title="Projects" template={template}>
                      {data.projects.filter((p) => p.title).map((p, i) => (
                        <div key={i} style={{ marginBottom: 6 }}>
                          <div><b>{p.title}</b>{p.tech ? <i style={{ color: '#666' }}> ({p.tech})</i> : null}</div>
                          {p.link && <div style={{ color: '#777', fontSize: 7 }}>{p.link}</div>}
                          {p.bullets.filter(Boolean).map((b, bi) => <div key={bi}>• {b}</div>)}
                        </div>
                      ))}
                    </PreviewSection>
                  )}

                  {data.experience.some((e) => e.role) && (
                    <PreviewSection title="Experience" template={template}>
                      {data.experience.filter((e) => e.role).map((e, i) => (
                        <div key={i} style={{ marginBottom: 6 }}>
                          <div><b>{e.role}{e.company ? ` - ${e.company}` : ''}</b> {e.duration && <span style={{ float: 'right', color: '#777' }}>{e.duration}</span>}</div>
                          {e.bullets.filter(Boolean).map((b, bi) => <div key={bi}>• {b}</div>)}
                        </div>
                      ))}
                    </PreviewSection>
                  )}

                  {data.education.some((e) => e.degree) && (
                    <PreviewSection title="Education" template={template}>
                      {data.education.filter((e) => e.degree).map((e, i) => (
                        <div key={i} style={{ marginBottom: 4 }}>
                          <div><b>{e.degree}</b> {e.duration && <span style={{ float: 'right', color: '#777' }}>{e.duration}</span>}</div>
                          <div style={{ color: '#555' }}>{[e.institution, e.score].filter(Boolean).join('  |  ')}</div>
                        </div>
                      ))}
                    </PreviewSection>
                  )}

                  {data.certifications.some(Boolean) && (
                    <PreviewSection title="Certifications" template={template}>
                      {data.certifications.filter(Boolean).map((c, i) => <div key={i}>• {c}</div>)}
                    </PreviewSection>
                  )}
                </div>
              </div>
              <div className="rb-download-bar">
                <button className="rb-btn-primary" onClick={handleDownload}>⬇ Download ATS-Format PDF</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PreviewSection({ title, template, children }) {
  const borderStyle = template.headerStyle === 'underline' ? '1px solid #222' : template.headerStyle === 'rule' ? 'none' : 'none';
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        fontWeight: 700, fontSize: 8.6, textTransform: 'uppercase', letterSpacing: '.3px',
        borderBottom: borderStyle, paddingBottom: 2, marginBottom: 4,
        borderLeft: template.headerStyle === 'rule' ? `3px solid ${template.accent}` : 'none',
        paddingLeft: template.headerStyle === 'rule' ? 6 : 0,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

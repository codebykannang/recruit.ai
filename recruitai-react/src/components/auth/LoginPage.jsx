import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const LOGIN_BG = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80';

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'signup' ? 'signup' : 'login');
  const [portal, setPortal] = useState('recruiter');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      const endpoint = tab === 'login' ? '/auth/login' : '/auth/register';
      const payload = tab === 'login'
        ? { email: form.email, password: form.password, portal }
        : { name: form.name, email: form.email, password: form.password, role: portal === 'recruiter' ? 'recruiter' : 'user', company: form.company };

      const { data } = await axios.post(`${API}${endpoint}`, payload, { withCredentials: true });
      if (data.success) {
        toast.success(tab === 'login' ? 'Welcome back!' : 'Account created!');
        navigate(data.redirect || (portal === 'recruiter' ? '/app' : '/dashboard'));
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Connection error — is the server running?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: '#ffffff', overflow: 'hidden', position: 'relative',
    }}>
      <style>{`
        .auth-bg {
          position: fixed; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 80% 60% at 20% 30%,rgba(220,38,38,.07) 0%,transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 70%,rgba(220,38,38,.05) 0%,transparent 60%),
            #ffffff;
        }
        .auth-grid {
          position: fixed; inset: 0; z-index: 0;
          background-image: linear-gradient(rgba(0,0,0,.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,0,0,.025) 1px,transparent 1px);
          background-size: 48px 48px;
        }
        .auth-orb {
          position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
          animation: orbdrift linear infinite;
        }
        @keyframes orbdrift{0%,100%{transform:translate(0,0)}25%{transform:translate(30px,-25px)}50%{transform:translate(-20px,35px)}75%{transform:translate(25px,20px)}}

        /* LEFT PANEL */
        .auth-left {
          display: none; position: relative; z-index: 10; flex: 1;
          flex-direction: column; justify-content: space-between;
          padding: 52px 56px;
          background-image: linear-gradient(rgba(255,255,255,.93),rgba(255,255,255,.95)), url(${LOGIN_BG});
          background-size: cover; background-position: center;
        }
        @media(min-width:900px){.auth-left{display:flex}}

        .auth-brand { display:flex;align-items:center;gap:14px; }
        .auth-brand-ic {
          width:48px;height:48px;border-radius:14px;
          background:linear-gradient(135deg,#dc2626,#b91c1c);
          display:flex;align-items:center;justify-content:center;
          font-size:22px;box-shadow:0 8px 28px rgba(220,38,38,.35);
        }
        .auth-brand-name{font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:#18181b}
        .auth-brand-sub{font-size:10px;color:#52525b;letter-spacing:1.2px;text-transform:uppercase;margin-top:1px}

        .auth-hero { flex:1;display:flex;flex-direction:column;justify-content:center;max-width:420px; }
        .auth-tag {
          display:inline-flex;align-items:center;gap:8px;padding:6px 14px;
          border-radius:100px;background:rgba(220,38,38,.08);
          border:1px solid rgba(220,38,38,.3);color:#dc2626;
          font-size:11px;font-weight:600;letter-spacing:.6px;text-transform:uppercase;
          margin-bottom:24px;width:fit-content;
        }
        .auth-tag-dot{width:6px;height:6px;border-radius:50%;background:#dc2626;box-shadow:0 0 8px #dc2626;animation:pulse 2s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .auth-h{font-family:'Syne',sans-serif;font-size:2.8rem;font-weight:800;line-height:1.1;color:#18181b;margin-bottom:18px}
        .auth-h span{background:linear-gradient(90deg,#dc2626,#b91c1c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .auth-p{font-size:15px;color:#52525b;line-height:1.75;margin-bottom:36px}
        .auth-feats{display:flex;flex-direction:column;gap:14px}
        .auth-feat{display:flex;align-items:center;gap:14px;font-size:13px;color:#3f3f46}
        .auth-feat-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
        .auth-stats{display:flex;gap:24px;margin-top:48px;padding-top:32px;border-top:1px solid rgba(0,0,0,.07)}
        .auth-stat .n{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;background:linear-gradient(135deg,#dc2626,#b91c1c);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .auth-stat .l{font-size:11px;color:#9ca3af;text-transform:uppercase;letter-spacing:.7px;margin-top:2px}

        /* PORTAL CHOOSER */
        .auth-portal-pick{display:flex;gap:10px;margin-bottom:20px}
        .auth-pp{
          flex:1;border:2px solid rgba(0,0,0,.08);border-radius:14px;
          padding:14px 10px;cursor:pointer;text-align:center;
          transition:all .2s;background:#fafafa;
        }
        .auth-pp:hover{border-color:rgba(220,38,38,.4);background:rgba(220,38,38,.05)}
        .auth-pp.active{border-color:#dc2626;background:rgba(220,38,38,.08);box-shadow:0 0 0 2px rgba(220,38,38,.15)}
        .auth-pp-icon{font-size:24px;margin-bottom:6px}
        .auth-pp-label{font-size:12px;font-weight:700;color:#18181b;letter-spacing:.2px}
        .auth-pp-sub{font-size:10px;color:#71717a;margin-top:2px}

        /* RIGHT PANEL */
        .auth-right{
          position:relative;z-index:10;width:100%;max-width:480px;margin:auto;
          padding:32px 24px;display:flex;flex-direction:column;justify-content:center;
          min-height:100vh;overflow-y:auto;
        }
        @media(min-width:900px){.auth-right{min-height:unset;padding:52px 48px;border-left:1px solid rgba(0,0,0,.06)}}

        .auth-card{
          background:#ffffff;border:1px solid rgba(0,0,0,.08);
          border-radius:24px;padding:36px 32px;
          box-shadow:0 24px 60px rgba(0,0,0,.08);
        }
        .auth-card-head{margin-bottom:24px}
        .auth-card-head h2{font-family:'Syne',sans-serif;font-size:1.6rem;font-weight:800;color:#18181b;letter-spacing:-.3px}
        .auth-card-head p{font-size:13px;color:#52525b;margin-top:5px}

        .auth-tabs{display:flex;background:#f4f4f5;border:1px solid rgba(0,0,0,.07);border-radius:12px;padding:4px;margin-bottom:20px}
        .auth-tab{flex:1;padding:9px 12px;border-radius:9px;border:none;background:transparent;color:#52525b;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;letter-spacing:.2px}
        .auth-tab.on{background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;box-shadow:0 4px 16px rgba(220,38,38,.35)}

        .auth-alert{display:flex;align-items:center;gap:10px;padding:12px 15px;border-radius:10px;font-size:13px;margin-bottom:18px;background:rgba(220,38,38,.07);border:1px solid rgba(220,38,38,.25);color:#b91c1c}

        .auth-field{display:flex;flex-direction:column;gap:7px;margin-bottom:16px}
        .auth-label{font-size:11px;font-weight:600;letter-spacing:.8px;text-transform:uppercase;color:#71717a}
        .auth-input{
          background:#fafafa;border:1px solid rgba(0,0,0,.1);
          border-radius:11px;padding:12px 16px;color:#18181b;font-size:14px;
          font-family:'DM Sans',sans-serif;outline:none;transition:all .2s;width:100%;
        }
        .auth-input:focus{border-color:rgba(220,38,38,.5);background:rgba(220,38,38,.04);box-shadow:0 0 0 3px rgba(220,38,38,.12)}
        .auth-input::placeholder{color:#a1a1aa}

        .auth-submit{
          display:flex;align-items:center;justify-content:center;gap:10px;
          width:100%;padding:14px;border-radius:12px;
          background:linear-gradient(135deg,#dc2626,#b91c1c);
          border:none;color:#fff;font-size:15px;font-weight:700;
          cursor:pointer;transition:all .22s;font-family:'DM Sans',sans-serif;
          box-shadow:0 8px 24px rgba(220,38,38,.3);letter-spacing:.2px;
          margin-top:4px;
        }
        .auth-submit:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 14px 36px rgba(220,38,38,.45)}
        .auth-submit:disabled{opacity:.6;cursor:not-allowed}
        .auth-terms{font-size:11px;color:#9ca3af;text-align:center;line-height:1.7;margin-top:18px}
        .auth-terms button.link{background:none;border:none;padding:0;font:inherit;color:#71717a;text-decoration:underline;cursor:pointer}
        .auth-back{font-size:13px;color:#52525b;text-align:center;margin-top:20px;cursor:pointer}
        .auth-back span{color:#dc2626;font-weight:600}
        .auth-back span:hover{text-decoration:underline}
      `}</style>

      <div className="auth-bg" />
      <div className="auth-grid" />
      <div className="auth-orb" style={{ width: 500, height: 500, top: -150, left: -100, background: 'rgba(220,38,38,.06)', animationDuration: '22s' }} />
      <div className="auth-orb" style={{ width: 350, height: 350, bottom: -80, right: -60, background: 'rgba(220,38,38,.05)', animationDuration: '18s', animationDelay: '-9s' }} />

      {/* LEFT */}
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-ic">🧠</div>
          <div>
            <div className="auth-brand-name">Recruit AI</div>
            <div className="auth-brand-sub">AI Recruitment Platform</div>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-tag"><span className="auth-tag-dot" /> AI-Powered Hiring</div>
          <h1 className="auth-h">Recruit Faster, <span>Hire Smarter</span></h1>
          <p className="auth-p">The AI recruitment platform that automates resume screening, ranks candidates and reduces bias — all in one place.</p>
          <div className="auth-feats">
            {[
              { icon: '⚡', text: 'Screen 500+ resumes in under 60 seconds', c: '#dc2626' },
              { icon: '🎯', text: '94% accuracy candidate-job matching', c: '#b91c1c' },
              { icon: '🛡️', text: 'Bias-free, GDPR-compliant screening', c: '#dc2626' },
            ].map((f, i) => (
              <div key={i} className="auth-feat">
                <div className="auth-feat-ic" style={{ background: 'rgba(220,38,38,.1)', color: f.c }}>{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>
          <div className="auth-stats">
            {[['10x', 'Faster'], ['94%', 'Accuracy'], ['60%', 'Time Saved']].map(([n, l]) => (
              <div key={l} className="auth-stat"><div className="n">{n}</div><div className="l">{l}</div></div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#9ca3af' }}>© 2025 Recruit AI · Built by Prozenix</p>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="auth-card-head">
            <h2>{tab === 'login' ? 'Welcome back 👋' : 'Create account'}</h2>
            <p>{tab === 'login' ? 'Sign in to your Recruit AI account' : 'Join thousands of recruiters using AI'}</p>
          </div>

          {/* Portal chooser */}
          <div className="auth-portal-pick">
            {[
              { id: 'recruiter', icon: '🏢', label: 'Recruiter', sub: 'Hire & manage' },
              { id: 'jobseeker', icon: '👤', label: 'Job Seeker', sub: 'Find jobs' },
            ].map(p => (
              <div
                key={p.id}
                className={`auth-pp${portal === p.id ? ' active' : ''}`}
                onClick={() => setPortal(p.id)}
              >
                <div className="auth-pp-icon">{p.icon}</div>
                <div className="auth-pp-label">{p.label}</div>
                <div className="auth-pp-sub">{p.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab${tab === 'login' ? ' on' : ''}`} onClick={() => setTab('login')}>Sign In</button>
            <button className={`auth-tab${tab === 'signup' ? ' on' : ''}`} onClick={() => setTab('signup')}>Register</button>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div className="auth-alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                ⚠️ {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fields */}
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              {tab === 'signup' && (
                <>
                  <div className="auth-field">
                    <label className="auth-label">Full Name</label>
                    <input className="auth-input" placeholder="Kannan G" value={form.name} onChange={set('name')} />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Company / Organisation</label>
                    <input className="auth-input" placeholder="Prozenix" value={form.company} onChange={set('company')} />
                  </div>
                </>
              )}
              <div className="auth-field">
                <label className="auth-label">Email Address</label>
                <input className="auth-input" type="email" placeholder="you@company.com" value={form.email} onChange={set('email')} />
              </div>
              <div className="auth-field">
                <label className="auth-label">Password</label>
                <input className="auth-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
            </motion.div>
          </AnimatePresence>

          <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? '→ Sign In' : '🚀 Create Account'}
          </button>

          <p className="auth-terms">
            By continuing you agree to our <button type="button" className="link">Terms of Service</button> and <button type="button" className="link">Privacy Policy</button>.
          </p>
        </motion.div>
        <p className="auth-back" onClick={() => navigate('/')}>← <span>Back to home</span></p>
      </div>
    </div>
  );
}

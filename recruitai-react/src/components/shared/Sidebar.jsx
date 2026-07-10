import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const recruiterNav = [
  { section: 'Overview', items: [] },
  { section: null, items: [{ id: 'dashboard', icon: '⊞', label: 'Dashboard' }] },
  { section: 'Recruitment', items: [
    { id: 'jobs', icon: '💼', label: 'Job Positions' },
    { id: 'screening', icon: '🔍', label: 'AI Screening' },
    { id: 'candidates', icon: '👥', label: 'Candidates' },
    { id: 'recommendations', icon: '💡', label: 'Recommendations' },
  ]},
  { section: 'Intelligence', items: [
    { id: 'ml', icon: '🤖', label: 'ML Classification' },
    { id: 'feedback', icon: '💬', label: 'Feedback Learning' },
    { id: 'bias', icon: '🛡', label: 'Bias Reduction' },
  ]},
  { section: 'Operations', items: [
    { id: 'email', icon: '✉️', label: 'Email Notifications' },
    { id: 'reports', icon: '📊', label: 'Reports' },
  ]},
];

export default function Sidebar({ page, setPage, user }) {
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await axios.get(`${API}/auth/logout`, { withCredentials: true }); } catch {}
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', marginBottom: 26, overflow: 'hidden' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 11, flexShrink: 0,
          background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: '0 6px 18px rgba(220,38,38,.3)',
        }}>🧠</div>
        <AnimatePresence>
          {(expanded || mobileOpen) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
              style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, color: '#18181b', whiteSpace: 'nowrap' }}
            >Recruit AI</motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      {recruiterNav.map((group, gi) => (
        <div key={gi}>
          {group.section && (expanded || mobileOpen) && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#9ca3af', padding: '7px 20px 3px' }}
            >{group.section}</motion.div>
          )}
          {group.items.map(item => (
            <div
              key={item.id}
              onClick={() => { setPage(item.id); setMobileOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 13,
                padding: '10px 16px', cursor: 'pointer',
                borderLeft: `3px solid ${page === item.id ? '#dc2626' : 'transparent'}`,
                color: page === item.id ? '#dc2626' : '#52525b',
                background: page === item.id ? 'rgba(220,38,38,.08)' : 'transparent',
                fontSize: 13, fontWeight: 500,
                margin: '1px 8px 1px 0', borderRadius: '0 10px 10px 0',
                transition: 'all .2s', whiteSpace: 'nowrap', overflow: 'hidden',
              }}
              onMouseEnter={e => { if (page !== item.id) { e.currentTarget.style.background = 'rgba(0,0,0,.04)'; e.currentTarget.style.color = '#18181b'; } }}
              onMouseLeave={e => { if (page !== item.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#52525b'; } }}
            >
              <span style={{ fontSize: 16, minWidth: 22, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <AnimatePresence>
                {(expanded || mobileOpen) && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.05 } }} exit={{ opacity: 0 }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {/* User pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', margin: '0 8px',
        background: '#f8f9fb', borderRadius: 12,
        border: '1px solid rgba(0,0,0,.07)', overflow: 'hidden',
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
          background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#fff',
        }}>{(user?.name || '?')[0].toUpperCase()}</div>
        <AnimatePresence>
          {(expanded || mobileOpen) && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#18181b', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 10, color: '#52525b', textTransform: 'capitalize' }}>{user?.role}</div>
            </motion.div>
          )}
        </AnimatePresence>
        {(expanded || mobileOpen) && (
          <span onClick={handleLogout} style={{ cursor: 'pointer', fontSize: 14, color: '#dc2626', flexShrink: 0 }} title="Sign out">↩</span>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        animate={{ width: expanded ? 230 : 66 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        style={{
          position: 'fixed', left: 0, top: 0, height: '100vh',
          background: '#ffffff', borderRight: '1px solid rgba(0,0,0,.08)',
          display: 'flex', flexDirection: 'column', padding: '18px 0 14px',
          zIndex: 200, overflow: 'hidden',
        }}
        className="sidebar-desktop"
      >
        <SidebarContent />
      </motion.nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="sidebar-mobile-btn"
        style={{
          display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 300,
          background: '#ffffff', border: '1px solid rgba(0,0,0,.1)',
          borderRadius: 10, padding: '10px 12px', color: '#18181b', fontSize: 18,
        }}
      >☰</button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 299 }}
            />
            <motion.nav
              initial={{ x: -250 }} animate={{ x: 0 }} exit={{ x: -250 }}
              style={{
                position: 'fixed', left: 0, top: 0, height: '100vh', width: 240,
                background: '#ffffff', borderRight: '1px solid rgba(0,0,0,.08)',
                display: 'flex', flexDirection: 'column', padding: '18px 0 14px',
                zIndex: 300, overflow: 'hidden auto',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#52525b', fontSize: 18, cursor: 'pointer' }}
              >✕</button>
              <SidebarContent />
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}

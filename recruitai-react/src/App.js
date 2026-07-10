import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/landing/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RecruiterApp from './components/dashboard/RecruiterApp';
import ResumeBuilderPage from './components/resume/ResumeBuilderPage';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios.get(`${API}/api/me`, { withCredentials: true })
      .then(r => setUser(r.data.user))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return (
      <div style={{
        minHeight: '100vh', background: '#ffffff', display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontSize: 40 }}>🧠</div>
        <div style={{ fontFamily: "'Syne',sans-serif", color: '#dc2626', fontWeight: 700 }}>Loading Recruit AI...</div>
        <div style={{ width: 48, height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#dc2626,#b91c1c)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <style>{`@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}`}</style>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children(user);
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#ffffff', border: '1px solid rgba(0,0,0,.1)', color: '#18181b', borderRadius: 12, fontSize: 13, boxShadow: '0 10px 30px rgba(0,0,0,.1)' },
      }} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resume-builder" element={<ResumeBuilderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/app" element={<ProtectedRoute>{(user) => <RecruiterApp user={user} />}</ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute>{(user) => <RecruiterApp user={user} />}</ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

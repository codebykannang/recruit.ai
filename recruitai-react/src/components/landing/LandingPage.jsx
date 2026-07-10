import { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Scene3D } from './ResumeModel3D';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Target,
  Zap,
  BarChart3,
  Mail,
  Shield,
  UploadCloud,
  Cpu,
  Layers,
  CheckCircle,
  Play,
  ArrowRight,
  Sparkles,
  FileText,
  ArrowUpRight,
  Menu,
  X
} from 'lucide-react';

const HERO_BG = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1800&q=80';
const STEPS_BG = 'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1800&q=80';
const CTA_BG = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80';
const RESUME_BG = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80';

const features = [
  { Icon: Brain, title: 'AI Resume Screening', desc: 'Instantly rank hundreds of resumes using our deep-learning ATS engine with 95%+ accuracy', color: '#ef4444', bg: 'rgba(239,68,68,.06)' },
  { Icon: Target, title: 'Smart Candidate Matching', desc: 'ML-powered job-to-candidate fit scoring across skills, experience and culture signals', color: '#f97316', bg: 'rgba(249,115,22,.06)' },
  { Icon: Zap, title: 'Bias Reduction Engine', desc: 'Blind screening mode removes demographic signals to ensure fair and diverse hiring', color: '#a78bfa', bg: 'rgba(167,139,250,.06)' },
  { Icon: BarChart3, title: 'Real-time Analytics', desc: 'Pipeline dashboards, funnel analytics and predictive hiring intelligence in one view', color: '#3b82f6', bg: 'rgba(59,130,246,.06)' },
  { Icon: Mail, title: 'Automated Outreach', desc: 'Trigger personalised email sequences based on candidate stage and AI recommendations', color: '#10b981', bg: 'rgba(16,185,129,.06)' },
  { Icon: Shield, title: 'Enterprise Security', desc: 'SOC-2 ready infrastructure with encrypted resume storage and audit logging', color: '#ec4899', bg: 'rgba(236,72,153,.06)' },
];

const stats = [
  { n: '10x', l: 'Faster Screening' },
  { n: '94%', l: 'Match Accuracy' },
  { n: '60%', l: 'Time Saved' },
  { n: '2M+', l: 'Resumes Processed' },
];

function Orb({ style }) {
  return <div className="lp-orb" style={style} />;
}

function CountUp({ to }) {
  const [count, setCount] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    const match = to.match(/^([0-9.]+)(.*)$/);
    if (!match) {
      setCount(to);
      return;
    }
    
    const num = parseFloat(match[1]);
    const suffix = match[2] || '';
    
    let start = 0;
    const duration = 1200; // 1.2s
    const steps = 40;
    const stepTime = duration / steps;
    const increment = num / steps;
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        clearInterval(timer);
        setCount(to);
      } else {
        const formatted = to.includes('.') ? start.toFixed(1) : Math.floor(start).toString();
        setCount(formatted + suffix);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [isInView, to]);

  return <span ref={ref}>{count || '0'}</span>;
}

function StatCounter({ n, l, delay }) {
  return (
    <motion.div
      className="lp-stat"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
    >
      <span className="lp-stat-n">
        <CountUp to={n} />
      </span>
      <span className="lp-stat-l">{l}</span>
    </motion.div>
  );
}

function FeatureCard({ Icon, title, desc, color, bg, index }) {
  return (
    <motion.div
      className="lp-feat-card"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.015 }}
      style={{ '--fc': color, '--fb': bg }}
    >
      <div className="lp-feat-icon" style={{ background: bg, color }}>
        <Icon size={24} />
      </div>
      <h3 className="lp-feat-title">{title}</h3>
      <p className="lp-feat-desc">{desc}</p>
      <div className="lp-feat-glow" style={{ background: color }} />
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef();
  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 60]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  const [activeTpl, setActiveTpl] = useState('modern-ats');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="lp-root">
      <style>{`
        .lp-root {
          min-height: 100vh;
          background: #090d16;
          color: #f8fafc;
          overflow-x: hidden;
          position: relative;
        }

        /* Top Progress Bar */
        .lp-progress {
          position: fixed; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #ef4444, #f97316, #a78bfa);
          transform-origin: 0%; z-index: 1000;
        }

        /* BG effects */
        .lp-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(239,68,68,.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 80%, rgba(167,139,250,.05) 0%, transparent 60%),
            #090d16;
        }
        .lp-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .lp-orb {
          position: absolute; border-radius: 50%; filter: blur(100px);
          pointer-events: none; animation: orbdrift linear infinite;
        }
        @keyframes orbdrift {
          0%,100%{transform:translate(0,0)} 25%{transform:translate(40px,-35px)}
          50%{transform:translate(-30px,45px)} 75%{transform:translate(35px,25px)}
        }

        /* PREMIUM BUTTON STYLES */
        .btn-premium-primary {
          padding: 14px 28px; border-radius: 12px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border: none; color: #fff; font-size: 15px; font-weight: 700;
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .btn-premium-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 36px rgba(239, 68, 68, 0.5), 0 0 0 2px rgba(239, 68, 68, 0.25);
          background: linear-gradient(135deg, #f87171, #dc2626);
        }
        .btn-premium-secondary {
          padding: 13px 26px; border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.03); color: #f8fafc;
          font-size: 15px; font-weight: 600; backdrop-filter: blur(8px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .btn-premium-secondary:hover {
          border-color: rgba(239, 68, 68, 0.5);
          background: rgba(239, 68, 68, 0.08); color: #ffffff;
          transform: translateY(-2px);
        }
        .btn-premium-glass {
          padding: 13px 26px; border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.05); color: #cbd5e1;
          font-size: 15px; font-weight: 500; backdrop-filter: blur(12px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
        }
        .btn-premium-glass:hover {
          background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.2);
          color: #fff; transform: translateY(-1px);
        }

        /* NAV */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 6%; height: 72px;
          background: rgba(9, 13, 22, 0.8); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lp-brand {
          display: flex; align-items: center; gap: 12px;
          font-family: 'Space Grotesk', sans-serif; font-weight: 800; font-size: 21px; color: #ffffff;
        }
        .lp-brand-ic {
          width: 38px; height: 38px; border-radius: 10px;
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; box-shadow: 0 4px 14px rgba(239,68,68,.3);
        }
        .lp-nav-links { display: flex; align-items: center; gap: 32px; }
        .lp-nav-link {
          color: #94a3b8; font-size: 14.5px; font-weight: 500;
          transition: color .2s; cursor: pointer;
        }
        .lp-nav-link:hover { color: #ffffff; }
        .lp-nav-btns { display: flex; align-items: center; gap: 14px; }
        .lp-nav-btns .btn-premium-secondary { padding: 9px 20px; font-size: 13.5px; }
        .lp-nav-btns .btn-premium-primary { padding: 9px 20px; font-size: 13.5px; }

        /* HERO - FULLY CENTERED */
        .lp-hero {
          position: relative; z-index: 10;
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 130px 6% 60px; text-align: center;
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.6) 0%, rgba(9, 13, 22, 0.95) 100%), url(${HERO_BG});
          background-size: cover; background-position: center; background-attachment: fixed;
        }
        .lp-hero-content {
          max-width: 860px; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
        }
        .lp-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 16px; border-radius: 100px;
          background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25);
          color: #f87171; font-size: 12.5px; font-weight: 600;
          letter-spacing: .8px; text-transform: uppercase; margin-bottom: 24px;
        }
        .lp-badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #ef4444; box-shadow: 0 0 10px #ef4444;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {0%,100%{opacity:1}50%{opacity:.4}}
        .lp-h1 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: clamp(2.6rem, 6.5vw, 4.8rem);
          font-weight: 800; line-height: 1.1;
          color: #ffffff; margin-bottom: 24px; letter-spacing: -.03em;
        }
        .lp-h1 span {
          background: linear-gradient(90deg, #ff4e50, #f9d423);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-sub {
          font-size: 18px; color: #94a3b8; line-height: 1.8;
          margin-bottom: 40px; max-width: 650px;
        }
        .lp-hero-btns {
          display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-bottom: 40px;
        }
        
        /* Floating tags in Hero */
        .lp-floating-tags {
          display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;
          margin-bottom: 48px;
        }
        .lp-floating-tag {
          background: rgba(15, 23, 42, 0.55); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px; padding: 10px 18px; font-size: 13.5px; color: #e2e8f0;
          font-weight: 600; backdrop-filter: blur(12px); display: flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        /* 3D CANVAS CENTER */
        .lp-canvas-center {
          width: 100%; max-width: 850px; height: 440px;
          position: relative; z-index: 10; margin-top: 10px;
          border-radius: 24px; overflow: hidden;
          background: radial-gradient(circle at center, rgba(167, 139, 250, 0.05) 0%, transparent 70%);
        }

        /* STATS */
        .lp-stats {
          position: relative; z-index: 10;
          display: flex; flex-wrap: wrap; gap: 0;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(16px);
        }
        .lp-stat {
          flex: 1; min-width: 180px; padding: 36px 20px; text-align: center;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-n {
          display: block;
          font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 800; line-height: 1;
          background: linear-gradient(135deg, #ef4444, #ff7e5f);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }
        .lp-stat-l {
          display: block; font-size: 12px; color: #64748b;
          text-transform: uppercase; letter-spacing: 1px; font-weight: 600;
        }

        /* SECTIONS GENERAL */
        .lp-section {
          position: relative; z-index: 10; padding: 120px 6%;
        }
        .lp-section-tag {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px; border-radius: 100px;
          background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171; font-size: 12px; font-weight: 700;
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px;
        }
        .lp-section-title {
          font-family: 'Space Grotesk', sans-serif; font-size: clamp(2.2rem, 4.5vw, 3.2rem);
          font-weight: 800; color: #ffffff; margin-bottom: 18px; letter-spacing: -.02em;
        }
        .lp-section-title span {
          background: linear-gradient(90deg, #ef4444, #f97316);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-section-sub {
          font-size: 17.5px; color: #94a3b8; max-width: 600px; line-height: 1.8;
          margin-bottom: 60px;
        }

        /* RESUME BUILDER PROMO */
        .lp-rb-promo-section {
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%), url(${RESUME_BG}) no-repeat center/cover;
          background-attachment: fixed;
        }
        .lp-rb-card {
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 60px;
          background: rgba(15, 23, 42, 0.45); border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 28px; padding: 56px; max-width: 1140px; margin: 0 auto;
          backdrop-filter: blur(12px); box-shadow: 0 30px 60px rgba(0,0,0,0.4);
        }
        .lp-rb-text { display: flex; flex-direction: column; justify-content: center; }
        
        /* Templates Interactive Showcase */
        .lp-tpl-tabs { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .lp-tpl-tab {
          padding: 16px 20px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.04);
          background: rgba(255,255,255,0.01); text-align: left; cursor: pointer; transition: all 0.3s;
        }
        .lp-tpl-tab:hover {
          background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1);
        }
        .lp-tpl-tab.active {
          background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.3);
        }
        .lp-tpl-tab-name { font-weight: 700; font-size: 15px; color: #ffffff; display: flex; align-items: center; justify-content: space-between; }
        .lp-tpl-tab-tag { font-size: 10px; text-transform: uppercase; background: rgba(239, 68, 68, 0.15); color: #f87171; padding: 2px 8px; border-radius: 100px; font-weight: 700; }
        .lp-tpl-tab-desc { font-size: 13px; color: #64748b; margin-top: 4px; line-height: 1.4; }
        .lp-tpl-tab.active .lp-tpl-tab-desc { color: #94a3b8; }

        /* Mock Resume Display Card */
        .lp-rb-mock-container { display: flex; justify-content: center; align-items: center; }
        .lp-rb-mock {
          background: #ffffff; border-radius: 16px; width: 100%; max-width: 380px; min-height: 480px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5); padding: 28px 24px; color: #1e293b;
          border: 1px solid rgba(255,255,255,0.15); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lp-rb-mock.classic-ats { font-family: 'Times New Roman', Times, serif; }
        .lp-rb-mock.modern-ats { font-family: 'Space Grotesk', sans-serif; }
        .lp-rb-mock.compact-ats { font-family: 'Inter', sans-serif; line-height: 1.3; }

        .lp-rb-mock-title { font-weight: 700; font-size: 16px; text-align: center; text-transform: uppercase; margin-bottom: 2px; }
        .lp-rb-mock-sub { font-size: 9px; color: #64748b; text-align: center; margin-bottom: 8px; }
        .lp-rb-mock-sec-title { font-weight: 700; font-size: 10px; text-transform: uppercase; border-bottom: 1.5px solid #1e293b; padding-bottom: 2px; margin-top: 12px; margin-bottom: 6px; letter-spacing: 0.5px; }
        .lp-rb-mock.modern-ats .lp-rb-mock-sec-title { border-bottom: none; border-left: 3px solid #ef4444; padding-left: 6px; }
        
        .lp-rb-mock-text { font-size: 8.5px; color: #334155; line-height: 1.5; }
        .lp-rb-mock-bullet { display: flex; gap: 5px; margin-top: 3px; font-size: 8px; color: #475569; }

        /* HOW IT WORKS */
        .lp-steps-section {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(9, 13, 22, 0.95) 100%), url(${STEPS_BG}) no-repeat center/cover;
          background-attachment: fixed;
        }
        .lp-steps-wrap { position: relative; border-radius: 28px; overflow: hidden; padding: 8px; }
        .lp-steps {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 24px;
          position: relative;
        }
        .lp-step {
          position: relative; background: rgba(15, 23, 42, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 36px 30px;
          transition: all 0.3s; overflow: hidden; backdrop-filter: blur(10px);
        }
        .lp-step:hover {
          border-color: rgba(239, 68, 68, 0.4); transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .lp-step-num {
          font-family: 'Space Grotesk', sans-serif; font-size: 3.2rem; font-weight: 800;
          color: rgba(239, 68, 68, 0.08); line-height: 1; margin-bottom: 16px;
          position: absolute; top: 16px; right: 20px;
        }
        .lp-step-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: rgba(239, 68, 68, 0.06); border: 1px solid rgba(239, 68, 68, 0.15);
          display: flex; align-items: center; justify-content: center;
          color: #f87171; margin-bottom: 20px;
        }
        .lp-step h4 {
          font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem;
          font-weight: 700; color: #ffffff; margin-bottom: 10px;
        }
        .lp-step p { font-size: 14px; color: #94a3b8; line-height: 1.6; }

        /* FEATURES GRID */
        .lp-feats-section {
          background: linear-gradient(180deg, rgba(9, 13, 22, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%), url(${CTA_BG}) no-repeat center/cover;
          background-attachment: fixed;
        }
        .lp-feats {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: 24px;
        }
        .lp-feat-card {
          position: relative; overflow: hidden; background: rgba(15, 23, 42, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 32px;
          transition: all 0.3s; cursor: default; backdrop-filter: blur(10px);
        }
        .lp-feat-card:hover {
          border-color: var(--fc, #ef4444);
          box-shadow: 0 15px 35px rgba(0,0,0,0.35), 0 0 0 1px var(--fc);
        }
        .lp-feat-icon {
          width: 54px; height: 54px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .lp-feat-title {
          font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem;
          font-weight: 700; color: #ffffff; margin-bottom: 10px;
        }
        .lp-feat-desc { font-size: 14px; color: #94a3b8; line-height: 1.7; }
        .lp-feat-glow {
          position: absolute; bottom: -40px; right: -40px;
          width: 100px; height: 100px; border-radius: 50%;
          opacity: .05; filter: blur(35px); transition: opacity .3s;
        }
        .lp-feat-card:hover .lp-feat-glow { opacity: .18; }

        /* CTA SECTION */
        .lp-cta {
          position: relative; z-index: 10; padding: 120px 6% 140px; text-align: center;
        }
        .lp-cta-card {
          max-width: 860px; margin: 0 auto;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.88), rgba(185, 28, 28, 0.95)), url(${CTA_BG});
          background-size: cover; background-position: center;
          border: 1px solid rgba(255,255,255,0.12); border-radius: 32px; padding: 76px 40px;
          position: relative; overflow: hidden; box-shadow: 0 30px 60px rgba(239, 68, 68, 0.15);
        }
        .lp-cta-glow1 {
          position: absolute; top: -80px; left: -80px;
          width: 250px; height: 250px; border-radius: 50%;
          background: rgba(255,255,255,0.12); filter: blur(70px);
        }
        .lp-cta-glow2 {
          position: absolute; bottom: -80px; right: -80px;
          width: 250px; height: 250px; border-radius: 50%;
          background: rgba(255,255,255,0.1); filter: blur(70px);
        }
        .lp-cta h2 {
          font-family: 'Space Grotesk', sans-serif; font-size: clamp(2rem, 4.5vw, 3.2rem);
          font-weight: 800; color: #ffffff; margin-bottom: 18px; letter-spacing: -.02em;
          position: relative;
        }
        .lp-cta p {
          font-size: 17.5px; color: rgba(255,255,255,0.9); margin-bottom: 40px;
          line-height: 1.8; position: relative; max-width: 600px; margin-left: auto; margin-right: auto;
        }
        .lp-cta-btns {
          display: flex; gap: 16px; justify-content: center;
          flex-wrap: wrap; position: relative;
        }
        .lp-cta .btn-premium-primary { background: #ffffff; color: #dc2626; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
        .lp-cta .btn-premium-primary:hover { background: rgba(255,255,255,0.9); transform: translateY(-2px); box-shadow: 0 15px 40px rgba(0,0,0,0.35); }
        .lp-cta .btn-premium-secondary { border-color: rgba(255,255,255,0.3); color: #fff; background: rgba(255,255,255,0.06); }
        .lp-cta .btn-premium-secondary:hover { background: rgba(255,255,255,0.12); border-color: #fff; }

        /* FOOTER */
        .lp-footer {
          position: relative; z-index: 10; border-top: 1px solid rgba(255,255,255,0.06);
          padding: 50px 6%; display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 20px; background: #070a11;
        }
        .lp-footer-brand {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Space Grotesk', sans-serif; font-weight: 800; color: #ffffff;
        }
        .lp-footer-copy { font-size: 13.5px; color: #64748b; }

        /* MOBILE MENU overlays */
        .lp-menu-mobile {
          position: fixed; top: 72px; left: 0; right: 0; bottom: 0;
          background: rgba(9, 13, 22, 0.98); z-index: 99; display: flex;
          flex-direction: column; padding: 40px 6%; gap: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .lp-mobile-menu-btn {
          display: none; background: none; border: none;
          color: #ffffff; font-size: 24px; cursor: pointer;
        }

        @media (max-width: 768px) {
          .lp-nav-links { display: none; }
          .lp-nav-btns { display: none; }
          .lp-mobile-menu-btn { display: block; }
          .lp-rb-card { grid-template-columns: 1fr; padding: 32px 24px; gap: 40px; }
          .lp-rb-mock-container { order: -1; }
          .lp-canvas-center { height: 320px; }
          .lp-footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* Top scroll-linked progress bar */}
      <motion.div className="lp-progress" style={{ scaleX: scrollYProgress }} />

      {/* BG */}
      <div className="lp-bg" />
      <div className="lp-grid" />
      <Orb style={{ width: 600, height: 600, top: -150, left: -100, background: 'rgba(239,68,68,.05)', animationDuration: '24s' }} />
      <Orb style={{ width: 400, height: 400, bottom: 150, right: -80, background: 'rgba(167,139,250,.04)', animationDuration: '20s', animationDelay: '-10s' }} />

      {/* NAV */}
      <motion.nav
        className="lp-nav"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lp-brand">
          <div className="lp-brand-ic">🧠</div>
          Recruit AI
        </div>
        <div className="lp-nav-links">
          <a className="lp-nav-link" href="#features">Features</a>
          <a className="lp-nav-link" href="#how">How it Works</a>
          <a className="lp-nav-link" href="#resume-builder">Resume Templates</a>
          <span className="lp-nav-link" onClick={() => navigate('/resume-builder')}>Resume Builder</span>
        </div>
        <div className="lp-nav-btns">
          <button className="btn-premium-glass" onClick={() => navigate('/resume-builder')}>📄 Build Resume</button>
          <button className="btn-premium-secondary" onClick={() => navigate('/login')}>Sign In</button>
          <button className="btn-premium-primary" onClick={() => navigate('/login?tab=signup')}>Get Started →</button>
        </div>
        <button className="lp-mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </motion.nav>

      {/* Mobile nav menu */}
      {menuOpen && (
        <div className="lp-menu-mobile">
          <span className="lp-nav-link" style={{ fontSize: 18 }} onClick={() => { setMenuOpen(false); navigate('/resume-builder'); }}>Resume Builder</span>
          <a className="lp-nav-link" style={{ fontSize: 18 }} href="#features" onClick={() => setMenuOpen(false)}>Features</a>
          <a className="lp-nav-link" style={{ fontSize: 18 }} href="#how" onClick={() => setMenuOpen(false)}>How it Works</a>
          <a className="lp-nav-link" style={{ fontSize: 18 }} href="#resume-builder" onClick={() => setMenuOpen(false)}>Templates</a>
          <hr style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <button className="btn-premium-glass" style={{ width: '100%' }} onClick={() => { setMenuOpen(false); navigate('/resume-builder'); }}>📄 Build Resume</button>
          <button className="btn-premium-secondary" style={{ width: '100%' }} onClick={() => { setMenuOpen(false); navigate('/login'); }}>Sign In</button>
          <button className="btn-premium-primary" style={{ width: '100%' }} onClick={() => { setMenuOpen(false); navigate('/login?tab=signup'); }}>Get Started</button>
        </div>
      )}

      {/* HERO */}
      <section className="lp-hero" ref={heroRef} id="home">
        <motion.div
          className="lp-hero-content"
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div className="lp-badge" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
            <span className="lp-badge-dot" />
            AI-Powered Recruiting Platform
          </motion.div>
          <h1 className="lp-h1">
            Hire Smarter with <span>Artificial Intelligence</span>
          </h1>
          <p className="lp-sub">
            Recruit AI automates resume screening, candidate matching and bias reduction so your team can focus on what matters — building great teams.
          </p>
          <div className="lp-hero-btns">
            <motion.button
              className="btn-premium-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login?tab=signup')}
            >
              🚀 Start Free Trial
            </motion.button>
            <motion.button
              className="btn-premium-glass"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
            >
              <Play size={16} fill="currentColor" /> Watch Demo
            </motion.button>
          </div>

          <div className="lp-floating-tags">
            <div className="lp-floating-tag">
              <Sparkles size={16} style={{ color: '#ef4444' }} /> ATS Score: 94%
            </div>
            <div className="lp-floating-tag">
              <Brain size={16} style={{ color: '#a78bfa' }} /> AI Match Found
            </div>
            <div className="lp-floating-tag">
              <FileText size={16} style={{ color: '#10b981' }} /> Parse Complete
            </div>
          </div>
        </motion.div>

        {/* Centered 3D Canvas */}
        <motion.div 
          className="lp-canvas-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Canvas style={{ width: '100%', height: '100%' }} dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.4}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <div className="lp-stats">
        {stats.map((s, i) => <StatCounter key={i} {...s} delay={i * 0.08} />)}
      </div>

      {/* RESUME BUILDER PROMO */}
      <section className="lp-section lp-rb-promo-section" id="resume-builder">
        <div className="lp-rb-card">
          <motion.div
            className="lp-rb-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="lp-section-tag">📄 Live Template Showcase</div>
            <h2 className="lp-section-title" style={{ textAlign: 'left', marginBottom: 16 }}>
              Build an <span>ATS-Ready Resume</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
              Choose from our parser-tested layouts. Enter details, view updates instantly, and download a structured single-column PDF built for modern ATS scanners.
            </p>

            {/* Interactive Selector Tabs */}
            <div className="lp-tpl-tabs">
              {[
                { id: 'classic-ats', name: 'Classic ATS', tag: 'Most Compatible', desc: 'Times New Roman serif fonts, bold plain headers, standard lines — preferred by banking & legacy firms.' },
                { id: 'modern-ats', name: 'Modern ATS', tag: 'Clean & Bold', desc: 'Space Grotesk heading styling with left-bordered red indicators. Fresh yet parser-perfect.' },
                { id: 'compact-ats', name: 'Compact ATS', tag: 'High Density', desc: 'Inter sans-serif layout with narrow margins to fit dense projects and skills lists onto 1 page.' }
              ].map(tpl => (
                <div
                  key={tpl.id}
                  className={`lp-tpl-tab ${activeTpl === tpl.id ? 'active' : ''}`}
                  onClick={() => setActiveTpl(tpl.id)}
                >
                  <div className="lp-tpl-tab-name">
                    {tpl.name}
                    <span className="lp-tpl-tab-tag">{tpl.tag}</span>
                  </div>
                  <div className="lp-tpl-tab-desc">{tpl.desc}</div>
                </div>
              ))}
            </div>

            <motion.button
              className="btn-premium-primary"
              style={{ alignSelf: 'flex-start' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/resume-builder')}
            >
              Build Your Resume Free <ArrowRight size={16} />
            </motion.button>
          </motion.div>

          {/* Interactive Resume Sheet Render */}
          <motion.div 
            className="lp-rb-mock-container"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className={`lp-rb-mock ${activeTpl}`}>
              <div className="lp-rb-mock-title">ALEX CARTER</div>
              <div className="lp-rb-mock-sub">alex.carter@devmail.io  |  +1 (555) 019-2834  |  alexcarter.dev</div>
              
              <div className="lp-rb-mock-sec-title">Professional Summary</div>
              <div className="lp-rb-mock-text">
                Results-driven Software Engineer with 5+ years of experience constructing scalable web services and complex integrations. Proven lead optimizer with deep expertise across modern technology stacks.
              </div>

              <div className="lp-rb-mock-sec-title">Technical Skills</div>
              <div className="lp-rb-mock-text">
                <b>Languages:</b> JavaScript, TypeScript, Python, SQL, HTML, CSS<br />
                <b>Frameworks:</b> React.js, Next.js, Node.js, FastAPI, Express
              </div>

              <div className="lp-rb-mock-sec-title">Work Experience</div>
              <div className="lp-rb-mock-text" style={{ fontWeight: 'bold', display: 'flex', justifycontent: 'space-between' }}>
                <span>Software Engineer II — TechCorp</span>
                <span>2024 - Present</span>
              </div>
              <div className="lp-rb-mock-bullet">• Migrated legacy monolith systems to async microservices.</div>
              <div className="lp-rb-mock-bullet">• Boosted overall page response times by 30% via lazy chunking.</div>
              <div className="lp-rb-mock-bullet">• Mentored 4 junior engineers on clean coding and unit test suites.</div>

              <div className="lp-rb-mock-sec-title">Projects</div>
              <div className="lp-rb-mock-text" style={{ fontWeight: 'bold' }}>
                TalentSync: AI Recruitment Engine
              </div>
              <div className="lp-rb-mock-bullet">• Programmed custom ATS parsing logic using NLP classifiers.</div>
              <div className="lp-rb-mock-bullet">• Designed responsive recruiter panels, handling 500+ daily resumes.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-section lp-steps-section" id="how">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="lp-section-tag">⚡ Process Flow</div>
          <h2 className="lp-section-title">From Upload to <span>Hire in Minutes</span></h2>
          <p className="lp-section-sub">Our pipeline ingests applications, structures data, filters bias, and delivers scores instantly.</p>
        </motion.div>
        <div className="lp-steps-wrap">
          <div className="lp-steps">
            {[
              { icon: UploadCloud, title: 'Upload Resumes', desc: 'Drag-drop PDFs, DOCX, or text files. Bulk process hundreds of profiles at once.', n: '01' },
              { icon: Cpu, title: 'AI Parsing', desc: 'Extracts skills, work milestones, education, and keywords instantly using custom models.', n: '02' },
              { icon: Layers, title: 'Scoring & Matching', desc: 'Scores each profile against criteria with explainable metrics and semantic search.', n: '03' },
              { icon: CheckCircle, title: 'Hire & Sync', desc: 'Send automated email status updates and export shortlists straight to your ATS.', n: '04' },
            ].map((step, i) => (
              <motion.div
                key={i}
                className="lp-step"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="lp-step-num">{step.n}</div>
                <div className="lp-step-icon">
                  <step.icon size={24} />
                </div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-section lp-feats-section" id="features">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="lp-section-tag">✨ Capabilities</div>
          <h2 className="lp-section-title">Everything Needed <span>to Scale Hiring</span></h2>
          <p className="lp-section-sub">A full-featured AI suite designed for modern talent acquisition departments.</p>
        </motion.div>
        <div className="lp-feats">
          {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta">
        <motion.div
          className="lp-cta-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="lp-cta-glow1" />
          <div className="lp-cta-glow2" />
          <h2>Ready to Transform Your Hiring?</h2>
          <p>Join thousands of recruiting teams saving 60% of screening time with Recruit AI. Zero-credit card registration.</p>
          <div className="lp-cta-btns">
            <motion.button 
              className="btn-premium-primary" 
              whileHover={{ scale: 1.04 }} 
              onClick={() => navigate('/login?tab=signup')}
            >
              🚀 Get Started Free
            </motion.button>
            <motion.button 
              className="btn-premium-secondary" 
              whileHover={{ scale: 1.02 }} 
              onClick={() => navigate('/login')}
            >
              Sign In <ArrowUpRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">
          <div className="lp-brand-ic" style={{ width: 34, height: 34, fontSize: 16, borderRadius: 8 }}>🧠</div>
          Recruit AI
        </div>
        <p className="lp-footer-copy">© 2026 Recruit AI. Built with ♥ by Prozenix.</p>
        <div style={{ display: 'flex', gap: 24, fontSize: 13.5, color: '#64748b' }}>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="lp-nav-link">Privacy</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="lp-nav-link">Terms</span>
          <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="lp-nav-link">Contact</span>
        </div>
      </footer>
    </div>
  );
}

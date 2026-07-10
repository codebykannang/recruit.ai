// ATS resume template definitions.
// Each template only controls fonts/spacing/accent used in the PDF + live preview.
// Layout stays single-column, plain text — this is what keeps every template ATS-safe.

export const RESUME_TEMPLATES = [
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    tag: 'Most Compatible',
    desc: 'Times New Roman, bold plain headers, zero tables — the exact format proven to pass ATS parsers.',
    font: 'times',
    accent: '#18181b',
    headerStyle: 'underline',
  },
  {
    id: 'modern-ats',
    name: 'Modern ATS',
    tag: 'Clean & Bold',
    desc: 'Helvetica based, subtle red section dividers, still single-column and fully text-parseable.',
    font: 'helvetica',
    accent: '#dc2626',
    headerStyle: 'rule',
  },
  {
    id: 'compact-ats',
    name: 'Compact ATS',
    tag: 'Fits More on One Page',
    desc: 'Tighter line spacing and margins — ideal when you have lots of projects/certifications to fit on one page.',
    font: 'helvetica',
    accent: '#18181b',
    headerStyle: 'plain',
    compact: true,
  },
];

export const emptyResumeData = () => ({
  fullName: '',
  title: '',
  phone: '',
  email: '',
  portfolio: '',
  github: '',
  linkedin: '',
  location: '',
  summary: '',
  skills: [
    { label: 'Frontend', value: '' },
    { label: 'Backend', value: '' },
    { label: 'Database', value: '' },
    { label: 'Languages', value: '' },
    { label: 'Tools', value: '' },
  ],
  projects: [
    { title: '', tech: '', link: '', bullets: [''] },
  ],
  experience: [
    { role: '', company: '', duration: '', bullets: [''] },
  ],
  education: [
    { degree: '', institution: '', duration: '', score: '' },
  ],
  certifications: [''],
});

// Kannan's own resume, pre-loaded as a ready-to-edit starting point ("use my resume as a template").
export const sampleResumeData = () => ({
  fullName: 'ALEX CARTER',
  title: 'Senior Full Stack Software Engineer',
  phone: '+1 (555) 019-2834',
  email: 'alex.carter@devmail.io',
  portfolio: 'alexcarter.dev',
  github: 'github.com/alexcarterdev',
  linkedin: 'linkedin.com/in/alexcarter',
  location: 'San Francisco, CA',
  summary:
    'Innovative and results-driven Software Engineer with over 5 years of experience building scalable web applications and AI integrations. Proficient in React, Node.js, Python, and cloud services, with a strong track record of optimizing application performance and leading cross-functional teams. Passionate about writing clean, maintainable code and solving complex technical challenges.',
  skills: [
    { label: 'Frontend', value: 'JavaScript (ES6+), React.js, Next.js, HTML5, CSS3, Tailwind CSS' },
    { label: 'Backend', value: 'Node.js, Express, Python (FastAPI, Flask), RESTful APIs' },
    { label: 'Database', value: 'PostgreSQL, MongoDB, Redis, MySQL' },
    { label: 'Languages', value: 'JavaScript, Python, TypeScript, SQL, HTML/CSS' },
    { label: 'Tools', value: 'Git, GitHub, Docker, AWS (S3, EC2), VS Code, JIRA' },
  ],
  projects: [
    {
      title: 'TalentSync: AI-Powered Recruitment SaaS Platform',
      tech: 'React, FastAPI, PostgreSQL, OpenAI API',
      link: 'github.com/alexcarterdev/talentsync',
      bullets: [
        'Architected and co-developed an AI recruiting SaaS that automates candidate filtering and ranking using NLP.',
        'Built a responsive dashboard in React, reducing time-to-hire by 45% for over 50 enterprise clients.',
        'Designed database schemas and optimized API queries, improving response times by 30% under heavy loads.',
        'Implemented secure OAuth2 authentication and JWT token management for client accounts.',
      ],
    },
    {
      title: 'CloudVault: Encrypted File Management System',
      tech: 'Next.js, Node.js, Express, AWS S3',
      link: 'github.com/alexcarterdev/cloudvault',
      bullets: [
        'Developed a secure cloud storage solution with client-side encryption and seamless chunked uploads.',
        'Integrated AWS S3 API for storage operations, resulting in 99.99% availability of user documents.',
        'Created a shareable link feature with custom expiration parameters and password protection.',
      ],
    },
  ],
  experience: [
    {
      role: 'Software Engineer II',
      company: 'TechCorp Solutions',
      duration: 'Mar 2024 - Present',
      bullets: [
        'Lead a team of 4 engineers in migrating a legacy monolithic application to microservices architecture.',
        'Optimized frontend bundles, resulting in a 25% improvement in Google Lighthouse performance scores.',
        'Collaborated closely with product managers to deliver 15+ highly anticipated user features.',
      ],
    },
    {
      role: 'Junior Frontend Developer',
      company: 'AppForge Studio',
      duration: 'Jun 2022 - Feb 2024',
      bullets: [
        'Designed and implemented reusable React UI component library used across 3 distinct product lines.',
        'Integrated payment gateways and subscription management systems using Stripe API.',
        'Fixed critical security vulnerabilities and maintained Jest unit test suites with 85%+ coverage.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      duration: 'Sep 2018 - May 2022',
      score: 'GPA: 3.8/4.0',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate (2025)',
    'Meta Front-End Developer Professional Certificate (2024)',
    'Certified ScrumMaster (CSM) – Scrum Alliance (2023)',
  ],
});

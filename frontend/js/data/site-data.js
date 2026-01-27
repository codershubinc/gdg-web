/**
 * site-data.js — Centralised static content for all pages.
 * All data is plain text / raw SVG strings; HTML-escaping is done
 * by the render functions that consume this data.
 */

/* ── SVG icon inner paths (placed inside <svg viewBox="0 0 64 64"> ) ─────── */
export const SVG_ML = `
  <line x1="14" y1="16" x2="31" y2="28" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <line x1="14" y1="32" x2="31" y2="32" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <line x1="14" y1="48" x2="31" y2="36" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <line x1="33" y1="28" x2="50" y2="22" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <line x1="33" y1="28" x2="50" y2="42" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <line x1="33" y1="36" x2="50" y2="22" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <line x1="33" y1="36" x2="50" y2="42" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
  <circle cx="14" cy="16" r="4" fill="rgba(255,255,255,0.85)"/>
  <circle cx="14" cy="32" r="4" fill="rgba(255,255,255,0.85)"/>
  <circle cx="14" cy="48" r="4" fill="rgba(255,255,255,0.85)"/>
  <circle cx="32" cy="28" r="5" fill="white"/>
  <circle cx="32" cy="36" r="5" fill="white"/>
  <circle cx="50" cy="22" r="4" fill="rgba(255,255,255,0.85)"/>
  <circle cx="50" cy="42" r="4" fill="rgba(255,255,255,0.85)"/>`;

export const SVG_LIGHTNING = `<path d="M37 5L15 37h17L26 59 53 27H36L40 5z" fill="rgba(255,255,255,0.95)"/>`;

export const SVG_STAR = `<polygon points="32,5 35.5,21 51,14 42,27 58,32 42,37 51,50 35.5,43 32,59 28.5,43 13,50 22,37 6,32 22,27 13,14 28.5,21" fill="rgba(255,255,255,0.95)"/>`;

export const SVG_CLOUD = `
  <path d="M18 46c-6 0-10-4.7-10-10.5 0-5.4 3.8-9.9 9-10.4C18.4 19 25 13 32 13s13.6 6 15 12.1c5.2.5 9 5 9 10.4C56 41.3 52 46 46 46H18z" fill="rgba(255,255,255,0.92)"/>
  <path d="M32 38v10" stroke="#0a1a2e" stroke-width="3" stroke-linecap="round"/>
  <path d="M27 44l5 6 5-6" stroke="#0a1a2e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;

export const SVG_BLOCKCHAIN = `
  <polygon points="32,14 42,20 42,32 32,38 22,32 22,20" stroke="rgba(255,255,255,0.95)" stroke-width="2" fill="rgba(255,255,255,0.14)"/>
  <polygon points="10,38 16,41.5 16,48.5 10,52 4,48.5 4,41.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5" fill="rgba(255,255,255,0.08)"/>
  <polygon points="54,38 60,41.5 60,48.5 54,52 48,48.5 48,41.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5" fill="rgba(255,255,255,0.08)"/>
  <polygon points="32,4 37,7 37,13 32,16 27,13 27,7" stroke="rgba(255,255,255,0.65)" stroke-width="1.5" fill="rgba(255,255,255,0.08)"/>
  <line x1="22" y1="30" x2="14" y2="40" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
  <line x1="42" y1="30" x2="50" y2="40" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
  <line x1="32" y1="14" x2="32" y2="13" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>`;

export const SVG_CODE = `
  <path d="M22 18L9 32l13 14" stroke="rgba(255,255,255,0.95)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M42 18l13 14-13 14" stroke="rgba(255,255,255,0.95)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="38" y1="12" x2="26" y2="52" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" stroke-linecap="round"/>`;

/* Past event SVGs */
export const SVG_GLOBE = `
  <circle cx="32" cy="32" r="16" stroke="rgba(255,255,255,0.6)" stroke-width="2" fill="rgba(255,255,255,0.06)"/>
  <path d="M32 16C22 16 16 24 16 32s6 16 16 16 16-8 16-16-6-16-16-16z" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" fill="none"/>
  <ellipse cx="32" cy="32" rx="9" ry="16" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="none"/>
  <line x1="16" y1="32" x2="48" y2="32" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>
  <line x1="19" y1="22" x2="45" y2="22" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  <line x1="19" y1="42" x2="45" y2="42" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>`;

export const SVG_STELLAR_STAR = `<path d="M32 8l5.5 17H56l-14.5 10.5 5.5 17L32 42l-15 10.5 5.5-17L8 25h18.5z" fill="rgba(255,255,255,0.9)"/>`;

export const SVG_PERSON = `
  <circle cx="32" cy="20" r="9" stroke="rgba(255,255,255,0.9)" stroke-width="2" fill="rgba(255,255,255,0.1)"/>
  <path d="M13 56c0-10.5 8.5-19 19-19s19 8.5 19 19" stroke="rgba(255,255,255,0.9)" stroke-width="2" stroke-linecap="round" fill="none"/>
  <line x1="44" y1="28" x2="56" y2="22" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="44" y1="34" x2="56" y2="38" stroke="rgba(255,255,255,0.55)" stroke-width="1.5" stroke-linecap="round"/>`;

/* ── Hero stats ─────────────────────────────────────────────────────────── */
export const HERO_STATS = [
    { target: 580, suffix: '+', label: 'Members' },
    { target: 11, suffix: '+', label: 'Events' },
    { target: 6, suffix: '', label: 'Domains' },
    { target: 3, suffix: '+', label: 'Years Active' },
];

/* ── Hero orbit pills ────────────────────────────────────────────────────── */
export const ORBIT_PILLS = [
    { cls: 'orbit-pill-1', label: '🤖 AI & ML', detail: 'Machine Learning & LLMs' },
    { cls: 'orbit-pill-2', label: '☁️ Cloud', detail: 'GCP, AWS & DevOps' },
    { cls: 'orbit-pill-3', label: '📱 Android', detail: 'Kotlin & Jetpack' },
    { cls: 'orbit-pill-4', label: '🌐 Web Dev', detail: 'React, Vue & More' },
    { cls: 'orbit-pill-5', label: '🔐 Security', detail: 'Ethical Hacking' },
    { cls: 'orbit-pill-6', label: '⚡ Firebase', detail: 'Realtime & Auth' },
];

/* ── About icon cards ────────────────────────────────────────────────────── */
export const ABOUT_CARDS = [
    { cls: 'reveal-tl delay-1', icon: '🚀', title: 'Innovation', desc: 'Pushing boundaries with cutting-edge Google tech' },
    { cls: 'reveal-tr delay-2', icon: '🤝', title: 'Collaboration', desc: 'Building alongside passionate fellow developers' },
    { cls: 'reveal-bl delay-3', icon: '💡', title: 'Learning', desc: 'Workshops, study jams & hands-on sessions' },
    { cls: 'reveal-br delay-4', icon: '🌍', title: 'Community', desc: 'Part of a global network of 10M+ developers' },
];

/* ── About stats ─────────────────────────────────────────────────────────── */
export const ABOUT_STATS = [
    { gradient: 'linear-gradient(135deg,#4285F4,#34A853)', value: '580+', label: 'Community Members', delay: 1 },
    { gradient: 'linear-gradient(135deg,#EA4335,#FBBC04)', value: '11+', label: 'Events Hosted', delay: 2 },
    { gradient: 'linear-gradient(135deg,#FBBC04,#EA4335)', value: '6', label: 'Tech Domains', delay: 3 },
    { gradient: 'linear-gradient(135deg,#34A853,#4285F4)', value: '3+', label: 'Years of Impact', delay: 4 },
];

/* ── Domain cards ────────────────────────────────────────────────────────── */
export const DOMAINS = [
    { icon: '🤖', name: 'AI & Machine Learning', desc: 'TensorFlow, Vertex AI, Generative AI, and ML model deployment', delay: 1 },
    { icon: '☁️', name: 'Google Cloud', desc: 'GCP, Cloud Functions, Firebase, BigQuery and data engineering', delay: 2 },
    { icon: '📱', name: 'Android & Flutter', desc: 'Native Android, Flutter cross-platform, Jetpack Compose & Material 3', delay: 3 },
    { icon: '🌐', name: 'Web Development', desc: 'Modern web with Angular, Progressive Web Apps, and Chrome APIs', delay: 4 },
    { icon: '🔒', name: 'Cybersecurity', desc: 'Security best practices, ethical hacking, and Google BeyondCorp', delay: 5 },
    { icon: '📊', name: 'Data Science', desc: 'Data analytics, Looker, BigQuery ML, and visualization tools', delay: 6 },
    { icon: '🥽', name: 'AR / VR', desc: 'ARCore, immersive experiences, and spatial computing', delay: 1 },
    { icon: '⛓️', name: 'Web3 & Blockchain', desc: 'Decentralized apps, smart contracts, and digital identity', delay: 2 },
];

/* ── Team members ────────────────────────────────────────────────────────── */
export const TEAM = [
    {
        name: 'Tanisha Hegde', initials: 'TH', delay: 1,
        role: 'GDGoC Organizer & Lead', roleColor: 'var(--google-blue)',
        topGradient: 'linear-gradient(135deg,rgba(66,133,244,0.4),rgba(52,168,83,0.4))',
        avatarGradient: 'linear-gradient(135deg,var(--google-blue),var(--google-green))',
        img: 'https://gdg-csmu-official.netlify.app/team/tanisha.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/tanisha-hegde-b9bb44268/' },
        { type: 'email', href: 'mailto:gdgoc.csmu@gmail.com' }]
    },

    {
        name: 'Varad Madhav', initials: 'VM', delay: 2,
        role: 'Technical Head — AI/ML', roleColor: 'var(--google-red)',
        topGradient: 'linear-gradient(135deg,rgba(234,67,53,0.3),rgba(251,188,4,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-red),var(--google-yellow))',
        img: 'https://gdg-csmu-official.netlify.app/team/varad.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/varadmadhav/' },
        { type: 'github', href: 'https://github.com/Varadmadhav' }]
    },

    {
        name: 'Prathamesh Padher', initials: 'PP', delay: 3,
        role: 'Technical Head — Frontend', roleColor: 'var(--google-green)',
        topGradient: 'linear-gradient(135deg,rgba(52,168,83,0.3),rgba(66,133,244,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-green),var(--google-blue))',
        img: 'https://gdg-csmu-official.netlify.app/team/prathamesh.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/prathamesh-padher-6bb094269/' },
        { type: 'github', href: 'https://github.com/PrathameshPadher' }]
    },

    {
        name: 'Aarya Shewale', initials: 'AS', delay: 4,
        role: 'UI/UX Head', roleColor: 'var(--google-yellow)',
        topGradient: 'linear-gradient(135deg,rgba(251,188,4,0.3),rgba(234,67,53,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-yellow),var(--google-red))',
        img: 'https://gdg-csmu-official.netlify.app/team/aarya.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/aarya-shewale-4b04712ab/' },
        { type: 'github', href: 'https://github.com/AaryaShewale07' }]
    },

    {
        name: 'Jayesh Jadhav', initials: 'JJ', delay: 1,
        role: 'Management & Design Head', roleColor: 'var(--google-blue)',
        topGradient: 'linear-gradient(135deg,rgba(66,133,244,0.3),rgba(234,67,53,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-blue),var(--google-red))',
        img: 'https://gdg-csmu-official.netlify.app/team/jayesh1.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/jayeshvj/' },
        { type: 'github', href: 'https://github.com/jayxvj' }]
    },

    {
        name: 'Sakshi Gollar', initials: 'SG', delay: 2,
        role: 'Social Media Head', roleColor: 'var(--google-green)',
        topGradient: 'linear-gradient(135deg,rgba(52,168,83,0.3),rgba(251,188,4,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-green),var(--google-yellow))',
        img: 'https://gdg-csmu-official.netlify.app/team/sakshi.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/sakshigollar31/' },
        { type: 'github', href: 'https://github.com/sakshig3101' }]
    },

    {
        name: 'Pratik Harugade', initials: 'PH', delay: 3,
        role: 'Management Head', roleColor: 'var(--google-red)',
        topGradient: 'linear-gradient(135deg,rgba(234,67,53,0.3),rgba(66,133,244,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-red),var(--google-blue))',
        img: 'https://gdg-csmu-official.netlify.app/team/pratik.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/pratik-pramod-harugade/' },
        { type: 'github', href: 'https://github.com/ppharugade' }]
    },

    {
        name: 'Vallabh Patil', initials: 'VP', delay: 4,
        role: 'Media Head', roleColor: 'var(--google-yellow)',
        topGradient: 'linear-gradient(135deg,rgba(251,188,4,0.3),rgba(52,168,83,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-yellow),var(--google-green))',
        img: 'https://gdg-csmu-official.netlify.app/team/patil.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/vallabh-patil-8810ba374/' },
        { type: 'github', href: 'https://github.com/Patil2004-hash' }]
    },

    {
        name: 'Prathamesh Tripathi', initials: 'PT', delay: 1,
        role: 'Operational Head', roleColor: 'var(--google-blue)',
        topGradient: 'linear-gradient(135deg,rgba(66,133,244,0.3),rgba(52,168,83,0.3))',
        avatarGradient: 'linear-gradient(135deg,var(--google-blue),var(--google-green))',
        img: 'https://gdg-csmu-official.netlify.app/team/prathameshtripathi.jpeg',
        socials: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/tripathiprathamesh/' }]
    },
];

/* ── Upcoming events (shared between index.html cards + events.html) ─────── */
export const EVENTS = [
    {
        category: 'workshop', svg: SVG_ML,
        gradient: 'linear-gradient(135deg,#0d1b3e,#1a237e)', badgeLabel: 'Workshop',
        title: 'Intro to Machine Learning with TensorFlow',
        homeDate: 'March 8, 2026 &nbsp;·&nbsp; 10:00 AM',
        homeDesc: 'ML fundamentals with TensorFlow — build & train your first neural network hands-on.',
        homeTags: ['TensorFlow', 'Python', 'AI/ML'], homeLoc: 'Lab 401, CSMU', homeCta: 'Register →',
        desc: "Dive into the fundamentals of machine learning using Google's TensorFlow 2.x. Build, train, and deploy your first neural network. Perfect for beginners with basic Python knowledge.",
        info: [{ icon: 'cal', text: 'Saturday, March 8, 2026 — 10:00 AM to 1:00 PM' },
        { icon: 'pin', text: 'Computer Lab 401, CSMU Campus' },
        { icon: 'people', text: 'Limited to 60 seats — 28 registered' }],
        tags: ['TensorFlow', 'Python', 'Neural Networks', 'AI/ML', 'Beginner Friendly'],
        avatars: [{ color: '#4285F4', l: 'A' }, { color: '#EA4335', l: 'P' }, { color: '#34A853', l: 'R' }], count: '28 going'
    },

    {
        category: 'hackathon', svg: SVG_LIGHTNING,
        gradient: 'linear-gradient(135deg,#3e0d0d,#7f1212)', badgeLabel: 'Hackathon',
        title: 'HealthTech Hackathon 2026',
        homeDate: 'March 22–23, 2026 &nbsp;·&nbsp; 36 Hours',
        homeDesc: '₹50,000 prize pool — build healthcare solutions with Google Cloud & Android.',
        homeTags: ['Google Cloud', 'Android', 'Healthcare'], homeLoc: 'CSMU Auditorium', homeCta: 'Register →',
        desc: 'A 36-hour non-stop hackathon focused on building innovative healthcare solutions. Use Google Cloud AI, Android, and Firebase to create apps that save lives. ₹50,000 prize pool!',
        info: [{ icon: 'cal', text: 'March 22–23, 2026 — Starts 9:00 AM (36 hours)' },
        { icon: 'pin', text: 'CSMU Main Auditorium & Innovation Lab' },
        { icon: 'people', text: 'Teams of 2–5 · 30 teams max' }],
        tags: ['Google Cloud', 'Android', 'Firebase', 'Healthcare AI', '₹50K Prize'],
        avatars: [{ color: '#EA4335', l: 'S' }, { color: '#FBBC04', l: 'V' }, { color: '#34A853', l: 'A' }], count: '72 registered'
    },

    {
        category: 'devfest', svg: SVG_STAR,
        gradient: 'linear-gradient(135deg,#1a3a1a,#1b5e20)', badgeLabel: 'DevFest',
        title: 'DevFest CSMU 2026',
        homeDate: 'April 5, 2026 &nbsp;·&nbsp; All Day',
        homeDesc: 'Flagship dev festival — keynotes, workshops, networking & Google swag. Free!',
        homeTags: ['Keynote', 'Workshops', 'Free'], homeLoc: 'Convention Hall', homeCta: 'Register Free →',
        desc: 'Our flagship annual developer festival! A full day of inspirational keynotes from Googlers, hands-on workshops, networking with industry professionals, and amazing Google swag.',
        info: [{ icon: 'cal', text: 'Saturday, April 5, 2026 — 9:00 AM to 7:00 PM' },
        { icon: 'pin', text: 'CSMU Convention Hall, Sector 32' },
        { icon: 'people', text: 'Free Entry · 200 seats available' }],
        tags: ['Keynote', 'Workshops', 'Networking', 'Google Swag', 'Free'],
        avatars: [{ color: '#4285F4', l: 'R' }, { color: '#FBBC04', l: 'N' }, { color: '#EA4335', l: 'K' }], count: '145 going'
    },

    {
        category: 'study', svg: SVG_CLOUD,
        gradient: 'linear-gradient(135deg,#0d2137,#01579b)', badgeLabel: 'Study Jam',
        title: 'Google Cloud Study Jam — Associate Exam Prep',
        homeDate: 'April 12, 2026 &nbsp;·&nbsp; 2:00 PM',
        homeDesc: 'Guided Qwiklabs + live mentorship. Free ₹2500 cloud credits for all.',
        homeTags: ['GCP', 'Certification', 'Free Credits'], homeLoc: 'Online + Lab 202', homeCta: 'Join Jam →',
        desc: 'Get certified! Join our structured Google Cloud Study Jam with guided Qwiklabs, live mentorship, and a dedicated Telegram study group. Free ₹2500 cloud credits included for participants.',
        info: [{ icon: 'cal', text: 'April 12, 2026 — 2:00 PM · Runs 4 Weekends' },
        { icon: 'laptop', text: 'Hybrid — Lab 202 + Google Meet' }],
        tags: ['GCP', 'Certification', 'Qwiklabs', 'Free Credits', '4 Weeks'],
        avatars: [{ color: '#34A853', l: 'M' }, { color: '#4285F4', l: 'D' }], count: '45 enrolled'
    },

    {
        category: 'talk', svg: SVG_BLOCKCHAIN,
        gradient: 'linear-gradient(135deg,#2d1b69,#4a148c)', badgeLabel: 'Tech Talk',
        title: 'Web3 & Blockchain: Building the Decentralized Future',
        homeDate: 'April 18, 2026 &nbsp;·&nbsp; 5:00 PM',
        homeDesc: 'Practical Web3 & smart contract session by an industry expert. All levels welcome.',
        homeTags: ['Blockchain', 'Web3', 'Smart Contracts'], homeLoc: 'Seminar Hall B', homeCta: 'Reserve Seat →',
        desc: 'Industry expert Rajesh Iyer (ex-Google, Web3 Lead @ Polygon) shares insights on building blockchain apps specifically for healthcare data management and patient privacy.',
        info: [{ icon: 'cal', text: 'Saturday, April 18, 2026 — 5:00 PM to 7:00 PM' },
        { icon: 'pin', text: 'Seminar Hall B, Block A, CSMU' }],
        tags: ['Blockchain', 'Web3', 'Ethereum', 'Smart Contracts'],
        avatars: [{ color: '#EA4335', l: 'T' }, { color: '#FBBC04', l: 'U' }, { color: '#4285F4', l: 'S' }], count: '89 going'
    },

    {
        category: 'community', svg: SVG_CODE,
        gradient: 'linear-gradient(135deg,#33180d,#bf360c)', badgeLabel: 'Community',
        title: 'Open Source Contribution Sprint',
        homeDate: 'May 3, 2026 &nbsp;·&nbsp; 4:00 PM',
        homeDesc: 'Your first PR to a Google-backed project, with expert mentorship. GSoC prep!',
        homeTags: ['Open Source', 'GitHub', 'GSoC'], homeLoc: 'Online + Campus', homeCta: 'Join Sprint →',
        desc: 'Prepare for Google Summer of Code! Learn to navigate open-source codebases, find beginner issues, craft proposals, and make your first real contribution with expert mentorship.',
        info: [{ icon: 'cal', text: 'Saturday, May 3, 2026 — 4:00 PM to 8:00 PM' },
        { icon: 'laptop', text: 'Hybrid — Online + CSMU Innovation Lab' }],
        tags: ['GSoC', 'Open Source', 'GitHub', 'Mentorship', 'Git'],
        avatars: [{ color: '#34A853', l: 'G' }, { color: '#4285F4', l: 'H' }], count: '55 going'
    },
];

/* ── Past events (events.html only) ─────────────────────────────────────── */
export const PAST_EVENTS = [
    {
        category: 'workshop', svg: SVG_GLOBE, glowColor: '#4285F4', badgeLabel: 'Workshop',
        title: 'INIT 2026 — GDG Campus CSMU Kickoff',
        desc: 'The grand kickoff event of GDG Campus CSMU for 2026! Introductions, demos of upcoming projects, community plans for the year, and interactive sessions for new members.',
        date: 'February 23, 2026', tags: ['Community', 'Kickoff', 'Google Tech', 'Networking'], footerText: 'Attended'
    },

    {
        category: 'hackathon', svg: SVG_STELLAR_STAR, glowColor: '#EA4335', badgeLabel: 'Hackathon',
        title: 'Build on Stellar Bootcamp: GDG Innovation Sprint!',
        desc: 'An intensive bootcamp exploring blockchain and the Stellar network. Participants built decentralized applications on Stellar during a guided innovation sprint.',
        date: 'November 12, 2025', tags: ['Blockchain', 'Stellar', 'Web3', 'dApps'], footerText: 'Participated'
    },

    {
        category: 'talk', svg: SVG_PERSON, glowColor: '#9C27B0', badgeLabel: 'Tech Talk',
        title: 'Generative AI in Healthcare: Possibilities & Ethics',
        desc: 'A thought-provoking keynote and Q&A session on how generative AI (LLMs, Gemini) is transforming medical diagnosis, drug discovery, and patient care — and the ethical considerations.',
        date: 'November 22, 2025 · 220 Attended', tags: ['Gemini', 'GenAI', 'Healthcare', 'Ethics'], footerText: '220 attended'
    },
];

/* ── Events page stats bar ───────────────────────────────────────────────── */
export const EVENTS_STATS = [
    { gradient: 'linear-gradient(135deg,var(--google-blue),var(--google-green))', value: '11+', label: 'Events Hosted' },
    { gradient: 'linear-gradient(135deg,var(--google-red),var(--google-yellow))', value: '580+', label: 'Community Members' },
    { gradient: 'linear-gradient(135deg,var(--google-green),var(--google-blue))', value: '3+', label: 'Workshops' },
    { gradient: 'linear-gradient(135deg,var(--google-yellow),var(--google-red))', value: '6', label: 'Domains' },
];

/* ── Events page filter buttons ─────────────────────────────────────────── */
export const EVENTS_FILTERS = [
    { value: 'all', label: 'All Events', active: true },
    { value: 'workshop', label: 'Workshops' },
    { value: 'hackathon', label: 'Hackathons' },
    { value: 'devfest', label: 'DevFest' },
    { value: 'study', label: 'Study Jams' },
    { value: 'talk', label: 'Tech Talks' },
    { value: 'community', label: 'Community' },
];

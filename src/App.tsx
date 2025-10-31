import React, { useState, FormEvent, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

// --- THÈMES ET STYLES GLOBAUX ---

const darkTheme = {
  colors: {
    background: '#000000ff', // Bleu foncé
    text: '#C9D1D9',       
    primary: '#58A6FF',     
    card: '#161B22',        
    border: '#30363D',
    accent: '#BF3989',      
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    heading: "'Inter', sans-serif",
  },
};

const lightTheme = {
  colors: {
    background: '#F6F8FA', 
    text: '#686868ff',       
    primary: '#0366D6',     
    card: '#FFFFFF',        
    border: '#E1E4E8',
    accent: '#D13117',      
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
    heading: "'Inter', sans-serif",
  },
};

type Theme = typeof darkTheme;

const GlobalCSS = ({ theme }: { theme: Theme }) => (
  <style>{`
    *, *::before, *::after {
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: ${theme.fonts.body};
      /* NOUVEAU: Ajout du "spotlight" qui suit la souris */
      background: radial-gradient(
        600px circle at var(--mouse-x) var(--mouse-y),
        ${theme.colors.primary}1A, /* 1A = ~10% opacité */
        transparent 80%
      ), ${theme.colors.background};
      color: ${theme.colors.text};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      transition: background-color 0.3s ease, color 0.3s ease;
      overflow-y: scroll;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: ${theme.fonts.heading};
      font-weight: 700;
      color: ${theme.colors.primary};
      transition: color 0.3s ease;
    }

    a {
      color: ${theme.colors.primary};
      text-decoration: none;
      transition: color 0.2s ease-in-out;
    }

    a:hover {
      color: ${theme.colors.accent};
    }
    
    section[data-page-id] {
      scroll-margin-top: 100px;
    }

    /* Conteneurs de base */
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .page-container {
      padding: 2rem 0;
      min-height: 100vh;
    }
    
    .page-content {
      padding-top: 80px; 
    }

    .button {
      background: ${theme.colors.primary};
      color: ${theme.colors.background};
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-block;
      text-decoration: none;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .section-title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      border-bottom: 3px solid ${theme.colors.accent};
      display: inline-block;
      padding-bottom: 0.5rem;
      transition: border-color 0.3s ease;
      /* NOUVEAU: Permet aux spans enfants de se cacher */
      overflow: hidden; 
    }

    /* --- Navbar --- */
    .nav-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: ${theme.colors.background}EE;
      backdrop-filter: blur(10px);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 2rem;
      border-bottom: 1px solid ${theme.colors.border};
      z-index: 1000;
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 1.5rem;
      align-items: center;
    }

    .nav-item {
      position: relative;
    }
    
    .nav-link {
      color: ${theme.colors.text};
      font-size: 1rem;
      font-weight: 500;
      padding: 0.5rem 0;
      cursor: pointer;
      position: relative;
    }

    .nav-link:hover {
      color: ${theme.colors.primary};
    }

    .active-underline {
      position: absolute;
      bottom: -5px;
      left: 0;
      right: 0;
      height: 3px;
      background: ${theme.colors.accent};
      border-radius: 2px;
    }
    
    .theme-toggle-button {
      background: ${theme.colors.card};
      border: 1px solid ${theme.colors.border};
      color: ${theme.colors.text};
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      margin-left: 2rem;
      transition: all 0.3s ease;
    }
    .theme-toggle-button:hover {
      background: ${theme.colors.border};
    }


    /* --- 2. Accueil (À Propos) --- */
    .hero-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: calc(100vh - 80px);
    }

    .hero-title {
      font-size: 4.5rem;
      margin: 0;
      color: #fff;
      background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      /* NOUVEAU: Permet aux spans enfants de se cacher */
      overflow: hidden;
    }
    
    /* NOUVEAU: Conteneur pour l'animation mot-par-mot */
    .animated-text-container {
      display: inline-block;
      /* NOUVEAU: Cache les mots qui sortent */
      overflow: hidden;
    }
    
    .animated-text-word {
      display: inline-block;
      margin-right: 0.25em; /* Espace entre les mots */
      white-space: nowrap;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin-top: 1rem;
      max-width: 600px;
    }

    /* --- 3. Objectif --- */
    .objectif-container {
      max-width: 800px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 80px);
    }

    .objectif-container p {
      font-size: 1.2rem;
      line-height: 1.8;
    }

    /* --- 4. Compétences --- */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .skill-category {
      background: ${theme.colors.card};
      border: 1px solid ${theme.colors.border};
      border-radius: 12px;
      padding: 1.5rem 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .skill-category-title {
      font-size: 1.5rem;
      color: ${theme.colors.primary};
      margin-top: 0;
      border-bottom: 2px solid ${theme.colors.border};
      padding-bottom: 0.5rem;
      transition: all 0.3s ease;
    }

    .skill-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .skill-tag {
      background: ${theme.colors.background};
      border: 1px solid ${theme.colors.border};
      color: ${theme.colors.text};
      padding: 0.5rem 0.8rem;
      border-radius: 20px;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    /* --- 5. Projets --- */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .project-card {
      background: ${theme.colors.card};
      border: 1px solid ${theme.colors.border};
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.3s ease;
    }

    .project-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .project-tag {
      background: ${theme.colors.background};
      border: 1px solid ${theme.colors.border};
      color: ${theme.colors.text};
      padding: 0.3rem 0.6rem;
      border-radius: 20px;
      font-size: 0.8rem;
      transition: all 0.3s ease;
    }

    .project-links {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      align-items: center;
    }
    
    .button-accent {
      background: ${theme.colors.accent};
      color: white;
    }

    /* --- 7. Contact --- */
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 700px;
      margin: 0 auto;
    }

    .input-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .form-input {
      padding: 0.8rem 1rem;
      border-radius: 8px;
      border: 1px solid ${theme.colors.border};
      background: ${theme.colors.card};
      color: ${theme.colors.text};
      font-size: 1rem;
      font-family: inherit;
      transition: all 0.3s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: ${theme.colors.primary};
    }

    .form-textarea {
      min-height: 150px;
      resize: vertical;
    }

    .form-status {
      padding: 1rem;
      border-radius: 8px;
      font-weight: 500;
      text-align: center;
    }
    
    .form-status-success {
      background: #2E7D32;
      color: white;
    }
    
    .form-status-error {
      background: #D32F2F;
      color: white;
    }

    /* --- MODALE IA (Simulation) --- */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .modal-content {
      background: ${theme.colors.card};
      width: 90%;
      max-width: 600px;
      height: 70vh;
      border-radius: 12px;
      border: 1px solid ${theme.colors.border};
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }

    .modal-header {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid ${theme.colors.border};
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: border-color 0.3s ease;
    }
    
    .modal-header h3 {
      margin: 0;
      color: ${theme.colors.primary};
    }

    .close-button {
      background: none;
      border: none;
      color: ${theme.colors.text};
      font-size: 1.5rem;
      cursor: pointer;
    }

    .chat-window {
      flex-grow: 1;
      padding: 1rem 1.5rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .chat-message {
      padding: 0.8rem 1rem;
      border-radius: 12px;
      max-width: 80%;
      line-height: 1.5;
      transition: all 0.3s ease;
    }

    .chat-message-ai {
      background: ${theme.colors.background};
      color: ${theme.colors.text};
      align-self: flex-start;
    }
    
    .chat-message-user {
      background: ${theme.colors.primary};
      color: ${theme.colors.background};
      align-self: flex-end;
    }

    .chat-input-form {
      display: flex;
      padding: 1rem 1.5rem;
      border-top: 1px solid ${theme.colors.border};
      gap: 1rem;
      transition: border-color 0.3s ease;
    }

    .chat-input {
      flex-grow: 1;
    }
    
    .click-ripple {
      position: fixed;
      border-radius: 50%;
      background: ${theme.colors.primary};
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9999;
    }
    
    .background-animations {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      overflow: hidden;
    }
    
    .floating-shape {
      position: absolute;
      background: ${theme.colors.primary}33; /* 33 = 20% opacité */
      border-radius: 20px;
      animation: float 20s infinite linear;
    }
    
    /* NOUVEAU: Plus de formes pour plus d'animation */
    .floating-shape:nth-child(1) { width: 80px; height: 80px; left: 10%; top: 15%; animation-duration: 25s; }
    .floating-shape:nth-child(2) { width: 120px; height: 120px; left: 80%; top: 30%; animation-duration: 20s; animation-delay: -5s; animation-direction: reverse; }
    .floating-shape:nth-child(3) { width: 50px; height: 50px; left: 50%; top: 70%; animation-duration: 15s; }
    .floating-shape:nth-child(4) { width: 200px; height: 200px; left: 20%; top: 80%; animation-duration: 30s; animation-delay: -10s; }
    .floating-shape:nth-child(5) { width: 100px; height: 100px; left: 90%; top: 90%; animation-duration: 18s; }
    .floating-shape:nth-child(6) { width: 40px; height: 40px; left: 5%; top: 50%; animation-duration: 22s; animation-delay: -15s; animation-direction: reverse; }
    .floating-shape:nth-child(7) { width: 150px; height: 150px; left: 70%; top: 10%; animation-duration: 28s; }
    .floating-shape:nth-child(8) { width: 60px; height: 60px; left: 30%; top: 40%; animation-duration: 17s; }
    .floating-shape:nth-child(9) { width: 90px; height: 90px; left: 85%; top: 65%; animation-duration: 23s; animation-delay: -7s; animation-direction: reverse; }
    .floating-shape:nth-child(10) { width: 110px; height: 110px; left: 45%; top: 5%; animation-duration: 19s; }
    
    @keyframes float {
      0% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
      50% { transform: translateY(-50px) rotate(180deg); opacity: 0.2; }
      100% { transform: translateY(0px) rotate(360deg); opacity: 0.5; }
    }
  `}
  </style>
);


// --- DONNÉES MOCK ---

type Page = 'accueil' | 'objectif' | 'competences' | 'projets' | 'experience' | 'contact';
const pageIds: Page[] = ['accueil', 'objectif', 'competences', 'projets', 'experience', 'contact'];

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  type?: 'ai' | 'web' | 'other';
}

const mockProjects: Project[] = [
  { id: 'ai-agent', name: 'Agent IA Persuasif', description: "Un agent conversationnel expérimental utilisant des techniques de PNL pour la persuasion éthique. (Simulation)", tags: ['Python', 'TypeScript', 'IA', 'PNL'], githubUrl: 'https://github.com/SticksOnTheBeach/ai-agent-demo', type: 'ai' },
  { id: 'rust-scanner', name: 'Network Sniffer en Rust', description: 'Un outil en ligne de commande pour analyser le trafic réseau, développé pour sa performance et sa sécurité.', tags: ['Rust', 'Réseaux', 'Cybersécurité', 'CLI'], githubUrl: 'https://github.com/SticksOnTheBeach/rust-sniffer', type: 'other' },
  { id: 'portfolio-v1', name: 'Ce Portfolio', description: 'Le site sur lequel vous naviguez actuellement, construit avec React, TypeScript et Framer Motion.', tags: ['React', 'TypeScript', 'Framer Motion', 'CSS'], githubUrl: 'https://github.com/SticksOnTheBeach/portfolio-react-ts', liveUrl: '#', type: 'web' },
  { id: 'java-bank', name: 'Simulation Bancaire Java', description: 'Application de bureau simulant un système de gestion bancaire, avec gestion des comptes et transactions.', tags: ['Java', 'Swing', 'POO'], githubUrl: 'https://github.com/SticksOnTheBeach/java-bank-sim', type: 'other' },
];

const skills = {
  cybersecurity: ['Analyse de malwares (basique)', 'Scan de vulnérabilités', 'Configuration de pare-feu', 'Principes de cryptographie', 'OSINT'],
  development: ['C#', 'Python', 'Rust', 'TypeScript', 'Java', 'HTML', 'CSS', 'React', 'Node.js'],
  networks: ['Modèle OSI', 'Protocoles TCP/IP', 'Configuration de VLAN', 'Wireshark', 'Subnetting'],
  ides: ['JetBrains Rider', 'PyCharm', 'CLion', 'Visual Studio', 'VS Code', 'IntelliJ IDEA'],
};

// --- ANIMATIONS ---

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 50, duration: 0.8 },
  },
};

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

// NOUVEAU: Variants pour l'animation mot-par-mot
const textContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: i * 0.1 },
  }),
};

const textWordVariants: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

// --- COMPOSANTS DE PAGE ---

// NOUVEAU: Composant pour animer le texte mot-par-mot
interface AnimatedTextProps {
  text: string;
  el?: keyof JSX.IntrinsicElements; // h1, h2, p, etc.
  className?: string;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, el = 'span', className = '', delay = 0 }) => {
  const words = text.split(' ');
  const MotionComponent = motion[el];

  return (
    <MotionComponent
      className={className}
      variants={textContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      custom={delay}
    >
      {words.map((word, index) => (
        <span key={index} className="animated-text-container">
          <motion.span
            className="animated-text-word"
            variants={textWordVariants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionComponent>
  );
};


// --- 1. Navbar ---
const Navbar: React.FC<{ 
  activePage: Page; 
  themeMode: 'dark' | 'light';
  toggleTheme: () => void;
}> = ({ activePage, themeMode, toggleTheme }) => {
  const pages: { id: Page, title: string }[] = [
    { id: 'accueil', title: 'À Propos' },
    { id: 'objectif', title: 'Objectif' },
    { id: 'competences', title: 'Compétences' },
    { id: 'projets', title: 'Projets' },
    { id: 'experience', title: 'Expérience' },
    { id: 'contact', title: 'Contact' },
  ];

  return (
    <motion.nav className="nav-container">
      <ul className="nav-links">
        {pages.map(page => (
          <motion.li className="nav-item" key={page.id}>
            <a href={`#${page.id}`} className="nav-link">
              {page.title}
              {activePage === page.id && (
                <motion.div 
                  className="active-underline" 
                  layoutId="activeUnderline"
                  // CHANGEMENT: Ajout d'une transition "spring"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </a>
          </motion.li>
        ))}
        <motion.button
          className="theme-toggle-button"
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {themeMode === 'dark' ? '☀️' : '🌙'}
        </motion.button>
      </ul>
    </motion.nav>
  );
};

// --- 2. Accueil (À Propos) ---
const Accueil: React.FC = () => (
  <div className="hero-container">
    {/* CHANGEMENT: Utilisation du nouveau composant AnimatedText */}
    <AnimatedText 
      text="SticksOnTheBeach"
      el="h1"
      className="hero-title"
    />
    <motion.p
      className="hero-subtitle"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={sectionVariants}
      transition={{ delay: 0.5 }} // Délai plus long pour attendre le titre
    >
      Développeur passionné & futur ingénieur en cybersécurité.
      <br />
      Bienvenue sur mon portfolio.
    </motion.p>
  </div>
);

// --- 3. Objectif ---
const Objectif: React.FC = () => (
  <div className="app-container objectif-container">
    {/* CHANGEMENT: Utilisation du nouveau composant AnimatedText */}
    <AnimatedText 
      text="Mon Objectif Professionnel"
      el="h2"
      className="section-title"
    />
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={sectionVariants}
      transition={{ delay: 0.3 }}
    >
      Je suis actuellement en quête de devenir <strong>Ingénieur en Cybersécurité</strong>. Ma passion ne se limite pas à la programmation ; elle s'étend à la protection des systèmes, à la compréhension des menaces et à la création d'un environnement numérique plus sûr.
    </motion.p>
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={sectionVariants}
      transition={{ delay: 0.5 }}
    >
      Mon objectif est de combiner mes compétences en développement (Rust, Python, C#) avec une expertise pointue en sécurité des réseaux et des applications pour travailler activement dans la cyberdéfense, l'analyse de menaces ou le pentesting.
    </motion.p>
  </div>
);

// --- 4. Compétences ---
const Competences: React.FC = () => (
  <div className="app-container page-container">
    {/* CHANGEMENT: Utilisation du nouveau composant AnimatedText */}
    <AnimatedText 
      text="Mes Compétences"
      el="h2"
      className="section-title"
    />
    <motion.div 
      className="skills-grid" 
      variants={listVariants} 
      initial="hidden" 
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* ... (contenu identique) ... */}
      <motion.div className="skill-category" variants={itemVariants}>
        <h3 className="skill-category-title">Cybersécurité</h3>
        <motion.ul className="skill-list">
          {skills.cybersecurity.map(skill => (
            <motion.li
              className="skill-tag"
              key={skill}
              whileHover={{ scale: 1.1, backgroundColor: darkTheme.colors.accent, color: '#fff' }}
            >
              {skill}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
      
      <motion.div className="skill-category" variants={itemVariants}>
        <h3 className="skill-category-title">Développement</h3>
        <motion.ul className="skill-list">
          {skills.development.map(skill => (
            <motion.li 
              className="skill-tag"
              key={skill}
              whileHover={{ scale: 1.1, backgroundColor: darkTheme.colors.primary, color: darkTheme.colors.background }}
            >
              {skill}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div className="skill-category" variants={itemVariants}>
        <h3 className="skill-category-title">Réseaux</h3>
        <motion.ul className="skill-list">
          {skills.networks.map(skill => (
            <motion.li className="skill-tag" key={skill} whileHover={{ scale: 1.1 }}>{skill}</motion.li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.div className="skill-category" variants={itemVariants}>
        <h3 className="skill-category-title">Outils & IDEs</h3>
        <motion.ul className="skill-list">
          {skills.ides.map(skill => (
            <motion.li className="skill-tag" key={skill} whileHover={{ scale: 1.1 }}>{skill}</motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </motion.div>
  </div>
);

// --- 5. Projets ---
const Projets: React.FC<{ onTestAi: () => void }> = ({ onTestAi }) => (
  <div className="app-container page-container">
    {/* CHANGEMENT: Utilisation du nouveau composant AnimatedText */}
    <AnimatedText 
      text="Mes Projets"
      el="h2"
      className="section-title"
    />
    <motion.div 
      className="projects-grid" 
      variants={listVariants} 
      initial="hidden" 
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* ... (contenu identique) ... */}
      {mockProjects.map(project => (
        <motion.div className="project-card" key={project.id} variants={itemVariants}>
          <div>
            <h3 style={{ marginTop: 0 }}>{project.name}</h3>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map(tag => (
                <span className="project-tag" key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className="project-links">
            <motion.a 
              className="button" 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Voir sur GitHub
            </motion.a>
            {project.type === 'ai' && (
              <motion.button 
                className="button button-accent" 
                onClick={onTestAi}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Tester l'IA
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

// --- 6. Expérience ---
const Experience: React.FC = () => (
  <div className="app-container page-container">
    {/* CHANGEMENT: Utilisation du nouveau composant AnimatedText */}
    <AnimatedText 
      text="Expérience"
      el="h2"
      className="section-title"
    />
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={sectionVariants}
    >
      Je suis actuellement étudiant et je concentre mes efforts sur des projets personnels et académiques pour bâtir mon expérience pratique.
      <br /><br />
      (Ici, vous ajouteriez des stages, des projets universitaires pertinents ou des contributions open-source.)
    </motion.p>
  </div>
);

// --- 7. Contact ---
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    console.log("Données du formulaire (simulation):", formData);
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 2000);
  };

  return (
    <div className="app-container page-container">
      {/* CHANGEMENT: Utilisation du nouveau composant AnimatedText */}
      <AnimatedText 
        text="Me Contacter"
        el="h2"
        className="section-title"
      />
      <motion.p 
        style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2rem auto' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        transition={{ delay: 0.2 }}
      >
        Un projet, une question ou juste envie de discuter ? Laissez-moi un message.
      </motion.p>
      <motion.form 
        className="form-container" 
        onSubmit={handleSubmit}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={listVariants}
      >
        {/* ... (contenu identique) ... */}
        <motion.div className="input-group" variants={itemVariants}>
          <label className="form-label" htmlFor="name">Nom</label>
          <input className="form-input" type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </motion.div>
        <motion.div className="input-group" variants={itemVariants}>
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-input" type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </motion.div>
        <motion.div className="input-group" variants={itemVariants}>
          <label className="form-label" htmlFor="message">Message</label>
          <textarea className="form-input form-textarea" id="message" name="message" value={formData.message} onChange={handleChange} required />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          {status === 'idle' && (
            <motion.button type="submit" className="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Envoyer
            </motion.button>
          )}
          {status === 'sending' && (
            <motion.button type="button" className="button" disabled>Envoi en cours...</motion.button>
          )}
        </motion.div>
        
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              className="form-status form-status-success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Message envoyé avec succès ! (Simulation)
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              className="form-status form-status-error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Une erreur est survenue. (Simulation)
            </motion.div>
          )}
        </AnimatePresence>
        
      </motion.form>
    </div>
  );
};

// --- MODALE IA (Simulation) ---
interface Message { id: number; sender: 'user' | 'ai'; text: string; }

const AiAgentModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: "Bonjour ! Je suis une simulation de l'agent IA. Posez-moi une question." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  const getAiResponse = (prompt: string): string => {
    prompt = prompt.toLowerCase();
    if (prompt.includes('cyber')) return "La cybersécurité est un domaine fascinant, n'est-ce pas ? SticksOnTheBeach s'y intéresse beaucoup.";
    if (prompt.includes('projet')) return "Ce projet est une démonstration. Pour le vrai projet, consultez le lien GitHub !";
    return "C'est une excellente question. En tant que simulation, je ne peux que donner des réponses pré-programmées. Mais merci d'avoir essayé !";
  };

  const handleAiSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage: Message = { id: Date.now() + 1, sender: 'ai', text: getAiResponse(currentInput) };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Test de l'Agent IA (Simulation)</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="chat-window">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`chat-message ${msg.sender === 'user' ? 'chat-message-user' : 'chat-message-ai'}`}
            >
              {msg.text}
            </div>
          ))}
          {isTyping && <div className="chat-message chat-message-ai">...</div>}
          <div ref={chatEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleAiSubmit}>
          <input 
            type="text" 
            className="form-input chat-input"
            placeholder="Écrivez votre prompt..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
          />
          <motion.button type="submit" className="button" disabled={isTyping}>Envoyer</motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};


// NOUVEAU: Animation de fond
const AnimatedBackground: React.FC = () => (
  <div className="background-animations">
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
    <div className="floating-shape"></div>
  </div>
);

// Animation de clic
interface Ripple { id: number; x: number; y: number; }
const ClickRipple: React.FC<Ripple & { onComplete: (id: number) => void }> = ({ id, x, y, onComplete }) => (
  <motion.div
    className="click-ripple"
    style={{ left: x, top: y }}
    initial={{ scale: 0, opacity: 0.5 }}
    animate={{ scale: 10, opacity: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    onAnimationComplete={() => onComplete(id)}
  />
);


// --- COMPOSANT APP PRINCIPAL ---

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [activeSection, setActiveSection] = useState<Page>('accueil');
  const [showAiModal, setShowAiModal] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  // NOUVEAU: État pour la position de la souris
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = pageIds.map(id => document.getElementById(id));
      const scrollY = window.scrollY + 110; 
      let current: Page = 'accueil';
      for (const section of sections) {
        if (section && section.offsetTop <= scrollY) {
          current = section.id as Page;
        } else {
          break;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // NOUVEAU: Gestionnaire pour la position de la souris
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };
  
  const handleAppClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
      return;
    }
    setRipples(prev => [
      ...prev,
      { id: Date.now(), x: e.clientX, y: e.clientY }
    ]);
  };
  
  const handleRippleComplete = (id: number) => {
    setRipples(prev => prev.filter(r => r.id !== id));
  };


  return (
    // CHANGEMENT: Ajout de onMouseMove et des variables CSS pour le spotlight
    <div 
      onClick={handleAppClick} 
      onMouseMove={handleMouseMove}
      style={{ 
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`,
        minHeight: '100vh', 
        position: 'relative' 
      } as React.CSSProperties}
    >
      <GlobalCSS theme={currentTheme} />
      <AnimatedBackground />
      {ripples.map(ripple => (
        <ClickRipple key={ripple.id} {...ripple} onComplete={handleRippleComplete} />
      ))}
      
      <Navbar 
        activePage={activeSection} 
        themeMode={themeMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="page-content">
        <section id="accueil" data-page-id="accueil">
          <Accueil />
        </section>
        
        <section id="objectif" data-page-id="objectif">
          <Objectif />
        </section>
        
        <section id="competences" data-page-id="competences">
          <Competences />
        </section>
        
        <section id="projets" data-page-id="projets">
          <Projets onTestAi={() => setShowAiModal(true)} />
        </section>
        
        <section id="experience" data-page-id="experience">
          <Experience />
        </section>
        
        <section id="contact" data-page-id="contact">
          <Contact />
        </section>
      </main>

      <AnimatePresence>
        {showAiModal && (
          <AiAgentModal onClose={() => setShowAiModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;


/** Grounded professional corpus for Ask. Edit here to "train" the assistant. */

export const CONTACT = {
  email: 'ershivanshumathur@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shivanshumathur/',
  calendly: 'https://calendly.com/shivanshu-mthr8/30min',
  figma: 'https://www.figma.com/@shivanshumathur'
};

export const OFF_TOPIC = [
  'weather', 'recipe', 'poem', 'joke', 'horoscope', 'astrology',
  'ipl', 'cricket', 'football', 'nba', 'score', 'match',
  'bitcoin', 'crypto', 'stock price', 'nasdaq',
  'python script', 'write code', 'leetcode', 'homework',
  'medical', 'diagnose', 'prescription', 'lawyer', 'legal advice',
  'girlfriend', 'dating', 'nsfw',
  'ignore previous', 'ignore all', 'system prompt', 'jailbreak',
  'who won', 'capital of', 'translate this', 'act as',
  'what is 2+', 'tell me a story'
];

export const DOCS = [
  {
    id: 'profile',
    keys: ['who is', 'about him', 'about shivanshu', 'background', 'bio', 'profile', 'shivanshu', 'mathur', 'what does he do', 'intro'],
    speak: "Shivanshu Mathur is an AI Native Product Designer in India. He designs intelligent products that make complexity feel simple.",
    show: "AI Native Product Designer · India · 6+ years · 20+ projects.",
    text: `Shivanshu Mathur is an AI Native Product Designer based in India. Positioning: he designs intelligent products that make complexity feel simple. 6+ years of experience, 20+ projects delivered. Recent companies: Novartis, Atlassian, EPAM, Simplilearn, NEC. Recent titles: Sr. UX Strategist (Novartis digital finance), Sr. Product Designer (Atlassian Forge).`,
    cards: [
      {
        type: 'profile',
        title: 'Shivanshu Mathur',
        subtitle: 'AI Native Product Designer',
        image: '/assets/logos/ShivanshuMathur.jpg',
        meta: 'India · 6+ years · 20+ projects'
      }
    ]
  },
  {
    id: 'process',
    keys: ['process', 'approach', 'how does he', 'method', 'research', 'design process', 'how he works', 'philosophy'],
    speak: "He starts at the moment someone gets stuck. Research first, then structure, then interface — especially on AI and platform work.",
    show: "Find the stuck moment → reframe → sequence a platform, not a one-off screen.",
    text: `Design process: find the moment someone gets stuck before redesigning anything. Research first, then structure, then interface. On Forge, low adoption looked like a docs problem; interviews showed it was a trust and support problem. Docs are often a symptom. He treats work as a platform initiative, not a single tool. Sequence capabilities to reduce risk and drive adoption.`,
    cards: [
      {
        type: 'process',
        title: 'How he works',
        steps: [
          'Find the stuck moment',
          'Reframe the real problem',
          'Sequence a platform, not a screen'
        ]
      }
    ]
  },
  {
    id: 'forge',
    keys: ['forge', 'atlassian', 'developer platform', 'developer experience', 'dx', 'cli', 'marketplace', 'volt'],
    speak: "On Forge he led research and experience strategy from January to June 2024. It went live that October — thousands of apps followed.",
    show: "Forge: unused internal platform → Atlassian's app-dev standard.",
    action: 'open_forge',
    text: `Atlassian Forge — App Development Platform. Role: Sr. Product Designer. Domain: Developer Experience. Period: research and experience strategy Jan–Jun 2024, handed off validated IA, landing page, onboarding, and community model. Live mid-October 2024. Problem: unused internal frontend platform with almost no adoption signal. Insight: teams that succeeded had an internal champion; the gap was a path from stuck to unstuck, not just documentation. Work included consolidated docs, Developer Community space, task-oriented tutorials, marketplace visibility. Impact by July 2026: 5,600+ apps created, 73,000+ Forge CLI downloads, 13,000+ Developer Community members.`,
    cards: [
      {
        type: 'project',
        title: 'Forge',
        subtitle: 'Atlassian app-development platform',
        image: '/assets/projects/Forge.jpg',
        meta: 'Sr. Product Designer · DX · 2024',
        cta: { label: 'Open case study', action: 'open_forge' }
      },
      {
        type: 'metrics',
        title: 'Impact by July 2026',
        metrics: [
          { value: '5,600+', label: 'Apps created' },
          { value: '73k+', label: 'CLI downloads' },
          { value: '13k+', label: 'Community members' }
        ]
      }
    ]
  },
  {
    id: 'finance',
    keys: ['finance', 'financial', 'forecast', 'planning', 'excel', 'novartis', 'sap', 'kpi', 'market model', 'cost insight'],
    speak: "At Novartis he led the shift from fragmented Excel planning to a trusted enterprise finance platform. Sr. UX Strategist, team of about 48.",
    show: "Enterprise Financial Planning · Jul 2024–present · platform, not a tool.",
    action: 'open_finance',
    text: `Novartis Enterprise Financial Planning & Forecasting. Role: Sr. UX Strategist. Duration: Jul 2024–present. Team ~48. Domain: Digital Finance. Tools: Miro, Figma, Jira, SAP. Mandate: move from fragmented Excel-based planning to a scalable, trusted enterprise platform. Strategy: treat it as a platform, not a tool. Three layers: (1) govern the data, (2) sync the workflows globally, (3) layer intelligence / AI-driven forecasting. Ownership across problem framing, platform sequencing, personas, KPI mapping, tool integration (Market Model, 1DL, Sofia, Cost Insights), card sorting, user flows, wireframes. Designed within SAP constraints.`,
    cards: [
      {
        type: 'project',
        title: 'Financial Planning',
        subtitle: 'Novartis digital finance platform',
        image: '/assets/projects/DigitalFinance.jpg',
        meta: 'Sr. UX Strategist · Jul 2024–present · ~48 people',
        cta: { label: 'Open case study', action: 'open_finance' }
      }
    ]
  },
  {
    id: 'dost',
    keys: ['dost', 'rag', 'chatbot', 'support bot', 'finance bot'],
    speak: "DOST is the RAG chatbot he defined for digital finance — it answers tool and definition questions from official docs and dashboards.",
    show: "DOST: RAG over docs, dashboards, and KPI definitions.",
    action: 'open_finance',
    text: `DOST is a RAG-based chatbot on the Novartis digital finance platform. It reduces support dependency by answering repetitive finance and tool queries with contextual guidance from documentation, dashboards, and KPI definitions.`,
    cards: [
      {
        type: 'project',
        title: 'DOST',
        subtitle: 'RAG assistant for digital finance',
        meta: 'Docs · dashboards · KPI definitions',
        cta: { label: 'See the platform', action: 'open_finance' }
      }
    ]
  },
  {
    id: 'contact',
    keys: ['contact', 'email', 'reach', 'hire', 'available', 'calendly', 'book', 'call', 'linkedin', 'recruit'],
    speak: "He's open to UX research, developer-experience, and AI product conversations. Email or book a thirty-minute call.",
    show: "Open to UX research, DX, and AI product design.",
    action: 'open_calendly',
    text: `Contact: ershivanshumathur@gmail.com. Calendly 30 min: https://calendly.com/shivanshu-mthr8/30min. LinkedIn: https://www.linkedin.com/in/shivanshumathur/. Figma: https://www.figma.com/@shivanshumathur. Open to UX research and developer-experience roles, and conversations about platform adoption or AI product design.`,
    cards: [
      {
        type: 'contact',
        title: 'Get in touch',
        actions: [
          { label: 'Book a call', action: 'open_calendly' },
          { label: 'Email', action: 'open_mail' },
          { label: 'LinkedIn', action: 'open_linkedin' }
        ]
      }
    ]
  },
  {
    id: 'site',
    keys: ['this site', 'personal os', 'os29', 'website', 'ai lab', 'ailab', 'portfolio'],
    speak: "This site is Personal OS — his portfolio as a desktop. Ask is the system assistant. AI Lab is the 3D experiment.",
    show: "Personal OS · Ask · AI Lab · Selected Projects.",
    text: `Personal OS is Shivanshu's portfolio imagined as a desktop. Built with HTML, CSS, JS, hosted on Vercel. Ask is the system assistant (work-only). AI Lab is a 3D WebGL experiment at /ai-lab/. Selected Projects (Work) holds the Forge and finance case studies and may be password-gated.`,
    cards: [
      {
        type: 'process',
        title: 'On this desktop',
        steps: ['Ask — work assistant', 'Work — selected projects', 'AI Lab — 3D experiments']
      }
    ]
  }
];

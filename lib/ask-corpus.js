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
    text: `Shivanshu Mathur is an AI Native Product Designer based in India. Positioning: he designs intelligent products that make complexity feel simple. 6+ years of experience, 20+ projects delivered. He is also the Founder of Meraken (Oct 2024-present). Recent companies: Novartis, Atlassian, EPAM, Simplilearn, NEC. Recent titles: Sr. UX Strategist (Novartis digital finance), Sr. Product Designer (Atlassian Forge), Experience Designer (EPAM Systems).`,
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
  },
  {
    id: 'epam',
    keys: ['epam', 'onepsp', 'psp', 'patient support', 'resume filtration', 'hiring tool', 'qlik', 'matplotlib'],
    speak: "At EPAM Systems he's an Experience Designer since March 2023. He led design on Novartis's OnePSP dashboard and built an AI-driven resume filtration tool.",
    show: "EPAM Systems · Experience Designer · Mar 2023–present.",
    text: `EPAM Systems — Experience Designer, Bengaluru, Mar 2023–present. Two notable initiatives: (1) OnePSP — Key Designer on Novartis's Patient Support Program (PSP). Led a cross-functional team of Business Analysts and Developers. Designed and built the OnePSP Dashboard, consolidating data across patient programs and giving Marketing and Stakeholders actionable insights. Tools: Qlik, Figma, AngularJS, Python, Matplotlib. (2) An AI-driven candidate filtration tool to handle high volumes of resumes and referrals, applying GenAI, UX, and research to improve hiring efficiency.`,
    cards: [
      {
        type: 'project',
        title: 'OnePSP',
        subtitle: 'Novartis Patient Support Program dashboard, via EPAM',
        meta: 'Key Designer · Qlik · Figma · AngularJS'
      }
    ]
  },
  {
    id: 'simplilearn',
    keys: ['simplilearn', 'skillup', 'edtech', 'learning platform', 'lms', 'upskilling', 'mau', 'traffic to lead'],
    speak: "At Simplilearn he redesigned learning journeys, lifting upskilling completion from 13% to 30% and growing monthly active users 18%.",
    show: "Simplilearn: UX Designer · Jul 2022–Mar 2023 · upskilling 13%→30%.",
    text: `Simplilearn — User Experience Designer, Bengaluru, Jul 2022–Mar 2023. Skillup (Freemium): redesigned learning journeys, increasing upskilling completion from 13% to 30%; grew Monthly Active Users 18%; introduced a new revenue stream via byte-sized learning and career learning paths. Platform Product — engagement: managed a Monthly Active User count of 77k for premium LMS programs; increased completion rates 22% through a holistic redesign of the omnichannel communication experience. Growth Product — traffic and conversion: ran traffic-to-lead strategy for the growth product at ~4 million monthly visitors; raised the Traffic-to-Lead ratio from 2.3% to 3.7%; designed POVs that lifted Click-Through Rate 15%, while holding Revenue per Lead steady.`,
    cards: [
      {
        type: 'metrics',
        title: 'Simplilearn impact',
        metrics: [
          { value: '13%→30%', label: 'Upskilling completion' },
          { value: '18%', label: 'MAU growth' },
          { value: '2.3%→3.7%', label: 'Traffic-to-lead' }
        ]
      }
    ]
  },
  {
    id: 'meraken',
    keys: ['meraken', 'founder', 'startup', 'venture', 'his own company', 'entrepreneur', 'entrepreneurship'],
    speak: "He's also the Founder of Meraken, his own venture, since October 2024 — alongside his design work.",
    show: "Meraken · Founder · Oct 2024–present.",
    text: `Meraken — Founder, October 2024–present. Shivanshu's own venture, run alongside his design work at EPAM/Novartis. Reach out via the contact options for more on what Meraken is building.`,
    cards: []
  },
  {
    id: 'origin',
    keys: ['education', 'degree', 'iit', 'iit delhi', 'lovely professional university', 'lpu', 'college', 'university', 'study', 'studied', 'studies', 'school', 'early career', 'before design', 'how did he start', 'data engineer', 'nec corporation', 'xenonstack', 'background story'],
    speak: "He studied Computer Science at Lovely Professional University, then Research and Strategy at IIT Delhi. He started out as a data engineer before moving into UX and product design.",
    show: "LPU (B.Tech CSE) · IIT Delhi (Research & Strategy) · started as a data engineer at NEC.",
    text: `Education: Bachelor's degree, Computer Science and Engineering, Lovely Professional University. Specialization, Research and Strategy, Indian Institute of Technology (IIT) Delhi. Early career, before shifting into UX and product design: NEC Corporation — Research Intern (Jun–Aug 2020), Trainee (Jan–Jul 2021), then Data Engineer (Aug 2021–Jul 2022), Bengaluru. XenonStack — Software Engineer Intern (Sep–Dec 2020). This engineering and data background now informs how he approaches AI-native product design.`,
    cards: [
      {
        type: 'process',
        title: 'Path into design',
        steps: [
          'B.Tech CSE, Lovely Professional University',
          'Data Engineer, NEC Corporation',
          'Research & Strategy, IIT Delhi',
          'Shift into UX and product design'
        ]
      }
    ]
  },
  {
    id: 'awards',
    keys: ['awards', 'honors', 'honours', 'hackathon', 'competition', 'ctf', 'achievements', 'recognition', 'skills', 'languages'],
    speak: "He's won a couple of cybersecurity CTF challenges, an NEC hackathon, and a healthtech innovation challenge. He speaks English, Hindi, and some German.",
    show: "NEC Hackathon · India Innovation Challenge 2019 · 2x CTF wins · AGBI HealthTech Challenge.",
    text: `Honors: NEC Hackathon — SX-Aurora (TSUBASA); India Innovation Challenge Design Contest 2019; Brute Force 1.0 (CTF Challenge); Cipher Combat 2.0 — A Cybersecurity CTF Challenge; AGBI Digital HealthTech Grand Challenge. Top skills: Entrepreneurship, Leadership, Time Management. Languages: English (Full Professional), Hindi (Native/Bilingual), German (Limited Working).`,
    cards: []
  }
];

/* Professional knowledge + scoped replies for Ask. No general chat. */
(function (root) {
  var CONTACT = {
    email: 'ershivanshumathur@gmail.com',
    linkedin: 'https://www.linkedin.com/in/shivanshumathur/',
    calendly: 'https://calendly.com/shivanshu-mthr8/30min',
    figma: 'https://www.figma.com/@shivanshumathur'
  };

  var REFUSE = {
    speak: "I only talk about Shivanshu's work. Ask about his background, case studies, or how to hire him.",
    show: "I stay on-topic: Shivanshu, his design work, and how to reach him.",
    action: null,
    refuse: true,
    cards: []
  };

  var UNKNOWN = {
    speak: "I don't have that detail. Ask about his background, Forge, the finance platform, or how to get in touch.",
    show: "Try his background, Forge, finance work, process, or booking a call.",
    action: null,
    refuse: false
  };

  var TOPICS = [
    {
      id: 'who',
      keys: ['who is', 'who is he', 'about him', 'about shivanshu', 'background', 'intro', 'introduction', 'bio', 'profile', 'shivanshu', 'mathur', 'what does he do'],
      speak: "Shivanshu Mathur is an AI Native Product Designer in India. He designs intelligent products that make complexity feel simple.",
      show: "AI Native Product Designer · India · 6+ years · 20+ projects. Novartis, Atlassian, EPAM, Simplilearn, NEC.",
      action: null,
      cards: [{ type: 'profile', title: 'Shivanshu Mathur', subtitle: 'AI Native Product Designer', image: './assets/logos/ShivanshuMathur.jpg', meta: 'India · 6+ years · 20+ projects' }]
    },
    {
      id: 'title',
      keys: ['title', 'role', 'job', 'position', 'what is he', 'ai native', 'product designer', 'ux'],
      speak: "He's an AI Native Product Designer — strategy, research, and product experience for complex and intelligent systems.",
      show: "Title: AI Native Product Designer. Recent roles: Sr. UX Strategist (Novartis finance), Sr. Product Designer (Atlassian Forge).",
      action: null
    },
    {
      id: 'experience',
      keys: ['experience', 'years', 'how long', 'senior', 'career', 'worked'],
      speak: "Over six years, twenty-plus shipped projects. Recent work spans Novartis digital finance and Atlassian Forge.",
      show: "6+ years · 20+ projects · Novartis, Atlassian, EPAM, Simplilearn, NEC.",
      action: null
    },
    {
      id: 'companies',
      keys: ['compan', 'nec', 'where did he', 'clients', 'employ', 'who has he worked'],
      speak: "He's worked with Novartis, Atlassian, EPAM, Simplilearn, and NEC — enterprise finance, developer platforms, and learning products.",
      show: "Novartis · Atlassian · EPAM · Simplilearn · NEC.",
      action: null
    },
    {
      id: 'meraken',
      keys: ['meraken', 'founder', 'startup', 'venture', 'his own company', 'entrepreneur', 'entrepreneurship'],
      speak: "He's also the Founder of Meraken, his own venture, since October 2024 — alongside his design work.",
      show: "Meraken · Founder · Oct 2024–present.",
      action: null
    },
    {
      id: 'epam',
      keys: ['epam', 'onepsp', 'psp', 'patient support', 'resume filtration', 'hiring tool', 'qlik', 'matplotlib'],
      speak: "At EPAM Systems he's an Experience Designer since March 2023. He led design on Novartis's OnePSP dashboard and built an AI-driven resume filtration tool.",
      show: "EPAM Systems · Experience Designer · Mar 2023–present.",
      action: null,
      cards: [{ type: 'project', title: 'OnePSP', subtitle: 'Novartis Patient Support Program dashboard, via EPAM', meta: 'Key Designer · Qlik · Figma · AngularJS' }]
    },
    {
      id: 'simplilearn',
      keys: ['simplilearn', 'skillup', 'edtech', 'learning platform', 'lms', 'upskilling', 'mau', 'traffic to lead'],
      speak: "At Simplilearn he redesigned learning journeys, lifting upskilling completion from 13% to 30% and growing monthly active users 18%.",
      show: "Simplilearn: UX Designer · Jul 2022–Mar 2023 · upskilling 13%→30%.",
      action: null,
      cards: [{ type: 'metrics', title: 'Simplilearn impact', metrics: [{ value: '13%→30%', label: 'Upskilling completion' }, { value: '18%', label: 'MAU growth' }, { value: '2.3%→3.7%', label: 'Traffic-to-lead' }] }]
    },
    {
      id: 'origin',
      keys: ['education', 'degree', 'iit', 'iit delhi', 'lovely professional university', 'lpu', 'college', 'university', 'study', 'studied', 'studies', 'school', 'early career', 'before design', 'how did he start', 'data engineer', 'nec corporation', 'xenonstack', 'background story'],
      speak: "He studied Computer Science at Lovely Professional University, then Research and Strategy at IIT Delhi. He started out as a data engineer before moving into UX and product design.",
      show: "LPU (B.Tech CSE) · IIT Delhi (Research & Strategy) · started as a data engineer at NEC.",
      action: null,
      cards: [{ type: 'process', title: 'Path into design', steps: ['B.Tech CSE, Lovely Professional University', 'Data Engineer, NEC Corporation', 'Research & Strategy, IIT Delhi', 'Shift into UX and product design'] }]
    },
    {
      id: 'awards',
      keys: ['awards', 'honors', 'honours', 'hackathon', 'competition', 'ctf', 'achievements', 'recognition', 'skills', 'languages'],
      speak: "He's won a couple of cybersecurity CTF challenges, an NEC hackathon, and a healthtech innovation challenge. He speaks English, Hindi, and some German.",
      show: "NEC Hackathon · India Innovation Challenge 2019 · 2x CTF wins · AGBI HealthTech Challenge.",
      action: null
    },
    {
      id: 'location',
      keys: ['where', 'location', 'india', 'based', 'remote', 'timezone', 'city'],
      speak: "He's based in India and works with distributed product teams.",
      show: "Location: India. Open to conversations about remote and hybrid roles.",
      action: null
    },
    {
      id: 'process',
      keys: ['process', 'approach', 'how does he', 'method', 'research', 'design process', 'how he works', 'philosophy'],
      speak: "He starts at the moment someone gets stuck. Research first, then structure, then interface — especially on AI and platform work.",
      show: "Find the stuck moment → reframe the problem → sequence a platform, not a one-off screen. Docs are often a symptom, not the cause.",
      action: null,
      cards: [{ type: 'process', title: 'How he works', steps: ['Find the stuck moment', 'Reframe the real problem', 'Sequence a platform, not a screen'] }]
    },
    {
      id: 'ai',
      keys: ['ai', 'artificial', 'intelligent', 'llm', 'machine learning', 'rag', 'chatbot'],
      speak: "He designs AI-native products — including DOST, a RAG chatbot that answers finance and tool questions from real docs and dashboards.",
      show: "AI UX + RAG: DOST on the Novartis finance platform. Also this Ask assistant on Personal OS, and experiments in AI Lab.",
      action: null
    },
    {
      id: 'tools',
      keys: ['tool', 'figma', 'miro', 'jira', 'sap', 'stack', 'software'],
      speak: "Day to day: Figma, Miro, Jira. On the finance platform he designed within SAP constraints.",
      show: "Figma · Miro · Jira · SAP. Figma community: figma.com/@shivanshumathur",
      action: null
    },
    {
      id: 'forge',
      keys: ['forge', 'atlassian', 'volt', 'developer platform', 'developer experience', 'dx', 'cli', 'marketplace'],
      speak: "On Forge he led research and experience strategy from January to June 2024. It went live that October — thousands of apps followed.",
      show: "Forge: unused internal platform → Atlassian's app-dev standard. Role: Sr. Product Designer. Impact by July 2026: 5,600+ apps, 73k+ CLI downloads, 13k+ community members.",
      action: 'open_forge',
      cards: [
        { type: 'project', title: 'Forge', subtitle: "Atlassian app-development platform", image: './assets/projects/Forge.jpg', meta: 'Sr. Product Designer · DX · 2024', cta: { label: 'Open case study', action: 'open_forge' } },
        { type: 'metrics', title: 'Impact by July 2026', metrics: [{ value: '5,600+', label: 'Apps created' }, { value: '73k+', label: 'CLI downloads' }, { value: '13k+', label: 'Community members' }] }
      ]
    },
    {
      id: 'finance',
      keys: ['finance', 'financial', 'forecast', 'planning', 'excel', 'novartis', 'sap', 'kpi', 'market model', 'cost insight'],
      speak: "At Novartis he led the shift from fragmented Excel planning to a trusted enterprise finance platform. Sr. UX Strategist, team of about 48.",
      show: "Enterprise Financial Planning & Forecasting · Jul 2024–present · treat it as a platform, not a tool. Layers: governance, planning, then intelligence.",
      action: 'open_finance',
      cards: [{ type: 'project', title: 'Financial Planning', subtitle: 'Novartis digital finance platform', image: './assets/projects/DigitalFinance.jpg', meta: 'Sr. UX Strategist · Jul 2024–present · ~48 people', cta: { label: 'Open case study', action: 'open_finance' } }]
    },
    {
      id: 'dost',
      keys: ['dost', 'support bot', 'finance bot', 'documentation bot'],
      speak: "DOST is the RAG chatbot he defined for digital finance — it answers repetitive tool and definition questions from official docs.",
      show: "DOST: RAG over documentation, dashboards, and KPI definitions. Cuts support load on the finance platform.",
      action: 'open_finance',
      cards: [{ type: 'project', title: 'DOST', subtitle: 'RAG assistant for digital finance', meta: 'Docs · dashboards · KPI definitions', cta: { label: 'See the platform', action: 'open_finance' } }]
    },
    {
      id: 'portfolio',
      keys: ['portfolio', 'case study', 'case studies', 'work', 'projects', 'selected', 'show work', 'open work'],
      speak: "I'll open Selected Projects. There are two public studies: Novartis finance and Atlassian Forge.",
      show: "Opening Work — password may be required.",
      action: 'open_work'
    },
    {
      id: 'ailab',
      keys: ['ai lab', 'ailab', 'lab', 'experiment', '3d', 'webgl'],
      speak: "AI Lab is his experimental space — a 3D WebGL lab on this site.",
      show: "Opening AI Lab.",
      action: 'open_ailab'
    },
    {
      id: 'site',
      keys: ['this site', 'personal os', 'os29', 'desktop', 'website', 'portfolio site'],
      speak: "This site is Personal OS — his portfolio imagined as a desktop. Designed and built by him.",
      show: "Personal OS · Version 1.0 · HTML, CSS, JS · Vercel. Ask is the system assistant.",
      action: null
    },
    {
      id: 'hire',
      keys: ['hire', 'available', 'availability', 'open to', 'looking', 'job', 'role', 'recruit', 'opportunity', 'freelance'],
      speak: "He's open to UX research and developer-experience conversations, and to building products like the ones in his studies. I can book a call.",
      show: "Open to UX research, DX, and AI product design conversations. Calendly or email.",
      action: 'open_calendly',
      cards: [{ type: 'contact', title: 'Get in touch', actions: [{ label: 'Book a call', action: 'open_calendly' }, { label: 'Email', action: 'open_mail' }, { label: 'LinkedIn', action: 'open_linkedin' }] }]
    },
    {
      id: 'contact',
      keys: ['contact', 'email', 'reach', 'write', 'message', 'get in touch', 'talk'],
      speak: "Email him at ershivanshumathur@gmail.com, or I can open a thirty-minute Calendly.",
      show: "ershivanshumathur@gmail.com · LinkedIn · Calendly 30 min",
      action: 'open_mail',
      cards: [{ type: 'contact', title: 'Get in touch', actions: [{ label: 'Book a call', action: 'open_calendly' }, { label: 'Email', action: 'open_mail' }, { label: 'LinkedIn', action: 'open_linkedin' }] }]
    },
    {
      id: 'call',
      keys: ['call', 'calendly', 'book', 'meeting', 'schedule', 'chat'],
      speak: "Opening his thirty-minute Calendly.",
      show: "calendly.com/shivanshu-mthr8/30min",
      action: 'open_calendly'
    },
    {
      id: 'linkedin',
      keys: ['linkedin', 'linked in'],
      speak: "Opening his LinkedIn.",
      show: "linkedin.com/in/shivanshumathur",
      action: 'open_linkedin'
    },
    {
      id: 'dark',
      keys: ['dark mode', 'dark theme', 'go dark', 'lights off', 'night mode'],
      speak: "Switching to dark.",
      show: "Appearance: Dark",
      action: 'theme_dark'
    },
    {
      id: 'light',
      keys: ['light mode', 'light theme', 'go light', 'lights on', 'day mode', 'bright'],
      speak: "Switching to light.",
      show: "Appearance: Light",
      action: 'theme_light'
    },
    {
      id: 'theme',
      keys: ['toggle theme', 'switch theme', 'appearance', 'toggle dark', 'toggle light'],
      speak: "Toggling appearance.",
      show: "Appearance toggled.",
      action: 'theme_toggle'
    },
    {
      id: 'help',
      keys: ['help', 'what can you', 'what can i', 'commands', 'what do you', 'how do i'],
      speak: "Ask about Shivanshu, Forge, the finance platform, his process, or say open work, book a call, or go dark.",
      show: "Who he is · Forge · Finance · Process · Open work · Book a call · Email · Dark / light",
      action: null
    }
  ];

  var OFF_TOPIC = [
    'weather', 'recipe', 'poem', 'joke', 'horoscope', 'astrology',
    'ipl', 'cricket', 'football', 'nba', 'score', 'match',
    'bitcoin', 'crypto', 'stock price', 'nasdaq',
    'python script', 'write code', 'leetcode', 'homework',
    'medical', 'diagnose', 'prescription', 'lawyer', 'legal advice',
    'girlfriend', 'dating', 'nsfw', 'sexy',
    'ignore previous', 'ignore all', 'system prompt', 'jailbreak',
    'who won', 'capital of', 'translate this', 'act as',
    'chatgpt', 'what is 2+', 'tell me a story'
  ];

  function norm(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/[’']/g, "'")
      .replace(/[^a-z0-9+.# ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function scoreTopic(q, topic) {
    var n = 0;
    var longest = 0;
    for (var i = 0; i < topic.keys.length; i++) {
      var k = topic.keys[i];
      if (q.indexOf(k) !== -1) {
        n += k.length >= 8 ? 3 : k.length >= 4 ? 2 : 1;
        if (k.length > longest) longest = k.length;
      }
    }
    return { n: n, longest: longest };
  }

  function isOffTopic(q) {
    for (var i = 0; i < OFF_TOPIC.length; i++) {
      if (q.indexOf(OFF_TOPIC[i]) !== -1) return true;
    }
    return false;
  }

  function answer(raw) {
    var q = norm(raw);
    if (!q) {
      return {
        speak: "I'm listening. Ask about Shivanshu's work.",
        show: "Background, Forge, finance, process, or how to hire him.",
        action: null,
        refuse: false
      };
    }

    if (isOffTopic(q)) return Object.assign({}, REFUSE);

    var best = null;
    var bestScore = 0;
    var bestLong = 0;
    for (var i = 0; i < TOPICS.length; i++) {
      var s = scoreTopic(q, TOPICS[i]);
      if (s.n > bestScore || (s.n === bestScore && s.longest > bestLong)) {
        bestScore = s.n;
        bestLong = s.longest;
        best = TOPICS[i];
      }
    }

    if (!best || bestScore < 2) {
      if (/\b(hi|hello|hey|yo|sup)\b/.test(q)) {
        return {
          speak: "Hi. I can talk about Shivanshu's work, case studies, or how to reach him.",
          show: "Try: Who is he? · Forge · Book a call",
          action: null,
          refuse: false
        };
      }
      if (/\b(thanks|thank you|thx|cool|nice|great)\b/.test(q)) {
        return {
          speak: "Anytime. Want the Forge study, or a link to book time?",
          show: "Forge · Finance · Book a call",
          action: null,
          refuse: false
        };
      }
      return Object.assign({}, UNKNOWN);
    }

    return {
      speak: best.speak,
      show: best.show,
      action: best.action,
      refuse: false,
      cards: best.cards || []
    };
  }

  root.AskKnowledge = {
    contact: CONTACT,
    answer: answer,
    refuse: REFUSE
  };
})(window);

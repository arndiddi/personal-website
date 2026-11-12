/**
 * ─────────────────────────────────────────────────────────────
 *  RESUME DATA — powers the /resume page (and bits of /about).
 *  Add, remove, or reorder entries freely; the page updates itself.
 *  Each entry's `bullets` is a list of plain-text strings.
 * ─────────────────────────────────────────────────────────────
 */

export type Entry = {
  org: string;
  role: string;
  location: string;
  dates: string;
  /** Optional one-line context shown under the role in muted text. */
  note?: string;
  bullets: string[];
};

export const education = [
  {
    school: 'Northeastern University',
    degree: 'Master of Science in Product Management',
    detail: 'Concentration in Technical Product Management',
    location: 'Boston, Massachusetts',
    dates: 'Sept 2026 – May 2028 (expected)',
    highlights: ['Coursework: Advanced Product Management'],
  },
  {
    school: 'Rutgers University',
    degree: 'B.S. Business Analytics & Information Technology (BAIT)',
    detail: 'Second Major in Computer Science · Rutgers Business School',
    location: 'New Brunswick, New Jersey',
    dates: 'Sept 2022 – May 2026',
    highlights: [
      'GPA 3.758 / 4.00 · Magna Cum Laude · Dean’s List (2022–2026)',
      'Coursework: Python, Management Information Systems, Data Structures, Intro to AI, Business Data Management',
    ],
  },
];

export const work: Entry[] = [
  {
    org: 'Johnson & Johnson – Innovative Medicine',
    role: 'Project Management Office Analyst',
    note: 'Contract via Infoville Inc. · Hybrid',
    location: 'Titusville, New Jersey',
    dates: 'Aug 2025 – Dec 2025',
    bullets: [
      'Delivered Power BI dashboards that gave leadership actionable insight into System Integration Testing (SIT) team performance, improving go-live readiness by 20% and enabling data-driven prioritization.',
      'Led adoption of a Generative AI test-script automation tool by gathering user feedback, aligning with stakeholder needs, and coordinating cross-functionally with multiple teams, increasing usage by 25%.',
      'Oversaw AI tool enhancements with the SIT and Dev teams while managing 50+ business user stories using agile methodology and Jira Query Language (JQL), reducing test-script creation time by 40%.',
    ],
  },
  {
    org: 'ZoomKidz',
    role: 'Chief Operating Officer',
    note: 'Student-run non-profit',
    location: 'Belle Mead, New Jersey',
    dates: 'May 2021 – Mar 2022',
    bullets: [
      'Directed operations across 4+ departments, prioritizing initiatives through weekly check-ins with department heads and executive feedback, and ensuring 100% of major events launched on schedule.',
      'Expanded organizational reach by building 20+ external partnerships and co-hosting events, driving stronger student and volunteer engagement, higher attendance, and deeper community impact.',
    ],
  },
  {
    org: 'ZoomKidz',
    role: 'Tech Officer',
    location: 'Belle Mead, New Jersey',
    dates: 'Apr 2020 – May 2021',
    bullets: [
      'Built the organization’s website from scratch and owned every change to it afterward.',
      'Worked directly with the CEO and COO on the site’s layout and information architecture, combining web design and coding.',
    ],
  },
  {
    org: 'Infoville, Inc.',
    role: 'Intern',
    location: 'Belle Mead, New Jersey',
    dates: 'Jun 2020 – Jul 2021',
    bullets: [
      'Collaborated with consultants on day-to-day work, including basic web design.',
      'Handled office operations and outreach to other companies on Infoville’s behalf.',
    ],
  },
];

export const leadership: Entry[] = [
  {
    org: 'Rutgers University Business For Youth',
    role: 'Mentor',
    location: 'New Brunswick, New Jersey',
    dates: 'Dec 2023 – May 2024',
    bullets: [
      'Guided 60+ high school students through counseling and workshops, strengthening career readiness and academic confidence.',
      'Organized interactive business presentations with fellow mentors, improving overall program involvement by 15%.',
    ],
  },
  {
    org: 'Peer Leadership Mentors',
    role: 'Leadership Mentor',
    location: 'New Brunswick, New Jersey',
    dates: 'Feb 2024 – May 2024',
    bullets: [
      'Mentored 5 first-year students on leadership and communication skills to support their transition into college.',
      'Presented workshops on servant leadership and ethics, earning 90% positive feedback on content relevance and impact.',
    ],
  },
  {
    org: 'Delta Sigma Iota Fraternity, Inc.',
    role: 'Service Chair',
    location: 'New Brunswick, New Jersey',
    dates: 'Jan 2024 – May 2024',
    bullets: [
      'Organized and led community service initiatives, coordinating volunteer efforts across 40+ members.',
      'Partnered with local organizations and charities on philanthropic events, raising hundreds of dollars in donations and contributing 200+ volunteer hours through food drives and environmental clean-ups.',
    ],
  },
  {
    org: 'Rutgers University Dance Marathon (RUDM)',
    role: 'Event Logistics Captain',
    location: 'New Brunswick, New Jersey',
    dates: 'Oct 2023 – May 2024',
    bullets: [
      'Worked with the Central Planning Team to plan and run New Jersey’s largest student-run philanthropic event, owning event logistics and fundraising initiatives.',
      'Supported the Embrace Kids Foundation and the children and families it serves.',
    ],
  },
  {
    org: 'SANGAM',
    role: 'Class Representative (Junior & Senior Rep)',
    location: 'New Brunswick, New Jersey',
    dates: 'Oct 2024 – May 2026',
    bullets: [
      'Served on the executive board as the liaison between the Class of 2026 and Rutgers’ South Indian cultural organization, advocating for member interests.',
      'Planned and ran events tailored to the Class of 2026 and kept general members informed of initiatives and opportunities.',
    ],
  },
  {
    org: 'First Year Leadership Fellowship',
    role: 'Student Fellow',
    location: 'New Brunswick, New Jersey',
    dates: 'Feb 2023 – May 2023',
    bullets: [
      'Completed team projects with an emphasis on clear communication, collaboration, and ethical decision-making.',
      'Explored and shared leadership styles with peers, and sharpened priority management by aligning daily work with bigger-picture goals.',
    ],
  },
];

/** Shown as three columns of skill groups. */
export const skillGroups = [
  {
    title: 'Product & Delivery',
    items: ['Product Management', 'Agile / Scrum', 'Jira & JQL', 'User Stories', 'Stakeholder Alignment', 'Lean Six Sigma'],
  },
  {
    title: 'Data & Analytics',
    items: ['SQL', 'Power BI', 'Tableau', 'Python', 'R', 'Microsoft 365 / Excel'],
  },
  {
    title: 'Technical & AI',
    items: ['Python', 'Java', 'HTML / CSS', 'OOP', 'Hugging Face', 'OpenAI API', 'Streamlit', 'Claude Code'],
  },
];

export const certifications = [
  { name: 'Financial Basics Everyone Should Know', issuer: 'LinkedIn Learning', date: 'May 2026' },
  { name: 'SQL Essential Training', issuer: 'LinkedIn Learning', date: 'Jul 2025' },
  { name: 'Learning SQL Programming', issuer: 'LinkedIn Learning', date: 'Jan 2025' },
  { name: 'Excel 2016: Advanced Formatting Techniques', issuer: 'LinkedIn Learning', date: 'Nov 2023' },
  { name: 'Lean Six Sigma Yellow Belt', issuer: '', date: '' },
  { name: 'Tableau', issuer: '', date: '' },
];

export const languages = ['Telugu (conversational)', 'Spanish (intermediate)'];

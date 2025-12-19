
import { MarketingModule, Book, Template } from './types';

export const INITIAL_MODULES: MarketingModule[] = [
  // Phase 1: Foundations
  {
    id: 'strategy',
    title: 'Strategy Citadel',
    description: 'The foundation of all marketing. Master the 4Ps, SWOT, and strategic positioning.',
    tooltip: 'Detailed insights: SWOT stands for Strengths, Weaknesses, Opportunities, Threats. STP stands for Segmentation, Targeting, and Positioning Model.',
    icon: 'fa-solid fa-chess-rook',
    color: 'bg-slate-600',
    topics: ['The 4 Ps of Marketing', 'SWOT Analysis', 'STP Model', 'Marketing Mix Modeling', 'Blue Ocean Strategy'],
    phase: 1
  },
  {
    id: 'pharma_foundations',
    title: 'Pharma Foundations',
    description: 'Understand the unique landscape of Pharmaceutical Marketing, from molecule to market.',
    tooltip: 'Covers the shift to Patient-Centricity, Business Models (Innovator, Generic, OTC), and the Pharma Value Chain.',
    icon: 'fa-solid fa-prescription-bottle-medical',
    color: 'bg-emerald-700',
    topics: ['Pharma Value Chain', 'Innovator vs Generic vs OTC', 'Regulatory Landscape', 'Patient-Centricity Shift', 'Pharma Marketing vs Consumer Marketing'],
    aiContext: 'You are teaching a Pharma Marketing course. Focus on the shift from product-focus to experience-driven engagement. Use the fictional country of "Medoria" for regulatory examples.',
    phase: 1
  },
  {
    id: 'branding',
    title: 'Brand Forge',
    description: 'Craft a legendary identity. Define voice, tone, and visual archetypes.',
    icon: 'fa-solid fa-fingerprint',
    color: 'bg-violet-600',
    topics: ['Brand Archetypes', 'Archetypal Branding Application', 'Defining Brand Voice', 'Visual Identity Basics', 'Brand Equity', 'Rebranding Risks'],
    phase: 1
  },
  {
    id: 'psychology',
    title: 'Mind Palace',
    description: 'Unlock the consumer mind. Use behavioral psychology to influence decisions.',
    icon: 'fa-solid fa-brain',
    color: 'bg-pink-600',
    topics: ['Cialdinis 6 Principles', 'Cognitive Biases', 'Color Psychology', 'Emotional Triggers', 'Neuromarketing', 'Social Proof'],
    aiContext: 'For "Social Proof", explain the psychological principle that people copy the actions of others. Provide examples like Testimonials, Case Studies, User Reviews, and "As Seen On" logos. Explain how to leverage it ethically.',
    phase: 1
  },
  
  // Phase 2: Tactics
  {
    id: 'bio_intelligence',
    title: 'Bio-Intelligence',
    description: 'Read the ecosystem. Master Patient Flows, Journeys, and Environmental Analysis.',
    tooltip: 'Deep dive into PESTEL for Pharma, Porter’s 5 Forces, and mapping the Patient Journey/Flow.',
    icon: 'fa-solid fa-dna',
    color: 'bg-teal-500',
    topics: ['PESTEL in Pharma', 'Porters 5 Forces in Healthcare', 'Patient Journey Mapping', 'Patient Flow Analysis', 'Living with Disease: Patient Stories'],
    aiContext: 'Use the fictional case of "Fatima living with Crohns Disease in Medoria" to explain Patient Journey vs Patient Flow. Explain political and economic factors (PESTEL) specific to healthcare access.',
    phase: 2
  },
  {
    id: 'content',
    title: 'Content Kingdom',
    description: 'Content is King. Learn to craft compelling narratives that convert.',
    icon: 'fa-solid fa-pen-nib',
    color: 'bg-indigo-500',
    topics: ['Storytelling', 'Blog Structure', 'Video Marketing', 'Content Calendars', 'Copywriting Formulas'],
    phase: 2
  },
  {
    id: 'content_mastery',
    title: 'Content Marketing Mastery',
    description: 'Learn to create compelling content that drives engagement and conversions.',
    icon: 'fa-solid fa-pen-fancy',
    color: 'bg-pink-500',
    topics: ['Content Strategy', 'Blog Writing', 'Video Scripting', 'SEO Content Optimization'],
    phase: 2
  },
  {
    id: 'content_strategy',
    title: 'Content Strategy Development',
    description: 'Learn to create effective content strategies that align with marketing goals and target audiences.',
    icon: 'fa-solid fa-clipboard-list',
    color: 'bg-fuchsia-600',
    topics: ['Content Pillars', 'Audience Content Needs', 'Content Calendar Planning', 'Measuring Content ROI'],
    phase: 2
  },
  {
    id: 'social',
    title: 'Social Media Arena',
    description: 'Navigate the chaotic waters of social platforms and build a community.',
    icon: 'fa-brands fa-twitter',
    color: 'bg-sky-500',
    topics: ['Platform Demographics', 'Viral Mechanics', 'Community Management', 'Influencer Marketing', 'Social Listening'],
    phase: 2
  },
  {
    id: 'seo',
    title: 'SEO Sorcery',
    description: 'Master the art of visibility. Learn keywords, backlinks, and optimization.',
    icon: 'fa-solid fa-magnifying-glass',
    color: 'bg-emerald-500',
    topics: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Technical SEO', 'Advanced Technical SEO', 'Local SEO', 'SEO Checklist'],
    aiContext: 'For Advanced Technical SEO, focus heavily on Schema Markup, Core Web Vitals, and Site Speed Optimization techniques. For "SEO Checklist", provide a comprehensive, actionable markdown checklist covering essential On-Page (meta, headings, content) and Technical SEO (speed, sitemaps, robots.txt) items.',
    phase: 2
  },
  {
    id: 'email',
    title: 'Email Alchemy',
    description: 'Turn subscriber lists into gold with segmentation and automation.',
    icon: 'fa-solid fa-envelope',
    color: 'bg-amber-500',
    topics: ['Subject Line Psychology', 'Drip Campaigns', 'List Segmentation', 'GDPR & Compliance', 'Newsletter Strategy'],
    phase: 2
  },

  // Phase 3: Growth
  {
    id: 'market_access',
    title: 'Market Access & Pricing',
    description: 'Master the complex world of Pharma Pricing, Reimbursement, and Access.',
    tooltip: 'Covers Value-Based Pricing, Reference Pricing, Tiered Pricing, and Lifecycle Management strategies.',
    icon: 'fa-solid fa-scale-balanced',
    color: 'bg-cyan-700',
    topics: ['Value Based Pricing', 'Reference Pricing Models', 'Differential & Tiered Pricing', 'Product Lifecycle Management', 'Loss of Exclusivity Strategies'],
    aiContext: 'Explain pricing for Innovative vs Generic drugs. Use the "BNX Biologic" product case study to illustrate pricing strategy assessments.',
    phase: 3
  },
  {
    id: 'integrated_marketing',
    title: 'Integrated Marketing Nexus',
    description: 'Unify offline and online channels. TV, Radio, OOH, and Experiential.',
    icon: 'fa-solid fa-broadcast-tower',
    color: 'bg-orange-600',
    topics: ['Integrated Campaign Planning', 'Offline to Online Attribution', 'Event & Experiential Marketing', 'Out of Home (OOH) Strategy', 'TV & Radio Fundamentals'],
    phase: 3
  },
  {
    id: 'ppc',
    title: 'PPC Treasury',
    description: 'Invest wisely to acquire users. Master Google Ads and Social Paid Media.',
    icon: 'fa-solid fa-coins',
    color: 'bg-green-600',
    topics: ['Google Ads', 'Facebook/Meta Ads', 'ROAS vs ROI', 'Retargeting', 'Programmatic Advertising'],
    phase: 3
  },
  {
    id: 'analytics',
    title: 'Analytics Archmage',
    description: 'Decode the data. Understand user behavior and attribution.',
    icon: 'fa-solid fa-chart-line',
    color: 'bg-rose-500',
    topics: ['Key KPIs', 'GA4 Basics', 'Attribution Models', 'Data Visualization', 'LTV Calculation'],
    phase: 3
  },
  {
    id: 'cro',
    title: 'Growth Lab',
    description: 'Experiment and optimize. Turn traffic into revenue through science.',
    icon: 'fa-solid fa-flask',
    color: 'bg-cyan-500',
    topics: ['A/B Testing', 'CRO Basics', 'Landing Page Optimization', 'The AARRR Funnel', 'Funnel Visualization', 'Viral Loops'],
    aiContext: 'When discussing the AARRR Funnel, explain how to visualize it (Acquisition at top, Revenue at bottom) and detailed strategies to optimize each stage: Acquisition (SEO/Ads), Activation (Onboarding), Retention (Email/Product), Referral (Invites), Revenue (Upsells).',
    phase: 3
  },

  // Phase 4: Leadership
  {
    id: 'pharma_strategy',
    title: 'Pharma Brand Strategy',
    description: 'From Insight to Impact. Craft winning strategies for HCPs and Patients.',
    tooltip: 'Covers HCP Segmentation, Behavioral Science in Messaging, Omnichannel Strategy, and AI in Pharma.',
    icon: 'fa-solid fa-user-doctor',
    color: 'bg-indigo-800',
    topics: ['HCP Segmentation & Targeting', 'Behavioral Science Messaging', 'Omnichannel Pharma Strategy', 'AI in Pharma Marketing', 'Storytelling in Pharma'],
    aiContext: 'Reference "Pfizers Science Will Win" campaign for storytelling. Discuss the "Next Best Action" AI models used by Sanofi/Novartis. Focus on compliance and ethics in messaging.',
    phase: 4
  },
  {
    id: 'marketing_ops',
    title: 'Marketing Operations',
    description: 'Learn to scale marketing efforts through MarTech, automation, and agile workflows.',
    icon: 'fa-solid fa-gears',
    color: 'bg-slate-700',
    topics: ['MarTech Stack Management', 'Marketing Automation Platforms', 'Agile Marketing Principles', 'Performance Tracking & Reporting', 'Budget Management'],
    phase: 4
  },
  {
    id: 'product',
    title: 'Product Launchpad',
    description: 'Bridge the gap between product and market. Go-to-Market strategies.',
    icon: 'fa-solid fa-rocket',
    color: 'bg-orange-500',
    topics: ['Go-To-Market Strategy', 'Product-Market Fit', 'Buyer Personas', 'Pricing Strategies', 'Feature Adoption'],
    phase: 4
  },
  {
    id: 'b2b',
    title: 'B2B Bastion',
    description: 'Navigate complex sales cycles and account-based marketing.',
    icon: 'fa-solid fa-handshake',
    color: 'bg-blue-800',
    topics: ['Lead Gen vs Demand Gen', 'Account-Based Marketing', 'Sales Enablement', 'LinkedIn Strategy', 'Whitepapers'],
    phase: 4
  },
  {
    id: 'pr',
    title: 'Reputation Realm',
    description: 'Manage public perception and handle crises with grace.',
    icon: 'fa-solid fa-bullhorn',
    color: 'bg-teal-600',
    topics: ['Press Releases', 'Crisis Communication Strategies', 'Crisis Management', 'Media Relations', 'Building Media Relationships', 'Crafting Effective Press Releases'],
    aiContext: 'For Crisis Communication, provide actionable frameworks for handling PR emergencies, maintaining transparency, and rebuilding public trust. For "Building Media Relationships", ensure you include a detailed sub-section on "Creating a Digital Media Kit" covering essential components (bios, high-res assets, fact sheets) and best practices. For Crafting Effective Press Releases, focus on structure, key elements, and distribution channels.',
    phase: 4
  }
];

export const PHASE_NAMES = {
  1: "Foundations",
  2: "Tactical Ops",
  3: "Growth Engine",
  4: "Market Leadership"
};

const getThumb = (title: string) => `https://placehold.co/300x450/1e293b/FFF?text=${encodeURIComponent(title.replace(/\s/g, '+'))}`;

export const LIBRARY_BOOKS: Book[] = [
    { 
        id: 'b1', title: 'Blue Ocean Strategy', author: 'W. Chan Kim & Renée Mauborgne', category: 'Strategy',
        thumbnail: getThumb('Blue Ocean Strategy'),
        keyTakeaways: ['Make competition irrelevant', 'Create new market space', 'Strategy Canvas', 'ERRC Grid'],
        summary: `### The Core Thesis
The cutthroat competition in existing industries turns the ocean bloody red. "Blue Ocean Strategy" argues that lasting success comes not from battling competitors, but from creating "blue oceans"—untapped new market spaces ripe for growth.

### The Strategy Canvas
This is the central diagnostic tool. It captures the current state of play in the known market space. To create a Blue Ocean, you must shift your focus from competitors to alternatives, and from customers to non-customers.

### The Four Actions Framework (ERRC Grid)
To reconstruct buyer value elements in crafting a new value curve, answer these four questions:

| Action | Description | Example (Cirque du Soleil) |
| :--- | :--- | :--- |
| **Eliminate** | Which factors that the industry takes for granted should be eliminated? | Star performers, animal shows, aisle concessions. |
| **Reduce** | Which factors should be reduced well below the industry's standard? | Fun and humor, thrill and danger. |
| **Raise** | Which factors should be raised well above the industry's standard? | Unique venue. |
| **Create** | Which factors should be created that the industry has never offered? | Theme, refined environment, artistic music and dance. |

### Key Principles of Blue Ocean Strategy
1.  **Reconstruct Market Boundaries:** Look across alternative industries, strategic groups, and complementary product offerings.
2.  **Focus on the Big Picture, Not the Numbers:** Use the Strategy Canvas to visualize value, rather than getting lost in spreadsheets.
3.  **Reach Beyond Existing Demand:** Don't focus on customer differences; build on powerful commonalities to aggregate non-customers.
4.  **Get the Strategic Sequence Right:** Buyer Utility -> Price -> Cost -> Adoption.

### Actionable Takeaway
Conduct a "Value Innovation" audit. Don't just improve—innovate. Stop benchmarking the competition and start looking at the "refusers" of your industry to understand why they don't buy.`
    },
    // ... [Truncated to save space, keeping all other books] ...
    {
        id: 'b12', title: 'This Is Marketing', author: 'Seth Godin', category: 'Marketing',
        thumbnail: getThumb('This Is Marketing'),
        keyTakeaways: ['Smallest Viable Market', 'Empathy', 'Tension', 'Status Roles'],
        summary: `### Core Thesis
Marketing is the generous act of helping someone solve a problem. It’s about empathy and culture change, not spam and hype.

### The Smallest Viable Market
Don't try to serve everyone. Pick the smallest group of people you can serve perfectly. If you can thrill 1,000 people, they will tell the next 10,000.

### Tension and Status
*   **Tension:** Marketing creates tension (the gap between where they are and where they want to be).
*   **Status:** People make decisions based on status ("People like us do things like this").

### Actionable Takeaway
Define your "Smallest Viable Market". Who are the 1,000 people who will love this so much they tell their friends? Stop chasing the mass market.`
    }
];

export const MARKETING_TEMPLATES: Template[] = [
    {
        id: 't1',
        title: 'Marketing Plan Template',
        category: 'Strategy',
        format: 'doc',
        description: 'A comprehensive document structure for your annual marketing plan.',
        content: `# Annual Marketing Plan\n\n## 1. Executive Summary\n[Summarize the main goals and strategies]\n\n## 2. Mission, Vision, and Values\n- Mission: [Your Mission]\n- Vision: [Your Vision]\n- Values: [Your Values]\n\n## 3. Target Audience\n- Demographics:\n- Psychographics:\n- Pain Points:\n\n## 4. SWOT Analysis\n- Strengths:\n- Weaknesses:\n- Opportunities:\n- Threats:\n\n## 5. Marketing Objectives (SMART Goals)\n1. \n2. \n3. \n\n## 6. Marketing Strategy\n- Product:\n- Price:\n- Place:\n- Promotion:\n\n## 7. Budget Allocation\n- Channel 1: $\n- Channel 2: $\n- Tools: $\n- Team: $`
    },
    {
        id: 't2',
        title: 'Social Media Content Calendar',
        category: 'Social Media',
        format: 'excel',
        description: 'Plan your social media posts week by week.',
        content: [
            ['Date', 'Platform', 'Topic', 'Content Type', 'Caption', 'Hashtags', 'Status'],
            ['2023-10-01', 'LinkedIn', 'Industry Trends', 'Text', 'Here are the top 3 trends...', '#marketing #trends', 'Scheduled'],
            ['2023-10-02', 'Instagram', 'Behind the Scenes', 'Image', 'Office life today!', '#team #culture', 'Draft'],
            ['2023-10-03', 'Twitter', 'Quick Tip', 'Thread', 'SEO is not dead. Here is why...', '#seo #tips', 'Idea']
        ]
    },
    {
        id: 't3',
        title: 'Email Drip Campaign Sequence',
        category: 'Email Marketing',
        format: 'doc',
        description: 'A 5-email welcome sequence template for new subscribers.',
        content: `# Welcome Sequence\n\n## Email 1: Welcome & Value\nSubject: Welcome to [Brand]! Here is your free gift.\nBody:\nHi [Name],\nThanks for joining. We are thrilled to have you.\nAs promised, here is [Lead Magnet].\n...\n\n## Email 2: Problem/Agitation\nSubject: Are you struggling with [Problem]?\nBody:\nHi [Name],\nMost people try to solve [Problem] by [Common Mistake].\nBut there is a better way.\n...\n\n## Email 3: Solution/Education\nSubject: The secret to [Result]\nBody:\nHi [Name],\nYesterday we talked about [Problem].\nHere is how [Product/Method] solves it.\n...\n\n## Email 4: Social Proof\nSubject: What others are saying\nBody:\nHi [Name],\nDon't take our word for it.\n"[Testimonial]" - Happy Customer\n...\n\n## Email 5: The Offer (Hard Sell)\nSubject: Ready to [Benefit]?\nBody:\nHi [Name],\nIf you are ready to take the next step, join us today.\n[Link]`
    },
    {
        id: 't4',
        title: 'SEO Audit Checklist',
        category: 'SEO',
        format: 'pdf',
        description: 'A checklist to ensure your website is optimized for search engines.',
        content: `SEO AUDIT CHECKLIST\n\n1. TECHNICAL SEO\n[ ] XML Sitemap submitted to Google Search Console\n[ ] Robots.txt file configured correctly\n[ ] Site speed optimized (Core Web Vitals)\n[ ] Mobile-friendly check passed\n[ ] SSL Certificate installed (HTTPS)\n[ ] No 404 errors or broken links\n\n2. ON-PAGE SEO\n[ ] Title tags < 60 characters\n[ ] Meta descriptions < 160 characters\n[ ] H1 tag unique on every page\n[ ] URL structure is clean and descriptive\n[ ] Images have Alt Text\n[ ] Internal linking strategy in place\n\n3. OFF-PAGE SEO\n[ ] Backlink profile analysis\n[ ] Google My Business profile optimized\n[ ] Social media signals`
    },
    {
        id: 't5',
        title: 'PPC Campaign ROI Calculator',
        category: 'Paid Ads',
        format: 'excel',
        description: 'Calculate your Return on Ad Spend (ROAS) and CPA.',
        content: [
            ['Metric', 'Value', 'Formula'],
            ['Total Ad Spend', '1000', 'Input'],
            ['Total Clicks', '500', 'Input'],
            ['CPC (Cost Per Click)', '2.00', '=Spend/Clicks'],
            ['Conversion Rate', '0.05', 'Input (5%)'],
            ['Total Conversions', '25', '=Clicks*ConvRate'],
            ['CPA (Cost Per Acquisition)', '40.00', '=Spend/Conversions'],
            ['Average Order Value', '100', 'Input'],
            ['Total Revenue', '2500', '=Conversions*AOV'],
            ['ROAS', '2.5', '=Revenue/Spend']
        ]
    },
    // New Templates
    {
        id: 't6',
        title: 'Buyer Persona Template',
        category: 'Strategy',
        format: 'pdf',
        description: 'Define your ideal customer profile with demographics and psychographics.',
        content: `BUYER PERSONA PROFILE\n\nNAME: ____________________\n\n1. DEMOGRAPHICS\n- Age: ____  Gender: ____\n- Location: ________________\n- Job Title: _______________\n- Income Level: ____________\n\n2. PSYCHOGRAPHICS\n- Interests: ____________________________\n- Values: _______________________________\n- Lifestyle: ____________________________\n\n3. PAIN POINTS & CHALLENGES\n- What keeps them up at night?\n  ________________________________________\n- What are the barriers to purchase?\n  ________________________________________\n\n4. GOALS & MOTIVATIONS\n- What do they want to achieve?\n  ________________________________________\n\n5. INFORMATION SOURCES\n- Where do they hang out online?\n  ________________________________________`
    },
    {
        id: 't7',
        title: 'Competitor Analysis Template',
        category: 'Strategy',
        format: 'excel',
        description: 'Compare your brand against top competitors across key metrics.',
        content: [
            ['Feature', 'My Brand', 'Competitor A', 'Competitor B', 'Competitor C'],
            ['Price Point', '$$', '$$$', '$', '$$'],
            ['Value Prop', 'Quality', 'Prestige', 'Speed', 'Reliability'],
            ['Strengths', '-', 'Brand Name', 'Price', 'Distribution'],
            ['Weaknesses', '-', 'Customer Service', 'Quality', 'Innovation'],
            ['Social Following', '10k', '100k', '50k', '200k'],
            ['SEO Authority', 'Low', 'High', 'Medium', 'High']
        ]
    },
    {
        id: 't8',
        title: 'Content Brief Template',
        category: 'Content',
        format: 'doc',
        description: 'A standard brief for writers and creators to ensure quality output.',
        content: `# Content Brief\n\n**Topic:** [Enter Topic]\n**Target Keyword:** [Primary Keyword]\n**Target Audience:** [Who is this for?]\n**Goal:** [Traffic? Leads? Sales?]\n\n## Structure\n1. **Introduction:** Hook the reader, state the problem.\n2. **Body Paragraph 1:** [Sub-heading]\n   - Key points...\n3. **Body Paragraph 2:** [Sub-heading]\n   - Key points...\n4. **Conclusion:** Summarize and CTA.\n\n## Requirements\n- Word Count: 1000-1500 words\n- Tone: Professional but accessible\n- Internal Links: Link to [Page A], [Page B]\n- Call to Action: Download our ebook.`
    },
    {
        id: 't9',
        title: 'Email Campaign Performance Report',
        category: 'Analytics',
        format: 'excel',
        description: 'Track open rates, click rates, and conversions for your emails.',
        content: [
            ['Campaign Name', 'Send Date', 'Sent', 'Delivered', 'Open Rate', 'Click Rate', 'Conversions', 'Revenue'],
            ['Welcome Series', '2023-10-01', '1000', '990', '45%', '12%', '50', '$2500'],
            ['Black Friday', '2023-11-24', '5000', '4950', '25%', '5%', '100', '$8000'],
            ['Newsletter #4', '2023-12-01', '2000', '1980', '30%', '3%', '10', '$500']
        ]
    },
    {
        id: 't10',
        title: 'Social Media Ad Copy Template',
        category: 'Paid Ads',
        format: 'doc',
        description: 'Drafting sheet for Facebook/Instagram/LinkedIn ads.',
        content: `# Ad Copy Draft\n\n## Ad Concept 1: The Problem/Agitation\n**Primary Text (125 chars):**\nStruggling to get leads? Stop wasting money on bad ads.\n\n**Headline (40 chars):**\nGet 10x ROI on Ads\n\n**Description (30 chars):**\nFree Guide Inside.\n\n**Visual Idea:**\nChart showing growth.\n\n---\n\n## Ad Concept 2: The Social Proof\n**Primary Text:**\n"This tool changed my business overnight." - Join 5,000+ marketers growing faster.\n\n**Headline:**\nRated #1 Marketing Tool\n\n**Description:**\nJoin free today.`
    }
];

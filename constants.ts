
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
    { 
        id: 'b2', title: 'Building a StoryBrand', author: 'Donald Miller', category: 'Branding',
        thumbnail: getThumb('StoryBrand'),
        keyTakeaways: ['The customer is the hero', 'You are the guide', 'Clarity sells', 'The 7-part framework'],
        summary: `### The Core Thesis
Most marketing fails because it is too complicated. The brain is designed to conserve calories; if your marketing forces people to think too hard, they tune out. "StoryBrand" simplifies your message using the universal elements of storytelling.

### The SB7 Framework
Every great story follows a 7-part structure. Your brand should do the same:

| Step | Element | Brand Application |
| :--- | :--- | :--- |
| 1 | **A Character** | The Customer is the Hero, not your brand. |
| 2 | **Has a Problem** | Identify the Villain (Internal, External, Philosophical problems). |
| 3 | **Meets a Guide** | Your Brand (demonstrate Empathy & Authority). |
| 4 | **Who Gives Them a Plan** | Process Plan (3 steps to buy) or Agreement Plan (Reduce fear). |
| 5 | **And Calls Them to Action** | Direct CTA (Buy Now) or Transitional CTA (PDF Download). |
| 6 | **That Helps Them Avoid Failure** | What are the stakes? What happens if they don't buy? |
| 7 | **And Ends in a Success** | Paint a picture of the "Happily Ever After". |

### The Grunt Test
Can a caveman look at your website for 5 seconds and answer:
1.  What do you offer?
2.  How will it make my life better?
3.  What do I need to do to buy it?

### Actionable Takeaway
Audit your website's "Hero Section". Does it clearly state what you do, or is it clever poetry? Replace cleverness with clarity. "We sell mattresses" is better than "Unlock the gateway to dreams."`
    },
    { 
        id: 'b3', title: 'Influence: The Psychology of Persuasion', author: 'Robert Cialdini', category: 'Psychology',
        thumbnail: getThumb('Influence'),
        keyTakeaways: ['Reciprocity', 'Commitment', 'Social Proof', 'Authority', 'Liking', 'Scarcity'],
        summary: `### The Core Thesis
Persuasion isn't magic; it's a science. Humans rely on fixed-action patterns (shortcuts) to make decisions. By understanding these 6 universal principles, marketers can ethically influence behavior.

### The 6 Weapons of Influence

| Principle | Concept | Marketing Application |
| :--- | :--- | :--- |
| **Reciprocity** | We feel obliged to return favors. | Offer a high-value free lead magnet (eBook, sample) *before* asking for a sale. |
| **Commitment & Consistency** | We want to act consistently with our past commitments. | Get a small "Yes" first (micro-conversion), like signing a petition or a free trial. |
| **Social Proof** | We look to others to determine correct behavior. | Show "Most Popular" badges, user counters ("10k users joined"), and testimonials. |
| **Liking** | We say yes to people we like (similar, attractive, complimentary). | Use "About Us" pages to show humanity. Use mirroring in sales copy. |
| **Authority** | We obey experts. | Display certifications, media logos ("As seen on"), and dress the part. |
| **Scarcity** | We value what is rare. | Use countdown timers, "Only 3 left in stock", or limited-time bonuses. |

### Critical Insight: "Click, Whirr"
Behaviors are mechanical. If you provide a *reason* (even a nonsensical one), compliance increases.
*   *Experiment:* "Can I cut in line?" (60% success) vs "Can I cut in line **because** I'm in a rush?" (94% success).

### Actionable Takeaway
Review your landing page. Are you using all 6 levers? Specifically, add a "Social Proof" section and a "Scarcity" element to your checkout page today.`
    },
    {
        id: 'b4', title: 'Contagious', author: 'Jonah Berger', category: 'Viral Marketing',
        thumbnail: getThumb('Contagious'),
        keyTakeaways: ['Social Currency', 'Triggers', 'Emotion', 'Public', 'Practical Value', 'Stories'],
        summary: `### The Core Thesis
Virality isn't luck. Ideas spread because they are designed to be shared. Berger analyzes the science behind word-of-mouth and identifies 6 key drivers (STEPPS).

### The STEPPS Framework

| Element | Description | Example |
| :--- | :--- | :--- |
| **Social Currency** | We share things that make us look good (smart, cool, insider). | Please Don't Tell (Secret Bar), Game Mechanics/Badges. |
| **Triggers** | Top-of-mind means tip-of-tongue. Link product to environment. | "KitKat and Coffee" (Coffee is the trigger). |
| **Emotion** | When we care, we share. High arousal emotions drive sharing. | Awe (Science articles), Anger (Politics), Anxiety. *Sadness does not share.* |
| **Public** | Built to show, built to grow. Making behavior visible. | Apple logo glowing on MacBooks, "I Voted" stickers. |
| **Practical Value** | News you can use. Helping others. | "Top 10 Ways to Save Money", Discounts, Life Hacks. |
| **Stories** | Information travels under the guise of idle chatter. Trojan Horse. | The Jared Fogle Subway Diet story (Product is part of the narrative). |

### The Power of Triggers
Triggers are the stimulus in the environment that reminds people of your product.
*   *Bad Trigger:* "Drink this on New Year's Eve" (Happens once a year).
*   *Good Trigger:* "Drink this on Friday mornings" (Happens weekly).

### Actionable Takeaway
Identify a frequent environmental cue in your customer's life (e.g., "Starting a meeting"). Create a campaign that links your product to that specific moment.`
    },
    {
        id: 'b5', title: 'Crossing the Chasm', author: 'Geoffrey Moore', category: 'Tech Strategy',
        thumbnail: getThumb('Crossing the Chasm'),
        keyTakeaways: ['The Early Adopter Gap', 'The Beachhead Strategy', 'Whole Product Solution'],
        summary: `### The Core Thesis
The Technology Adoption Life Cycle has a massive crack in it. There is a "Chasm" between the **Early Adopters** (Visionaries) and the **Early Majority** (Pragmatists). Most tech startups die in this chasm because they try to market to both groups the same way.

### The Adoption Curve Segments
1.  **Innovators:** Tech enthusiasts. They want the newest thing, even if it's broken.
2.  **Early Adopters (Visionaries):** They want a breakthrough. They are willing to take risks for a competitive advantage.
3.  **THE CHASM** -> *Here lies the graveyard of startups.*
4.  **Early Majority (Pragmatists):** They want a proven solution. They buy from market leaders. They reference each other.
5.  **Late Majority:** Conservatives. They buy only when forced to.

### How to Cross the Chasm: The D-Day Strategy
You cannot cross the chasm by trying to be everything to everyone. You must secure a "Beachhead".
1.  **Target a Niche:** Pick a tiny, specific market segment (e.g., "Field Geologists", not "Enterprise Business").
2.  **The Whole Product:** Pragmatists hate bugs. You must provide the "Whole Product" (Software + Support + Integration + Training).
3.  **Dominate:** Own 50%+ of that niche.
4.  **Expand:** Move to adjacent niches (The Bowling Pin Strategy).

### Actionable Takeaway
Define your "Beachhead" segment. It must be small enough that you can dominate it, but large enough to generate cash flow. Stop selling "Global Enterprise Solutions" and start selling "Inventory Tracking for Mid-Sized Dental Offices".`
    },
    {
        id: 'b6', title: 'Good to Great', author: 'Jim Collins', category: 'Leadership',
        thumbnail: getThumb('Good to Great'),
        keyTakeaways: ['Level 5 Leadership', 'First Who Then What', 'The Hedgehog Concept', 'The Flywheel'],
        summary: `### The Hedgehog Concept
Great companies focus on the intersection of three circles:
1.  **Passion:** What are you deeply passionate about?
2.  **Best in the World:** What can you be the absolute best at?
3.  **Economic Engine:** What drives your economic engine (profit per x)?

### The Flywheel Effect
Success is not a single push; it's a giant, heavy flywheel. You push it, and it moves an inch. You keep pushing, and it gains momentum. Eventually, its own weight does the work. Marketing is about adding grease to the flywheel, not reinventing the wheel every quarter.`
    },
    {
        id: 'b7', title: 'Hooked', author: 'Nir Eyal', category: 'Product',
        thumbnail: getThumb('Hooked'),
        keyTakeaways: ['Trigger', 'Action', 'Variable Reward', 'Investment'],
        summary: `### The Hook Model
How do products like Facebook or TikTok become habits? They follow a 4-step loop:

1.  **Trigger:**
    *   *External:* Notifications, emails.
    *   *Internal:* Boredom, loneliness, fear of missing out.
2.  **Action:** The user performs a simple behavior in anticipation of a reward (e.g., scroll feed).
3.  **Variable Reward:** The user gets something, but they don't know what. Is it a funny video? A like? The unpredictability creates a dopamine spike (like a slot machine).
4.  **Investment:** The user puts work into the system (uploads photo, follows friend), which increases the likelihood of the next pass through the loop.`
    },
    {
        id: 'b8', title: 'Zero to One', author: 'Peter Thiel', category: 'Strategy',
        thumbnail: getThumb('Zero to One'),
        keyTakeaways: ['Competition is for losers', 'Monopoly is the goal', 'The Last Mover Advantage'],
        summary: `### Vertical vs Horizontal Progress
*   **Horizontal (1 to n):** Copying things that work. Globalization.
*   **Vertical (0 to 1):** Doing something new. Technology.

### Monopoly is the Goal
Capitalism and competition are opposites. In a perfect competition, all profits are competed away. Monopolies (like Google) can afford to innovate because they have profits.
**The Strategy:** Start small and monopolize. Amazon started with just books. PayPal started with just eBay power sellers. Dominate a niche, then scale.`
    },
    {
        id: 'b9', title: 'The Lean Startup', author: 'Eric Ries', category: 'Growth',
        thumbnail: getThumb('Lean Startup'),
        keyTakeaways: ['MVP', 'Build-Measure-Learn', 'Pivot or Persevere', 'Validated Learning'],
        summary: `### Build-Measure-Learn Loop
The fundamental activity of a startup is to turn ideas into products, measure how customers respond, and then learn whether to pivot or persevere.

1.  **Build:** Create a Minimum Viable Product (MVP). The smallest thing that allows the loop to turn.
2.  **Measure:** Use actionable metrics (not vanity metrics) to determine if you are creating value.
3.  **Learn:** validated learning. Did the experiment prove the hypothesis?

**Vanity Metrics vs Actionable Metrics:**
*   *Vanity:* Total registered users, total hits.
*   *Actionable:* Active daily users, cohort retention, conversion rate per split test.`
    },
    {
        id: 'b10', title: 'Start with Why', author: 'Simon Sinek', category: 'Leadership',
        thumbnail: getThumb('Start with Why'),
        keyTakeaways: ['The Golden Circle', 'People buy why you do it', 'Inspiration vs Manipulation'],
        summary: `### The Golden Circle
Most companies communicate from the outside in: "We make computers (What). They are powerful (How). Want to buy one?"
Inspiring leaders communicate from the inside out:
1.  **Why:** The belief. "We believe in challenging the status quo."
2.  **How:** The process. "We make our products beautifully designed and user-friendly."
3.  **What:** The result. "We just happen to make computers."

**Key Insight:** People don't buy *what* you do; they buy *why* you do it. The goal is to do business with people who believe what you believe.`
    },
    {
        id: 'b11', title: 'Purple Cow', author: 'Seth Godin', category: 'Branding',
        thumbnail: getThumb('Purple Cow'),
        keyTakeaways: ['Safe is risky', 'Be remarkable', 'Target the sneezers'],
        summary: `### Core Thesis
In a crowded marketplace, fitting in is failing. The only way to win is to be "remarkable"—worth making a remark about. Marketing is no longer about the stuff that you make, but about the stories you tell.

### The Death of the TV Industrial Complex
You can no longer buy mass attention with average products. The "safe" choice is now the risky choice because nobody notices safe.

| Old Rule | New Rule |
| :--- | :--- |
| Create safe products | Create remarkable products |
| Combine with great marketing | The marketing is built-in |
| Target the masses | Target the "Otaku" (Early Adopters) |

### Actionable Takeaway
Take your product and make it extreme. If it's not worth talking about, it's not worth marketing. Focus on the "Otaku" (obsessed fans) who will sneeze your idea to the rest of the curve.`
    },
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
    }
];

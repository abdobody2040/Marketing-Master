# MarketMaster RPG - The Gamified Marketing Academy

Welcome to **MarketMaster RPG**, the ultimate gamified learning platform for aspiring Chief Marketing Officers (CMOs). This application combines role-playing game (RPG) elements with advanced AI to create an immersive educational experience covering everything from foundational strategy to advanced pharmaceutical marketing.

---

## 🚀 Quick Start & Installation

This project is built with **React**, **TypeScript**, and **Tailwind CSS**. It uses the **Google Gemini API** for dynamic content generation.

### Prerequisites
*   Node.js (v14 or higher)
*   npm or yarn
*   A Google Gemini API Key

### Installation Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/marketmaster-rpg.git
    cd marketmaster-rpg
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Gemini API Key.
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *Note: The application expects `process.env.API_KEY` to be available.*

4.  **Run the Application**
    ```bash
    npm start
    # or
    yarn start
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

---

## 🌟 Core Features

### 1. The Quest Map
A visual progression system divided into 4 Phases:
*   **Phase 1: Foundations** (Strategy, Branding, Psychology, Pharma Basics)
*   **Phase 2: Tactics** (SEO, Content, Social Media, Email)
*   **Phase 3: Growth** (PPC, Analytics, CRO, Integrated Marketing)
*   **Phase 4: Leadership** (Product, B2B, PR, Ops, Pharma Strategy)

Users must master modules to unlock subsequent phases.

### 2. AI-Powered Lessons & Quizzes
*   **Dynamic Content:** Lessons are generated on-the-fly by AI based on the selected topic and difficulty level.
*   **Interactive Quizzes:** After every lesson, users take a 3-question quiz. Passing with >60% marks the topic as complete.
*   **XP System:** Users earn Experience Points (XP) to level up and earn badges.

### 3. The Marketing Simulator (CMO Mode)
A realistic roleplay environment where users act as a CMO.
*   **Business Case Generation:** The AI generates unique companies with specific problems (e.g., "Declining sales in a saturated beverage market").
*   **Strategic Planning:** Users draft an Executive Summary, define Target Audiences (Demographics/Psychographics), select Channels, and allocate a Budget.
*   **AI Grading:** The "Board of Directors" (AI) evaluates the plan, providing a letter grade (S, A, B, C, D, F), a score out of 100, and tactical feedback.

### 4. Knowledge Library
A central hub for resources:
*   **Book Summaries:** 100+ detailed summaries of top marketing books (Blue Ocean Strategy, Contagious, etc.).
*   **Templates:** Downloadable tools (PDF, Excel, Doc) for Marketing Plans, Content Calendars, SEO Audits, and more.
*   **Flashcards:** An active recall game that generates flashcards based on the specific topics the user has learned.

### 5. Pharma Specialization Track
A dedicated curriculum for Pharmaceutical Marketing, covering:
*   Regulatory Landscapes (Medoria context)
*   Patient Journeys & Flow
*   Market Access & Pricing Models
*   HCP Segmentation

### 6. Administration Panel
A hidden dashboard for managing the app:
*   **User Management:** Create, delete, and view users.
*   **Content Management:** Add/Edit/Delete Modules, Books, and Templates.
*   **Configuration:** Set the app subscription price.

---

## 📂 Project Structure

```
/
├── public/                 # Static assets
├── src/
│   ├── components/         # React Components
│   │   ├── AdminPanel.tsx      # Admin Dashboard
│   │   ├── AuthScreen.tsx      # Landing Page & Login
│   │   ├── Library.tsx         # Books, Templates, Flashcards
│   │   ├── ModuleCard.tsx      # Dashboard Card UI
│   │   ├── QuestMap.tsx        # Progression Map
│   │   ├── Quiz.tsx            # Quiz Interface
│   │   ├── Scenario.tsx        # Text-based RPG Scenarios
│   │   ├── Sidebar.tsx         # Navigation
│   │   ├── Simulator.tsx       # CMO Simulator Logic
│   │   └── ...                 # Charts & UI helpers
│   ├── services/
│   │   ├── certificateService.ts # PDF Generation
│   │   ├── geminiService.ts      # AI Integration (Lessons, Grading)
│   │   └── storageService.ts     # LocalStorage Mock Backend
│   ├── App.tsx             # Main Router & State
│   ├── constants.ts        # Static Data (Modules, Book Lists)
│   ├── index.tsx           # Entry Point
│   └── types.ts            # TypeScript Interfaces
├── index.html              # HTML Root & Tailwind Config
└── metadata.json           # App Metadata
```

---

## 🛠️ Technical Details

### AI Integration
The app uses the `@google/genai` SDK.
*   **Prompt Engineering:** The app uses sophisticated prompts injected with "Context" (e.g., "Act as a strict CMO") to ensure high-quality output.
*   **JSON Mode:** The AI is instructed to return structured JSON for Quizzes and Evaluations to ensure the app can parse and render the data reliably.

### Persistence
The app currently uses `localStorage` to simulate a database (`storageService.ts`). This allows for a persistent experience (User accounts, progress, settings) without a dedicated backend server for the demo.

### Theming
Tailwind CSS is used for styling, with full support for **Dark Mode**. The theme preference is stored in the user profile.

---

## 🏆 Certification
Upon mastering all modules, users can generate a **Professional Certificate of Mastery**. This is rendered as a high-resolution PDF using `jspdf`, complete with the user's name, date, and a gold seal.

---

## 📝 License
This project is for educational purposes. 
Copyright © 2023 MarketMaster RPG.

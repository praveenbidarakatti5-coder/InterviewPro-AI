# InterviewPro AI – AI-Powered Interview Preparation and Assessment Platform

> **Tagline:** Practice Smarter. Prepare Better. Get Hired.  
> **Built For:** Engineering students, fresh graduates, and tech job seekers.

---

## 🚀 Overview

**InterviewPro AI** is a production-grade, AI-orchestrated web application designed to help engineering students and job candidates prepare for technical interviews, coding assessments, aptitude rounds, and HR interviews.

Unlike traditional platforms that provide static questions and rote answers, InterviewPro AI:
1. **Calibrates Questions to Job Roles** (Python Developer, Java Developer, Full Stack, Frontend, Backend, Data Analyst, AI/ML Engineer).
2. **Evaluates Answers with a 5-Point Engineering Rubric** (Technical Accuracy, Conceptual Depth, Completeness, Clarity, and Relevant Examples) rather than simple keyword matching.
3. **Simulates Real-Time Conversational Mock Interviews** with adaptive follow-up questions and end-of-session hiring diagnostic reports.
4. **Executes Multi-Language Code Safely** (Python, C, and Java) against hidden unit test cases in a sandboxed execution runner.
5. **Analyzes PDF Resumes with PyMuPDF** to discover skill gaps against industry benchmarks and generate resume-tailored interview prompts.
6. **Computes a Transparent Interview Readiness Score** based on verifiable multi-factor formulas rather than black-box numbers.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons | High-performance Single Page Application (SPA) with responsive SaaS UI |
| **Data Viz** | Recharts | Performance trend lines, topic mastery bar charts, and circular readiness meters |
| **Backend** | Python 3.14 / 3.11, FastAPI, Uvicorn | Asynchronous REST API gateway with automatic OpenAPI `/docs` |
| **Validation** | Pydantic v2 | Strict request/response Data Transfer Object (DTO) schema enforcement |
| **Database** | PostgreSQL & SQLite via SQLAlchemy 2.0 | Production-ready ACID relational models with automatic schema migrations |
| **Security** | JWT (JSON Web Tokens), PBKDF2-HMAC-SHA256 | Stateless cryptographic authorization and secure password hashing |
| **AI Integration** | Google Gemini API / LLM Service | Structured prompt engineering for dynamic question generation and answer evaluation |
| **Resume Engine** | PyMuPDF (`fitz`) / PyPDF | Text extraction, skill catalog parsing, and gap identification from PDF files |
| **Code Sandbox** | Subprocess Sandbox Runner | Isolated execution runner with strict timeouts for Python, C (GCC), and Java |

---

## 🏛️ System Architecture

```text
[ React 19 Single Page App ] ──(JWT Bearer Token / JSON REST)──┐
                                                              │
                                                              ▼
                                            [ FastAPI Gateway (Uvicorn) ]
                                                              │
               ┌──────────────────────┬───────────────────────┼──────────────────────┐
               ▼                      ▼                       ▼                      ▼
       [ SQLAlchemy ORM ]       [ AI Engine ]        [ Code Sandbox ]       [ Resume Engine ]
               │                      │                       │                      │
               ▼                      ▼                       ▼                      ▼
        [(PostgreSQL /         (Structured JSON       (Subprocess Isolation    (PyMuPDF PDF Text
           SQLite DB)]          LLM Prompts)          Python / C / Java)       & Skill Matcher)
```

---

## 📦 Project Structure

```text
interviewpro-ai/
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py                # Application entrypoint & table initialization
│   │   ├── config.py              # Settings & environment variables
│   │   ├── core/
│   │   │   ├── database.py        # SQLAlchemy engine & session factory
│   │   │   └── security.py        # PBKDF2 password hashing & JWT handlers
│   │   ├── models/
│   │   │   └── entities.py        # Database models (User, Interview, Coding, Resume...)
│   │   ├── schemas/
│   │   │   └── dtos.py            # Pydantic validation schemas
│   │   ├── routers/               # Modular API routes
│   │   │   ├── auth.py            # Register, Login, Me, Profile
│   │   │   ├── dashboard.py       # Metrics, Readiness Score calculation
│   │   │   ├── questions.py       # AI Question Generator
│   │   │   ├── evaluations.py     # 5-Rubric Answer Evaluation
│   │   │   ├── mock_interview.py  # Interactive Mock Interview Room
│   │   │   ├── coding.py          # Multi-language code assessment runner
│   │   │   ├── resume.py          # PyMuPDF resume skill analyzer
│   │   │   └── analytics.py       # Recharts historical analytics
│   │   └── services/              # Business logic & sandbox integrations
│   ├── requirements.txt
│   └── .env
│
└── frontend/                      # React Frontend (Vite + Tailwind CSS)
    ├── src/
    │   ├── api/client.js          # Axios client with JWT interceptors
    │   ├── context/AuthContext.jsx# Global authentication state
    │   ├── components/layout/     # Navbar, Sidebar, DashboardLayout
    │   ├── pages/                 # All 9 module views + Landing Page
    │   └── App.jsx                # Router configuration
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (Node v24 recommended)
- **Python**: v3.10+ (Python 3.11/3.14 supported)
- **GCC / Java**: Optional (for running C/Java coding submissions)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (if not already created)
python -m venv .venv

# Activate virtual environment
# On Windows PowerShell:
.\.venv\Scripts\Activate.ps1
# On Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend API and interactive Swagger documentation will be available at:
👉 **API Docs:** `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install packages
npm install

# Start the Vite development server
npm run dev
```
The React application will be live at:
👉 **Web App:** `http://localhost:3000`

---

## 🔑 Demo Credentials

To test the application immediately without registration:
- **Email:** `student@interviewpro.ai`
- **Password:** `InterviewPro2026!`
- Or simply click the **"1-Click Student Demo Login"** button on the Login page!

---

## 🎯 Core Modules

### 1. User Registration & Authentication (Module 1)
- JWT token authentication with bcrypt/PBKDF2 password hashing.
- Profile management with preferred job role configuration.

### 2. Student Dashboard (Module 2)
- Real-time summary cards: Total Interviews, Average Score, Problems Solved, and Technical Score.
- Visual Interview Readiness Score gauge.
- Performance trajectory charts and quick action shortcuts.

### 3. AI Question Generator (Module 3)
- Calibrated generation across 7 job roles, 3 difficulty tiers, and 10 technical domains.

### 4. AI Answer Evaluation (Module 4)
- Granular 5-dimension scoring:
  - Technical Accuracy (/10)
  - Conceptual Depth (/10)
  - Answer Completeness (/10)
  - Clarity of Explanation (/10)
  - Relevant Examples (/10)
- Actionable feedback: Correct points, missing concepts, revision suggestions, and an exemplary benchmark answer.

### 5. Interactive Mock Interview Room (Module 5)
- Conversational interview state machine (Technical, HR, Mixed, Coding).
- Active timer, live question counter, and adaptive follow-up challenges.
- Comprehensive end-of-interview report with hiring verdict.

### 6. Coding Practice Sandbox (Module 6)
- In-browser code editor with starter templates in **Python**, **C**, and **Java**.
- Isolated sandbox execution against unit test cases with runtime and memory diagnostics.

### 7. PyMuPDF Resume Analyzer (Module 7)
- PDF upload with text extraction.
- Automatic skill matching against target role benchmarks.
- Discovery of underrepresented/missing skills and tailored interview prompts.

### 8. Personalized Learning Roadmap (Module 8)
- Dynamic revision checklist automatically prioritized by lowest-scoring topics.

### 9. Performance Analytics (Module 9)
- Historical score progression line charts and topic benchmark bar charts using Recharts.
- Transparent readiness formula explanation:
  $$\text{Readiness} = (0.35 \times \text{TechScore}) + (0.25 \times \text{MockScore}) + (0.25 \times \text{CodingPassRate}) + (0.15 \times \text{SkillCoverage})$$

---

## 🔒 Security Measures
- **Never execute arbitrary code unsafely**: Sandboxed execution with strict timeout ceilings (3s) and prohibited system token filtering.
- **Protected API Endpoints**: Endpoints enforce JWT signature verification.
- **CORS & Environment Isolation**: Sensitive keys loaded exclusively through environment variables.

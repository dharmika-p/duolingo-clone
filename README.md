# 🦉 Duolingo Clone – Spanish Learning Platform

A full-stack language learning web application inspired by Duolingo. The application provides an interactive Spanish learning experience with lessons, practice sessions, XP, hearts, streaks, crowns, progress tracking, achievements, and a leaderboard.

---

## 🚀 Features

### 📚 Learning Path
- Spanish language learning course
- Structured units and skills
- Progressive learning path
- Locked and unlocked lessons
- Skill completion tracking
- Visual progress indicators
- Crown-based lesson performance

### 📝 Interactive Lessons
- Multiple-choice questions
- Text-based translation questions
- Instant answer feedback
- Lesson progress bar
- Heart/life system
- XP rewards
- Crown rewards based on performance
- Lesson completion stored in the database

### 🎯 Practice Mode
- Dedicated practice sessions
- Multiple exercises
- Score calculation
- XP rewards
- Hearts tracking
- Practice attempt persistence
- Recent practice results displayed on the profile

### 👤 Profile
- Learner profile
- Total XP
- Daily streak
- Gems
- Hearts
- Course progress
- Skills completed
- Crowns earned
- Learning milestones
- Recent practice performance

### 🏆 Leaderboard
- Weekly XP rankings
- Learner ranking
- Streak display
- Bronze League
- Top learner podium
- Current learner position
- Learning motivation section

### ⚙️ Navigation
- Learn
- Practice
- Leaderboard
- Profile
- Settings

---

## 🛠️ Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Uvicorn

### Database
- SQLite
- SQLAlchemy ORM

---

## 🏗️ Application Architecture

```text
┌─────────────────────────────┐
│       Next.js Frontend      │
│                             │
│ Learn | Practice | Profile  │
│ Leaderboard | Settings      │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│        FastAPI Backend      │
│                             │
│ Courses | Lessons | Users   │
│ Progress | Practice | XP    │
└──────────────┬──────────────┘
               │
               │ SQLAlchemy ORM
               ▼
┌─────────────────────────────┐
│           SQLite            │
│                             │
│ Users | Courses | Lessons   │
│ Exercises | Progress        │
│ Attempts | Practice History │
└─────────────────────────────┘

Project Structure

duolingo-clone/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── duolingo.db
│   └── ...
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── lesson/
│   │   │   └── [lesson_id]/
│   │   │       └── page.tsx
│   │   ├── practice/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── globals.css
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── .gitignore


🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/home` | Get learner and course information |
| GET | `/api/lesson/{lesson_id}` | Get lesson information and exercises |
| POST | `/api/lesson/{lesson_id}/complete` | Save lesson completion |
| GET | `/api/practice` | Get practice exercises |
| POST | `/api/practice/complete` | Save practice completion |
| GET | `/api/practice/latest` | Get the latest practice attempt |
| GET | `/api/leaderboard` | Get learner leaderboard |

Interactive API documentation is available through FastAPI:
http://127.0.0.1:8000/docs

⚙️ Installation
Prerequisites
Make sure the following are installed:
- Python 3
- Node.js
- npm

🔧 Backend Setup
Open a terminal and navigate to the backend:
cd backend

Create a virtual environment:
python -m venv venv

Activate the virtual environment.

macOS / Linux
source venv/bin/activate

Windows
venv\Scripts\activate

Install the required Python packages:
pip install fastapi uvicorn sqlalchemy

Start the backend server:
uvicorn main:app --reload

The backend will run at:
http://localhost:8000



💻 Frontend Setup
Open a second terminal and navigate to the frontend:
cd frontend

Install dependencies:
npm install

Start the development server:
npm run dev

The frontend will run at:
http://localhost:3000

▶️ Running the Application
Two servers need to be running.

Terminal 1 – Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload

Terminal 2 – Frontend
cd frontend
npm run dev

Then open:
http://localhost:3000

🎮 Application Flow
Home
  │
  ▼
Learning Path
  │
  ▼
Select Skill
  │
  ▼
Start Lesson
  │
  ▼
Answer Exercises
  │
  ├── Correct → XP Reward
  │
  └── Incorrect → Lose Heart
  │
  ▼
Lesson Complete
  │
  ├── XP Reward
  ├── Crown Reward
  └── Progress Saved
  │
  ▼
Profile / Leaderboard


Practice flow:

Practice
  │
  ▼
Complete Exercises
  │
  ▼
Calculate Score
  │
  ▼
Earn XP
  │
  ▼
Save Practice Attempt
  │
  ▼
View Result on Profile

🏅 Gamification System
The application includes several gamification mechanisms designed to encourage consistent learning:
- ⭐ XP – experience points earned from learning
- 🔥 Streak – tracks consecutive learning activity
- ❤️ Hearts – represents available attempts
- 💎 Gems – in-app currency
- ⭐ Crowns – represents lesson mastery
- 🏆 Leaderboard – ranks learners based on XP
- 🎯 Daily Goal – encourages daily learning
- 🏅 Milestones – rewards learning achievements

💾 Data Persistence
The application uses SQLite and SQLAlchemy for persistent storage.
The database stores information including:
- User information
- XP
- Streak
- Hearts
- Gems
- Courses
- Units
- Skills
- Lessons
- Exercises
- Skill progress
- Lesson attempts
- Practice attempts
The database file is:
backend/duolingo.db


📊 Progress Tracking
Learner progress is tracked across the application.
Completing lessons updates:
- XP
- Skill progress
- Completion status
- Crowns
- Lesson attempt history
Completing practice updates:
- XP
- Correct answers
- Total questions
- Hearts remaining
- Practice history
The profile page provides a centralized view of the learner's progress.

🎨 User Interface
The application follows a clean, gamified learning interface inspired by modern language-learning platforms.
The UI includes:
- Green learning-focused visual theme
- Interactive lesson cards
- Progress bars
- Achievement cards
- XP and streak indicators
- Leaderboard rankings
- Responsive layouts
- Clear navigation between learning sections

🔒 Error Handling
The application includes basic error handling for:
- Failed API requests
- Missing users
- Invalid lesson completion requests
- Failed leaderboard loading
- Failed practice requests
- Database-related failures


🌟 Key Highlights
This project demonstrates the integration of:
- Full-stack web development
- REST API development
- Database design
- SQLAlchemy ORM
- React/Next.js development
- TypeScript
- Persistent application state
- Gamification
- Progress tracking
- Interactive educational content


The project focuses on building a functional learning platform rather than only reproducing the visual appearance of an existing application.

👩‍💻 Author
Dharmika Sai Pavuluri
CSE – Artificial Intelligence & Machine Learning
VIT-AP University

📌 Disclaimer
This project is an educational implementation inspired by language-learning applications. It is not affiliated with or endorsed by Duolingo.

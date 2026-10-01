# 👻 TypeTrace

**Type faster. Outsmart your past self.**

TypeTrace is a cinematic typing game built around one idea:

> Your previous performance becomes your opponent.

The project keeps the abandoned research-terminal visual style while adding account-based history, continuous typing traces, personal ghosts, ghost races, scores, progression, streaks, achievements and victory celebrations.

## Features

### Typing terminal
- 15 / 30 / 60 second modes
- First key starts the timer
- Real-time WPM, accuracy, errors and score
- Correct / incorrect / active character rendering
- Continuous passages that automatically add more text
- Responsive paragraph wrapping
- No hard end to the typing passage during a timed run

### Authentication
- Register and login
- JWT authentication
- Password hashing with Passlib/bcrypt
- Protected typing, history, profile, statistics and ghost routes
- Each user's records are isolated by user id
- Logout from Settings

### Personal archive
Every completed test is stored with:
- WPM
- Accuracy
- Errors
- Correct/incorrect characters
- Duration
- Time taken
- Score
- Timestamp
- Typing paragraph
- Ghost challenge result

### Ghost system 👻
Your historical performance becomes a ghost.

You can:
- Challenge your fastest historical run
- Select any previous run from the Ghost Archive
- Race against a selected past trace
- Compare current score and WPM with the ghost
- See whether you are ahead or behind
- Record ghost victories in the database
- Replay a ghost challenge

### Victory system
When you beat a selected past trace:
- Ghost defeated state
- Score difference
- WPM difference
- Victory report
- Animated celebration
- Ghost-breaker achievement

### Game progression
The Adventure page includes:
- XP
- Trace levels
- Chapter unlocks
- Speed milestones
- Test-count milestones
- Ghost victory milestones
- Personal progression statistics

### Other systems
- Daily typing streak
- Best WPM
- Average WPM
- Best accuracy
- Performance statistics
- History archive
- Achievements
- Profile
- Reduced-motion support
- Responsive/mobile layouts
- Cinematic grain, scanlines, fog and ghost effects

## Tech stack

### Frontend
- React
- Vite
- React Router
- Framer Motion
- Recharts
- Lucide React
- CSS / Tailwind configuration

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- JWT
- Passlib / bcrypt
- Python dotenv

## Project structure

```text
typetrace_complete/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── main.py
│   ├── requirements.txt
│   └── run.py
│
├── README.md
└── .gitignore
```

## Run locally

### Backend

Open PowerShell:

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

Backend:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

Health:

```text
http://localhost:8000/api/health
```

### Frontend

Open another PowerShell:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL Vite prints, for example:

```text
http://localhost:5173/
```

If port 5173 is already occupied, Vite may use:

```text
http://localhost:5174/
```

## First-use flow

```text
REGISTER
   ↓
LOGIN
   ↓
ENTER TERMINAL
   ↓
TYPE
   ↓
RESULT
   ↓
SAVE PERSONAL TRACE
   ↓
TRACE ENTERS ARCHIVE
   ↓
TRACE CAN BECOME A GHOST
   ↓
CHALLENGE PAST SELF
   ↓
WIN
   ↓
CELEBRATION + XP + ACHIEVEMENT
```

## Ghost challenge flow

```text
THE GHOST ROOM
      ↓
PERSONAL GHOST ARCHIVE
      ↓
SELECT PAST TRACE
      ↓
CHALLENGE
      ↓
THE TERMINAL
      ↓
CURRENT RUN vs PAST RUN
      ↓
RESULT
      ↓
GHOST DEFEATED / GHOST ESCAPED
```

## Score

The score is based on:

```text
score = WPM × accuracy × duration × 10
```

where accuracy is represented as a fraction between 0 and 1.

This gives the game a single value that can be used for historical ghost comparisons while WPM and accuracy remain visible separately.

## API

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Tests

```text
POST /api/tests
GET  /api/tests
GET  /api/tests/{id}
```

### Statistics

```text
GET /api/stats
GET /api/stats/wpm
GET /api/stats/accuracy
GET /api/streak
```

### Ghosts

```text
GET /api/ghost
GET /api/ghost?test_id={id}
GET /api/ghost/past
GET /api/ghost/races
POST /api/ghost/race
```

### Other

```text
GET /api/achievements
GET /api/profile
PUT /api/profile
GET /api/health
```

## Environment variables

### Frontend

Create:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://localhost:8000/api
```

### Backend

Create:

```text
backend/.env
```

with:

```env
SECRET_KEY=change_this_to_a_long_random_secret
DATABASE_URL=sqlite:///./typetrace.db
CORS_ORIGINS=http://localhost:5173
```

## Database

SQLite is used for local development.

The backend automatically creates missing tables on startup and includes a lightweight SQLite migration for the new ghost/score fields so an existing local `typetrace.db` can continue to work.

The database is ignored by Git through `.gitignore`.

## Security note

For a production deployment:
- Use PostgreSQL or another production database.
- Store JWTs in secure HttpOnly cookies.
- Add refresh-token rotation.
- Use a strong production `SECRET_KEY`.
- Add rate limiting.
- Add password reset and email verification.
- Configure CORS from environment variables instead of hard-coded development origins.

## Routes

```text
/              Landing
/login         Login
/register      Register
/test          Typing terminal
/result        Result report
/ghost         Ghost room
/history       Personal archive
/statistics    Performance statistics
/adventure     Game progression
/profile       User record
/settings      Configuration and logout
```

## Design direction

The existing TypeTrace visual identity is intentionally preserved:

- dark abandoned-terminal atmosphere
- bone-colored typography
- rust/red accents
- desaturated green system indicators
- grain and scanlines
- fog
- abstract SVG ghost
- terminal-style labels
- restrained motion
- no generic neon SaaS redesign

The new features are layered into that same visual language instead of replacing it.

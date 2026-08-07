# LearnHub Web

The LearnHub education app as a standalone website — same design, courses, auth, quizzes, flashcards, and progress tracking.

## Run locally

```bash
cd web
npm install
npm run dev
```

Open **http://localhost:5173**

## Build for production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to Vercel, Netlify, or any static host.

## Features

- Sign up / sign in (saved in browser localStorage)
- 4 courses with lessons, quizzes, and flashcards
- XP, streaks, and progress tracking
- Same gradient UI and floating tab bar as the mobile app

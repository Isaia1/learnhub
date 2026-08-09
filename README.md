# LearnHub

A learning website — courses, lessons, quizzes, flashcards, and progress tracking with XP and streaks.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## Build for production

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Import [github.com/Isaia1/learnhub](https://github.com/Isaia1/learnhub) on [vercel.com](https://vercel.com)
2. **Root Directory:** leave as `.` (repo root — no subfolder needed)
3. **Framework:** Vite · **Build:** `npm run build` · **Output:** `dist`
4. Deploy

Or from the terminal:

```bash
npx vercel --prod
```

## Features

- Sign up / sign in (saved in browser localStorage)
- 4 courses with lessons, quizzes, and flashcards
- XP, streaks, and per-course progress

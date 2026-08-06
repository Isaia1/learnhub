# LearnHub — Cross-Platform Education App

A full-featured education app built with **Expo (React Native)** that runs on **iOS**, **Android**, and **Web** from a single codebase.

## Features

- **User Authentication** — Sign up and sign in with email (via Supabase)
- **Courses & Lessons** — Real course content stored in Supabase
- **Quizzes** — Multiple-choice with instant feedback and explanations
- **Flashcards** — Flip cards, mark as mastered
- **Live Classes** — Scheduled and live tutoring sessions
- **Progress Tracking** — XP, streaks, per-course progress (saved locally + cloud)
- **Custom Branding** — LearnHub theme, splash screen, app identity

## Quick Start

```bash
npm install
npm start
```

Press `i` (iOS), `a` (Android), or scan the QR code with Expo Go.

**Without Supabase:** The app runs in demo mode with local sample data and progress saved on your device.

## Supabase Setup (Auth + Cloud Sync)

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings → API** and copy:
   - **Project URL**
   - **anon public** key

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the database schema

1. In Supabase, go to **SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

This creates all tables, security policies, and seeds course content.

### 4. Enable email auth

In Supabase: **Authentication → Providers → Email** — make sure it's enabled.

For development, you can disable email confirmation under **Authentication → Settings**.

### 5. Restart the app

```bash
npm start
```

You'll see the sign-in screen. Create an account and your progress syncs across devices.

## Saving Progress

Progress is saved in two places:
- **AsyncStorage** — instant, works offline
- **Supabase** — syncs when signed in (lessons, quizzes, flashcards, XP, streaks)

## Push to GitHub

```bash
git add .
git commit -m "Add auth, Supabase, and progress persistence"
git push
```

Never commit your `.env` file — it's in `.gitignore`.

## Project Structure

```
src/
├── components/     # UI components (Logo, CourseCard, Flashcard, etc.)
├── context/        # Auth, Courses, Progress state
├── data/           # Local fallback course data
├── lib/            # Supabase client & config
├── navigation/     # Tab + stack navigation
├── screens/        # All app screens including Login/SignUp
├── services/       # Course fetching & progress persistence
├── theme/          # LearnHub brand colors
└── types/          # TypeScript interfaces
supabase/
└── schema.sql      # Database schema + seed data
```

## Tech Stack

- Expo SDK 54 + React Native 0.81
- Supabase (auth + PostgreSQL)
- AsyncStorage (local persistence)
- React Navigation
- TypeScript

## Build for App Stores

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

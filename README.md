# LearnHub — Cross-Platform Education App

A full-featured education app built with **Expo (React Native)** that runs on **iOS**, **Android**, and **Web** from a single codebase.

## Features

- **Courses & Lessons** — Browse subjects, read lesson content, track completion
- **Quizzes** — Multiple-choice questions with instant feedback and explanations
- **Flashcards** — Flip cards to study, mark cards as mastered
- **Live Classes** — View scheduled and live tutoring sessions
- **Progress Tracking** — XP, streaks, per-course progress, and quiz scores
- **Profile** — User stats, settings, and account management

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on your phone (for quick testing)
- Xcode (for iOS simulator) or Android Studio (for Android emulator)

### Install & Run

```bash
npm install
npm start
```

Then press:
- `i` — Open iOS simulator
- `a` — Open Android emulator
- `w` — Open in web browser
- Scan the QR code with Expo Go on your phone

### Build for App Stores

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure and build
eas build --platform ios
eas build --platform android
```

## Project Structure

```
src/
├── components/     # Reusable UI (CourseCard, Flashcard, ProgressBar, etc.)
├── context/        # Progress state management
├── data/           # Mock course & live class data
├── navigation/     # Tab + stack navigation
├── screens/        # All app screens
├── theme/          # Colors and styling
└── types/          # TypeScript interfaces
```

## Tech Stack

- **Expo SDK 57** — Cross-platform framework
- **React Native** — Native mobile UI
- **React Navigation** — Tab and stack navigation
- **TypeScript** — Type safety

## Next Steps

- Add user authentication (Firebase, Supabase, or Auth0)
- Connect a backend API for real course content
- Add video playback for lessons (expo-av)
- Implement real-time live classes (WebRTC or Zoom SDK)
- Persist progress with AsyncStorage or a cloud database
- Push notifications for streaks and live class reminders

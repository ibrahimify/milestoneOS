# Milestone OS

Milestone OS is a local mentor dashboard for tracking mentees, session notes, module choices, meeting schedules, minutes, and finance status.

The app is built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and browser local storage.

## Features

- iPod-style private entry screen
- Dashboard overview for mentees, logs, minutes, and finance
- Mentee profile cards
- Editable mentee dossiers
- Session log creation and editing
- Automatic minute totals per mentee
- Editable module recommendations and selected modules
- Calendar events and deadlines
- Finance installment tracker
- Searchable syllabus catalogue

## Local Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run lint
```

## Project Structure

```text
app/
  globals.css
  layout.tsx
  page.tsx

components/
  CalendarGrid.tsx
  DashboardOverview.tsx
  FinanceTracker.tsx
  IPodClassic.tsx
  MenteeDossier.tsx
  MenteeGallery.tsx
  Sidebar.tsx
  SyllabusCatalogue.tsx
  TopBar.tsx

lib/
  mockData.ts
  utils.ts

types/
  index.ts
```

## Data

Initial mentee, session, calendar, syllabus, and finance data live in `lib/mockData.ts`.

The app stores updates in browser local storage. To reset local data during development, clear the site data for `localhost:3000` in the browser.

## Notes

The entry passcode is intentionally not documented in this file.

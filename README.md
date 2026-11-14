# Milestone OS

Milestone OS is a private workspace for mentors to manage mentees, session logs, follow-ups, modules, and payments. The click-wheel sign-in and glass dashboard give the workspace the feel of a small desktop app.

![Milestone OS dashboard with sample mentees and follow-ups](docs/screenshots/dashboard.png)

## Why it exists

A mentor should be able to open a mentee's profile before a meeting and see the last session, the next milestone, and what they agreed to do. Milestone OS keeps that work in one place and gives program administrators a way to approve accounts, share deadlines, and maintain a common module catalogue.

The same workflow can support other mentoring programs. Separate program workspaces and delegated administration are future possibilities. The current release provides private mentor data and a shared catalogue within one installation.

## What you can do

- Keep mentee profiles, goals, scratchpads, and module selections.
- Record sessions and due dates. Mark a next action done to clear it from the dashboard, or reopen it from its session log.
- Track meetings and deadlines, open Skedda, and export events to Google or Apple Calendar.
- Record installments and see gross pay, estimated net pay, and money received.
- Use the admin account to approve mentors, publish shared calendar events, and manage modules.

## Screenshots

[Sign-in](docs/screenshots/sign-in.png) · [Session log](docs/screenshots/session-log.png) · [Mobile navigation](docs/screenshots/mobile-navigation.png)

## Run locally

Use Node.js 24. Copy `.env.example` to `.env.local` and configure the project as described in the [Supabase setup guide](docs/setup.md).

```sh
npm ci
npm run dev
```

Open [Milestone OS locally](http://localhost:3000). Run `npm run lint`, `npm run typecheck`, and `npm test` before submitting changes. CI also runs the production build.

[System diagrams](docs/architecture.md) · [Release notes](https://github.com/ibrahimify/milestoneOS/releases) · [Report a bug](https://github.com/ibrahimify)

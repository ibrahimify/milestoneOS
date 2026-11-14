# Milestone OS architecture

## Use cases

```mermaid
flowchart LR
  Visitor["Actor · Applicant"] --> Request(["Request access and verify email"])
  Mentor["Actor · Approved mentor"] --> Profiles(["Manage mentees and modules"])
  Mentor --> Sessions(["Log sessions and complete follow-ups"])
  Mentor --> Schedule(["Manage calendar and export events"])
  Mentor --> Payments(["Track pay and installments"])
  Mentor --> Settings(["Change nickname or password"])
  Admin["Actor · Administrator"] --> Review(["Approve or suspend accounts"])
  Admin --> Catalogue(["Maintain the module catalogue"])
  Admin --> Shared(["Publish shared calendar events"])
```

## Component and deployment view

```mermaid
flowchart LR
  Browser["Mentor browser"] --> Next["Next.js UI and server actions"]
  Next --> Auth["Supabase Auth"]
  Next --> DB["Supabase Postgres · row-level security"]
  Auth --> DB
  Next --> Resend["Resend · signup notifications"]
  Browser --> Skedda["Skedda sign-in"]
  Browser --> Calendar["Google Calendar or .ics export"]
```

## Data model

```mermaid
erDiagram
  AUTH_USER ||--o| PROFILE : has
  PROFILE ||--o{ MENTEE : owns
  PROFILE ||--o{ PAYMENT : owns
  PROFILE ||--o| FINANCE_SETTINGS : owns
  PROFILE ||--o{ CALENDAR_EVENT : owns
  PROFILE ||--o| SIGNUP_NOTIFICATION : queues
  MENTEE ||--o{ SESSION : has
  MENTEE o|--o{ CALENDAR_EVENT : links
  MODULE_CATEGORY ||--o{ MODULE : groups
  MENTEE {
    uuid id PK
    uuid owner_id FK
    text recommended_modules
    text selected_modules
  }
  SESSION {
    uuid id PK
    uuid owner_id FK
    uuid mentee_id FK
    text next_action
    date follow_up
    timestamptz follow_up_completed_at
  }
```

The catalogue picker stores module IDs in the existing mentee fields. Older text values still resolve by title when a matching catalogue entry exists. Private queries use the signed-in account and row-level security. Approval and module management require an administrator.

## Complete a follow-up

```mermaid
sequenceDiagram
  actor Mentor
  participant UI as Session log
  participant Action as Next.js server action
  participant DB as Supabase Postgres
  Mentor->>UI: Mark done
  UI->>Action: Send session ID, action, due date and completion choice
  Action->>DB: Update matching session as signed-in mentor
  alt Session still matches and is owned by mentor
    DB-->>Action: Return updated session ID
    Action-->>UI: Refresh workspace data
    UI-->>Mentor: Show Done tick and remove dashboard reminder
  else Session changed or access was denied
    DB-->>Action: No matching update
    Action-->>UI: Ask mentor to refresh and try again
  end
```

## Follow-up state

```mermaid
stateDiagram-v2
  [*] --> Open: Add a next action or due date
  Open --> Done: Mark done
  Done --> Open: Reopen
  Done --> Open: Change action or due date
  Open --> [*]: Remove action and due date
```

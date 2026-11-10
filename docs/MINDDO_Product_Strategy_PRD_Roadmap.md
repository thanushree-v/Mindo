# MINDDO --- Product Strategy, PRD & Development Roadmap

> **Working name:** MINDDO\
> **Tagline:** Your thoughts, organised.\
> **Document version:** 1.0 --- MVP planning draft\
> **Status:** Proposed\
> **Platform:** Responsive web app / installable PWA\
> **Audience:** General consumers\
> **Interaction:** Voice-first, with manual text input\
> **Assistant personality:** Simple organiser that follows instructions

------------------------------------------------------------------------

## 1. Executive Summary

MINDDO is a voice-first personal productivity assistant that turns
everyday spoken thoughts into organised tasks, ideas, notes and
reminders.

People frequently think of things they need to do or remember while
doing something else. Opening an app, typing, selecting a category and
entering a deadline creates friction. MINDDO makes capture as simple as
speaking.

Examples: - "I need to submit my assignment by Friday." - "Save this
idea: a browser extension that blocks distractions." - "Remind me to
call Mom at 7 PM." - "I should research this topic tomorrow."

The application transcribes speech, identifies intent, extracts relevant
information, presents the interpretation for review and saves confirmed
records. A dependable reminder system delivers notifications at the
requested times.

**Core value proposition:** Think it. Speak it. It's organised.

1.  Capture --- speak naturally or type.
2.  Understand --- identify tasks, ideas, notes and reminders.
3.  Organise --- convert the capture into structured records.
4.  Remember --- schedule and deliver reminders reliably.

### MVP scope

1.  Voice and text capture.
2.  AI-powered intent extraction.
3.  Task and idea management.
4.  Reliable reminders and notifications.

Advanced analytics, autonomous planning, calendar integrations and
general-purpose voice conversations are excluded from V1.

------------------------------------------------------------------------

## 2. Product Vision and Strategy

### 2.1 Vision

Make capturing and organising everyday life as easy as speaking.

### 2.2 Mission

Reduce the friction between having a thought and taking action on it.

### 2.3 Problem statement

People have useful thoughts and obligations throughout the day, often
while doing something else. They may not want to open a notes app, type
a sentence, select a category, enter a date and organise the
information.

As a result: - Tasks are forgotten. - Ideas disappear. - Reminders are
created too late or not at all. - Notes become scattered across
applications. - Users spend time organising information instead of
acting on it.

### 2.4 Target audience

The long-term audience is universal: anyone who wants a simple way to
capture and organise personal information.

Potential groups: - Students managing assignments, exams and personal
goals. - Working professionals managing meetings, deadlines and
follow-ups. - Creators and entrepreneurs capturing spontaneous ideas. -
Everyday users managing errands, appointments and household tasks.

**Go-to-market recommendation:** Although the product is designed for
everyone, begin validation with 20--30 people who frequently forget
tasks or capture ideas. A universal product still needs a focused
initial testing group.

### 2.5 Product principles

1.  **Voice first, not voice only.** Manual input must always be
    available.
2.  **Capture before organisation.** Do not force users to complete a
    form just to save a thought.
3.  **Follow instructions, do not overstep.** Organise what the user
    says; do not independently make consequential decisions.
4.  **Make actions visible.** Show what was transcribed, interpreted,
    saved and scheduled.
5.  **Never invent certainty.** Ask for clarification when dates or
    times are ambiguous.
6.  **Reliability beats novelty.** A reminder that arrives is more
    valuable than an impressive but unreliable AI interaction.
7.  **Privacy by design.** Recording starts only after explicit user
    action.

------------------------------------------------------------------------

## 3. Competitive Positioning and Differentiation

Voice assistants, note-taking products and task managers already exist.
MINDDO should not claim to be the first voice-powered productivity
application. Its differentiation is the complete **voice-to-action
workflow**.

  -----------------------------------------------------------------------
  Product/category        Established strength    MINDDO opportunity
  ----------------------- ----------------------- -----------------------
  Voice-note applications Recording,              Convert spoken content
                          transcription and       into actionable tasks
                          searchable notes        and reminders

  Task managers such as   Tasks, projects, due    Make spontaneous voice
  Todoist                 dates and reminders     capture the primary
                                                  entry point

  AI scheduling products  Scheduling work around  Start with a simpler
  such as Motion          calendars               capture, organise and
                                                  remind workflow

  Flexible workspaces     Customisable notes,     Avoid requiring users
  such as Notion          databases and           to build their own
                          workspaces              organisation system
  -----------------------------------------------------------------------

Competitor features and pricing should be rechecked before public
launch; this is strategic positioning, not a live feature comparison.

### 3.1 Differentiators

1.  **Low-friction capture:** One tap to speak, without manually
    selecting a category.
2.  **Multi-intent extraction:** One recording can create multiple
    distinct records.
3.  **Multilingual and code-mixed capture:** Support natural speech in
    languages and combinations verified through testing.
4.  **Reliable execution:** Use a real scheduler and notification
    delivery pipeline.
5.  **Transparent interpretation:** Show the transcript and extracted
    fields so users can correct mistakes.
6.  **Simple experience:** Avoid turning the app into a complex
    project-management workspace.

### 3.2 Example workflow

User says:

> "Remind me to submit my project report on Friday, and save an idea: a
> browser extension that blocks distractions."

Expected interpretation: - Task: Submit project report --- due Friday. -
Idea: Distraction-blocking browser extension. - Reminder: Create only if
the user supplied or confirmed a reminder time or an explicit reminder
rule.

The application shows the extracted records and allows confirmation or
editing before saving.

### 3.3 What not to compete on

-   Do not compete with Todoist on advanced project management.
-   Do not compete with Notion on customisable workspaces.
-   Do not compete with Motion on automated calendar optimisation.
-   Do not compete with general AI chatbots on open-ended conversation.

Compete on the speed and reliability of turning everyday speech into
organised action.

------------------------------------------------------------------------

## 4. Release Strategy and Scope

  -----------------------------------------------------------------------
  Release                 Focus                   Main capabilities
  ----------------------- ----------------------- -----------------------
  V1 --- MVP              Capture and organise    Voice/text capture,
                                                  transcription,
                                                  extraction, tasks,
                                                  ideas and reminders

  V1.5                    Better organisation     Recurring tasks,
                                                  categories, improved
                                                  search and capture
                                                  history

  V2                      Personal productivity   Daily agenda, analytics
                          assistant               and natural-language
                                                  search over saved
                                                  information

  V2.5+                   Integrations            Calendar, email, mobile
                                                  app and richer
                                                  multilingual
                                                  interaction
  -----------------------------------------------------------------------

### 4.1 V1 goals

-   Capture a thought in seconds.
-   Convert speech into structured tasks, ideas, notes and reminders.
-   Interpret natural-language dates and times.
-   Allow users to edit extracted information.
-   Deliver reminders at scheduled times.
-   Make captured information searchable and accessible.
-   Provide manual input as an alternative to voice.

### 4.2 V1 non-goals

-   Autonomous life coaching.
-   Full calendar or email integration.
-   Always-listening microphone.
-   General-purpose conversational voice assistant.
-   Complex AI daily scheduling.
-   Team collaboration and shared task management.
-   Weekly, monthly and yearly analytics dashboards.
-   Autonomous task prioritisation or rescheduling.

------------------------------------------------------------------------

## 5. Product Requirements Document (PRD)

### 5.1 Product overview

  -----------------------------------------------------------------------
  Field                               Specification
  ----------------------------------- -----------------------------------
  Product name                        MINDDO (working name)

  Product type                        Voice-first personal productivity
                                      web app

  Audience                            General consumers

  Primary interaction                 Voice, with manual text entry

  Assistant personality               Simple organiser that follows
                                      instructions

  Platform                            Responsive web app / installable
                                      PWA

  Primary objective                   Convert spoken thoughts into
                                      organised tasks and reminders

  Speech-to-text                      Gnani Prisma, subject to API access
                                      and validation

  Text-to-speech                      Gnani Timbre, optional for V1

  Backend                             FastAPI

  Database                            PostgreSQL
  -----------------------------------------------------------------------

### 5.2 User stories

1.  As a user, I want to speak a thought so I can save it without
    typing.
2.  As a user, I want the app to identify whether I mentioned a task,
    idea, note or reminder.
3.  As a user, I want to mention deadlines naturally instead of
    selecting dates manually.
4.  As a user, I want to correct an incorrectly interpreted transcript
    or deadline.
5.  As a user, I want to see all my pending tasks in one place.
6.  As a user, I want reminders at the times I requested.
7.  As a user, I want to add and edit tasks manually.
8.  As a user, I want to mark tasks complete, postpone them or delete
    them.
9.  As a user, I want to search my saved tasks and ideas.
10. As a user, I want to know when a reminder could not be scheduled or
    delivered.

### 5.3 Functional requirements

#### A. Voice capture

**Requirements** - Prominent microphone button on the home screen. -
Start and stop recording with clear visual feedback. - Display recording
duration and microphone state. - Request microphone permission only when
needed. - Transcribe audio using Gnani Prisma. - Display the
transcript. - Allow transcript editing and retrying. - Provide manual
text entry as an alternative. - Store capture timestamps and the
original transcript. - Show clear permission, network and transcription
errors. - Never record without explicit user action.

**Acceptance criteria** - A user can start and stop a recording. - A
successful transcription appears in the UI. - Failed transcription shows
an understandable error and retry option. - A user can edit the
transcript before confirming extracted records. - The microphone is not
activated automatically.

#### B. AI intent extraction

Supported initial types: - `task` - `idea` - `note` - `reminder`

Suggested extracted fields:

  Field                    Example
  ------------------------ --------------------------------
  Intent                   task
  Title                    Submit project report
  Description              Complete and submit the report
  Due date                 ISO 8601 datetime or null
  Reminder time            ISO 8601 datetime or null
  Priority                 low, medium or high
  Category                 personal, work, study or other
  Clarification required   true or false

**Requirements** - One utterance may produce multiple records. - Detect
dates, times and relative expressions. - Resolve relative dates using
the user's timezone. - Distinguish task deadlines from reminder times. -
Do not invent dates or times. - Ask for clarification when a date or
time is ambiguous. - Allow users to edit extracted records before
saving. - Preserve the original transcript for traceability.

**Example**

User: "I need to finish the assignment tomorrow and call Rahul at 6 PM."

Expected: - Task: Finish the assignment --- due tomorrow. - Reminder:
Call Rahul --- tomorrow at 6 PM, if context clearly establishes that as
the intended reminder.

If the date or time cannot be resolved confidently, ask the user rather
than silently guessing.

#### C. Task management

Task fields: - `id` - `user_id` - `title` - `description` - `due_at` -
`priority` - `status` - `category` - `source` - `created_at` -
`updated_at`

Initial statuses: - `pending` - `completed` - `postponed`

Operations: - Create, view, edit and delete tasks. - Complete and reopen
tasks. - Postpone tasks. - Filter by status, date and category. - Sort
by due date and priority.

#### D. Ideas and notes

Not every thought should become a task.

**Ideas** - Save title and description. - Retain the original capture
reference. - Allow users to convert an idea into a task. - Support
search.

**Notes** - Save free-form text. - Retain creation and update
timestamps. - Support search. - Do not require a due date.

#### E. Reminder engine

**Requirements** - Schedule a reminder at a specific time. - Support
reminders associated with tasks. - Support standalone reminders. - Allow
reminders to be edited or cancelled. - Track scheduled, sent, failed and
cancelled states. - Handle timezone conversion. - Reject or clarify
reminder times in the past. - Retry transient delivery failures. -
Expose notification permission status to the user.

**Critical rule:** Use a database-backed scheduler and notification
delivery service. Do not rely on an LLM to remember to send
notifications.

For the web MVP, implement in-app reminders and browser push
notifications where permission is granted. Clearly explain that browser
or operating-system settings can block notifications. Do not promise
delivery when the user has disabled notifications or the device is
offline.

#### F. Home dashboard

Include: - Greeting and current date. - Prominent microphone button. -
Manual text capture option. - Today's tasks. - Upcoming reminders. -
Quick access to ideas. - Pending task count. - Navigation to tasks,
ideas, reminders and settings.

A user should be able to capture a thought immediately without
navigating through several screens.

#### G. Manual input

Users must be able to: - Create a task using a simple form. - Add a due
date and reminder. - Create an idea or note. - Edit captured
information. - Search and filter records. - Complete, postpone and
delete tasks.

Voice should be the fastest path, not the only path.

### 5.4 Suggested screen structure

**Home** - Header with app name and profile/settings. - Greeting and
date. - Large microphone capture control. - Text capture field. -
Today's tasks. - Upcoming reminders. - Navigation.

**Capture review** - Transcript. - Extracted records. - Record type
labels. - Editable title, description, date and time. - Confirm and save
action. - Retry or discard action.

**Tasks** - Pending, completed and overdue tasks. - Filters and
sorting. - Edit, complete, postpone and delete actions.

**Ideas** - Saved ideas. - Search. - Idea details. - Convert idea to
task.

**Reminders** - Upcoming and past reminders. - Delivery status. - Edit
and cancel actions.

### 5.5 UX rules

-   Keep the microphone action visually prominent.
-   Use clear recording, processing and error states.
-   Never hide the transcript from users.
-   Make extracted records editable.
-   Distinguish task due dates from reminder times.
-   Avoid unnecessary confirmation steps for low-risk edits.
-   Require clarification before scheduling an ambiguous reminder.
-   Provide accessible labels and keyboard navigation.
-   Make the app usable on mobile screens.

------------------------------------------------------------------------

## 6. Technical Architecture

### 6.1 Recommended stack

  -----------------------------------------------------------------------
  Layer                   Technology              Purpose
  ----------------------- ----------------------- -----------------------
  Frontend                React + Vite            Web application

  Styling                 Tailwind CSS            Responsive UI

  Language                JavaScript              Frontend implementation

  Backend                 Python FastAPI          APIs and business logic

  Database                PostgreSQL              Persistent application
                                                  data

  ORM                     SQLAlchemy              Database access

  Migrations              Alembic                 Schema versioning

  Speech-to-text          Gnani Prisma            Voice transcription

  Text-to-speech          Gnani Timbre            Optional spoken
                                                  confirmations

  AI extraction           LLM with structured     Intent and entity
                          JSON output             extraction

  Validation              Pydantic                Request and extraction
                                                  validation

  Authentication          JWT-based               User sessions
                          authentication          

  Initial scheduler       APScheduler or          MVP scheduled jobs
                          equivalent              

  Production jobs         Redis + Celery or       Durable background
                          equivalent              processing

  Notifications           Browser Push API +      Web notifications
                          service worker          

  Charts                  Chart.js                Future analytics
  -----------------------------------------------------------------------

Keep the speech provider behind an adapter interface so another provider
can be substituted without rewriting the application.

### 6.2 High-level architecture

``` mermaid
flowchart TD
    A[User] --> B[React PWA]
    B --> C{Capture type}
    C -->|Voice| D[Audio upload]
    C -->|Text| E[Text input]
    D --> F[FastAPI]
    E --> G[FastAPI]
    F --> H[Gnani Prisma STT]
    H --> I[Transcript]
    G --> I
    I --> J[LLM extraction service]
    J --> K[Structured extraction JSON]
    K --> L{User confirms?}
    L -->|Edit or clarify| J
    L -->|Confirm| M[PostgreSQL]
    M --> N[Reminder scheduler]
    N --> O[Notification service]
    M --> P[Task and idea dashboard]
    P --> B
    O --> B
```

### 6.3 Component responsibilities

**Frontend** - Record audio. - Display recording status. - Upload
audio. - Submit typed captures. - Display transcript and extracted
records. - Allow editing and confirmation. - Display tasks, ideas and
reminders. - Register service worker and manage notification permission.

**Speech service** - Send audio to Gnani Prisma. - Receive
transcription. - Normalize provider responses. - Return clear errors and
provider metadata. - Never expose API keys to the browser.

**Extraction service** Input: - Transcript. - Current date and time. -
User timezone. - Supported intent types. - Extraction schema.

Output: - Structured records. - Missing or ambiguous fields. -
Clarification requirement. - Validation metadata.

The LLM must not directly write to PostgreSQL or schedule notifications.

**Validation service** Validate: - Required fields. - Date and time
validity. - User ownership. - Supported intent types. - Duplicate or
conflicting records. - Past reminder times. - Ambiguous values requiring
clarification.

**Persistence and scheduler** - Save confirmed records. - Create or
update reminder jobs. - Track delivery state. - Retry transient
failures. - Prevent duplicate notifications. - Reconcile jobs after
service restarts.

**Text-to-speech** Use Gnani Timbre for optional spoken confirmations,
such as "Your project report reminder has been saved." This is not
essential for the first MVP.

------------------------------------------------------------------------

## 7. Data Model

Use PostgreSQL with UUID primary keys.

### 7.1 Initial tables

  -----------------------------------------------------------------------
  Table                               Important fields
  ----------------------------------- -----------------------------------
  `users`                             id, name, email, password_hash,
                                      timezone, preferences, created_at

  `captures`                          id, user_id, transcript,
                                      audio_reference, source, created_at

  `tasks`                             id, user_id, title, description,
                                      due_at, priority, status, category,
                                      source, created_at, updated_at

  `ideas`                             id, user_id, title, description,
                                      capture_id, created_at, updated_at

  `notes`                             id, user_id, content, capture_id,
                                      created_at, updated_at

  `reminders`                         id, user_id, task_id, title,
                                      scheduled_at, status, sent_at,
                                      created_at

  `extraction_logs`                   id, capture_id, extracted_json,
                                      confidence_metadata,
                                      correction_status, created_at
  -----------------------------------------------------------------------

### 7.2 Relationships

-   One user can have many captures.
-   One user can have many tasks.
-   One user can have many ideas.
-   One user can have many notes.
-   One user can have many reminders.
-   One capture can produce multiple extracted records.
-   One task can have multiple reminders.
-   A standalone reminder may have no task relationship.

### 7.3 Data rules

-   Store timestamps in UTC.
-   Store the user's IANA timezone, such as `Asia/Kolkata`.
-   Convert timestamps to local time for display and date
    interpretation.
-   Enforce ownership checks on every user-facing data operation.
-   Use database transactions when saving a capture and its extracted
    records.
-   Retain raw audio only when necessary and with a clear retention
    policy.
-   Provide a way for users to delete their data.

### 7.4 Database implementation notes

Define separate SQLAlchemy models for users, captures, tasks, ideas,
notes, reminders and extraction logs.

Use: - UUID primary keys. - Foreign keys with deliberate deletion
behaviour. - Indexed `user_id`, `due_at`, `scheduled_at` and `status`
fields. - Database constraints for supported status and priority
values. - Created and updated timestamps.

Do not put all record types into one unstructured JSON column.
Structured tables make filtering, reminders and analytics easier.

------------------------------------------------------------------------

## 8. API Design

Use a versioned REST API under `/api/v1`.

  Method   Endpoint                        Purpose
  -------- ------------------------------- ----------------------------
  POST     `/api/v1/captures/voice`        Upload voice recording
  POST     `/api/v1/captures/text`         Submit typed capture
  GET      `/api/v1/captures`              List capture history
  GET      `/api/v1/captures/{id}`         Retrieve a capture
  POST     `/api/v1/extractions/preview`   Extract structured records
  POST     `/api/v1/tasks`                 Create task
  GET      `/api/v1/tasks`                 List and filter tasks
  GET      `/api/v1/tasks/{id}`            Retrieve task
  PATCH    `/api/v1/tasks/{id}`            Update task
  DELETE   `/api/v1/tasks/{id}`            Delete task
  POST     `/api/v1/ideas`                 Create idea
  GET      `/api/v1/ideas`                 List ideas
  PATCH    `/api/v1/ideas/{id}`            Update idea
  DELETE   `/api/v1/ideas/{id}`            Delete idea
  POST     `/api/v1/reminders`             Create reminder
  GET      `/api/v1/reminders`             List reminders
  PATCH    `/api/v1/reminders/{id}`        Update reminder
  DELETE   `/api/v1/reminders/{id}`        Cancel reminder

### 8.1 API rules

-   Require authentication for all private user data.
-   Validate requests using Pydantic.
-   Return consistent error structures.
-   Apply pagination to list endpoints.
-   Use ownership checks for every record ID.
-   Keep extraction preview separate from persistence.
-   Use idempotency protection for retryable create operations where
    appropriate.
-   Derive `user_id` from the authenticated session; do not trust it
    from a request body.

### 8.2 Example extraction response

``` json
{
  "items": [
    {
      "type": "task",
      "title": "Submit project report",
      "description": "Complete and submit the report",
      "due_at": "2026-11-13T18:00:00+05:30",
      "reminder_at": null,
      "priority": "medium",
      "needs_clarification": false
    },
    {
      "type": "idea",
      "title": "Distraction-blocking browser extension",
      "description": "An extension to reduce distractions",
      "due_at": null,
      "reminder_at": null,
      "priority": "low",
      "needs_clarification": false
    }
  ],
  "clarification_questions": []
}
```

This is an illustrative response schema. The backend must validate it
before presenting it as a confirmed result.

------------------------------------------------------------------------

## 9. AI Extraction Design

### 9.1 Extraction system prompt

``` text
You are the intent extraction engine of a personal
productivity application.

Convert the user's transcript into structured records.

Supported types:
- task
- idea
- note
- reminder

Rules:
1. Extract every distinct intent.
2. Preserve the user's original meaning.
3. Do not invent deadlines or reminder times.
4. Distinguish task deadlines from reminder times.
5. Resolve relative dates using the supplied current
   date and timezone.
6. If the date or time is ambiguous, request clarification.
7. Return only JSON matching the supplied schema.
8. Never claim that a task or reminder has been saved.
9. Do not make decisions on behalf of the user.
10. Preserve the original language and meaning where possible.
```

### 9.2 Extraction pipeline

1.  Receive transcript.
2.  Attach current time and user timezone.
3.  Send transcript and schema to the LLM.
4.  Parse structured output.
5.  Validate with Pydantic.
6.  Detect missing or ambiguous fields.
7.  Return preview to frontend.
8.  Let user edit or confirm.
9.  Persist only confirmed records.
10. Schedule reminders only after confirmation.

### 9.3 Safeguards

-   Never invent dates.
-   Never silently turn a task deadline into a reminder time.
-   Never schedule an ambiguous reminder without clarification.
-   Do not claim an operation succeeded before the backend confirms it.
-   Store extraction metadata for debugging and evaluation.
-   Treat model output as untrusted input.

------------------------------------------------------------------------

## 10. Reminder and Notification Architecture

### 10.1 Reminder lifecycle

``` mermaid
stateDiagram-v2
    [*] --> Pending
    Pending --> Scheduled: Valid time confirmed
    Scheduled --> Sent: Delivery accepted
    Scheduled --> Failed: Delivery error
    Failed --> Scheduled: Retry
    Scheduled --> Cancelled: User cancels
    Pending --> Cancelled: User cancels
    Sent --> [*]
    Cancelled --> [*]
```

### 10.2 Delivery requirements

-   Store every reminder in PostgreSQL.
-   Schedule jobs from persisted reminder records.
-   Use a unique job identifier per reminder.
-   Make job processing idempotent.
-   Record delivery attempts and failures.
-   Retry transient failures with bounded backoff.
-   Reconcile scheduled reminders after a service restart.
-   Do not create duplicate jobs when a reminder is edited.
-   Cancel or replace the old job when the scheduled time changes.

### 10.3 MVP delivery channels

1.  In-app notification list.
2.  Browser push notification where permission is granted.

Later options: - Email. - Native mobile push notifications. - Additional
messaging integrations, subject to user consent and platform policies.

### 10.4 Reliability caveat

Browser notifications depend on browser support, permission, device
settings and connectivity. Report actual delivery state. Do not promise
that every notification will appear on every device.

------------------------------------------------------------------------

## 11. Security, Privacy and Reliability

### 11.1 Privacy

-   Recording begins only after explicit user action.
-   Show recording status clearly.
-   Explain whether audio is transmitted to a speech provider.
-   Do not retain raw audio indefinitely by default.
-   Provide transcript and audio deletion controls where applicable.
-   Use HTTPS in production.
-   Keep API keys and provider credentials on the backend.
-   Do not log private transcripts unnecessarily.
-   Define data retention and deletion policies.

### 11.2 Security

-   Hash passwords using a secure password-hashing algorithm.
-   Use short-lived access tokens and a secure refresh strategy.
-   Validate ownership for every database operation.
-   Apply upload size and file-type limits.
-   Rate-limit expensive speech and LLM endpoints.
-   Protect against duplicate submissions.
-   Store secrets in environment variables or a secrets manager.
-   Avoid exposing internal errors or stack traces to clients.

### 11.3 Reliability

-   Use database transactions for multi-record saves.
-   Make reminder processing idempotent.
-   Add structured logging.
-   Monitor API errors and provider failures.
-   Add health-check endpoints.
-   Back up the database.
-   Test recovery after worker and application restarts.

------------------------------------------------------------------------

## 12. Success Metrics and Evaluation

  -----------------------------------------------------------------------
  Metric                              What it measures
  ----------------------------------- -----------------------------------
  Capture completion rate             Whether users successfully capture
                                      thoughts

  Time to capture                     Friction in the capture workflow

  Transcription accuracy              Whether speech recognition
                                      preserves words

  Intent extraction accuracy          Whether record types are identified
                                      correctly

  Date/time extraction accuracy       Whether deadlines and reminders are
                                      correct

  Correction rate                     How often users must edit extracted
                                      data

  Reminder processing success         Whether scheduled jobs are
                                      processed

  Weekly active users                 Whether users return

  Task completion rate                Whether captured tasks are acted
                                      upon
  -----------------------------------------------------------------------

### Suggested initial targets

These are validation targets, not guaranteed outcomes:

-   Median short-recording capture-to-preview time: under 10 seconds.
-   At least 90% correct intent classification on a curated test set.
-   At least 95% correct date/time extraction on unambiguous test cases.
-   At least 99% successful reminder processing in controlled tests.
-   Fewer than 10% of captures requiring major corrections.

### Evaluation dataset

Create a consented test dataset of at least 100--200 utterances
covering: - English. - Indian English. - Tamil, Hindi and other
languages supported by the selected speech API. - Code-mixed speech
where supported. - Different accents and speaking speeds. - Quiet and
moderately noisy environments. - Single-intent and multi-intent
utterances. - Relative dates and ambiguous deadlines.

Label the expected transcript, intent, title, date, time and
clarification requirement.

Measure transcription quality and extraction quality separately. A
correct transcript does not guarantee correct task extraction.

------------------------------------------------------------------------

## 13. Risks and Mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  Incorrect speech transcription      Show transcript and allow
                                      correction

  Incorrect deadline extraction       Validate dates and ask for
                                      clarification

  Missed notifications                Durable jobs, retries and delivery
                                      tracking

  Poor background audio               Recording guidance and
                                      audio-quality checks

  LLM invents task details            Strict schemas and no unsupported
                                      defaults

  Users do not trust AI               Show exactly what was understood

  Scope becomes too large             Keep V1 limited to capture, tasks
                                      and reminders

  Privacy concerns                    Explicit recording, encryption and
                                      deletion controls

  Speech API limitations              Test API access, quotas, languages
                                      and latency early

  Provider outage                     Provider adapter, clear errors and
                                      retry strategy
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 14. Implementation Roadmap

Estimated duration: approximately 4--5 weeks for a focused two-person
team. This is a planning estimate and depends on API access, prior
experience and scope discipline.

### Week 1 --- Foundation and voice capture

Tasks: - Create React + Vite project. - Configure Tailwind CSS. - Create
FastAPI project. - Configure PostgreSQL. - Set up authentication. -
Implement microphone recording. - Implement audio upload. - Integrate
Gnani Prisma. - Display transcripts and error states.

**Deliverable:** Working voice transcription flow.

### Week 2 --- AI extraction and data management

Tasks: - Define Pydantic extraction schemas. - Integrate an LLM. -
Extract tasks, ideas, notes and reminders. - Support multiple records
per capture. - Implement confirmation and editing UI. - Create database
models and migrations. - Persist confirmed records.

**Deliverable:** Speech-to-structured-data pipeline.

### Week 3 --- Tasks and reminders

Tasks: - Build task CRUD APIs. - Build task screens. - Add due dates and
priorities. - Implement reminder scheduling. - Add in-app notification
state. - Implement browser push notifications. - Add task completion and
postponement. - Test job retry and duplicate prevention.

**Deliverable:** End-to-end personal organiser.

### Week 4 --- Product experience and reliability

Tasks: - Build dashboard and capture history. - Add search and
filters. - Handle timezone and ambiguous dates. - Add
failed-notification handling. - Test multilingual and noisy
recordings. - Add privacy controls and data deletion. - Add error
handling and structured logging.

**Deliverable:** Usable MVP.

### Week 5 --- Testing and demonstration

Tasks: - Test with real users. - Measure transcription and extraction
accuracy. - Fix edge cases. - Deploy frontend, backend and database. -
Prepare demo recordings and presentation. - Document architecture and
known limitations.

**Deliverable:** Deployed demo and technical documentation.

### 14.1 Suggested two-person work split

  Person A --- Frontend            Person B --- Backend
  -------------------------------- --------------------------------------
  React UI and responsive design   FastAPI backend
  Recording and audio upload       Gnani Prisma integration
  Task and idea screens            LLM extraction and validation
  Manual task input                PostgreSQL schema and APIs
  Dashboard and capture history    Reminder scheduler and notifications

Both team members should review integration points and test the complete
user journey together. Do not postpone integration until the final week.

### 14.2 Build order: vertical slices

1.  Record speech → transcribe → display transcript.
2.  Transcript → extract one task → confirm → save.
3.  Task → schedule reminder → receive notification.
4.  One recording → extract multiple records → confirm → save.
5.  Typed input → same extraction pipeline.
6.  Ideas and notes → save → search.

This reduces integration risk and produces demonstrable progress each
week.

------------------------------------------------------------------------

## 15. Post-MVP Roadmap

  -----------------------------------------------------------------------
  Phase                   Features                Value
  ----------------------- ----------------------- -----------------------
  V1.5                    Recurring tasks,        Better everyday
                          categories, improved    usability
                          search, capture history 

  V2                      Daily agenda,           Productivity visibility
                          weekly/monthly          
                          analytics, task         
                          insights                

  V2.5                    Personal memory and     Easier retrieval of
                          natural-language search saved information

  V3                      Calendar and email      Connect to existing
                          integration, mobile app workflows

  V4                      Personalised            Richer voice-first
                          multilingual voice      experience
                          interaction             
  -----------------------------------------------------------------------

Future interaction examples: - "What tasks do I have tomorrow?" - "Show
me all the ideas I captured last month." - "Which tasks have I postponed
more than twice?" - "Remind me every Sunday to plan my week." - "What
did I say about that browser extension idea?"

These are future capabilities, not V1 commitments.

------------------------------------------------------------------------

## 16. User Validation and Launch Strategy

### Initial testing group

Recruit 20--30 people who frequently forget tasks or capture ideas.
Include students, working professionals and people who regularly use
voice messages.

### Seven-day user test

Observe: - How often do they use voice instead of typing? - What types
of things do they capture? - Which languages do they naturally speak? -
How frequently does the app misinterpret a date? - Do they edit
extracted records? - Do reminders arrive at the requested time? - Do
they return to the app without being prompted?

Interview users after the test.

### Core validation question

**Does this app make remembering and organising things noticeably easier
than using WhatsApp messages to yourself, a notes app or a normal task
manager?**

If the answer is no, adding more AI features will not solve the core
problem.

------------------------------------------------------------------------

## 17. MVP Definition of Done

-   [ ] A user can register and log in.
-   [ ] A user can record audio after granting microphone permission.
-   [ ] The backend can transcribe audio using the configured speech
    provider.
-   [ ] A user can submit typed text.
-   [ ] The extraction service can identify tasks, ideas, notes and
    reminders.
-   [ ] One capture can produce multiple records.
-   [ ] The user can review and edit extracted records.
-   [ ] Only confirmed records are persisted.
-   [ ] A user can create, view, update and delete tasks.
-   [ ] A user can create and manage ideas.
-   [ ] A user can schedule and cancel reminders.
-   [ ] Reminder jobs survive application restarts through persisted
    state and reconciliation.
-   [ ] Notification failures are visible and logged.
-   [ ] Timezone handling is tested.
-   [ ] Users can search their records.
-   [ ] User data is isolated by authenticated ownership.
-   [ ] The app provides a way to delete user data.
-   [ ] The application is deployed and usable on mobile and desktop.
-   [ ] The team has tested the full voice-to-reminder workflow.

------------------------------------------------------------------------

## 18. Product Decisions to Lock Before Development

Recommended defaults:

  -----------------------------------------------------------------------
  Decision                            Recommendation
  ----------------------------------- -----------------------------------
  Capture saving                      Transcribe first, then review and
                                      confirm extracted records

  Reminder delivery                   In-app and browser notifications
                                      for V1

  Authentication                      JWT-based email/password flow for a
                                      straightforward FastAPI
                                      implementation

  Audio retention                     Do not retain raw audio
                                      indefinitely; define a short,
                                      explicit retention policy

  AI extraction                       Structured LLM output validated by
                                      Pydantic

  Date handling                       Store UTC timestamps and retain the
                                      user's IANA timezone

  Speech provider                     Gnani Prisma behind a provider
                                      adapter

  Voice response                      Defer Timbre-based spoken responses
                                      until the core workflow works
  -----------------------------------------------------------------------

These defaults can be revised after API access and early user testing
are confirmed.

------------------------------------------------------------------------

## 19. Final Product Recommendation

MINDDO should launch as a focused voice-first organiser, not a broad
autonomous AI assistant.

The first version should do four things exceptionally well:

1.  Capture thoughts through voice or text.
2.  Understand and classify multiple intentions.
3.  Turn them into editable tasks, ideas and reminders.
4.  Deliver reminders reliably.

The strongest technical demonstration is a complete workflow: a user
speaks naturally, the app transcribes the recording, extracts multiple
structured records, asks for clarification where necessary, saves
confirmed information and schedules the requested reminder.

The idea is not entirely new. Its success depends on execution,
reliability, multilingual experience and a noticeably smoother workflow
than existing voice-note and task-management products.

**Build the smallest complete product, test it with real users, measure
the errors and improve the experience before adding more features.**

------------------------------------------------------------------------

## 20. Development References and Research Checklist

Before implementation, verify current documentation and access
requirements for:

-   Gnani Prisma API: endpoint, authentication, supported audio formats,
    languages, streaming support, limits, latency and pricing.
-   Gnani Timbre API: supported languages, voices, audio formats and
    usage limits.
-   Selected LLM provider: structured output support, rate limits, cost
    and data handling.
-   PostgreSQL hosting and backup strategy.
-   Browser Push API and service worker support across target browsers.
-   Hosting provider limits for audio uploads and background workers.
-   Applicable privacy and data-protection requirements for the launch
    market.

Do not hardcode provider assumptions into the architecture until these
checks are complete.

# seenby-client

Seenby는 타인의 경험을 통해 나에 대한 새로운 인사이트를 제공하는 서비스입니다.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Biome
- npm

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```


## Scripts

```bash
npm run dev        # Start local development server
npm run build      # Type-check and create production build
npm run preview    # Preview production build locally
npm run typecheck  # Run TypeScript project checks
npm run lint       # Run Biome lint
npm run check      # Run Biome lint, format, and import checks without writing
npm run format     # Format files with Biome
npm run fix        # Apply Biome safe fixes and formatting
```

## Tooling Policy

Linting and formatting are managed by Biome. ESLint is not used in this project.

Tailwind CSS is configured through the Vite plugin and imported from `src/index.css`.

## Analytics

GA4 and Microsoft Clarity use SeenBy's production IDs by default and load
automatically only on `seenby.kr` and `www.seenby.kr`. Local development and
preview deployments stay disabled to avoid polluting production data. To verify
analytics locally, set `VITE_ANALYTICS_ENABLED=true`. The environment variables
below remain available when the IDs need to be overridden.

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=xxxxxxxxxx
```

The app sends SPA page views without query strings and normalizes dynamic IDs in
paths (for example, `/groups/:groupId`). Event parameters contain only counts and
categorical values; names, feedback text, tokens, and IDs are not sent.

Because the app sends sanitized SPA page views manually, open the GA4 web data
stream's **Enhanced measurement** settings and turn off **Page changes based on
browser history events** under Page views. `send_page_view: false` suppresses the
initial automatic page view, but Google can still send history-based page views
when that Enhanced measurement option is enabled. Leaving it enabled can both
double-count SPA page views and bypass the app's query-string sanitization.

Core GA4 events:

| Event | Meaning |
| --- | --- |
| `login` | Kakao login completed |
| `onboarding_completed` | Onboarding data saved |
| `feedback_group_created` | Feedback group created |
| `feedback_link_shared` | Feedback link copied or shared to Kakao |
| `feedback_submitted` | Public feedback successfully submitted |
| `retrospective_saved` | Retrospective successfully saved |
| `ai_generation_requested` | AI analysis request accepted |
| `ai_generation_completed` | AI analysis generation completed |
| `cover_letter_generation_requested` | Cover-letter request accepted |
| `cover_letter_generation_completed` | Cover-letter generation completed |

In GA4 Admin, mark the events used as business conversions as **Key events**.
A useful first funnel is `login` → `onboarding_completed` →
`feedback_group_created` → `feedback_link_shared`, with
`feedback_submitted` and `ai_generation_requested` monitored as separate outcome
events because they can happen in another user's session or later in time.

Clarity receives the same event names as custom events so recordings can be
filtered around important actions. The app root uses `data-clarity-mask` to mask
all rendered content. `/auth/callback` and `/feedback` are intentionally excluded
from Clarity because their URLs contain a login code or feedback-link token. Keep
Clarity's project-level masking mode set to **Strict** as defense in depth. If the
public feedback flow must be recorded, first arrange URL-parameter masking with
Clarity support or remove the token from the browser URL.

# Assessment Management System

A full-stack reference implementation of the Assessment Management System. The project demonstrates a configuration-first PDF report engine, together with a lightweight authentication workflow and a React + Tailwind UI for requesting reports.

## Project structure

```
.
├── backend              # Express API, authentication, report generation
├── frontend             # React + Tailwind interface for signup, login, and report requests
├── docs                 # Additional documentation (configuration reference, video notes, ...)
└── assignment-requirements.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Setup instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

The server starts on [http://localhost:4000](http://localhost:4000). Environment variables:

- `PORT` (default `4000`)
- `JWT_SECRET` (default `super-secret-key`)

API routes:

- `POST /auth/signup` – register a new user
- `POST /auth/login` – authenticate and receive a JWT token
- `POST /generate-report` – generate a PDF (requires `Authorization: Bearer <token>` header and a JSON payload `{ "session_id": "..." }`).

Generated PDFs are stored under `backend/reports/`. The raw HTML used to render the PDF is also returned in the API response to simplify debugging.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on [http://localhost:5173](http://localhost:5173). Configure the API URL by setting `VITE_API_BASE_URL` (defaults to `http://localhost:4000`).

The UI provides:

- Signup & login forms with validation feedback
- Authenticated dashboard to trigger report generation by `session_id`
- Quick reference for the bundled sample sessions

## Configuration-driven reports

All behaviour for report layouts, field mappings, and value classifications lives in `backend/src/config/reportConfig.js`. Adding a new assessment type, changing copy, or adjusting classification ranges requires **only** editing this configuration file. See [docs/configuration.md](docs/configuration.md) for the full reference.

## Sample data

The provided assessment fixtures are available in `backend/data/assessments.js`. The `session_id` is used as the lookup key by the report endpoint.

## Testing the flow

1. Start the backend and frontend servers.
2. Sign up for a new account from the frontend.
3. Log in (automatic after signup) and open the dashboard.
4. Use one of the sample session identifiers (e.g. `session_001`).
5. Press "Generate PDF report" and verify that a PDF appears in `backend/reports/`.

## Video demo checklist

When recording the submission video, cover the following:

- Signup → login journey in the UI
- Issuing a report generation request from the dashboard
- Locating the generated PDF on disk and opening it
- Optional: editing `reportConfig.js` to showcase how a new field/section appears without code changes

## License

MIT

You are an architect. Generate an Excalidraw diagram in JSON format representing the project architecture described below. The diagram should include modules and how they connect.

PROJECT OVERVIEW:
- Personal email sending system with Next.js frontend and Node.js backend.
- SQLite database managed with Prisma.
- Auth with bcrypt + jose.
- Emails sent via Nodemailer/SMTP.
- Cron jobs with randomized send times.
- Upload emails individually or via CSV.

MODULES TO SHOW:
1. Frontend (Next.js)
   - Upload Page (CSV or Single Email)
   - Dashboard (View email list, stats)
   - Auth Page (Login)
2. Backend (Node.js/TypeScript)
   - API routes (auth, upload, send)
   - Auth logic (bcrypt/jose)
   - Email logic (nodemailer)
   - Scheduler logic (cron job, random times)
   - CSV parser
3. Database (SQLite + Prisma)
   - Recipient Model (email, sentCount, maxEmails)
   - Logs/Stats Model (daily sent tracking)
4. Infrastructure
   - Runs locally or on VPS (Hetzner)
   - .env for secrets

DRAWING STYLE:
- Use boxes for modules, arrows for flow.
- Group frontend, backend, database, infra separately.
- Show connections (e.g., frontend → API → DB, backend → SMTP server).
- Show cron job connecting to Email logic.
- Show DB tracking sent counts.

Output ONLY valid Excalidraw JSON (no explanation text).

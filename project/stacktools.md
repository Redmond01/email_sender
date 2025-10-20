# 📦 Bulk Email Sending Web Application — External Libraries Guide

This document lists all the **external libraries** required to build and run the MVP project using **Next.js (App Router)** and **Server Actions**.

---

## ⚙️ BACKEND — Server Actions Overview

The backend is composed of multiple server routes and internal logic modules.  
Each API section below lists its core responsibilities and supporting libraries.

---

### 🧩 A. CLIENT PERMISSION AND ACCESS

#### `/api/signup` (HTTP)
**Purpose:**  
Handles new user registration, JWT token creation, and cookie assignment.

**Libraries:**
- `jose` — for JWT signing (`accessToken`, `refreshToken`)
- `bcryptjs` — for password hashing
- `zod` — for input validation
- `prisma` or `mongoose` — for database operations
- `next/headers` or `cookie` — for setting secure cookies
- `dotenv` — for environment variable management

---

#### `/api/login` (HTTP)
**Purpose:**  
Validates user credentials and issues new access/refresh tokens.

**Libraries:**
- `jose`
- `bcryptjs`
- `zod`
- `prisma` or `mongoose`
- `cookie` or `next/headers`

---

#### `middleware` (HTTP)
**Purpose:**  
Protects routes, checks for valid cookies, and redirects unauthorized users.

**Libraries:**
- `jose` — for token verification
- `cookie` or `next/headers`
- `next/server` — for Next.js middleware
- `zod` — optional validation
- `rate-limiter-flexible` — optional rate limiting

---

#### `/api/refresh` (HTTP)
**Purpose:**  
Handles token refresh logic using the stored refresh token.

**Libraries:**
- `jose` — for token validation and regeneration
- `next/headers` — for updating client cookies
- `dotenv` — for JWT secret management

---

### 🧠 B. CLIENT INTERACTIONS API SERVERS

#### `/api/dashboard` (GraphQL)
**Purpose:**  
Retrieves all analytical and dashboard data.

**Libraries:**
- `graphql`
- `@apollo/server` — backend GraphQL server
- `@apollo/client` — frontend data fetching
- `prisma` or `mongoose` — for data querying
- `zod` — validation schemas (optional)

---

#### `/api/credentials` (HTTP POST)
**Purpose:**  
Handles CRUD operations on email credentials and SMTP records.

**Libraries:**
- `prisma` or `mongoose`
- `zod` — for `{action, data}` schema validation
- `papaparse` or `csv-parse` — for handling bulk CSV uploads
- `dayjs` — for date field formatting
- `dotenv` — for environment management
- `validator` — for input sanitization

---

#### `/api/scheduler` (HTTP POST / GET)
**Purpose:**  
Adds or removes schedule timers for sending emails.

**Libraries:**
- `node-cron` — for schedule triggers
- `dayjs` — for handling time and date formats
- `prisma` or `mongoose`
- `zod` — for schedule validation

---

#### `/api/emailTemplate` (HTTP POST / GET)
**Purpose:**  
Manages email templates in the database (12 models total).

**Libraries:**
- `prisma` or `mongoose`
- `zod` — for validating templates
- `dotenv` — environment variables
- `dayjs` — for timestamp management

---

### ⚙️ C. INTERNAL SERVER LOGIC AND EXECUTION

#### SMTP Logic
**Purpose:**  
Resets SMTP stats daily and updates fields.

**Libraries:**
- `node-cron` — for daily (6 AM) reset
- `dayjs` — date tracking
- `prisma` or `mongoose`

---

#### Filter Emails Logic
**Purpose:**  
Filters valid recipients for each day’s campaign.

**Libraries:**
- `prisma` or `mongoose`
- `p-limit` — for concurrency control
- `dayjs`

---

#### Send Emails Logic (Outreach)
**Purpose:**  
Loops through valid emails and SMTPs, sending emails accordingly.

**Libraries:**
- `nodemailer` — for sending emails
- `p-limit` — concurrency control
- `dayjs`
- `dotenv` — for SMTP config
- `winston` or `pino` — for logging

---

## 🖥️ FRONTEND — Next.js (App Router)

### User Flow
1. User → Login / Signup page  
2. Redirect → Dashboard (GraphQL data)  
3. CRUD operations → `/credentials` API  
4. Set Schedule → `/schedule` API  
5. Add SMTP + Email Templates → `/emailTemplate` API

---

### 🔧 Frontend Libraries

| Task | Library |
|------|----------|
| Authentication & API calls | `axios` |
| GraphQL client integration | `@apollo/client` |
| Form management | `react-hook-form` |
| Data validation | `zod` |
| CSV file parsing (bulk upload) | `papaparse` |
| Notifications | `react-hot-toast` |
| State management (optional) | `zustand` |
| UI styling | `tailwindcss` + `shadcn/ui` |
| Cookie access | `js-cookie` |
| Date formatting | `dayjs` |

---

## 🧩 OPTIONAL UTILITIES

| Purpose | Library |
|----------|----------|
| Environment configuration | `dotenv` |
| Error tracking | `sentry` |
| Rate limiting | `rate-limiter-flexible` |
| Input sanitization | `validator` |
| Logging | `winston` or `pino` |

---

## ✅ Minimal Core Stack Summary

**Next.js** — Framework  
**Prisma / Mongoose** — Database  
**JOSE + bcryptjs** — Authentication  
**GraphQL + Apollo** — Data Fetching  
**Node-cron + Nodemailer** — Scheduling & Email  
**Zod + Papaparse** — Validation & CSV Handling  
**Cookie / Next headers** — Secure Token Storage  

---

_This setup ensures the backend server actions and frontend workflows align perfectly, covering authentication, CRUD operations, GraphQL data fetching, and email automation._

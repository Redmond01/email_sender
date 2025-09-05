project-root/
 ├── prisma/                # Prisma schema & migrations
 ├── src/
 │   ├── app/               # Next.js app directory
 │   │   ├── api/           # API routes
 │   │   ├── auth/          # Auth routes & pages
 │   │   ├── dashboard/     # UI for managing emails
 │   │   └── upload/        # Page to upload CSV or single email
 │   ├── lib/
 │   │   ├── auth.ts        # Auth helpers (bcrypt/jose)
 │   │   ├── db.ts          # Prisma client
 │   │   ├── email.ts       # Nodemailer/SMTP functions
 │   │   ├── scheduler.ts   # Cronjob scheduling logic
 │   │   └── csv.ts         # CSV parsing logic
 │   ├── middleware/        # Auth middleware
 │   ├── types/             # TS types/interfaces
 │   └── utils/             # General utilities
 ├── scripts/               # Setup or seed scripts
 ├── .env                   # Secrets (SMTP, JWT, etc.)
 ├── package.json
 └── tsconfig.json



project-root/
├── app/                  # Next.js app router (pages, layouts)
│   ├── dashboard/        # Main user interfaces
│   │   ├── admin/        # Admin-specific pages (analytics, user mgmt)
│   │   ├── teacher/      # Teacher pages (attendance, grading)
│   │   ├── parent/       # Parent portal pages
│   │   └── layout.tsx    # Shared dashboard layout
│   ├── api/              # API routes (backend endpoints)
│   │   ├── auth/         # Login, register, JWT
│   │   ├── students/     # CRUD for SIS
│   │   ├── grades/       # Grading endpoints
│   │   ├── attendance/   # Attendance endpoints
│   │   ├── reports/      # Report generation
│   │   ├── analytics/    # Query aggregates
│   │   └── feedback/     # Suggestions submission
│   ├── globals.css       # Tailwind setup
│   └── layout.tsx        # Root layout (PWA manifest)
├── components/           # Reusable UI components
│   ├── forms/            # Input forms (e.g., grade entry, feedback)
│   ├── charts/           # Analytics visualizations
│   ├── pdf/              # Report preview/export
│   └── offline/          # Offline status indicators
├── lib/                  # Utilities and services
│   ├── db.ts             # MongoDB connection (Mongoose)
│   ├── auth.ts           # JWT helpers
│   ├── socket.ts         # Socket.io setup
│   ├── cache.ts          # Redis client
│   └── utils.ts          # Compression, validation funcs
├── models/               # Mongoose schemas
│   ├── School.ts
│   ├── User.ts
│   ├── Student.ts
│   ├── Grade.ts
│   ├── Attendance.ts
│   └── Report.ts
├── public/               # Static assets (logos, manifests)
├── tests/                # Jest/Cypress tests
│   ├── unit/             # Component/API tests
│   └── e2e/              # User flow tests
├── docker-compose.yml    # For self-hosted DB/Redis
├── .env                  # Secrets (DB URI, JWT key)
├── next.config.js        # Next.js config (PWA, compression)
├── package.json
├── tsconfig.json
└── README.md
# UNIWISE AI - Academic Matching Platform

Full-stack web application for personalized university/program recommendations.

## Features
- **Profile Wizard**: 8-step dynamic form (Mode, Country, PDF parsing).
- **Matching Engine**: Vector similarity + Rule-based scoring (PostgreSQL + pgvector).
- **Paywall**: Preview top 3 results, unlock full list with Stripe.
- **Admin Panel**: Dataset management (Excel), User management.
- **Tech Stack**: Next.js 15, Tailwind, Prisma, Postgres, NextAuth.

## Setup

### 1. Prerequisites
- Node.js 18+
- PostgreSQL with `vector` extension installed.
- Stripe Account (Test mode).

### 2. Environment Variables
Copy `.env.example` to `.env` (or use the generated `.env`):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/uniwise?schema=public"
NEXTAUTH_SECRET="supersecret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
OPENAI_API_KEY="sk-..." # Optional, mocks used if missing
ADMIN_EMAIL="admin@uniwise.ai"
ADMIN_PASSWORD="adminpassword"
```

### 3. Database Setup
```bash
# Install dependencies
npm install

# Initialize Database & Migrations
# Ensure your Postgres DB is running and supports vector extension
npx prisma migrate dev --name init

# Seed Admin User and Initial Data
npx prisma db seed
```

### 4. Running the App
```bash
npm run dev
```

### 5. Stripe Webhook (Local Dev)
To test payments locally:
1. Install Stripe CLI.
2. Login: `stripe login`
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/billing/webhook
   ```
4. Copy the "whsec_..." secret to your `.env` file.

## Dataset Management
1. Login as Admin (`admin@uniwise.ai` / `adminpassword` - configured in `prisma/seed.ts`).
2. Go to `/admin/datasets`.
3. Upload Excel files.
   - Naming convention is handled automatically but structure must match: `university_name`, `program_name`, `language`.

## Project Structure
- `app/api`: Backend API routes (Match engine, Profile, Admin, Stripe).
- `app/wizard`: Client-side Profile Wizard.
- `app/results`: Results view & Paywall.
- `app/lib`: Shared utilities (Prisma, Auth, OpenAI, Stripe).
- `prisma`: Database schema & Seed script.
- `data`: Dataset storage.

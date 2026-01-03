# UNIWISE AI - Setup Complete! 🎓

Your UNIWISE AI application has been successfully initialized with:

## ✅ What's Been Created

### Project Structure
- **Next.js 15** application with App Router
- **TypeScript** configuration
- **Tailwind CSS** for styling
- **Prisma** ORM with PostgreSQL schema
- **NextAuth** for authentication

### Core Features Implemented
1. **Landing Page** - Animated background with city images
2. **Authentication System** - Sign up/Sign in with role-based access
3. **Profile Wizard** - 8-step dynamic form (Bachelor/Master)
4. **Matching Engine** - 6-stage AI-powered pipeline
5. **Results Page** - Paywall with preview (3 free results)
6. **Stripe Integration** - Payment processing
7. **Admin Panel** - Complete management dashboard

### Database
- **User** - Authentication and roles
- **Profile** - Student information
- **Program** - University programs with embeddings
- **MatchRun** - Matching sessions
- **MatchResult** - Individual program matches
- **Purchase** - Payment records
- **Entitlement** - Access control
- **Document** - CV/Transcript storage

### Sample Data
- 6 Excel files with sample programs (DE, IT, PL for Bachelor/Master)
- Located in `data/master/` and `data/bachelor/`

## 🚀 Next Steps

### 1. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - For AI matching
- `STRIPE_SECRET_KEY` - For payments
- `NEXTAUTH_SECRET` - For authentication
- `ADMIN_EMAIL` & `ADMIN_PASSWORD` - Admin credentials

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# Seed with sample data (takes 5-10 min)
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 5. Setup Stripe Webhooks (for testing payments)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks
stripe listen --forward-to localhost:3000/api/billing/webhook
```

## 📖 Documentation

See `README.md` for complete documentation including:
- Detailed setup instructions
- API endpoints
- Deployment guide
- Troubleshooting

## 🔐 Default Admin Access

After seeding, login with:
- **Email**: Value from `ADMIN_EMAIL` env
- **Password**: Value from `ADMIN_PASSWORD` env

## 📁 Key Files to Know

- `app/page.tsx` - Landing page
- `app/wizard/page.tsx` - Profile wizard
- `lib/matching.ts` - Matching algorithm
- `app/api/*` - All API endpoints
- `app/admin/*` - Admin dashboard pages
- `prisma/schema.prisma` - Database schema

## 🎯 Quick Test Flow

1. **Sign Up**: Create a user account
2. **Wizard**: Complete the 8-step profile form
3. **Match**: Select countries and start matching
4. **Results**: View first 3 results (preview mode)
5. **Payment**: Test unlock with Stripe test card `4242 4242 4242 4242`
6. **Admin**: Login as admin to view all data

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Stripe Docs](https://stripe.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)

## 🐛 Common Issues

### Database Connection Failed
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify pgvector extension is installed

### OpenAI API Errors
- Verify OPENAI_API_KEY is correct
- Check you have API credits
- Note: Seed process makes many API calls

### Stripe Webhook Errors
- Make sure Stripe CLI is running
- Verify webhook secret in .env
- Check endpoint URL is correct

---

**Built with ❤️ for the UNIWISE Team**

For questions or issues, refer to README.md or contact support.

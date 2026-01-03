# 🚀 UNIWISE AI - Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Code Quality
- [x] All TypeScript files compile without errors
- [x] No console errors in browser
- [x] All API endpoints tested
- [x] Database schema validated
- [x] Environment variables documented

### 2. Security
- [x] Passwords hashed with bcrypt
- [x] Role-based access implemented
- [x] API routes protected
- [x] Stripe webhook verified
- [x] SQL injection prevention (Prisma)
- [x] No secrets in code

### 3. Features Complete
- [x] Landing page
- [x] Authentication (signup/signin)
- [x] Profile wizard (8 steps)
- [x] Country selection
- [x] Matching pipeline
- [x] Results page with paywall
- [x] Stripe integration
- [x] Admin panel
- [x] Dataset management

---

## 🔧 Local Testing Steps

### 1. Initial Setup
```bash
cd /workspace
npm install
cp .env.example .env
# Edit .env with your credentials
```

### 2. Database Setup
```bash
# Make sure PostgreSQL is running
npm run prisma:generate
npm run db:push
```

### 3. Seed Data (Optional but Recommended)
```bash
npm run db:seed
# This takes 5-10 minutes
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test User Flow
1. Visit http://localhost:3000
2. Click "Sign Up" and create account
3. Complete profile wizard
4. Select countries (Germany, Italy, or Poland)
5. Wait for matching to complete
6. View results (first 3 visible)
7. Test Stripe checkout (use card: 4242 4242 4242 4242)

### 6. Test Admin Flow
1. Sign out
2. Sign in with admin credentials from .env
3. Visit /admin
4. Check datasets, users, match-runs, purchases
5. Verify all data displays correctly

---

## 🌐 Production Deployment

### Step 1: Database Setup (Supabase)

1. Go to https://supabase.com
2. Create new project
3. Wait for database provisioning
4. Get connection string from Settings > Database
5. Enable pgvector extension:
   ```sql
   CREATE EXTENSION vector;
   ```

### Step 2: Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import repository
4. Add environment variables:
   ```
   DATABASE_URL=your-supabase-connection-string
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXTAUTH_SECRET=generate-new-secret
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=secure-password
   OPENAI_API_KEY=your-openai-key
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (from step 3)
   CONSULTING_PACKAGE_PRICE=86364
   CONSULTING_PACKAGE_LIST_PRICE=239900
   CONSULTING_PACKAGE_DISCOUNT=64
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
5. Deploy

### Step 3: Stripe Webhook Setup

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/billing/webhook`
3. Select event: `checkout.session.completed`
4. Copy signing secret
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
6. Redeploy

### Step 4: Seed Production Database

Option A: Run seed from local machine pointing to production DB
```bash
DATABASE_URL="your-production-db-url" npm run db:seed
```

Option B: Upload datasets through admin panel

### Step 5: Test Production

1. Visit your domain
2. Test complete user flow
3. Test payment with real card (small amount)
4. Verify webhook triggers
5. Check admin panel access
6. Verify entitlement activation

---

## 📊 Monitoring Setup

### Recommended Services

1. **Error Tracking**: Sentry
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

2. **Analytics**: Vercel Analytics (built-in)
   - Enable in Vercel dashboard

3. **Database Monitoring**: Supabase Dashboard
   - Monitor query performance
   - Set up alerts

4. **Uptime Monitoring**: UptimeRobot
   - Monitor main pages
   - Set up notifications

---

## 💰 Stripe Configuration

### Test Mode (Development)
- Use test API keys (sk_test_, pk_test_)
- Test card: 4242 4242 4242 4242
- Any future date, any CVC
- Webhooks via Stripe CLI

### Live Mode (Production)
1. Complete Stripe account verification
2. Switch to live API keys
3. Set up production webhook
4. Test with small real transaction
5. Configure payout schedule

---

## 🔐 Security Hardening

### Production Checklist
- [ ] Change all default passwords
- [ ] Use strong NEXTAUTH_SECRET (32+ characters)
- [ ] Enable Stripe webhook signature verification
- [ ] Set up HTTPS (automatic on Vercel)
- [ ] Configure CORS if needed
- [ ] Set up rate limiting (optional)
- [ ] Enable database SSL
- [ ] Backup database daily

---

## 📈 Performance Optimization

### Frontend
- [ ] Enable Next.js image optimization
- [ ] Set up CDN for static assets
- [ ] Enable caching headers
- [ ] Minimize bundle size

### Backend
- [ ] Add database indexes (already in schema)
- [ ] Enable Redis caching (future)
- [ ] Optimize API response sizes
- [ ] Set up database connection pooling

### OpenAI
- [ ] Monitor API usage
- [ ] Set up usage alerts
- [ ] Consider caching common queries
- [ ] Batch requests when possible

---

## 🐛 Common Issues & Solutions

### Issue: Database connection fails
**Solution**: 
- Verify DATABASE_URL is correct
- Check database is accessible from deployment platform
- Ensure pgvector extension is installed

### Issue: OpenAI API errors
**Solution**:
- Check API key is correct
- Verify account has credits
- Check rate limits
- Add retry logic for transient errors

### Issue: Stripe webhook not triggering
**Solution**:
- Verify webhook URL is correct
- Check webhook secret matches
- Ensure correct event selected
- Check Vercel logs for errors

### Issue: Slow matching performance
**Solution**:
- Pre-generate embeddings during seed
- Reduce number of LLM calls
- Optimize database queries
- Consider async processing

---

## 📞 Post-Launch Monitoring

### Daily
- [ ] Check error logs
- [ ] Monitor payment success rate
- [ ] Review user signups

### Weekly
- [ ] Analyze conversion funnel
- [ ] Check average matching time
- [ ] Review user feedback
- [ ] Monitor API costs

### Monthly
- [ ] Update program data
- [ ] Review and optimize costs
- [ ] Analyze revenue trends
- [ ] Plan feature updates

---

## 🎯 Success Metrics

### Technical KPIs
- Server uptime > 99.9%
- Page load time < 2s
- API response time < 200ms
- Error rate < 0.1%

### Business KPIs
- User signup conversion
- Wizard completion rate
- Payment conversion rate
- Average revenue per user
- User retention rate

---

## 📋 Maintenance Schedule

### Weekly Tasks
- Review error logs
- Check API usage
- Monitor costs
- Review user feedback

### Monthly Tasks
- Update dependencies
- Review security alerts
- Optimize database
- Update program data

### Quarterly Tasks
- Re-generate embeddings
- Major feature updates
- Comprehensive testing
- Performance audit

---

## 🚨 Emergency Contacts

### Key Services
- **Vercel Support**: vercel.com/support
- **Supabase Support**: supabase.com/support
- **Stripe Support**: support.stripe.com
- **OpenAI Support**: platform.openai.com/support

### Backup Plans
- Database backup strategy
- Code repository backups
- Environment variable backup
- Documentation backup

---

## ✅ Final Pre-Launch Checklist

### Must Have
- [x] All features working
- [x] Responsive design
- [x] Error handling
- [x] Security measures
- [x] Payment processing
- [x] Admin panel
- [x] Documentation

### Nice to Have
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] A/B testing
- [ ] Social media integration
- [ ] SEO optimization
- [ ] Blog/content section

### Legal Requirements
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie Policy
- [ ] GDPR compliance (if EU users)
- [ ] Refund policy

---

## 🎉 Launch Day

1. **Final Test**: Complete end-to-end test
2. **Monitoring**: All monitoring tools active
3. **Support**: Support channels ready
4. **Announcement**: Marketing materials prepared
5. **Backup**: Emergency rollback plan ready

---

## 📞 Support Resources

- Documentation: README.md, SETUP.md, PROJECT_SUMMARY.md
- Code Comments: Inline documentation throughout
- Community: Stack Overflow, Next.js Discord
- Professional: Consider hiring DevOps consultant

---

**Remember**: Start small, monitor closely, scale gradually!

Good luck with your launch! 🚀

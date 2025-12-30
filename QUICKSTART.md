# Quick Start Guide

Get up and running with the Bun monorepo in 5 minutes!

## Prerequisites

- [Bun](https://bun.sh) v1.0+ or Node.js v18+
- Git

## Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/your-username/aws-sam-auth0-dynamo.git
cd aws-sam-auth0-dynamo

# Install dependencies
npm install

# Verify setup
npm run verify
```

## Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
cp .env.example .env
```

For local development, you can use the default values in `.env.example` to test the server structure. The server will run with warnings but will be functional.

## Step 3: Build (30 seconds)

```bash
# Build all packages
npm run build
```

## Step 4: Run (30 seconds)

```bash
# Start the development server
npm run dev

# Or with Bun (if installed)
npm run dev:bun
```

The server will start at `http://localhost:3000`

## Step 5: Test (1 minute)

Open a new terminal and test the endpoints:

```bash
# Test health check
curl http://localhost:3000/health

# Test root endpoint
curl http://localhost:3000/

# Test protected endpoint (will return 401 without token)
curl http://localhost:3000/api/profile
```

## What's Next?

### For Development

1. **Set up real credentials** (optional but recommended):
   - Get Supabase credentials from [supabase.com](https://supabase.com)
   - Get Auth0 credentials from [auth0.com](https://auth0.com)
   - Update `.env` with real values

2. **Run database migrations**:
   ```bash
   # Copy SQL from packages/db/src/migrations/001_initial_schema.sql
   # Run in your Supabase SQL Editor
   ```

3. **Start developing**:
   - Add new endpoints in `packages/api/src/index.ts`
   - Modify auth logic in `packages/auth/src/index.ts`
   - Add database helpers in `packages/db/src/index.ts`

4. **Read the guides**:
   - [README.md](README.md) - Comprehensive setup guide
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Development workflow
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

### For Production Deployment

1. **Prepare credentials**:
   - Set up Supabase project
   - Configure Auth0 tenant and API
   - Get Railway account

2. **Deploy to Railway**:
   ```bash
   # Push to GitHub
   git push origin main
   
   # Or use Railway CLI
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

3. **Set environment variables** in Railway dashboard

4. **Test your deployment**:
   ```bash
   curl https://your-app.railway.app/health
   ```

## Common Commands

```bash
# Development
npm run dev              # Start dev server (Node.js)
npm run dev:bun          # Start dev server (Bun)

# Building
npm run build            # Build all packages

# Production
npm run start            # Run production build (Node.js)
npm run start:bun        # Run with Bun

# Database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database

# Verification
npm run verify           # Verify setup
```

## Project Structure

```
├── packages/
│   ├── api/          # Main API server
│   ├── auth/         # Auth0 middleware
│   └── db/           # Supabase client
├── examples/         # Example code
├── scripts/          # Utility scripts
├── .env.example      # Environment template
└── railway.json      # Railway config
```

## Troubleshooting

### Port already in use
```bash
# Change PORT in .env to a different port
PORT=3001
```

### Build fails
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Server won't start
```bash
# Check build output exists
ls packages/api/dist/

# Rebuild if missing
npm run build
```

## Getting Help

- 📖 [Full Documentation](README.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)
- 💬 Open an issue on GitHub

## Success Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Setup verified (`npm run verify`)
- [ ] Project builds (`npm run build`)
- [ ] Server starts (`npm run dev`)
- [ ] Health endpoint responds (`curl localhost:3000/health`)
- [ ] Protected endpoints require auth

Once all checkboxes are complete, you're ready to start developing!

---

**Tip**: Run `npm run verify` anytime to check if your setup is correct.

# Bun Monorepo with Auth0 & Supabase

A modern, high-performance API monorepo built with Bun, featuring Auth0 authentication and Supabase database integration. Designed for deployment on Railway.

## 🚀 Features

- **Bun Runtime**: Lightning-fast JavaScript runtime with native TypeScript support
- **Monorepo Architecture**: Clean separation of concerns with workspace packages
- **Auth0 Integration**: Secure JWT-based authentication
- **Supabase Database**: PostgreSQL database with real-time capabilities
- **Hono Framework**: Ultra-fast web framework optimized for edge computing
- **Railway Ready**: Pre-configured for seamless Railway deployment
- **Type Safety**: Full TypeScript support across all packages

## 📦 Project Structure

```
.
├── packages/
│   ├── api/          # Main API server (Hono)
│   ├── auth/         # Auth0 authentication middleware
│   └── db/           # Supabase database client and migrations
├── railway.json      # Railway deployment configuration
├── nixpacks.toml     # Nixpacks build configuration
└── package.json      # Root workspace configuration
```

## 🛠️ Prerequisites

- [Bun](https://bun.sh) v1.0.0 or higher
- [Auth0 Account](https://auth0.com)
- [Supabase Account](https://supabase.com)
- [Railway Account](https://railway.app) (for deployment)

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Auth0

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Create a new API or use an existing one
3. Note your:
   - Domain (e.g., `your-tenant.auth0.com`)
   - API Identifier/Audience (e.g., `https://your-api-identifier`)

### 3. Configure Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use an existing one
3. Go to Project Settings → API
4. Note your:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon/Public Key

### 4. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
PORT=3000
NODE_ENV=development

# Auth0
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# CORS (optional)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 5. Set Up Database Schema

Run the migration SQL in your Supabase SQL Editor:

```bash
# Copy the contents of packages/db/src/migrations/001_initial_schema.sql
# and run it in your Supabase SQL Editor
```

Or use the Supabase CLI:

```bash
supabase db push
```

### 6. Seed Database (Optional)

```bash
bun run db:seed
```

## 🏃 Running Locally

### Development Mode (with auto-reload)

```bash
bun run dev
```

The API will be available at `http://localhost:3000`

### Production Build

```bash
bun run build
bun run start
```

## 🧪 Testing the API

### Public Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Root endpoint
curl http://localhost:3000/
```

### Protected Endpoints (requires Auth0 token)

```bash
# Get user profile
curl -H "Authorization: Bearer YOUR_AUTH0_TOKEN" \
  http://localhost:3000/api/profile

# Get user data
curl -H "Authorization: Bearer YOUR_AUTH0_TOKEN" \
  http://localhost:3000/api/data

# Create data
curl -X POST \
  -H "Authorization: Bearer YOUR_AUTH0_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"key": "value"}}' \
  http://localhost:3000/api/data
```

To get an Auth0 token for testing:
1. Use Auth0's test token feature in the dashboard
2. Or implement a login flow in your frontend application

## 🚂 Deploying to Railway

### Option 1: Deploy via GitHub

1. Push your code to GitHub
2. Go to [Railway Dashboard](https://railway.app/dashboard)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect the configuration

### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project (or create new)
railway link

# Deploy
railway up
```

### Set Environment Variables on Railway

In your Railway project settings, add these environment variables:

```
PORT=3000
NODE_ENV=production
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://your-api-identifier
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

Railway will automatically assign a domain to your API.

## 📚 Package Details

### @aws-sam-auth0-dynamo/api

Main API server built with Hono framework. Handles HTTP requests and routes.

**Key Features:**
- REST API endpoints
- CORS configuration
- Logging middleware
- Error handling

### @aws-sam-auth0-dynamo/auth

Auth0 authentication middleware using JWT verification.

**Key Features:**
- JWT token verification
- Auth0 integration
- User context management
- Protected route middleware

### @aws-sam-auth0-dynamo/db

Supabase database client and utilities.

**Key Features:**
- Supabase client singleton
- Type-safe database queries
- Migration scripts
- Seed data utilities

## 🔒 Security Notes

- Never commit `.env` files to git
- Use environment variables for all sensitive data
- Enable Row Level Security (RLS) in Supabase
- Regularly rotate API keys and secrets
- Use HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT

## 🆘 Troubleshooting

### "Supabase is not configured" error

Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set in your `.env` file.

### "Auth0 not configured" error

Make sure `AUTH0_DOMAIN` and `AUTH0_AUDIENCE` are set in your `.env` file.

### Port already in use

Change the `PORT` in your `.env` file or kill the process using port 3000:

```bash
lsof -ti:3000 | xargs kill -9
```

### Railway deployment fails

1. Check the build logs in Railway dashboard
2. Ensure all environment variables are set
3. Verify `railway.json` and `nixpacks.toml` are present

## 📖 Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev)
- [Auth0 Documentation](https://auth0.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Railway Documentation](https://docs.railway.app)
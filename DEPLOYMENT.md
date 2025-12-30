# Deployment Guide

This guide provides step-by-step instructions for deploying the Bun monorepo to Railway with Supabase and Auth0.

## Prerequisites

Before deploying, make sure you have:

1. A [Railway](https://railway.app) account
2. A [Supabase](https://supabase.com) project
3. An [Auth0](https://auth0.com) tenant and API configuration
4. Git repository pushed to GitHub (recommended)

## Step 1: Set Up Supabase

### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details and wait for it to be created

### Run Database Migrations

1. Go to the SQL Editor in your Supabase project
2. Copy the contents of `packages/db/src/migrations/001_initial_schema.sql`
3. Paste and run the SQL in the editor
4. Verify tables are created in the Table Editor

### Get Supabase Credentials

1. Go to Project Settings → API
2. Copy your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key (starts with `eyJ...`)

## Step 2: Set Up Auth0

### Create or Configure API

1. Go to [Auth0 Dashboard](https://manage.auth0.com)
2. Navigate to Applications → APIs
3. Create a new API or select an existing one
4. Note your:
   - Domain (e.g., `your-tenant.auth0.com`)
   - API Identifier/Audience (e.g., `https://your-api-identifier`)

### Configure CORS (Optional)

In your Auth0 API settings, add allowed CORS origins if needed.

## Step 3: Deploy to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Create new Railway project**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect the configuration

3. **Set environment variables**
   
   In Railway project settings → Variables, add:
   
   ```
   PORT=3000
   NODE_ENV=production
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_AUDIENCE=https://your-api-identifier
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ALLOWED_ORIGINS=https://your-frontend-domain.com
   ```

4. **Deploy**
   - Railway will automatically build and deploy
   - You'll get a public URL (e.g., `https://your-app.railway.app`)

### Option B: Deploy with Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize project**
   ```bash
   railway init
   ```

4. **Set environment variables**
   ```bash
   railway variables set PORT=3000
   railway variables set NODE_ENV=production
   railway variables set AUTH0_DOMAIN=your-tenant.auth0.com
   railway variables set AUTH0_AUDIENCE=https://your-api-identifier
   railway variables set SUPABASE_URL=https://xxxxx.supabase.co
   railway variables set SUPABASE_ANON_KEY=your-anon-key
   railway variables set ALLOWED_ORIGINS=https://your-frontend.com
   ```

5. **Deploy**
   ```bash
   railway up
   ```

## Step 4: Verify Deployment

### Test Your API

1. **Test health endpoint**
   ```bash
   curl https://your-app.railway.app/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

2. **Test root endpoint**
   ```bash
   curl https://your-app.railway.app/
   ```
   
   Expected response:
   ```json
   {
     "message": "Welcome to the API",
     "version": "1.0.0",
     "status": "healthy"
   }
   ```

3. **Test protected endpoint** (should return 401 without token)
   ```bash
   curl https://your-app.railway.app/api/profile
   ```
   
   Expected response:
   ```json
   {
     "error": "Unauthorized: No token provided"
   }
   ```

## Step 5: Configure Auth0 for Your Deployment

### Update Auth0 Allowed Callback URLs

1. Go to your Auth0 Application settings
2. Add your Railway URL to:
   - Allowed Callback URLs
   - Allowed Web Origins
   - Allowed Origins (CORS)

Example:
```
https://your-app.railway.app
```

### Test Authentication

Get a test token from Auth0 and test protected endpoints:

```bash
curl -H "Authorization: Bearer YOUR_AUTH0_TOKEN" \
  https://your-app.railway.app/api/profile
```

## Troubleshooting

### Build Failures

**Problem**: Railway build fails

**Solutions**:
- Check build logs in Railway dashboard
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility
- Check that `railway.json` and `nixpacks.toml` are present

### Runtime Errors

**Problem**: App crashes after deployment

**Solutions**:
- Check Railway logs for error messages
- Verify all environment variables are set correctly
- Test database connection from Supabase dashboard
- Verify Auth0 credentials

### CORS Errors

**Problem**: Frontend can't access API

**Solutions**:
- Add frontend domain to `ALLOWED_ORIGINS` environment variable
- Update Auth0 CORS settings
- Check that CORS middleware is properly configured

### Database Connection Issues

**Problem**: Can't connect to Supabase

**Solutions**:
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
- Check Supabase project status
- Test connection using Supabase's REST API directly
- Ensure Row Level Security policies are properly configured

### Authentication Failures

**Problem**: Valid tokens are rejected

**Solutions**:
- Verify `AUTH0_DOMAIN` matches your Auth0 tenant
- Check `AUTH0_AUDIENCE` matches your API identifier
- Ensure token hasn't expired
- Verify token is being sent in `Authorization: Bearer TOKEN` format

## Continuous Deployment

Railway automatically redeploys when you push to your GitHub repository:

```bash
git add .
git commit -m "Update API"
git push origin main
```

Railway will:
1. Detect the push
2. Run the build process
3. Deploy the new version
4. Keep the old version running until the new one is ready

## Monitoring

### View Logs

**In Railway Dashboard**:
- Go to your project
- Click on the service
- Navigate to "Deployments" → "View Logs"

**With Railway CLI**:
```bash
railway logs
```

### View Metrics

Railway provides built-in metrics:
- CPU usage
- Memory usage
- Request count
- Response times

Access these in the Railway dashboard under the Metrics tab.

## Scaling

Railway automatically scales your application. For custom scaling:

1. Go to your project settings
2. Adjust resource limits
3. Configure auto-scaling rules (on paid plans)

## Cost Optimization

- Use Railway's free tier for development
- Upgrade to Hobby plan for production ($5/month)
- Monitor usage in the Railway dashboard
- Optimize cold starts by keeping the app warm

## Security Best Practices

1. **Never commit secrets**
   - Always use environment variables
   - Keep `.env` in `.gitignore`

2. **Use HTTPS only**
   - Railway provides HTTPS by default
   - Enforce HTTPS in production

3. **Rotate credentials regularly**
   - Update Auth0 secrets periodically
   - Rotate Supabase keys
   - Update Railway environment variables

4. **Enable Row Level Security**
   - Supabase RLS is enabled in migrations
   - Verify policies are working correctly

5. **Monitor for vulnerabilities**
   - Run `npm audit` regularly
   - Keep dependencies updated
   - Review Railway security alerts

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)
- [Auth0 Documentation](https://auth0.com/docs)
- [Hono Documentation](https://hono.dev)
- [Bun Documentation](https://bun.sh/docs)

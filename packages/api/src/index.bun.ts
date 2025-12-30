import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware, type User } from '@aws-sam-auth0-dynamo/auth';
import { getSupabaseClient } from '@aws-sam-auth0-dynamo/db';

// Define context variables type
type Variables = {
  user: User;
};

const app = new Hono<{ Variables: Variables }>();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Public routes
app.get('/', (c) => {
  return c.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    status: 'healthy',
    runtime: 'Bun',
  });
});

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected routes
app.use('/api/*', authMiddleware);

app.get('/api/profile', async (c) => {
  const user = c.get('user');
  return c.json({ user });
});

app.get('/api/data', async (c) => {
  const supabase = getSupabaseClient();
  const user = c.get('user');
  
  // Example query - adjust based on your schema
  const { data, error } = await supabase
    .from('user_data')
    .select('*')
    .eq('user_id', user.sub);
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  return c.json({ data });
});

app.post('/api/data', async (c) => {
  const supabase = getSupabaseClient();
  const user = c.get('user');
  const body = await c.req.json();
  
  const { data, error } = await supabase
    .from('user_data')
    .insert({ ...body, user_id: user.sub })
    .select();
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  return c.json({ data }, 201);
});

// Error handling
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({ error: err.message || 'Internal Server Error' }, 500);
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Server starting on port ${port} with Bun runtime`);

// Bun-native export
export default {
  port,
  fetch: app.fetch,
};

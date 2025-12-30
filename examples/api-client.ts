/**
 * Example client for the API
 * 
 * This demonstrates how to interact with the API from a frontend application.
 * You'll need to integrate Auth0 authentication in your frontend first.
 */

// Configuration
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

// Example: Get an Auth0 token
// In a real app, this would come from Auth0's authentication flow
async function getAuth0Token() {
  // This is a placeholder. In production, use Auth0's SDK:
  // 
  // import { Auth0Client } from '@auth0/auth0-spa-js';
  // 
  // const auth0 = new Auth0Client({
  //   domain: 'your-tenant.auth0.com',
  //   clientId: 'your-client-id',
  //   authorizationParams: {
  //     audience: 'https://your-api-identifier'
  //   }
  // });
  // 
  // await auth0.loginWithPopup();
  // const token = await auth0.getTokenSilently();
  // return token;
  
  throw new Error('Implement Auth0 authentication first');
}

// API Client class
class ApiClient {
  constructor(baseUrl, token = null) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Public endpoints
  async health() {
    return this.request('/health');
  }

  async root() {
    return this.request('/');
  }

  // Protected endpoints (require authentication)
  async getProfile() {
    return this.request('/api/profile');
  }

  async getData() {
    return this.request('/api/data');
  }

  async createData(data) {
    return this.request('/api/data', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  }
}

// Example usage
async function main() {
  const client = new ApiClient(API_BASE_URL);

  console.log('Testing public endpoints...\n');

  // Test health endpoint
  try {
    const health = await client.health();
    console.log('✓ Health check:', health);
  } catch (error) {
    console.error('✗ Health check failed:', error.message);
  }

  // Test root endpoint
  try {
    const root = await client.root();
    console.log('✓ Root endpoint:', root);
  } catch (error) {
    console.error('✗ Root endpoint failed:', error.message);
  }

  console.log('\nTesting protected endpoints...\n');

  // Test protected endpoint without token (should fail)
  try {
    await client.getProfile();
    console.log('✗ Should have failed without token');
  } catch (error) {
    console.log('✓ Correctly rejected without token:', error.message);
  }

  // To test with a real token, uncomment:
  // try {
  //   const token = await getAuth0Token();
  //   client.setToken(token);
  //   
  //   const profile = await client.getProfile();
  //   console.log('✓ Profile:', profile);
  //   
  //   const data = await client.getData();
  //   console.log('✓ User data:', data);
  //   
  //   const newData = await client.createData({ 
  //     message: 'Hello from client',
  //     timestamp: new Date().toISOString() 
  //   });
  //   console.log('✓ Created data:', newData);
  // } catch (error) {
  //   console.error('✗ Protected endpoints failed:', error.message);
  // }
}

// Run if this file is executed directly
if (import.meta.main) {
  main().catch(console.error);
}

export { ApiClient };

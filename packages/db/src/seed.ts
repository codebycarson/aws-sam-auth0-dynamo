import { getSupabaseClient } from './index';

/**
 * Seed the database with initial data
 * Run with: bun run packages/db/src/seed.ts
 */
async function seed() {
  console.log('🌱 Seeding database...');

  const supabase = getSupabaseClient();

  try {
    // Example: Insert sample data
    // Adjust based on your schema and needs
    const sampleData = [
      {
        user_id: 'test-user-1',
        data: { name: 'Test User 1', description: 'Sample data for testing' },
      },
      {
        user_id: 'test-user-2',
        data: { name: 'Test User 2', description: 'Another sample entry' },
      },
    ];

    const { error } = await supabase.from('user_data').insert(sampleData);

    if (error) {
      console.error('❌ Error seeding database:', error.message);
      process.exit(1);
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (import.meta.main) {
  seed();
}

export { seed };

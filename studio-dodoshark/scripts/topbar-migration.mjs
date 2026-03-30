import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '../front/dodoshark/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_EDITOR_TOKEN,
});

async function migrate() {
  console.log('Starting TopBar migration...');

  const topBarPatch = {
    backgroundColor: '#f5f5f0',
    borderColor: '#e8e7de',
  };

  try {
    await client
      .patch('globalSettings')
      .set({ 'header.topBar': topBarPatch })
      .commit();
    
    console.log('TopBar migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

migrate();

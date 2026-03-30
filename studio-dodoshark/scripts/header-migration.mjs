import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { basename, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../front/dodoshark/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_EDITOR_TOKEN,
});

const PUBLIC_DIR = join(process.cwd(), '../front/dodoshark/public');

async function uploadImage(localPath) {
  try {
    const fullPath = join(PUBLIC_DIR, localPath);
    console.log(`Uploading ${fullPath}...`);
    const asset = await client.assets.upload('image', createReadStream(fullPath), {
      filename: basename(fullPath),
    });
    return asset._id;
  } catch (error) {
    console.error(`Failed to upload ${localPath}:`, error.message);
    return null;
  }
}

async function migrate() {
  console.log('Starting Header migration...');

  const navBgId = await uploadImage('/assets/images/background/footer-background.png');

  const headerPatch = {
    sloganLabel: 'Our Slogan',
    sloganText: 'Work with Confidence, Reap in Joy',
    workingHoursLabel: 'Working Hours (Beijing Time)',
    workingHoursText: 'Mon - Sun: 9:00 - 22:00',
    desktopCtaLabel: 'Request Quote',
    desktopCtaHref: '/contact',
    mobileCtaLabel: 'Quote',
    mobileCtaHref: '/contact',
    navBackground: navBgId ? {
      _type: 'image',
      asset: { _type: 'reference', _ref: navBgId },
      alt: 'Navigation Background Texture'
    } : undefined,
  };

  try {
    // We use patch to update the specific fields in the globalSettings singleton
    await client
      .patch('globalSettings') // Assuming the ID is globalSettings
      .set({ header: headerPatch })
      .commit();
    
    console.log('Header migration completed successfully!');
  } catch (error) {
    // If globalSettings doesn't exist yet (unlikely), we might need createIfNotExists
    console.error('Migration failed:', error.message);
    
    if (error.message.includes('Document ID "globalSettings" not found')) {
        console.log('Attempting to create globalSettings document...');
        await client.createIfNotExists({
            _id: 'globalSettings',
            _type: 'globalSettings',
            header: headerPatch
        });
        console.log('globalSettings document created with header fields.');
    }
  }
}

migrate();

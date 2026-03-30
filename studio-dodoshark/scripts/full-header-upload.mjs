import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config({ path: '../front/dodoshark/.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_EDITOR_TOKEN,
});

async function uploadImage(filePath) {
  try {
    const imageData = readFileSync(filePath);
    const asset = await client.assets.upload('image', imageData, {
      filename: filePath.split('/').pop(),
    });
    return asset._id;
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error.message);
    return null;
  }
}

async function migrate() {
  console.log('Starting full Header content upload...');

  const logoPath = join(process.cwd(), '../front/dodoshark/public/assets/images/brand/dodoshark-logo.png');
  const bgPath = join(process.cwd(), '../front/dodoshark/public/assets/images/background/footer-background.png');

  const logoAssetId = await uploadImage(logoPath);
  const bgAssetId = await uploadImage(bgPath);

  const patch = {
    siteName: 'DoDoShark',
    logo: logoAssetId ? {
      _type: 'image',
      asset: { _type: 'reference', _ref: logoAssetId },
      alt: 'DoDoShark Logo'
    } : undefined,
    header: {
      topBar: {
        backgroundColor: '#f5f5f0',
        borderColor: '#e8e7de',
      },
      sloganLabel: 'OUR SLOGAN',
      sloganText: 'Work with Confidence, Reap in Joy',
      workingHoursLabel: 'WORKING HOURS (BEIJING TIME)',
      workingHoursText: 'Mon - Sun: 9:00 - 22:00',
      navBackground: bgAssetId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: bgAssetId },
        alt: 'Header Navigation Background'
      } : undefined,
      desktopCtaLabel: 'Request Quote',
      desktopCtaHref: '/contact',
      mobileCtaLabel: 'Quote',
      mobileCtaHref: '/contact',
    }
  };

  try {
    // Ensure the document exists before patching
    await client.createIfNotExists({ _id: 'globalSettings', _type: 'globalSettings' });

    await client
      .patch('globalSettings')
      .set(patch)
      .commit();
    
    console.log('Full Header content upload completed successfully!');
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

migrate();

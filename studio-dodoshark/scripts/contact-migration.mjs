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
  console.log('Starting Contact Page migration...');

  const heroImageId = await uploadImage('/assets/images/about/contact-hero.jpg');
  const showroomImageId = await uploadImage('/assets/images/showroom-1.jpg');

  const contactPageData = {
    _id: 'contactPage',
    _type: 'contactPage',
    hero: {
      title: 'Get In Touch',
      subtitle: 'Reach out to our expert team for recommendations, quotations, and global technical support.',
      backgroundImage: heroImageId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: heroImageId },
        alt: 'DoDoShark Contact Center'
      } : undefined,
    },
    showroom: {
      title: 'Our Showroom',
      description: 'Visit our facility in Nanjing to see our high-precision machinery in action and discuss your production needs with our experts.',
      image: showroomImageId ? {
        _type: 'image',
        asset: { _type: 'reference', _ref: showroomImageId },
        alt: 'DoDoShark Showroom'
      } : undefined,
    },
    headquarters: {
      title: 'Headquarters',
      description: 'Located in Nanjing, Jiangsu Province, China.',
      note: 'DoDoShark is proudly a brand of Nanjing Heici Machinery Co., Ltd.',
    },
    productionBases: {
      title: 'Production Bases',
      description: 'Three major manufacturing facilities located in Shandong Province.',
      cities: ['Jinan', 'Liaocheng', 'Weifang'],
    },
    directContact: {
      title: 'Direct Contact',
      phone: '+86 18251999196',
      email: 'sales@dodoshark.com',
      websiteLabel: 'www.dodoshark.com',
      websiteUrl: 'https://www.dodoshark.com',
    },
    inquiryPanel: {
      title: 'Send Inquiry',
      description: 'Leave your contact details and city. Our team will respond shortly.',
    },
  };

  try {
    await client.createOrReplace(contactPageData);
    console.log('Contact Page migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
  }
}

migrate();

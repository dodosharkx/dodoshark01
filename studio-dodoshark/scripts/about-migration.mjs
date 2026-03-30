import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

// Robust environment loading
const envPath = path.resolve(process.cwd(), 'front/dodoshark/.env.local');
const envStr = fs.readFileSync(envPath, 'utf8');
const projectId = envStr.match(/NEXT_PUBLIC_SANITY_PROJECT_ID=["']?([^"'\s]+)/)?.[1];
const token = envStr.match(/SANITY_API_EDITOR_TOKEN=["']?([^"'\s]+)/)?.[1];

if (!projectId || !token) {
  console.error('Missing Project ID or Token in', envPath);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset: 'production',
  useCdn: false,
  token,
  apiVersion: '2023-10-25',
});

async function uploadImage(filePath) {
  try {
    const fullPath = path.join(process.cwd(), 'front/dodoshark/public', filePath);
    console.log(`Uploading ${fullPath}...`);
    const buffer = fs.readFileSync(fullPath);
    const asset = await client.assets.upload('image', buffer, {
      filename: path.basename(fullPath),
    });
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error.message);
    return null;
  }
}

async function runMigration() {
  console.log('Starting About Page migration...');

  // Upload all required images
  const heroImage = await uploadImage('/assets/images/factory.jpg');
  const brandStoryThumbnail = await uploadImage('/assets/images/brand/DoDoShark-Brand-cover.jpg');
  const globalLayoutBackgroundImage = await uploadImage('/assets/images/about/global-layout.jpg');
  const teamImage = await uploadImage('/assets/images/about/team.jpg');
  const valuePropositionBackgroundImage = await uploadImage('/assets/images/about/value-proposition.jpg');
  const joinUsImage = await uploadImage('/assets/images/about/join-us.jpg');
  
  const productSystemAgricultureImage = await uploadImage('/assets/images/about/dual-track-agri.jpg');
  const productSystemFoodImage = await uploadImage('/assets/images/about/dual-track-food.jpg');

  const history1 = await uploadImage('/assets/images/about/history-1.jpg');
  const history2 = await uploadImage('/assets/images/about/history-2.jpg');
  const history3 = await uploadImage('/assets/images/about/history-3.jpg');
  const history4 = await uploadImage('/assets/images/about/history-4.jpg');
  const history5 = await uploadImage('/assets/images/about/history-5.jpg');
  const history6 = await uploadImage('/assets/images/about/history-6.jpg');

  const aboutPageData = {
    _id: 'aboutPage',
    _type: 'aboutPage',
    hero: {
      titleLineOne: 'DoDoShark Machinery',
      titleLineTwo: 'Rooted in China',
      titleLineThree: 'Empowering the World',
      description: 'We provide stable, efficient, and worry-free DoDoShark machinery.',
      image: heroImage,
    },
    storyCards: [
      {
        _key: 'card-slogan',
        title: 'Our slogan',
        subtitle: '"Work with Confidence, Reap in Joy"',
        description: 'We aim to build partnerships that transcend equipment, serving every workshop globally with the philosophy of "Work with Confidence, Reap in Joy".',
      },
      {
        _key: 'card-dna',
        title: 'Corporate DNA',
        description: 'With a heritage stemming from a state-owned factory founded in 1970, we carry half a century of engineering depth. DoDoShark Machinery was established in Nanjing in 2019, anchoring our core mission as "Empowering Productivity."',
      },
      {
        _key: 'card-tech',
        title: 'Technical Strength',
        description: 'Our products significantly outperform peers. For instance, our stainless steel crushers were the first to achieve 150-mesh fineness at 1 ton/hour, supporting 12 hours continuous operation, multiplying standard industry efficiency.',
      },
    ],
    brandStoryTitle: 'DoDoShark Brand Story',
    brandStoryVideoUrl: 'https://www.youtube.com/shorts/C_JWSMn42eA',
    productSystemIntro: {
      titleLineOne: 'Dual-Track',
      titleLineTwo: 'Product System',
      description: 'Exceeding industry standards to meet diverse production needs with full-process customized solutions. Seamlessly connecting production segments for maximum efficiency.',
      buttonLabel: 'View Product Matrices',
      buttonHref: '/products',
    },
    productSystems: [
      {
        _key: 'system-agri',
        title: 'Agricultural Processing Machinery',
        description: 'Designed for durability and precision in large-scale agricultural scenarios. Covering cast iron crushers, roller crushers, rice millers, and wheat flour mills.',
        tags: ['Cast Iron Crushers', 'Roller Crushers', 'Rice Millers', 'Wheat Mills'],
        image: productSystemAgricultureImage,
      },
      {
        _key: 'system-food',
        title: 'Food Processing Machinery',
        description: 'Meeting rigorous food production standards with premium materials and precision craftsmanship. Solutions for high-end processing and commercial kitchens.',
        tags: ['Stainless Crushers', 'Industrial Mixers', 'Dough Mixers', 'Juicers'],
        image: productSystemFoodImage,
      },
    ],
    globalLayout: {
      title: 'High-End Talent & Global Layout',
      badge: 'Our Elite Engineering Team',
      descriptionOne: 'Integrating foundational physics, mechanical automation, and IT technology to produce intellectual property. We operate 3 major production bases in Shandong (Jinan, Liaocheng, Weifang) with advanced laser cutting and static pressure casting technologies.',
      descriptionTwo: 'From serving every major city in China to expanding into over a dozen countries globally. DoDoShark stands as a new name card for Intelligent Manufacturing in China.',
      stats: [
        { _key: 'stat-engineers', value: '10+', label: 'Senior Engineers' },
        { _key: 'stat-bases', value: '3', label: 'Production Bases' },
        { _key: 'stat-techs', value: '60+', label: 'Skilled Technicians' },
        { _key: 'stat-clients', value: '100+', label: 'Global Clients' },
      ],
    },
    timelineIntro: {
      titleLineOne: 'The Journey of',
      titleLineTwo: 'DoDoShark',
      description: 'From our state-owned origins to a modern global enterprise. Constantly evolving in reliability and innovation.',
    },
    timeline: [
      {
        _key: 'time-foundation',
        year: '1970 - 2019',
        phase: 'State-Owned Heritage',
        title: 'A Foundation of Engineering',
        description: 'Our predecessor was founded in 1970. Half a century of deep technical accumulation established a solid engineering foundation and robust manufacturing capabilities.',
        image: history1,
      },
      {
        _key: 'time-start',
        year: '2019',
        phase: 'Brand Foundation',
        title: 'The DoDoShark Era Begins',
        description: 'DoDoShark Machinery was officially established in the historical capital of Nanjing, locking its focus on empowering agricultural and food processing productivity.',
        image: history2,
      },
      {
        _key: 'time-iterative',
        year: '2020 - 2021',
        phase: 'Market Roots & Reputation',
        title: 'Iterative Excellence',
        description: 'Leveraged deep technical strength to resolve dozens of common industry crusher issues. Gained a firm market foothold with new models featuring high crushing rates and extreme durability.',
        image: history3,
      },
      {
        _key: 'time-expansion',
        year: '2022 - 2023',
        phase: 'Track Expansion',
        title: 'Dual-Track Business Model',
        description: 'Extended beyond agricultural machinery into stainless steel food crushers and mixers, successfully forming the "Agriculture + Food" dual-track processing layout.',
        image: history4,
      },
      {
        _key: 'time-automation',
        year: '2024 - 2025',
        phase: 'Innovation & Lean Manufacturing',
        title: 'Smart Automation Upgrades',
        description: 'Core products received hardcore upgrades: Intelligent Control + Energy Saving designs. Introduced lean production systems for dual upgrades in quality and efficiency.',
        image: history5,
      },
      {
        _key: 'time-future',
        year: '2026+',
        phase: 'Brand Elevation & Future Outlook',
        title: 'Industry Solution Provider',
        description: 'Evolving from an equipment supplier to a comprehensive industry solutions provider. Opening a new global chapter driven by technological depth and effect-based sales.',
        image: history6,
      },
    ],
    timelineClosing: {
      title: 'Settling in Reliability, Innovating in Evolution.',
      description: 'From a single machine to a diverse ecosystem. We invite you to co-create the future of intelligent manufacturing.',
    },
    cta: {
      eyebrow: 'Value Proposition',
      title: 'Partnerships Beyond Equipment',
      description: 'We have moved beyond simple equipment sales to an "Effect-based Sales" model, providing full life-cycle solutions from process planning to technical implementation. With an industry-leading 10-year warranty on core components, we upgrade short-term cooperation into long-term strategic partnerships.',
      buttonLabel: 'Connect With Us Today',
      buttonHref: '/contact',
      joinUsTitle: 'Join Our Journey',
      joinUsDescription: 'Become part of the global DoDoShark ecosystem.',
    },
    images: {
      brandStoryThumbnail: brandStoryThumbnail,
      globalLayoutBackgroundImage: globalLayoutBackgroundImage,
      teamImage: teamImage,
      valuePropositionBackgroundImage: valuePropositionBackgroundImage,
      joinUsImage: joinUsImage,
    }
  };

  await client.createOrReplace(aboutPageData);
  await client.createOrReplace({ ...aboutPageData, _id: 'drafts.aboutPage' });
  console.log('About Page migration completed successfully (with keys and draft)!');
}

runMigration().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

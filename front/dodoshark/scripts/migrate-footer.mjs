import { readFile } from 'fs/promises';
import { basename } from 'path';

// Values from .env.local
const PROJECT_ID = "nljl95h9";
const DATASET = "production";
const TOKEN = "sk8wdsPDTOuC2FCJ4R8YCy3cGRihrEAaA4Mq4rmXlXPLS59WpUqt6nbQjd1UUz2GqbiF3i0KNEdn23VqmSxOUH2lf9P6NwQkfhWZsjVVbaOAoo7mwpatl8vlVAreYGKFacGnNNZ7f6tY7pgzbYU3MLbVf4TAtTf2DwxbGQDdIvVy5H7bgwA1";

const DOC_ID = "globalSettings";
const API_VERSION = "v2025-01-01";

async function run() {
  console.log("Starting comprehensive footer/contact content migration...");

  try {
    // 1. Upload Map Image
    console.log("Uploading footer-map-image.png...");
    const imagePath = "public/assets/images/background/footer-map-image.png";
    const imageBuffer = await readFile(imagePath);
    const uploadRes = await fetch(`https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/assets/images/${DATASET}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "image/png"
      },
      body: imageBuffer
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Image upload failed: ${errorText}`);
    }

    const imageData = await uploadRes.json();
    const assetId = imageData.document._id;
    console.log(`Image uploaded successfully! Asset ID: ${assetId}`);

    // 2. Patch globalSettings document
    console.log(`Patching ${DOC_ID} with all footer and contact fields...`);
    const patchPayload = {
      mutations: [
        {
          patch: {
            id: DOC_ID,
            setIfMissing: {
              footer: {},
              contact: {}
            },
            set: {
              // Footer Text
              "footer.headquartersKicker": "Headquarters",
              "footer.headquartersTitle": "DoDoShark",
              "footer.headquartersBody": "Located in Nanjing, Jiangsu, China.\nDoDoShark is a brand of Nanjing Heici Machinery Co., Ltd.",
              "footer.phoneLabel": "Phone",
              "footer.emailLabel": "Email",
              "footer.websiteLabelTitle": "Website",
              "footer.networkKicker": "Regional Coverage",
              "footer.networkTitle": "Our Network",
              "footer.networkItems": [
                "Customers cover 1,000+ cities across China",
                "Business operations cover 12+ countries worldwide",
                "Three major production bases: Jinan / Liaocheng / Weifang"
              ],
              "footer.socialKicker": "Stay Connected",
              "footer.socialTitle": "Follow Us",
              "footer.copyrightText": "© 2026 DoDoShark. All rights reserved.",
              
              // Footer Map
              "footer.footerMap": {
                "_type": "object",
                "ariaLabel": "Worldwide customer distribution map",
                "image": {
                  "_type": "image",
                  "alt": "World map showing DoDoShark global presence",
                  "asset": {
                    "_type": "reference",
                    "_ref": assetId
                  }
                }
              },

              // Contact Details (Synced with Footer contact list)
              "contact.phone": "+86 19941519694",
              "contact.email": "sales@dodoshark.com",
              "contact.supportEmail": "support@dodoshark.com",
              "contact.websiteLabel": "www.dodoshark.com",
              "contact.websiteUrl": "https://www.dodoshark.com"
            }
          }
        }
      ]
    };

    const patchRes = await fetch(`https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/mutate/${DATASET}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patchPayload)
    });

    if (!patchRes.ok) {
      const errorText = await patchRes.text();
      throw new Error(`Patch failed: ${errorText}`);
    }

    const patchData = await patchRes.json();
    console.log("Migration completed successfully!", JSON.stringify(patchData, null, 2));

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

run();

const https = require('https');
const fs = require('fs');

const config = {
  projectId: 'nljl95h9',
  dataset: 'production',
  token: 'sk8wdsPDTOuC2FCJ4R8YCy3cGRihrEAaA4Mq4rmXlXPLS59WpUqt6nbQjd1UUz2GqbiF3i0KNEdn23VqmSxOUH2lf9P6NwQkfhWZsjVVbaOAoo7mwpatl8vlVAreYGKFacGnNNZ7f6tY7pgzbYU3MLbVf4TAtTf2DwxbGQDdIvVy5H7bgwA1',
  apiVersion: 'v2024-01-01'
};

async function apiRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${config.projectId}.api.sanity.io`,
      path: `/${config.apiVersion}${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 400) reject(json);
          else resolve(json);
        } catch (e) { resolve(data); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  try {
    console.log('Fetching solution documents for repair...');
    const query = '*[_type == "solution" && (defined(htmlTemplate.html) || defined(htmlTemplate.customCss))] { _id, htmlTemplate }';
    const res = await apiRequest('GET', `/data/query/${config.dataset}?query=${encodeURIComponent(query)}`);
    
    if (!res.result || res.result.length === 0) {
      console.log('No documents found requiring repair.');
      return;
    }

    const mutations = [];
    for (const doc of res.result) {
      const patch = { id: doc._id, set: {} };
      let changed = false;

      if (doc.htmlTemplate?.html && (typeof doc.htmlTemplate.html !== 'object' || doc.htmlTemplate.html._type !== 'code')) {
        const codeValue = typeof doc.htmlTemplate.html === 'object' ? doc.htmlTemplate.html.code : doc.htmlTemplate.html;
        patch.set['htmlTemplate.html'] = {
          _type: 'code',
          code: codeValue || '',
          language: 'html'
        };
        changed = true;
      }

      if (doc.htmlTemplate?.customCss && (typeof doc.htmlTemplate.customCss !== 'object' || doc.htmlTemplate.customCss._type !== 'code')) {
        const cssValue = typeof doc.htmlTemplate.customCss === 'object' ? doc.htmlTemplate.customCss.code : doc.htmlTemplate.customCss;
        patch.set['htmlTemplate.customCss'] = {
          _type: 'code',
          code: cssValue || '',
          language: 'css'
        };
        changed = true;
      }

      if (changed) {
        mutations.push({ patch });
        console.log(`Prepared repair for document ${doc._id}`);
      }
    }

    if (mutations.length > 0) {
      console.log(`Applying ${mutations.length} mutations...`);
      const result = await apiRequest('POST', `/data/mutate/${config.dataset}`, { mutations });
      console.log('Repair completed successfully!');
    } else {
      console.log('All found documents are already well-formed.');
    }
  } catch (err) { console.error('Repair failed:', err); }
}

run();

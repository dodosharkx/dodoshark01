const fs = require('fs')
const path = 'd:/new-website/final-3.9/front/dodoshark/app/products/[slug]/page.tsx'
let text = fs.readFileSync(path, 'utf8')
text = text.replace(/`r`n/g, '')
fs.writeFileSync(path, text)

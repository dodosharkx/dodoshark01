const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:\\new-website\\final-3.9\\www.dodoshark.vip-20260329T014712.json', 'utf8'));

let out = '';
out += '=== SCORES ===\n';
for (const [k, v] of Object.entries(data.categories || {})) {
    out += `${v.title}: ${Math.round(v.score * 100)}\n`;
}

out += '\n=== METRICS ===\n';
const metrics = ['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index', 'interactive'];
for (const m of metrics) {
    if (data.audits[m]) out += `- ${data.audits[m].title}: ${data.audits[m].displayValue} (Score: ${data.audits[m].score})\n`;
}

out += '\n=== OPPORTUNITIES ===\n';
for (const [k, v] of Object.entries(data.audits || {})) {
    if (v.score !== null && v.score < 0.9 && v.details && v.details.type === 'opportunity') {
        let s = '';
        if (v.details.overallSavingsMs) s += `[Ms: ${Math.round(v.details.overallSavingsMs)}] `;
        if (v.details.overallSavingsBytes) s += `[Bytes: ${Math.round(v.details.overallSavingsBytes)}]`;
        out += `- ${v.title} (${k}): ${s.trim()}\n`;
    }
}

out += '\n=== FAILED AUDITS & DIAGNOSTICS (Score < 0.9) ===\n';
for (const [k, v] of Object.entries(data.audits || {})) {
    if (v.score !== null && v.score !== undefined && v.score < 0.9 && (!v.details || v.details.type !== 'opportunity')) {
        out += `- ${v.title} (${k}) Score: ${v.score}\n`;
        if (v.displayValue) {
            out += `  Value: ${v.displayValue}\n`;
        }
    }
}

fs.writeFileSync('d:\\new-website\\final-3.9\\parse_result.txt', out);

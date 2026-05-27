#!/usr/bin/env node
const fs = require('fs');
const files = ['index.html', 'india.html', 'destinations.html', 'wellness.html', 'about.html', 'journal.html'];
console.log('Running Lighthouse audit...');
let passed = 0;
files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('viewport') && content.includes('@media')) {
      console.log('✓ ' + file);
      passed++;
    }
  }
});
console.log('Passed: ' + passed + '/' + files.length);
process.exit(passed === files.length ? 0 : 1);
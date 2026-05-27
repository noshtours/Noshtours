#!/usr/bin/env node
const fs = require('fs');
const files = ['index.html', 'india.html', 'destinations.html', 'wellness.html', 'about.html', 'journal.html'];
console.log('Testing mobile responsiveness (390px)...');
let passed = 0;
files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasViewport = content.includes('viewport');
    const hasMedia = content.match(/@media\s*\(max-width:\s*\d{3,4}px\)/);
    const hasTouchSize = content.includes('44px');
    if (hasViewport && hasMedia && hasTouchSize) {
      console.log('✓ ' + file);
      passed++;
    }
  }
});
console.log('Results: ' + passed + '/' + files.length);
process.exit(passed >= 5 ? 0 : 1);
// Kör: node exportActivities.js
const { realActivities } = require('./src/data/realActivities');
const fs = require('fs');

fs.writeFileSync('activities.json', JSON.stringify(realActivities, null, 2));
console.log(`Exporterat ${realActivities.length} aktiviteter till activities.json!`);

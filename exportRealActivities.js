
const fs = require('fs');
const realActivities = require('./src/data/realActivities').realActivities;

fs.writeFileSync('realActivities.json', JSON.stringify(realActivities, null, 2));
console.log('✅ Export klar: realActivities.json');

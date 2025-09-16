// Kör: npx ts-node exportActivities.ts
import { realActivities } from './src/data/realActivities';
import * as fs from 'fs';

fs.writeFileSync('activities.json', JSON.stringify(realActivities, null, 2));
console.log(`Exporterat ${realActivities.length} aktiviteter till activities.json!`);

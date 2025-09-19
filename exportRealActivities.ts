import { realActivities } from './src/data/realActivities';
import * as fs from 'fs';

fs.writeFileSync('realActivities.json', JSON.stringify(realActivities, null, 2));
console.log('✅ Export klar: realActivities.json');

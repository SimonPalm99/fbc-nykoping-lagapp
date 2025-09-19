const fs = require('fs');
const path = require('path');

const tsFile = path.join(__dirname, 'src', 'data', 'realActivities.ts');
const outFile = path.join(__dirname, 'realActivities.json');

const tsContent = fs.readFileSync(tsFile, 'utf8');

// Plocka ut JSON-arrayen ur exporten
const match = tsContent.match(/export const realActivities: Activity\[] = ([\s\S]*?);\n/);
if (!match) {
  console.error('❌ Kunde inte hitta realActivities-arrayen i TypeScript-filen!');
  process.exit(1);
}

let activitiesRaw = match[1];
// Ta bort eventuella trailing-kommentarer och export
activitiesRaw = activitiesRaw.replace(/\nexport .*/, '').trim();

// Försök att parsa till JSON
try {
  const activities = eval(activitiesRaw); // OBS! Endast säkert om du litar på filen
  fs.writeFileSync(outFile, JSON.stringify(activities, null, 2));
  console.log('✅ Export klar: realActivities.json');
} catch (err) {
  console.error('❌ Fel vid parsing:', err);
}

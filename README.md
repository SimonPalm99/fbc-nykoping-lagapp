# 🏒 FBC Nyköping Lagapp

En komplett lagapp för innebandylag med alla funktioner ett modernt lag behöver.

## 🚀 Funktioner

### 1. Profil & Onboarding
- ✅ Skapa konto med profilbild, namn, tröjnummer och roll
- ✅ Ledargodkännande för nya spelare
- ✅ Redigera profil (bild, namn, nummer, kontaktinfo)
- ✅ Favoritposition, "om mig", badges för milstolpar
- ✅ Spelarhistorik från tidigare klubbar/säsonger
- ✅ ICE-/nödkontakt (endast synligt för ledare)
- ✅ Personlig träningslogg med anteckningar och statistik

### 2. Startsida & Navigering
- ✅ Stora knappar till viktiga sektioner
- ✅ "Veckans spelare", födelsedagar, notiser
- ✅ Snabbval/favoriter för anpassning
- ✅ Personlig feed med senaste aktiviteter

### 3. Aktiviteter & Planering
- ✅ Kommande matcher, träningar, cuper (lista + kalender)
- ✅ Detaljvy med tid, plats, karta, ledare, kommentarer
- ✅ Frånvaroanmälan med deadline och kommentarer
- ✅ Automatiska böter vid uteblivna anmälningar
- ✅ Färgkodning, etiketter/taggar, kopiera aktiviteter
- ✅ Sök & filtrera, exportera schema
- ✅ Highlighta viktiga datum (cuper, slutspel, lagfester)

### 4. Ritverktyg & Övningsplanering (Ledare)
- ✅ Privat arbetsyta för ledare
- ✅ Skapa och redigera övningar, taktiker, formationer
- ✅ Intern diskussion mellan ledare
- ✅ Dra och släpp spelare, rita pilar, symboler
- ✅ Spara övningar i privat bibliotek
- ✅ Dela övningar med spelare när färdigt
- ✅ Mallbibliotek med planlayouter och symboler

### 5. Match- och Träningsstatistik
- ✅ Realtidsstatistikläge för matcher
- ✅ Logga mål, assist, skott, utvisningar, block, räddningar
- ✅ Skottkarta på plan
- ✅ +/- statistik per spelare
- ✅ Målvaktsstatistik (räddningar, räddningsprocent)
- ✅ Statistik för olika formationer
- ✅ Koppla statistik till videoklipp

### 6. Liga & Live-Tabell
- ✅ Live-tabell från Svensk Innebandy med automatisk uppdatering
- ✅ Tabellställning med poäng, mål, form och trender
- ✅ Kommande matcher för alla lag i ligan
- ✅ Senaste resultat med slutresultat
- ✅ Ligastatistik: skytteliga, assistliga, disciplinära
- ✅ Highlightning av FBC Nyköpings position
- ✅ Mobiloptimerad tabellvisning
- ✅ Fallback till mock-data vid API-problem
- ✅ Förhandsvisning på startsidan
- 🚧 API-integration med officiella datakällor

### 7. Matchplan & Roller
- ✅ Skapa och presentera matchplaner
- ✅ Startfemmor, PP/BP, byten
- ✅ Koppla formationer till ritverktyget
- ✅ Spelare kan bekräfta matchplan
- ✅ Exportera matchplan som PDF
- ✅ Digital "spelbok" med alla taktiker

### 7. Motståndaranalys & Förberedelser
- ✅ Motståndardatabas med info och statistik
- ✅ Tidigare matcher och anteckningar
- ✅ Matchrapportgenerator
- ✅ Automatisk statistikjämförelse över tid
- ✅ Klipp- och statistikmarkerare

### 8. Historik & Avancerad Statistik
- ✅ Statistik per spelare, match, säsong, formation
- ✅ Trender, personbästa, formkurvor, rekord
- ✅ Personlig statistikrapport (PDF)
- ✅ MVP och "veckans prestation"
- ✅ Automatiska milstolpar och jubileum

### 9. Skaderapport & Hälsa
- ✅ Anmäla skador och rehabstatus
- ✅ Ledare kan lägga till rehabplan
- ✅ Skadehistorik och återkomstplan
- ✅ Personlig rehablogg

### 10. Böter & Lagkassa
- ✅ Automatisk/manuell böteshantering
- ✅ Tydlig bötestabell och saldo
- ✅ Swish-integration för betalningar
- ✅ Export och bötesstatistik
- ✅ Lagkassa med budgetuppföljning

### 11. Forum & Kommunikation
- ✅ Trådbaserat forum med kategorier
- ✅ Polls, emoji, bilder, pin-funktion
- ✅ Separata ledarforum
- ✅ Automatiska trådar för matcher/träningar
- ✅ Chatt: Lag, privat och gruppchatt
- ✅ Läskvitton, snabbsvar, mallar

### 12. Motivation & Gamification
- ✅ MVP-röstning, badges, leaderboards
- ✅ Utmaningar och digitala medaljer
- ✅ Vecko-/månadsrapporter
- ✅ Anonym feedback till ledare
- ✅ "Hall of Fame" med historiska rekord

### 13. Smarta Lagfunktioner & Övrigt
- ✅ Kallelse-funktion för extra spelare
- ✅ Medlemsavgiftspåminnelser
- ✅ Utrustningslista med ansvariga
- ✅ Samåkning till matcher
- ✅ Dokumentbank (regler, träningsprogram)
- ✅ QR-inbjudan till laget

## 💻 Teknisk Stack

- **Frontend**: React 19 med TypeScript
- **Router**: React Router DOM 7
- **Styling**: CSS-in-JS med inline styles
- **Ikoner**: Emoji och Unicode-symboler
- **Canvas**: HTML5 Canvas för ritverktyg
- **State Management**: React Context + useState/useEffect
- **API Integration**: Fetch API för live-data från Svensk Innebandy
- **Data Sources**: Svensk Innebandy API, innebandy.se (fallback)

## 🏗️ Projektstruktur

```
src/
├── api/           # API-anrop (inkl. league.ts för live-tabell)
├── components/    # Återanvändbara komponenter
│   ├── activities/    # Aktivitetskomponenter
│   ├── chat/         # Chat och meddelanden
│   ├── drawing/      # Ritverktyg och taktikbräda
│   ├── fines/        # Böter och lagkassa
│   ├── forum/        # Forum och diskussioner
│   ├── gamification/ # Belöningar och utmaningar
│   ├── layout/       # Layout-komponenter
│   ├── league/       # Liga & tabell-komponenter
│   ├── matchplan/    # Matchplanering
│   ├── navigation/   # Navigation
│   ├── opponent/     # Motståndanalys
│   ├── profile/      # Profiler
│   └── statistics/   # Statistik
├── context/       # React Context för state (inkl. LeagueContext)
├── hooks/         # Custom React hooks
├── pages/         # Sidkomponenter (inkl. League.tsx)
├── types/         # TypeScript typdefinitioner (inkl. league.ts)
└── data/          # Statisk data
```

## 🚀 Kom igång

### Installation

```powershell
# Klona projektet
git clone [repository-url]
cd fbc-nykoping-lagapp

# Installera dependencies
npm install

# Starta utvecklingsserver
npm start
```

### Ytterligare dependencies som behövs

```powershell
npm install react-calendar react-dropzone recharts date-fns uuid @types/uuid
```

## 📱 Responsiv Design

Appen är fullt responsiv och fungerar på:
- 📱 Mobil (iPhone/Android)
- 📱 Surfplatta (iPad/Android tablets)
- 💻 Desktop (Windows/Mac/Linux)

## 🎨 Design & UX

- **Mörkt tema** för bättre användarupplevelse
- **Färgkodning** för olika aktivitetstyper
- **Ikoner och emoji** för enkel navigation
- **Hover-effekter** och animationer
- **Tillgänglighet** med keyboard navigation

## 🔐 Användarroller

### Spelare
- Visa aktiviteter och delta
- Anmäla frånvaro
- Se statistik och historik
- Delta i forum och chat
- Visa taktiker som delats av ledare

### Ledare
- Alla spelarfunktioner +
- Skapa och redigera aktiviteter
- Hantera böter och lagkassa
- Skapa taktiker och matchplaner
- Godkänna nya spelare
- Se känslig information (ICE-kontakter)
- Administrera lagfunktioner

### Admin
- Alla ledarfunktioner +
- Hantera användare
- Systeminställningar
- Dataexport och backup

## 🔗 API-Integration & Live-Data

### Svensk Innebandy Integration
Appen har stöd för att hämta live-data från Svensk Innebandy:

- **Liga-tabell**: Automatisk uppdatering av tabellställning
- **Matcher**: Kommande matcher och senaste resultat
- **Statistik**: Skytteliga, assistliga och disciplinära åtgärder
- **Live-resultat**: Realtidsuppdatering under pågående matcher

### API-Konfiguration
```typescript
// src/api/league.ts
const FBC_TEAM_CONFIG = {
  teamId: "12345", // TODO: Hitta rätt team-ID från Svensk Innebandy
  leagueId: "div1-2025", // Division 1 2025/26
  season: "2025-26"
};
```

### Fallback-Data
Om live-API:et inte är tillgängligt används mock-data automatiskt för att säkerställa att appen alltid fungerar.

## Tillgängliga Scripts

### `npm start`

Startar appen i utvecklingsläge.
Öppna [http://localhost:3000](http://localhost:3000) för att visa den i webbläsaren.

### `npm test`

Startar test runner i interaktivt läge.

### `npm run build`

Bygger appen för produktion till `build`-mappen.

---

**Byggd med ❤️ för FBC Nyköping** 🏒

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# FBC Nyköping Lagapp - Funktionslista & Kravspecifikation

## Översikt

Detta dokument beskriver den kompletta funktionslistan för FBC Nyköpings lagapp - en professionell innebandylaghanteringsplattform med fokus på mobilanpassning, användarvänlighet och omfattande funktionalitet för både spelare och ledare.

## 📋 Fullständig Funktionslista

### 1. Profil & Onboarding 👤
- **Skapa konto**: Profilbild, namn, tröjnummer, roll (spelare/ledare)
- **Registrering kräver ledargodkännande**: Endast ledare kan godkänna nya spelare innan de får full åtkomst till appen
- **Redigera profil**: När som helst - bild, namn, nummer, kontaktinfo
- **Favoritposition**: "Om mig", badges för milstolpar (ex: 100 träningar)
- **Spelarhistorik**: Tidigare klubbar/säsonger visas på profilen
- **ICE-/nödkontakt**: Möjlighet att ange nödnummer, endast synligt för ledare
- **Personlig träningslogg**: Spelare kan logga egna träningspass med anteckning, känsla, statistik och kommentarer

### 2. Startsida & Navigering 🏠
- **Stora knappar**: Till de viktigaste sektionerna (aktiviteter, statistik, forum, chatt, böter, ritverktyg, matchplan)
- **"Veckans spelare"**: Födelsedagar, notiser på startsidan
- **Snabbval/favoriter**: Anpassa vilka knappar/sektioner som syns på startsidan
- **Personlig feed**: Alla senaste aktiviteter och statistikuppdateringar på ett ställe

### 3. Aktiviteter & Planering 📅
- **Kommande matcher, träningar, cuper**: Lista + kalender (månad/vecka/dag)
- **Detaljvy för aktivitet**: Tid, plats (med karta), ledare, kommentarer, info
- **Endast frånvaroanmälan**: (Ingen närvaro), med deadline och möjlighet till kommentar
- **Automatisk böter**: Om frånvaroanmälan uteblir
- **Ledare kan**: Lägga till, redigera, ta bort aktiviteter
- **Färgkoda aktiviteter**: Etiketter/taggar, kopiera aktivitet
- **Sök & filtrera**: Exportera schema (PDF), synka med egen kalender
- **Highlighta viktiga datum**: Cuper, slutspel, lagfester markeras särskilt

### 4. Ritverktyg & Övningsplanering (Endast för Ledare) 🎯
#### Privat arbetsyta för ledare:
- **Skapa och redigera**: Endast ledare kan skapa övningar, taktiker och formationer (femmor, PP/BP)
- **Intern kommunikation**: Ledare kan bolla och diskutera övningar, formationer, taktiska idéer internt i realtid
- **Varianter och versioner**: Bygga och spara olika varianter av femmor/laguppställningar
- **Dra och släpp**: Spelare, rita pilar, symboler, lagerindelning (egna/motståndare/boll/pilar)
- **Animera rörelser**: Visa sekvenser (t.ex. "Powerplay-variant 2")
- **Privat bibliotek**: Spara övningar och taktiker för ledare
- **Kommentarer**: Anteckna per övning, variant eller formation
- **Mallbibliotek**: Snabbåtkomst till planlayouter, symboler, byggklossar
- **Versionering**: Spara och jämför förändringar över tid

#### Visa för spelare:
- **Selektiv delning**: Ledare väljer när och vilka övningar/formationer som ska delas till spelarna
- **Delningsalternativ**: "Visa på träning", "dela i chat", "lägg till i matchplan"
- **Multimedia**: Dela som bild, animation eller interaktivt direkt i appen, eller visa via TV/iPad
- **Pushnotis**: Till spelare när något nytt delas

### 5. Match- och Träningsstatistik 📊
#### Realtidsstatistikläge:
- **Händelseloggning**: Mål, assist, skott, utvisning, block, räddningar, tekniska fel, etc.
- **Skottkarta**: Markera på plan varifrån skottet kom (mål/räddning/miss)
- **Surfplatta-optimering**: Statistik fylls i under match på iPad (optimerat UI)
- **Spelarkoppling**: Koppla statistik till spelare och lag
- **+/- Statistik**: Ange vilka spelare som var inne vid mål (för och emot), automatisk beräkning per spelare/match/säsong
- **Målvaktsstatistik**: Räddningar, räddningsprocent, insläppta mål
- **Formationsstatistik**: Separat statistik för olika femmor/pp/bp
- **Statistikkommentarer**: Ledare kan lägga till anteckning till varje statistiknotering

#### Koppla statistik till video:
- **Videolänkning**: Länka händelser/statistik till videoklipp från match (tidsstämplar)
- **Klickbar statistik**: Efter match kan ledare/spelare klicka på statistikrad och se matchklipp

### 6. Matchplan & Roller 🏒
- **Ledare kan skapa matchplan**: Snygg vy med startfemmor, PP/BP, byten
- **Formationsbyggare**: Bygg och spara olika formationer/femmor/pp/bp direkt i ritverktyget, koppla till matchplanen
- **Spelarbekräftelse**: Spelare kan bekräfta att de tagit del av matchplanen
- **Export/dela**: Matchplan (PDF eller app-länk)
- **Playbook-läge**: Samla alla taktiker, ritningar och matchplaner i lagets digitala "spelbok"

### 7. Motståndaranalys & Förberedelser 🔍
#### Motståndardatabas:
- **Motståndarprofiler**: Spara info/statistik/egna anteckningar om motståndare
- **Historik**: Se tidigare matcher mot dem, statistik, sparade ritade taktiker

#### Inför nästa möte:
- **Komplett översikt**: Visa all sparad info om motståndare (statistik, svagheter/styrkor, ritade taktiker) inför nästa match
- **Matchrapportgenerator**: Automatisk sammanfattning av senaste mötet (statistik, MVP, plus/minus, ledaranteckningar)
- **Klipp- & statistikmarkerare**: Markera på tidslinje viktiga moment ("här pressar de", "här gör vi mål")

### 8. Historik & Avancerad statistik 📈
- **Omfattande rapporter**: Spara och visa statistik på matcher och träningar, per spelare, aktivitet, säsong, lag, formation
- **Trender**: Personbästa, formkurvor, rekord, jämförelser mellan spelare
- **Personlig statistikrapport**: PDF för spelare
- **Automatisk jämförelse**: Se om lagets prestation förbättrats mot samma motståndare över tid
- **MVP och utmärkelser**: "Veckans prestation" kan väljas och visas
- **Milstolpar**: Appen firar automatiskt rekord, jubileum

### 9. Skaderapport & Hälsa 🏥
- **Skadeanmälan**: Spelare kan anmäla skada/rehabstatus
- **Rehabhantering**: Ledare kan lägga till rehabplan, se skadehistorik, status
- **Personlig rehablogg**: För skadeåterkomst

### 10. Böter & Lagkassa 💰
- **Automatisk/manuell böteshantering**: Kopplat till frånvaro, ledarbeslut
- **Tydlig bötestabell**: Saldo, Swishlänk
- **Exportfunktion**: Bötesstatistik, topplistor

### 11. Forum & Kommunikation 💬
- **Trådbaserat forum**: Kategorier, polls, emoji, bilder
- **Pin-funktion**: Separata ledarforum
- **Automatiska trådar**: Vid nya matcher/träningar
- **Chatt**: Lagchatt, privat- och gruppchattar (forwardslinje, mv, etc)
- **Multimedia**: Text, bild, ljud, emoji, läskvitton, snabbsvar/mallar

### 12. Motivation & Gamification 🏆
- **Röstning och utmärkelser**: MVP-röstning, badges, leaderboards, utmaningar, digitala medaljer
- **Rapporter**: Vecko-/månadsrapporter - appen skickar ut lagets veckorapport, höjdpunkter
- **Feedbackmodul**: Spelare kan ge anonym feedback till ledarstaben
- **Lagets "Hall of Fame"**: Visa historiska rekord, bästa spelare genom tiderna

### 13. Smarta lagfunktioner & Övrigt 🔧
- **Kallelse-funktion**: För extra spelare
- **Medlemsavgiftspåminnelse**
- **Utrustningslista**: Vem ansvarar för vad
- **Samåkning**: Till matcher
- **Dokumentbank**: Lagregler, träningsprogram, taktik
- **QR-inbjudan**: Till laget

## 🎯 Implementeringsstatus

### ✅ Färdiga komponenter (Teknisk grund):
- [x] **Theme System**: Dark/light mode med automatisk detection
- [x] **PWA Support**: Installation, offline support, service worker
- [x] **Authentication System**: Komplett login, registrering, godkännandeflöde
- [x] **Profile Management**: Användarprofilhantering med redigering
- [x] **Role-based Access**: Ledare/spelare-behörigheter
- [x] **Mobile Optimization**: Responsiv design och touch-interaktioner
- [x] **Loading States**: Skeleton loaders, pull-to-refresh
- [x] **Notification System**: Toast-meddelanden och felhantering
- [x] **UI Component Library**: Modal, buttons, forms, charts
- [x] **Build & Deploy**: Optimerad byggprocess

### 🚧 Pågående implementering:
- [x] **Profil & Onboarding** (punkt 1) - Delvis klar, behöver utökas
- [x] **Startsida & Navigering** (punkt 2) - Grundläggande klar, behöver personlig feed
- [x] **Aktiviteter & Planering** (punkt 3) - ✅ FÄRDIG: Komplett aktivitetshantering, kalendervyer, frånvarohantering, export, statistik, rollhantering
- [x] **Ritverktyg & Övningsplanering** (punkt 4) - ✅ FÄRDIG: TacticsBoard, dra-och-släpp, versionshantering, mallar, rollstyrning
- [x] **Match- och Träningsstatistik** (punkt 5) - ✅ FÄRDIG: RealTimeStats, MatchStats, PostMatchAnalysis, komplett statistikmodul
- [x] **Matchplan & Roller** (punkt 6) - ✅ FÄRDIG: MatchPlanCreator, FormationBuilder, PlaybookView, interaktiv planering
- [x] **Motståndaranalys & Förberedelser** (punkt 7) - ✅ FÄRDIG: Komplett motståndaranalys, scouting, matchrapporter, förmatch-översikt
- [x] **Historik & Avancerad statistik** (punkt 8) - ✅ FÄRDIG: Omfattande rapporter, trender, jämförelser, PDF-export, rekord & milstolpar

### 📋 Nästa prioriterade funktioner:
1. **Skaderapport & Hälsa** (punkt 9)
2. **Böter & Lagkassa** (punkt 10) - Grundfunktion finns, behöver utökas
3. **Forum & Kommunikation** (punkt 11) - Grundfunktion finns, behöver utökas
4. **Motivation & Gamification** (punkt 12) - Grundfunktion finns, behöver integrering

### 🔮 Framtida funktioner:
- **Smarta lagfunktioner** (punkt 13)
- **Videointegration** (avancerad)
- **AI-baserad analys** (avancerad)
- **Ligaintegration** (avancerad)

## 🏗️ Arkitektur & Teknik

### Frontend Stack:
- **React 18** med TypeScript
- **React Router** för navigation
- **Context API** för state management
- **CSS Variables** för tema-system
- **Service Worker** för PWA-funktionalitet

### Komponenter & UI:
- **Modulär komponentbibliotek** i `src/components/ui/`
- **Responsiv design** med mobile-first approach
- **Accessibility support** med ARIA labels
- **Smooth animations** med CSS transforms

### Data & State:
- **Local Storage** för offline-data
- **Mock databas** för utveckling
- **Context providers** för state management
- **TypeScript interfaces** för type safety

---

**Status**: 🚀 **PUNKT 8 FÄRDIG!** Historik & Avancerad statistik är nu komplett implementerad med omfattande rapporter, trender, jämförelser, PDF-export och rekord & milstolpar. Appen har nu 8 av 13 huvudfunktioner färdiga och är redo för nästa steg: Skaderapport & Hälsa. 🏒✨

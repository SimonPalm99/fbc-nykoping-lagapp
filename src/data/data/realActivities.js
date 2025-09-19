"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.activities = exports.realActivities = void 0;
// Generera träningar för hela säsongen
function generateTrainings() {
    var startDate = new Date('2025-07-28');
    var endDate = new Date('2026-03-14');
    var daysOfWeek = [
        { day: 1, start: '20:30', end: '22:00', label: 'Måndag' },
        { day: 2, start: '19:30', end: '20:45', label: 'Tisdag' },
        { day: 4, start: '20:45', end: '22:00', label: 'Torsdag' }
    ];
    var trainings = [];
    for (var d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        for (var _i = 0, daysOfWeek_1 = daysOfWeek; _i < daysOfWeek_1.length; _i++) {
            var info = daysOfWeek_1[_i];
            if (d.getDay() === info.day) {
                var yyyy = d.getFullYear();
                var mm = String(d.getMonth() + 1).padStart(2, '0');
                var dd = String(d.getDate()).padStart(2, '0');
                trainings.push({
                    id: "training-".concat(yyyy).concat(mm).concat(dd, "-").concat(info.label),
                    title: "Tr\u00E4ning ".concat(info.label),
                    type: 'träning',
                    date: "".concat(yyyy, "-").concat(mm, "-").concat(dd),
                    startTime: info.start,
                    // ingen sluttid på träning
                    location: 'Sporthallen',
                    description: "".concat(info.label, " (").concat(yyyy, "-").concat(mm, "-").concat(dd, ") \u2022 Samlingstid 30 min innan"),
                    createdBy: 'coach1',
                    participants: [],
                    comments: [],
                    tags: ['ordinarie'],
                    important: false
                });
            }
        }
    }
    return trainings;
}
// Matcher
var matches = [
    {
        id: "friendly-20250809",
        title: "FBC Nyköping vs Ledberg Innebandy",
        type: "match",
        date: "2025-08-09",
        startTime: "14:00",
        // ingen sluttid på matcher
        location: "Gnesta Sporthall",
        description: "Träningsmatch. Samling 12:30 (1,5 timme före matchstart).",
        createdBy: "coach1",
        participants: [],
        comments: [],
        tags: ["träningsmatch", "förberedelse"],
        important: false,
        color: "#4CAF50"
    },
    {
        id: "friendly-20250816",
        title: "FBC Nyköping vs Linköping Innebandy",
        type: "match",
        date: "2025-08-16",
        startTime: "14:00",
        // ingen sluttid på matcher
        location: "Nyköpings Sporthall",
        description: "Träningsmatch på hemmaplan. Samling 12:30 (1,5 timme före matchstart).",
        createdBy: "coach1",
        participants: [],
        comments: [],
        tags: ["träningsmatch", "hemma"],
        important: false,
        color: "#4CAF50"
    },
    {
        id: "friendly-20250823",
        title: "Bergs IK vs FBC Nyköping",
        type: "match",
        date: "2025-08-23",
        startTime: "13:00",
        // ingen sluttid på matcher
        location: "Vasa Arena",
        description: "Träningsmatch på bortaplan. Samling 11:30 (1,5 timme före matchstart).",
        createdBy: "coach1",
        participants: [],
        comments: [],
        tags: ["träningsmatch", "borta"],
        important: false,
        color: "#4CAF50"
    },
    {
        id: "friendly-20250912",
        title: "Åby Oilers IBK vs FBC Nyköping",
        type: "match",
        date: "2025-09-12",
        startTime: "19:00",
        // ingen sluttid på matcher
        location: "Åby Arena",
        description: "Träningsmatch inför säsongsstart. Samling 17:30 (1,5 timme före matchstart).",
        createdBy: "coach1",
        participants: [],
        comments: [],
        tags: ["träningsmatch", "borta", "förberedelse"],
        important: false,
        color: "#4CAF50"
    },
    {
        id: "match-580032005",
        title: "Älvsjö AIK IBF vs FBC Nyköping",
        type: "match",
        date: "2025-09-20",
        startTime: "15:00",
        // ingen sluttid på matcher
        location: "Älvsjö Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 1. Säsongsöppnare på bortaplan!",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch", "säsongsöppnare"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032009",
        title: "FBC Nyköping vs Åkersberga IBF",
        type: "match",
        date: "2025-09-27",
        startTime: "15:00",
        // ingen sluttid på matcher
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 2. Första hemmamatch för säsongen!",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch", "första-hemma"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032018",
        title: "FBC Sollentuna vs FBC Nyköping",
        type: "match",
        date: "2025-10-04",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sollentuna Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 3. Bortamatch mot FBC Sollentuna.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032019",
        title: "FBC Nyköping vs Rosersberg Arlanda IBK",
        type: "match",
        date: "2025-10-11",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 4. Hemmamatch mot Rosersberg Arlanda IBK.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032026",
        title: "Huddinge IBS vs FBC Nyköping",
        type: "match",
        date: "2025-10-25",
        startTime: "15:00",
        endTime: "16:30",
        location: "Huddinge Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 5. Bortamatch mot Huddinge IBS.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032034",
        title: "FBC Nyköping vs Hässelby SK IBK",
        type: "match",
        date: "2025-11-01",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 6. Hemmamatch mot Hässelby SK IBK.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032041",
        title: "Nykvarns IF Utveckling vs FBC Nyköping",
        type: "match",
        date: "2025-11-12",
        startTime: "19:00",
        // ingen sluttid på matcher
        location: "Nykvarn Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 7. Bortamatch mot Nykvarns IF Utveckling.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch", "vardagsmatch"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032046",
        title: "FBC Nyköping vs Djurgårdens IF IBS",
        type: "match",
        date: "2025-11-15",
        startTime: "15:00",
        // ingen sluttid på matcher
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 8. Hemmamatch mot Djurgårdens IF IBS.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch", "djurgården"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032060",
        title: "Nacka IBK vs FBC Nyköping",
        type: "match",
        date: "2025-11-29",
        startTime: "15:00",
        // ingen sluttid på matcher
        location: "Nacka Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 10. Bortamatch mot Nacka IBK.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032066",
        title: "FBC Nyköping vs Värmdö IF",
        type: "match",
        date: "2025-12-06",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 11. Hemmamatch mot Värmdö IF.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032071",
        title: "FBC Nyköping vs Älvsjö AIK IBF",
        type: "match",
        date: "2025-12-20",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 12. Hemmamatch mot Älvsjö AIK IBF - sista matchen före jul!",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch", "julhelg"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032075",
        title: "Åkersberga IBF vs FBC Nyköping",
        type: "match",
        date: "2026-01-04",
        startTime: "15:00",
        endTime: "16:30",
        location: "Åkersberga Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 13. Första match efter nyår!",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch", "nyår"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032084",
        title: "FBC Nyköping vs FBC Sollentuna",
        type: "match",
        date: "2026-01-11",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 14. Hemmamatch mot FBC Sollentuna.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032085",
        title: "Rosersberg Arlanda IBK vs FBC Nyköping",
        type: "match",
        date: "2026-01-18",
        startTime: "15:00",
        endTime: "16:30",
        location: "Rosersberg Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 15. Bortamatch mot Rosersberg Arlanda IBK.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032092",
        title: "FBC Nyköping vs Huddinge IBS",
        type: "match",
        date: "2026-01-25",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 16. Hemmamatch mot Huddinge IBS.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032099",
        title: "Hässelby SK IBK vs FBC Nyköping",
        type: "match",
        date: "2026-02-01",
        startTime: "15:00",
        endTime: "16:30",
        location: "Hässelbyhallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 17. Bortamatch mot Hässelby SK IBK.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032106",
        title: "FBC Nyköping vs Nykvarns IF Utveckling",
        type: "match",
        date: "2026-02-08",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 18. Hemmamatch mot Nykvarns IF Utveckling.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032113",
        title: "Djurgårdens IF IBS vs FBC Nyköping",
        type: "match",
        date: "2026-02-15",
        startTime: "15:00",
        endTime: "16:30",
        location: "Eriksdalshallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 19. Bortamatch mot Djurgårdens IF IBS i Eriksdalshallen.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch", "djurgården", "eriksdalshallen"],
        important: true,
        color: "#FF6B35"
    },
    {
        id: "match-580032119",
        title: "FBC Nyköping vs Farsta IBK",
        type: "match",
        date: "2026-02-22",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 20. Hemmamatch mot Farsta IBK.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032126",
        title: "FBC Nyköping vs Nacka IBK",
        type: "match",
        date: "2026-03-01",
        startTime: "15:00",
        endTime: "16:30",
        location: "Sporthallen",
        description: "Division 1 Herrar Södra Svealand - Omgång 21. Hemmamatch mot Nacka IBK.",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "hemmamatch"],
        important: true,
        color: "#00D4AA"
    },
    {
        id: "match-580032132",
        title: "Värmdö IF vs FBC Nyköping",
        type: "match",
        date: "2026-03-07",
        startTime: "16:30",
        // ingen sluttid på matcher
        location: "Värmdö Sporthall",
        description: "Division 1 Herrar Södra Svealand - Omgång 22. SISTA MATCHEN för säsongen!",
        createdBy: "leader1",
        participants: [],
        comments: [],
        tags: ["division1", "bortamatch", "sista-matchen", "säsongsavslutning"],
        important: true,
        color: "#FF6B35"
    }
];
exports.realActivities = __spreadArray(__spreadArray([], generateTrainings(), true), matches, true);
// Export aktiviteter för kompatibilitet
exports.activities = exports.realActivities;
exports["default"] = exports.realActivities;

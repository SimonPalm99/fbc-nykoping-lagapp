import React, { createContext, useContext, useState, ReactNode } from "react";
import { Activity, ActivityComment, ActivityParticipant } from "../types/activity";

const initialActivities: Activity[] = [
  // Regelbundna träningar - måndag, tisdag, torsdag
  {
    id: "training-001",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-06-30",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Vanlig innebandyträning - teknik och spelövningar",
    tags: ["träning", "teknik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-002",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-07-01",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Konditionsträning och spelövningar",
    tags: ["träning", "kondition"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-003",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-07-03",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Spelträning och matchförberedelser",
    tags: ["träning", "spel"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Träningar andra veckan
  {
    id: "training-004",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-07-07",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Teknikträning och passningsövningar",
    tags: ["träning", "teknik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-005",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-07-08",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Fysträning och skottövningar",
    tags: ["träning", "skott"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-006",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-07-10",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Taktikträning och spelövningar",
    tags: ["träning", "taktik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Tredje veckan
  {
    id: "training-007",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-07-14",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Vanlig träning - förberedelse inför match",
    tags: ["träning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-008",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-07-15",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Kondition och spelövningar",
    tags: ["träning", "kondition"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-009",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-07-17",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchförberedelse inför helgens match",
    tags: ["träning", "matchförb"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Fjärde veckan
  {
    id: "training-010",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-07-21",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Återhämtningsträning efter match",
    tags: ["träning", "återhämtning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-011",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-07-22",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Teknikträning och spelförståelse",
    tags: ["träning", "teknik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-012",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-07-24",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Intensiv spelträning",
    tags: ["träning", "intensiv"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === AUGUSTI 2025 ===
  // Vecka 1
  {
    id: "training-013",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-08-04",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Säsongstart - kondition och grundteknik",
    tags: ["träning", "säsongstart"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-014",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-08-05",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Speluppbyggnad och passningsspel",
    tags: ["träning", "speluppbyggnad"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-015",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-08-07",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Skottträning och spelövningar",
    tags: ["träning", "skott"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Vecka 2
  {
    id: "training-016",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-08-11",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Fysträning och uthållighet",
    tags: ["träning", "fysträning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-017",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-08-12",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Taktisk genomgång inför seriestarten",
    tags: ["träning", "taktik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-018",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-08-14",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchförberedelse",
    tags: ["träning", "matchförb"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === SEPTEMBER 2025 ===
  // Vecka 1
  {
    id: "training-019",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-09-01",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Återhämtningsträning efter match",
    tags: ["träning", "återhämtning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-020",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-09-02",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Intensiv teknikträning",
    tags: ["träning", "teknik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-021",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-09-04",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Spelövningar och målvaktsspel",
    tags: ["träning", "målvakt"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Vecka 2
  {
    id: "training-022",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-09-08",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Powerplay och boxplay",
    tags: ["träning", "specialsituationer"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-023",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-09-09",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Konditionsträning med boll",
    tags: ["träning", "kondition"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-024",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-09-11",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchförberedelse inför helgen",
    tags: ["träning", "matchförb"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === OKTOBER 2025 ===
  // Vecka 1
  {
    id: "training-025",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-10-06",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Teknik och ballkontroll",
    tags: ["träning", "teknik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-026",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-10-07",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Speluppbyggnad från egen zon",
    tags: ["träning", "speluppbyggnad"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-027",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-10-09",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Avslut och spelförståelse",
    tags: ["träning", "avslut"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Vecka 2
  {
    id: "training-028",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-10-13",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Fysträning och explosivitet",
    tags: ["träning", "fysträning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-029",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-10-14",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Taktisk träning - defensiv",
    tags: ["träning", "defensiv"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-030",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-10-16",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchförberedelse - offensiv",
    tags: ["träning", "offensiv"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === NOVEMBER 2025 ===
  // Vecka 1
  {
    id: "training-031",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-11-03",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Återhämtningsträning",
    tags: ["träning", "återhämtning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-032",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-11-04",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Speluppbyggnad och passningar",
    tags: ["träning", "speluppbyggnad"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-033",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-11-06",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchförberedelse inför helgen",
    tags: ["träning", "matchförb"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Vecka 2
  {
    id: "training-034",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-11-10",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Teknikfokus - första intryck",
    tags: ["träning", "teknik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-035",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-11-11",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Kondition och uthållighet",
    tags: ["träning", "kondition"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-036",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-11-13",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Specialsituationer - frispark",
    tags: ["träning", "specialsituationer"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === DECEMBER 2025 ===
  // Vecka 1
  {
    id: "training-037",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-12-01",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Vintermånad - intensiv träning",
    tags: ["träning", "vinter"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-038",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-12-02",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Taktisk genomgång",
    tags: ["träning", "taktik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-039",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-12-04",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Fysträning inomhus",
    tags: ["träning", "fysträning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Vecka 2
  {
    id: "training-040",
    title: "Träning - Måndag",
    type: "träning",
    date: "2025-12-08",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Skottträning och målchans",
    tags: ["träning", "skott"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-041",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2025-12-09",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Spelövningar och samspel",
    tags: ["träning", "samspel"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-042",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2025-12-11",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchsimulering",
    tags: ["träning", "match"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === JANUARI 2026 ===
  // Vecka 1 (Nyårsträning)
  {
    id: "training-043",
    title: "Träning - Måndag",
    type: "träning",
    date: "2026-01-05",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Återstart efter nyår",
    tags: ["träning", "nyår"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-044",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2026-01-06",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Kondition och explosivitet",
    tags: ["träning", "kondition"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-045",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2026-01-08",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Teknik och precision",
    tags: ["träning", "teknik"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  // Vecka 2
  {
    id: "training-046",
    title: "Träning - Måndag",
    type: "träning",
    date: "2026-01-12",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Spelförståelse och läsning",
    tags: ["träning", "spelförståelse"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-047",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2026-01-13",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Powerplay och specialspel",
    tags: ["träning", "powerplay"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-048",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2026-01-15",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchförberedelse vinterrunda",
    tags: ["träning", "matchförb"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === FEBRUARI 2026 ===
  // Vecka 1
  {
    id: "training-049",
    title: "Träning - Måndag",
    type: "träning",
    date: "2026-02-02",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Säsongens slutspurt",
    tags: ["träning", "slutspurt"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-050",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2026-02-03",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Intensiv spelträning",
    tags: ["träning", "intensiv"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-051",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2026-02-05",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Matchförberedelse februari",
    tags: ["träning", "matchförb"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === MARS 2026 ===
  // Vecka 1
  {
    id: "training-052",
    title: "Träning - Måndag",
    type: "träning",
    date: "2026-03-02",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Vårkänslor - teknikfokus",
    tags: ["träning", "vår"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-053",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2026-03-03",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Avslutande övningar",
    tags: ["träning", "avslut"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-054",
    title: "Träning - Torsdag",
    type: "träning",
    date: "2026-03-05",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Sista matcherna - slutspurt",
    tags: ["träning", "slutspurt"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },

  // === APRIL 2026 - SÄSONGSAVSLUTNING ===
  // Vecka 1
  {
    id: "training-055",
    title: "Träning - Måndag",
    type: "träning",
    date: "2026-04-06",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Säsongsavslutning - glädje och reflektion",
    tags: ["träning", "avslutning"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-056",
    title: "Träning - Tisdag",
    type: "träning",
    date: "2026-04-07",
    startTime: "19:00",
    endTime: "20:30",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: false,
    canceled: false,
    description: "Utvärdering och målsättning",
    tags: ["träning", "utvärdering"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "training-057",
    title: "Avslutningsträning",
    type: "träning",
    date: "2026-04-09",
    startTime: "19:00",
    endTime: "21:00",
    location: "Nyköpings Sporthall",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall",
    createdBy: "Tränare",
    important: true,
    canceled: false,
    description: "Säsongens sista träning - tack för en fantastisk säsong!",
    tags: ["träning", "avslutning", "firande"],
    color: "#b8f27c",
    comments: [],
    participants: []
  },
  
  // Äldre aktiviteter (behåller för historik)
  {
    id: "1",
    title: "Träning",
    type: "träning",
    date: "2025-06-10",
    startTime: "19:00",
    endTime: "20:30",
    location: "Sporthallen",
    mapUrl: "https://goo.gl/maps/testkarta123",
    createdBy: "Simon",
    important: false,
    canceled: false,
    description: "Vanlig innebandyträning",
    tags: ["innebandy"],
    color: "#4a9d2c",
    comments: [],
    participants: []
  },
  {
    id: "2",
    title: "Match",
    type: "match",
    date: "2025-06-13",
    startTime: "17:30",
    endTime: "19:00",
    location: "Arenan",
    createdBy: "Tränare",
    important: true,
    canceled: true,
    description: "Seriematch mot IFK inställd",
    tags: ["match"],
    color: "#e66",
    comments: [],
    participants: []
  },
  // Säsong 25/26 matcher (från verkliga spelschemat)
  {
    id: "match-001",
    title: "FBC Nyköping - Ledberg Innebandy",
    type: "match",
    date: "2025-08-09",
    startTime: "14:00",
    endTime: "16:00",
    location: "Nyköpings Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Hemma",
    tags: ["seriematch", "hemma", "division1"],
    color: "#b8f27c",
    comments: [],
    participants: [],
    absenceDeadline: "2025-08-07T23:59",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall"
  },
  {
    id: "match-002", 
    title: "FBC Nyköping - Linköping Innebandy",
    type: "match",
    date: "2025-08-16",
    startTime: "14:00",
    endTime: "16:00",
    location: "Nyköpings Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Hemma",
    tags: ["seriematch", "hemma", "division1"],
    color: "#b8f27c",
    comments: [],
    participants: [],
    absenceDeadline: "2025-08-14T23:59",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall"
  },
  {
    id: "match-003",
    title: "Bergs IK - FBC Nyköping", 
    type: "match",
    date: "2025-08-23",
    startTime: "13:00",
    endTime: "15:00",
    location: "Vasa Arena",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Borta",
    tags: ["seriematch", "borta", "division1"],
    color: "#ffc107",
    comments: [],
    participants: [],
    absenceDeadline: "2025-08-21T23:59",
    mapUrl: "https://goo.gl/maps/vasa-arena"
  },
  {
    id: "match-004",
    title: "FBC Nyköping - Åby Öilers IBK",
    type: "match",
    date: "2025-08-30",
    startTime: "14:00",
    endTime: "16:00",
    location: "Nyköpings Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Hemma",
    tags: ["seriematch", "hemma", "division1"],
    color: "#b8f27c",
    comments: [],
    participants: [],
    absenceDeadline: "2025-08-28T23:59",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall"
  },
  {
    id: "match-005",
    title: "Sala IBF - FBC Nyköping",
    type: "match",
    date: "2025-09-06",
    startTime: "14:00",
    endTime: "16:00",
    location: "Sala Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Borta",
    tags: ["seriematch", "borta", "division1"],
    color: "#ffc107",
    comments: [],
    participants: [],
    absenceDeadline: "2025-09-04T23:59",
    mapUrl: "https://goo.gl/maps/sala-sporthall"
  },
  {
    id: "match-006",
    title: "FBC Nyköping - Västerås IBS",
    type: "match",
    date: "2025-09-13",
    startTime: "14:00",
    endTime: "16:00",
    location: "Nyköpings Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Hemma",
    tags: ["seriematch", "hemma", "division1"],
    color: "#b8f27c",
    comments: [],
    participants: [],
    absenceDeadline: "2025-09-11T23:59",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall"
  },
  {
    id: "match-007",
    title: "Uppsala IBK - FBC Nyköping",
    type: "match",
    date: "2025-09-20",
    startTime: "14:00",
    endTime: "16:00",
    location: "Uppsala Hall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Borta",
    tags: ["seriematch", "borta", "division1"],
    color: "#ffc107",
    comments: [],
    participants: [],
    absenceDeadline: "2025-09-18T23:59",
    mapUrl: "https://goo.gl/maps/uppsala-hall"
  },
  {
    id: "match-008",
    title: "Ledberg Innebandy - FBC Nyköping",
    type: "match",
    date: "2025-09-27",
    startTime: "14:00",
    endTime: "16:00",
    location: "Gnesta Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Borta",
    tags: ["seriematch", "borta", "division1"],
    color: "#ffc107",
    comments: [],
    participants: [],
    absenceDeadline: "2025-09-25T23:59",
    mapUrl: "https://goo.gl/maps/gnesta-sporthall"
  },
  {
    id: "match-009",
    title: "Linköping Innebandy - FBC Nyköping",
    type: "match",
    date: "2025-10-04",
    startTime: "14:00",
    endTime: "16:00",
    location: "Linköping Arena",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Borta",
    tags: ["seriematch", "borta", "division1"],
    color: "#ffc107",
    comments: [],
    participants: [],
    absenceDeadline: "2025-10-02T23:59",
    mapUrl: "https://goo.gl/maps/linkoping-arena"
  },
  {
    id: "match-010",
    title: "FBC Nyköping - Bergs IK",
    type: "match",
    date: "2025-10-11",
    startTime: "14:00",
    endTime: "16:00",
    location: "Nyköpings Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Hemma",
    tags: ["seriematch", "hemma", "division1"],
    color: "#b8f27c",
    comments: [],
    participants: [],
    absenceDeadline: "2025-10-09T23:59",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall"
  },
  {
    id: "match-011",
    title: "Åby Öilers IBK - FBC Nyköping",
    type: "match",
    date: "2025-10-18",
    startTime: "14:00",
    endTime: "16:00",
    location: "Åby Arena",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Borta",
    tags: ["seriematch", "borta", "division1"],
    color: "#ffc107",
    comments: [],
    participants: [],
    absenceDeadline: "2025-10-16T23:59",
    mapUrl: "https://goo.gl/maps/aby-arena"
  },
  {
    id: "match-012",
    title: "FBC Nyköping - Sala IBF",
    type: "match",
    date: "2025-10-25",
    startTime: "14:00",
    endTime: "16:00",
    location: "Nyköpings Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Hemma",
    tags: ["seriematch", "hemma", "division1"],
    color: "#b8f27c",
    comments: [],
    participants: [],
    absenceDeadline: "2025-10-23T23:59",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall"
  },
  {
    id: "match-013",
    title: "Västerås IBS - FBC Nyköping",
    type: "match",
    date: "2025-11-01",
    startTime: "14:00",
    endTime: "16:00",
    location: "Västerås Arena",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Borta",
    tags: ["seriematch", "borta", "division1"],
    color: "#ffc107",
    comments: [],
    participants: [],
    absenceDeadline: "2025-10-30T23:59",
    mapUrl: "https://goo.gl/maps/vasteras-arena"
  },
  {
    id: "match-014",
    title: "FBC Nyköping - Uppsala IBK",
    type: "match",
    date: "2025-11-08",
    startTime: "14:00",
    endTime: "16:00",
    location: "Nyköpings Sporthall",
    createdBy: "Matchsekretariat",
    important: true,
    canceled: false,
    description: "Seriematch i Division 1 Östra - Hemma",
    tags: ["seriematch", "hemma", "division1"],
    color: "#b8f27c",
    comments: [],
    participants: [],
    absenceDeadline: "2025-11-06T23:59",
    mapUrl: "https://goo.gl/maps/nykoping-sporthall"
  }
];

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  updateActivity: (activityId: string, updates: Partial<Activity>) => void;
  respondToActivity: (activityId: string, userId: string, status: "attending" | "absent" | "maybe", absenceReason?: string, onTrainingAttend?: (trainingData: any) => void) => void;
  addComment: (activityId: string, userId: string, text: string, isLeaderOnly?: boolean) => void;
  deleteActivity: (activityId: string) => void;
  getActivityById: (activityId: string) => Activity | undefined;
  getUserActivities: (userId: string) => Activity[];
  getUpcomingActivities: (limit?: number) => Activity[];
  // New integration functions
  getUserResponsesForActivity: (activityId: string, userId: string) => ActivityParticipant | undefined;
  getMyUpcomingActivities: (userId: string, limit?: number) => Activity[];
  getActivitiesNeedingResponse: (userId: string) => Activity[];
  autoRegisterUserForActivity: (activityId: string, userId: string) => void;
  bulkRegisterUsersForActivity: (activityId: string, userIds: string[]) => void;
  getActivityStats: (activityId: string) => {
    total: number;
    attending: number;
    maybe: number;
    absent: number;
    notResponded: number;
  };
}

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);

  const addActivity = (activity: Activity) => {
    setActivities(prev => [...prev, activity]);
  };

  const updateActivity = (activityId: string, updates: Partial<Activity>) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === activityId 
          ? { ...activity, ...updates }
          : activity
      )
    );
  };

  const respondToActivity = (
    activityId: string, 
    userId: string, 
    status: "attending" | "absent" | "maybe", 
    absenceReason?: string,
    onTrainingAttend?: (trainingData: any) => void
  ) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id !== activityId) return activity;

        const existingParticipant = activity.participants.find(p => p.userId === userId);
        const updatedParticipants = existingParticipant
          ? activity.participants.map(p => 
              p.userId === userId 
                ? { ...p, status, absenceReason: absenceReason || '', absenceDate: new Date().toISOString() }
                : p
            )
          : [...activity.participants, {
              userId,
              status,
              absenceReason: absenceReason || '',
              absenceDate: new Date().toISOString()
            }];

        // Auto-create training log when attending training activities
        if (status === "attending" && activity.type === "träning" && onTrainingAttend) {
          // Create training log based on activity
          const skills: string[] = [];
          const tags = activity.tags || [];
          if (tags.includes("teknik")) skills.push("Teknik");
          if (tags.includes("kondition")) skills.push("Kondition");
          if (tags.includes("skott")) skills.push("Skott");
          if (tags.includes("taktik")) skills.push("Taktik");
          if (tags.includes("spel")) skills.push("Spelförståelse");
          
          // Default to basic skills if no specific tags
          if (skills.length === 0) {
            skills.push("Teknik", "Spelförståelse");
          }

          const trainingLog = {
            date: activity.date,
            feeling: 3, // Default neutral feeling
            note: `Lagträning: ${activity.title}`,
            duration: 90, // Default 90 minutes
            intensity: 3, // Default medium intensity
            skills,
            stats: {
              goals: 0,
              assists: 0,
              shots: 0
            }
          };

          onTrainingAttend(trainingLog);
        }

        return { ...activity, participants: updatedParticipants };
      })
    );
  };

  const addComment = (activityId: string, userId: string, text: string, isLeaderOnly = false) => {
    const newComment: ActivityComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      text,
      timestamp: new Date().toISOString(),
      isLeaderOnly
    };

    setActivities(prev =>
      prev.map(activity =>
        activity.id === activityId
          ? { ...activity, comments: [...activity.comments, newComment] }
          : activity
      )
    );
  };

  const deleteActivity = (activityId: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== activityId));
  };

  const getActivityById = (activityId: string): Activity | undefined => {
    return activities.find(activity => activity.id === activityId);
  };

  const getUserActivities = (userId: string): Activity[] => {
    return activities.filter(activity => 
      activity.participants.some(p => p.userId === userId)
    );
  };

  const getUpcomingActivities = (limit = 10): Activity[] => {
    const now = new Date();
    return activities
      .filter(activity => new Date(activity.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  };

  // New integration functions
  const getUserResponsesForActivity = (activityId: string, userId: string): ActivityParticipant | undefined => {
    const activity = getActivityById(activityId);
    return activity?.participants.find(p => p.userId === userId);
  };

  const getMyUpcomingActivities = (userId: string, limit = 10): Activity[] => {
    const now = new Date();
    return activities
      .filter(activity => {
        const isUpcoming = new Date(activity.date) >= now;
        const isParticipant = activity.participants.some(p => p.userId === userId);
        return isUpcoming && isParticipant;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  };

  const getActivitiesNeedingResponse = (userId: string): Activity[] => {
    const now = new Date();
    return activities
      .filter(activity => {
        const isUpcoming = new Date(activity.date) >= now;
        const userResponse = activity.participants.find(p => p.userId === userId);
        return isUpcoming && (!userResponse || userResponse.status === "not_responded");
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const autoRegisterUserForActivity = (activityId: string, userId: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id !== activityId) return activity;
        
        const existingParticipant = activity.participants.find(p => p.userId === userId);
        if (existingParticipant) return activity; // Already registered
        
        const newParticipant: ActivityParticipant = {
          userId,
          status: "not_responded"
        };
        
        return {
          ...activity,
          participants: [...activity.participants, newParticipant]
        };
      })
    );
  };

  const bulkRegisterUsersForActivity = (activityId: string, userIds: string[]) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id !== activityId) return activity;
        
        const newParticipants: ActivityParticipant[] = userIds
          .filter(userId => !activity.participants.some(p => p.userId === userId))
          .map(userId => ({
            userId,
            status: "not_responded" as const
          }));
        
        return {
          ...activity,
          participants: [...activity.participants, ...newParticipants]
        };
      })
    );
  };

  const getActivityStats = (activityId: string) => {
    const activity = getActivityById(activityId);
    if (!activity) {
      return { total: 0, attending: 0, maybe: 0, absent: 0, notResponded: 0 };
    }
    
    const stats = {
      total: activity.participants.length,
      attending: activity.participants.filter(p => p.status === "attending").length,
      maybe: activity.participants.filter(p => p.status === "maybe").length,
      absent: activity.participants.filter(p => p.status === "absent").length,
      notResponded: activity.participants.filter(p => p.status === "not_responded").length
    };
    
    return stats;
  };

  return (
    <ActivityContext.Provider value={{ 
      activities, 
      addActivity,
      updateActivity,
      respondToActivity,
      addComment,
      deleteActivity,
      getActivityById,
      getUserActivities,
      getUpcomingActivities,
      // New integration functions
      getUserResponsesForActivity,
      getMyUpcomingActivities,
      getActivitiesNeedingResponse,
      autoRegisterUserForActivity,
      bulkRegisterUsersForActivity,
      getActivityStats
    }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity måste användas inom ActivityProvider");
  return ctx;
};

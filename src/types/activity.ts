export type ActivityType = "träning" | "match" | "cup" | "lagfest" | "styrketräning" | "taktikträning" | "målvaktsträning" | "möte" | "annat";

export interface ActivityParticipant {
  userId: string;
  status: "attending" | "absent" | "maybe" | "not_responded";
  absenceReason?: string;
  absenceDate?: string;
  fineAmount?: number;
  fineStatus?: "pending" | "paid" | "waived";
}

export interface ActivityComment {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  isLeaderOnly?: boolean;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  date: string;
  startTime?: string;
  gatheringTime?: string; // Samlingstid för aktivitet
  endTime?: string;
  duration?: number; // duration in minutes
  location?: string;
  mapUrl?: string;
  createdBy: string;
  leader?: string; // assigned leader/coach for this activity
  description?: string;
  tags?: string[];
  important?: boolean;
  absenceDeadline?: string;
  color?: string;
  canceled?: boolean;
  comments: ActivityComment[];
  participants: ActivityParticipant[];
  maxParticipants?: number;
  equipment?: string[];
  leaderNotes?: string; // endast synlig för ledare
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: "weekly" | "monthly";
    interval: number;
    endDate?: string;
  };
  reminderSent?: boolean;
  carpool?: {
    driver: string;
    seats: number;
    passengers: string[];
  }[];
  linkedMatchId?: string; // om det är en match
  linkedTacticIds?: string[]; // kopplat till taktiker

  // FBC matchinfo/laguttagning
  matchInfo?: string;
  matchFiles?: { url: string; name: string; type: 'image' | 'document'; }[];
  lineup?: {
    first?: string[];
    second?: string[];
    third?: string[];
    powerplay?: string[];
    boxplay?: string[];
    goalies?: string[];
    reserve?: string[];
  };
}
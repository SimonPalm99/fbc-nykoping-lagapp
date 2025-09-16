// Typer för dokumenthantering och andra funktioner

export interface Document {
  id: string;
  title: string;
  description: string;
  category: "regler" | "taktik" | "träningsprogram" | "formulär" | "övrigt";
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  isPublic: boolean;
  viewPermissions: string[]; // user IDs som kan se dokumentet
  editPermissions: string[]; // user IDs som kan redigera
  downloadCount: number;
  lastDownloadAt?: string;
  version: number;
  previousVersions: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  version: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  changeNotes: string;
}

export interface Equipment {
  id: string;
  name: string;
  description: string;
  category: "matchutrustning" | "träningsutrustning" | "övrigt";
  responsibleUserId: string;
  currentLocation: string;
  condition: "excellent" | "good" | "fair" | "poor" | "needs_repair";
  purchaseDate?: string;
  cost?: number;
  supplier?: string;
  maintenanceHistory: EquipmentMaintenance[];
  isActive: boolean;
}

export interface EquipmentMaintenance {
  id: string;
  date: string;
  type: "cleaning" | "repair" | "inspection" | "replacement";
  description: string;
  cost?: number;
  performedBy: string;
  nextMaintenanceDate?: string;
}

export interface Carpool {
  id: string;
  activityId: string;
  driverUserId: string;
  availableSeats: number;
  departureTime: string;
  departureLocation: string;
  returnTime?: string;
  passengers: CarpoolPassenger[];
  status: "available" | "full" | "departed" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface CarpoolPassenger {
  userId: string;
  confirmedAt: string;
  pickupLocation?: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "activity" | "fine" | "forum" | "chat" | "achievement" | "system";
  title: string;
  message: string;
  data?: any; // extra data beroende på typ
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface MembershipFee {
  id: string;
  userId: string;
  season: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: string;
  paymentReference?: string;
  reminderSent: boolean;
  lastReminderDate?: string;
  reminderCount: number;
  status: "pending" | "paid" | "overdue" | "waived";
}

export interface TeamInvite {
  id: string;
  email: string;
  invitedBy: string;
  invitedAt: string;
  role: "player" | "leader";
  message?: string;
  qrCode: string;
  expiresAt: string;
  usedAt?: string;
  usedBy?: string;
  status: "pending" | "used" | "expired" | "cancelled";
}

export interface FeedbackSubmission {
  id: string;
  userId?: string; // kan vara anonym
  category: "träning" | "match" | "ledning" | "facilitet" | "allmänt";
  subject: string;
  message: string;
  isAnonymous: boolean;
  submittedAt: string;
  status: "new" | "read" | "in_progress" | "resolved" | "closed";
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  priority: "low" | "medium" | "high";
}

export interface WeeklyReport {
  id: string;
  weekStart: string;
  weekEnd: string;
  highlights: string[];
  upcomingActivities: string[];
  mvpOfWeek?: string;
  statisticalHighlights: {
    topScorer?: string;
    bestAttendance?: string;
    mostImproved?: string;
  };
  teamNews: string[];
  generatedAt: string;
  sentTo: string[];
}

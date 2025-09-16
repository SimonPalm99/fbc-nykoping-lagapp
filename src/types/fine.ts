// Typ av bot (t.ex. sen till träning, glömt matchtröja etc)
export type FineCategory = "frånvaro" | "försening" | "utrustning" | "uppförande" | "annat";

export interface FineType {
  id: string;
  name: string;
  amount: number;
  description?: string;
  category: FineCategory;
  isActive: boolean;
  autoApply: boolean; // automatisk vid frånvaro etc
  requiresApproval: boolean;
  createdBy: string;
  createdAt: string;
}

// Enskild bot
export interface Fine {
  id: string;
  playerId: string;
  userId: string; // alias för bakåtkompatibilitet
  type: FineType;
  date: string; // ISO
  reason: string;
  amount: number;
  category: FineCategory;
  description: string;
  dueDate?: string;
  paid: boolean;
  isPaid: boolean; // alias för bakåtkompatibilitet
  paidDate?: string;
  paidAmount?: number;
  paymentMethod?: "swish" | "kontant" | "banköverföring";
  paymentReference?: string;
  createdBy: string;
  issuedBy: string; // alias för bakåtkompatibilitet
  approvedBy?: string;
  status: "pending" | "approved" | "paid" | "waived" | "disputed";
  relatedActivityId?: string;
  notes?: string;
  disputeReason?: string;
  disputeDate?: string;
}

export interface FineStatistics {
  userId: string;
  totalFines: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  finesByCategory: {
    category: FineCategory;
    count: number;
    amount: number;
  }[];
  lastFineDate?: string;
  averageFineAmount: number;
}

// En betalning till lagkassan
export interface Payment {
  id: string;
  playerId: string;
  amount: number;
  date: string; // ISO
  fineIds: string[]; // vilka böter betalades med denna
  createdBy: string;
  paymentMethod?: "swish" | "kontant" | "banköverföring";
  reference?: string;
  notes?: string;
}

// Lagkassan, summerad info
export interface TeamFund {
  id: string;
  totalAmount: number;
  currentBalance: number;
  transactions: FundTransaction[];
  allocations: FundAllocation[];
  lastUpdated: string;
  // Gamla fält för bakåtkompatibilitet
  totalFines: number;
  totalPaid: number;
  balance: number;
}

export interface FundTransaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  category: "böter" | "sponsring" | "försäljning" | "utgift" | "övrigt";
  reference?: string;
  approvedBy: string;
  relatedFineId?: string;
}

export interface FundAllocation {
  id: string;
  purpose: string;
  budgetAmount: number;
  spentAmount: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}
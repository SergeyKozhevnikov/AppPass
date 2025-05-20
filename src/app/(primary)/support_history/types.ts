// src/app/(primary)/support/types.ts
export interface SupportTicket {
  id: number;
  fullName: string;
  problem: string;
  email: string;
  phoneNumber: string;
  status: string;
}
export type InvoiceStatus =
  | "uploaded"
  | "verified"
  | "approved"
  | "rejected";

export interface Invoice {
  invoice_id: number;
  status: InvoiceStatus;
  file_hash: string;
  created_at?: string;
  flags?: string[];
  risk_score?: number;
}
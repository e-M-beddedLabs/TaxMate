// API Response Types - shaped exactly like backend responses

export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface DashboardSummary {
  total_income: number;
  total_expense: number;
  estimated_tax: number;
}

export interface Record {
  id: number;
  date: string;
  description: string;
  category: string;
  transaction_type: 'income' | 'expense';
  taxable_amount: number;
  tax_amount: number;
  total_amount: number;
}

export interface RecordCreate {
  date: string;
  description: string;
  category: string;
  transaction_type: 'income' | 'expense';
  taxable_amount: number;
  tax_type: 'GST' | 'NONE';
}

export interface CSVUploadPreview {
  valid_rows: Record[];
  error_rows: CSVErrorRow[];
  total_rows: number;
}

export interface CSVErrorRow {
  row_number: number;
  data: string[];
  error: string;
}

export interface CSVImportResult {
  imported_count: number;
  failed_count: number;
  status: 'processing' | 'completed' | 'failed';
}

export interface ReportSummary {
  period_start: string;
  period_end: string;
  total_income: number;
  total_expense: number;
  net_amount: number;
  total_tax: number;
  income_by_category: CategoryBreakdown[];
  expense_by_category: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

// Period types for filtering
export type PeriodType = 'month' | 'prev_month' | 'fy' | 'ytd' | 'custom';

export interface DateRange {
  start: string;
  end: string;
}

// Filter types
export interface RecordFilters {
  date_range?: DateRange;
  transaction_type?: 'income' | 'expense' | 'all';
  category?: string;
}

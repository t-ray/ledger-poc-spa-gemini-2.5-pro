export interface Account {
    /** User-defined unique ID (e.g., "PNC0906") - Primary Key */
    id: string;
  
    /** User-friendly name (e.g., "PNC Checking Account") */
    name: string;
  
    /** Determines balance calculation logic ('asset' or 'liability') */
    accountType: 'asset' | 'liability';
  
    /** Starting balance in cents */
    startingBalance: number;
  
    /** Date for the starting balance ('YYYY-MM-DD') */
    startingBalanceDate: string;
  }
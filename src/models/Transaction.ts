export interface Transaction {
    // --- Primary Key & Identifiers ---
    /** True unique ID (UUID) - Primary Key */
    transactionId: string;
    /** Your sequential display ID (e.g., "00000001") */
    displayId: string;
  
    // --- Linking & Core Data ---
    /** Foreign Key to Account.id (Account this entry affects) */
    accountId: string;
    /** Cleared/Posted Date ('YYYY-MM-DD') */
    date: string;
    /**
     * Change to this account's balance (in cents).
     * Can be positive or negative based on the transaction's effect on this specific account.
     */
    amount: number;
    /** Description/Payee */
    vendor: string;
  
    // --- Classification & Details ---
    /**
     * Method/mechanism of the transaction.
     * Expected values: 'Deposit', 'Transfer', 'Debit', 'ACH', 'Withdrawal',
     * 'Interest Payment', 'Check', 'Wire', 'Purchase', 'Dividend'.
     */
    type: string;
    /** Foreign Key to Category.id */
    categoryId: string;
    /** Optional free-form further classification */
    subCategory?: string;
    /** Optional: Last digits of card/account used */
    digits?: string;
  
    // --- Flags (Primarily for Reporting/Querying) ---
    /** User-defined flag for income reporting */
    isIncome: boolean;
    /** Fixed/recurring transaction flag */
    isFixed: boolean;
    /** Counts towards spending reports flag (e.g., False for transfers) */
    isSpend: boolean;
  
    // --- Notes ---
    /** Optional free-form notes */
    notes?: string;
  }
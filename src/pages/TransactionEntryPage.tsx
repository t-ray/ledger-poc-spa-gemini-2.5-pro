// src/pages/TransactionEntryPage.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Import uuid generator
import TransactionForm, { TransactionFormData } from '../components/TransactionForm';
import { Account } from '../models/Account';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction'; // Full Transaction type
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';

// --- Mock Data ---
// In a real app, this would come from context, state management, or API calls
const mockAccounts: Account[] = [
  { id: 'PNC0906', name: 'PNC Checking', accountType: 'asset', startingBalance: 150000, startingBalanceDate: '2025-01-01' },
  { id: 'ALLY0123', name: 'Ally Savings', accountType: 'asset', startingBalance: 1000000, startingBalanceDate: '2025-01-01' },
  { id: 'CHASE_VISA', name: 'Chase Sapphire Card', accountType: 'liability', startingBalance: 50000, startingBalanceDate: '2025-01-01' },
];

const mockCategories: Category[] = [
  { id: 'Groceries', name: 'Groceries' },
  { id: 'Salary', name: 'Salary' },
  { id: 'Utilities', name: 'Utilities' },
  { id: 'Transfer', name: 'Transfer' },
  { id: 'Interest Payment', name: 'Interest Payment'},
  { id: 'Purchase', name: 'Purchase' },
  { id: 'Dividend', name: 'Dividend'},
  // Add more categories as needed
];
// --- End Mock Data ---

const TransactionEntryPage: React.FC = () => {
  // State to hold transactions entered in this session (for display)
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // In a real app, you'd fetch accounts and categories, possibly using useEffect
  const [accounts] = useState<Account[]>(mockAccounts);
  const [categories] = useState<Category[]>(mockCategories);

  // Handler for when the form is submitted
  const handleTransactionSubmit = (formData: TransactionFormData) => {
    // Generate unique IDs
    const newTransaction: Transaction = {
      ...formData,
      transactionId: uuidv4(),
      // Basic sequential ID generation (example only - reset on refresh)
      // In a real app, this needs persistent tracking or server-side generation
      displayId: String(transactions.length + 1).padStart(8, '0'),
    };

    // Add to our temporary list for display
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]); // Add to top

    // In a real app, you would save `newTransaction` here
    // (e.g., send to API, save to localStorage/IndexedDB)
    console.log('New Transaction Added:', newTransaction);
    alert('Transaction Added Successfully!'); // Simple feedback
  };

  // Helper to format cents for display
  const formatCurrency = (cents: number): string => {
      const value = cents / 100;
      return value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(2)}`;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Enter Transaction
      </Typography>

      <TransactionForm
        accounts={accounts}
        categories={categories}
        onSubmit={handleTransactionSubmit}
      />

      {/* Display recently added transactions (optional) */}
      {transactions.length > 0 && (
        <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Entries (Session Only)</Typography>
            <List dense>
                {transactions.map(t => (
                    <ListItem key={t.transactionId} divider>
                        <ListItemText
                            primary={`${t.date}: <span class="math-inline">\{t\.vendor\} \(</span>{t.type})`}
                            secondary={`Amount: ${formatCurrency(t.amount)} | Account: ${t.accountId} | Category: ${t.categoryId}${t.subCategory ? ` (${t.subCategory})` : ''}`}

                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
      )}
    </Box>
  );
};

export default TransactionEntryPage;
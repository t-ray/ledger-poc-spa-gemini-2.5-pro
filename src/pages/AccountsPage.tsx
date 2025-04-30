// src/pages/AccountsPage.tsx
import React, { useState } from 'react';
import { Account } from '../models/Account';
import AccountForm from '../components/AccountForm';
import AccountList from '../components/AccountList';
import Typography from '@mui/material/Typography'; // Use Typography
import Box from '@mui/material/Box'; // Use Box for layout if needed


// Mock data - replace with actual data fetching later
const initialAccounts: Account[] = [
  { id: 'PNC0906', name: 'PNC Checking', accountType: 'asset', startingBalance: 150000, startingBalanceDate: '2025-01-01' },
  { id: 'ALLY0123', name: 'Ally Savings', accountType: 'asset', startingBalance: 1000000, startingBalanceDate: '2025-01-01' },
  { id: 'CHASE_VISA', name: 'Chase Sapphire Card', accountType: 'liability', startingBalance: 50000, startingBalanceDate: '2025-01-01' },
];

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleAddAccount = (newAccount: Account) => {
    // ID uniqueness check happens in the form based on existingAccountIds
    setAccounts([...accounts, newAccount]);
    setEditingAccount(null); // Clear editing state
  };

  const handleUpdateAccount = (updatedAccount: Account) => {
    setAccounts(
      accounts.map((acc) =>
        acc.id === updatedAccount.id ? updatedAccount : acc // Replace the whole account
      )
    );
    setEditingAccount(null); // Exit editing mode
  };

  const handleFormSubmit = (accountData: Account | null) => {
       if (!accountData) { // Handle Cancel Edit button
          setEditingAccount(null);
          return;
      }
      if (editingAccount) {
          handleUpdateAccount(accountData);
      } else {
          handleAddAccount(accountData);
      }
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm(`Are you sure you want to delete account "${accountId}"? This could affect transactions.`)) {
       // TODO: Check if account has transactions before deleting in a real app
      setAccounts(accounts.filter((acc) => acc.id !== accountId));
       if (editingAccount?.id === accountId) {
          setEditingAccount(null); // Clear form if deleted account was being edited
      }
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account); // Set account to edit, form will populate
  };

  return (
    // Use Box or Fragment, Container is handled in App.tsx
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
          Manage Accounts
      </Typography>
      <AccountForm
        onSubmit={handleFormSubmit}
        initialData={editingAccount}
        existingAccountIds={accounts.map(acc => acc.id)}
      />
      <AccountList
        accounts={accounts}
        onEdit={handleEditAccount}
        onDelete={handleDeleteAccount}
      />
    </Box>
  );
};

export default AccountsPage;
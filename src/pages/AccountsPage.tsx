// src/pages/AccountsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Account } from '../models/Account';
import AccountList from '../components/AccountList';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { storage } from '../utils/storage';

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  const existingAccounts = storage.getAccounts();
  if (existingAccounts.length === 0) {
    const initialAccounts: Account[] = [
      { id: 'PNC0906', name: 'PNC Checking', accountType: 'asset', startingBalance: 150000, startingBalanceDate: '2025-01-01' },
      { id: 'ALLY0123', name: 'Ally Savings', accountType: 'asset', startingBalance: 1000000, startingBalanceDate: '2025-01-01' },
      { id: 'CHASE_VISA', name: 'Chase Sapphire Card', accountType: 'liability', startingBalance: 50000, startingBalanceDate: '2025-01-01' },
    ];
    storage.saveAccounts(initialAccounts);
  }
};

const AccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = React.useState<Account[]>([]);

  // Initialize data and load accounts from storage
  React.useEffect(() => {
    initializeStorage();
    setAccounts(storage.getAccounts());
  }, []);

  const handleEditAccount = (account: Account) => {
    navigate(`/accounts/edit/${account.id}`);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (window.confirm(`Are you sure you want to delete account "${accountId}"? This could affect transactions.`)) {
      storage.deleteAccount(accountId);
      setAccounts(storage.getAccounts());
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Manage Accounts
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/accounts/new')}
        >
          Add New Account
        </Button>
      </Box>

      <AccountList
        accounts={accounts}
        onEdit={handleEditAccount}
        onDelete={handleDeleteAccount}
      />
    </Box>
  );
};

export default AccountsPage;
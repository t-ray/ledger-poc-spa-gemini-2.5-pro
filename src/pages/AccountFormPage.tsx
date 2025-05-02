import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Account } from '../models/Account';
import AccountForm from '../components/AccountForm';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { storage } from '../utils/storage';

const AccountFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountId } = useParams<{ accountId: string }>();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // Load accounts from storage
  useEffect(() => {
    setAccounts(storage.getAccounts());
  }, []);

  // Set editing account when accounts are loaded or accountId changes
  useEffect(() => {
    if (accountId && accountId !== 'new') {
      const account = accounts.find(acc => acc.id === accountId);
      setEditingAccount(account || null);
    } else {
      setEditingAccount(null);
    }
  }, [accountId, accounts]);

  const handleSubmit = (accountData: Account | null) => {
    if (!accountData) {
      navigate('/accounts');
      return;
    }

    if (editingAccount) {
      // Update existing account
      storage.updateAccount(accountData);
    } else {
      // Add new account
      storage.addAccount(accountData);
    }
    navigate('/accounts');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/accounts')}
          sx={{ mr: 2 }}
          aria-label="back to accounts"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {editingAccount ? 'Edit Account' : 'Add New Account'}
        </Typography>
      </Box>

      <AccountForm
        onSubmit={handleSubmit}
        initialData={editingAccount}
        existingAccountIds={accounts.map(acc => acc.id)}
      />
    </Box>
  );
};

export default AccountFormPage; 
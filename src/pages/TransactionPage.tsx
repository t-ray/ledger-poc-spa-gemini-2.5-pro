import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import TransactionGrid from '../components/TransactionGrid';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { Category } from '../models/Category';
import { storage } from '../utils/storage';

const TransactionPage: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Initialize data
  useEffect(() => {
    // Load accounts and categories
    const loadedAccounts = storage.getAccounts();
    setAccounts(loadedAccounts);
    setCategories(storage.getCategories());

    // Set first account as selected if available
    if (loadedAccounts.length > 0) {
      setSelectedAccountId(loadedAccounts[0].id);
    }

    // Load transactions
    setAllTransactions(storage.getTransactions());
  }, []);

  // Filter transactions when account selection or transactions change
  useEffect(() => {
    setFilteredTransactions(allTransactions.filter(t => t.accountId === selectedAccountId));
  }, [selectedAccountId, allTransactions]);

  const handleUpdate = (updatedTransaction: Transaction, isTemporary: boolean = false) => {
    if (!isTemporary) {
      storage.updateTransaction(updatedTransaction);
      setAllTransactions(storage.getTransactions());
    } else {
      // For temporary updates during editing, just update the state without persisting
      setAllTransactions(prev => 
        prev.map(t => t.transactionId === updatedTransaction.transactionId ? updatedTransaction : t)
      );
    }
  };

  const handleDelete = (transactionId: string) => {
    storage.deleteTransaction(transactionId);
    setAllTransactions(storage.getTransactions());
  };

  const handleAdd = (newTransaction: Omit<Transaction, 'transactionId' | 'displayId'>) => {
    const currentTransactions = storage.getTransactions();
    
    // Get the selected account
    const selectedAccount = accounts.find(a => a.id === selectedAccountId)!; // We know this exists
    
    // Find the last transaction ID for this account
    const accountTransactions = currentTransactions.filter(t => t.accountId === selectedAccountId);
    const lastTransaction = accountTransactions[accountTransactions.length - 1];
    
    // Determine the next display ID based on the business rules
    let nextDisplayId: string;
    if (lastTransaction) {
      // If there are existing transactions, increment the last one
      nextDisplayId = (parseInt(lastTransaction.displayId) + 1).toString().padStart(8, '0');
    } else if (selectedAccount.startingTransactionId) {
      // If no transactions but account has a starting ID, use that
      nextDisplayId = selectedAccount.startingTransactionId;
    } else {
      // Default to 00000001
      nextDisplayId = '00000001';
    }
    
    const transactionId = (currentTransactions.length + 1).toString();
    const fullTransaction = { 
      ...newTransaction, 
      transactionId,
      displayId: nextDisplayId,
      accountId: selectedAccountId
    };
    
    storage.addTransaction(fullTransaction);
    setAllTransactions(storage.getTransactions());
  };

  // If no accounts exist, show a message instead of the transaction grid
  if (accounts.length === 0) {
    return (
      <Box sx={{ 
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2
      }}>
        <Typography variant="h4" component="h1">
          No Accounts Available
        </Typography>
        <Typography variant="body1">
          Please create at least one account before managing transactions.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        gap: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h4" component="h1">
          Transactions
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Account</InputLabel>
          <Select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            label="Account"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300
                }
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'right'
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
              }
            }}
          >
            {accounts.map(account => (
              <MenuItem key={account.id} value={account.id}>
                {account.name} ({account.id})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        <TransactionGrid
          transactions={filteredTransactions}
          accounts={accounts}
          categories={categories}
          selectedAccountId={selectedAccountId}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </Box>
    </Box>
  );
};

export default TransactionPage; 
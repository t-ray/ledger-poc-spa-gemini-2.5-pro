// src/components/AccountForm.tsx
import React, { useState, useEffect } from 'react';
import { Account } from '../models/Account';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Helpers remain the same
const formatCentsToDollars = (cents: number): string => (cents / 100).toFixed(2);
const formatDollarsToCents = (dollars: string | number): number => {
    const numericValue = typeof dollars === 'string' ? parseFloat(dollars) : dollars;
    if (isNaN(numericValue)) return 0;
    return Math.round(numericValue * 100);
};

interface AccountFormProps {
  onSubmit: (account: Account | null) => void;
  initialData?: Account | null;
  existingAccountIds: string[];
}

const AccountForm: React.FC<AccountFormProps> = ({ onSubmit, initialData, existingAccountIds }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<'asset' | 'liability'>('asset');
  const [startBalanceStr, setStartBalanceStr] = useState('0.00');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setName(initialData.name);
      setAccountType(initialData.accountType);
      setStartBalanceStr(formatCentsToDollars(initialData.startingBalance));
      setStartDate(initialData.startingBalanceDate);
    } else {
      setId('');
      setName('');
      setAccountType('asset');
      setStartBalanceStr('0.00');
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedId = id.trim();
    const trimmedName = name.trim();
    if (!trimmedId || !trimmedName || !startDate) {
      alert('Account ID, Name, and Start Date are required.');
      return;
    }
    if (!isEditing && existingAccountIds.some(existingId => existingId.toLowerCase() === trimmedId.toLowerCase())) {
      alert(`Account ID '${trimmedId}' already exists.`);
      return;
    }
    const startingBalanceCents = formatDollarsToCents(startBalanceStr);
    const accountData: Account = {
      id: trimmedId, name: trimmedName, accountType,
      startingBalance: startingBalanceCents, startingBalanceDate: startDate,
    };
    onSubmit(accountData);
    if (!isEditing) {
      setId(''); setName(''); setAccountType('asset'); setStartBalanceStr('0.00');
      setStartDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 3, p: 2, border: '1px solid', borderColor: 'grey.300',
        borderRadius: 1, backgroundColor: 'grey.50'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Edit Account' : 'Add New Account'}
      </Typography>
      <Stack spacing={2}> {/* Use Stack for vertical spacing */}
        <TextField
          label="Account ID"
          variant="outlined"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
          disabled={isEditing}
          fullWidth
          size="small"
          helperText={isEditing ? "ID cannot be changed" : ""}
        />
        <TextField
          label="Account Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          size="small"
        />
        <FormControl fullWidth size="small">
          <InputLabel id="account-type-label">Account Type</InputLabel>
          <Select
            labelId="account-type-label"
            label="Account Type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as 'asset' | 'liability')}
          >
            <MenuItem value="asset">Asset (Checking, Savings, Cash)</MenuItem>
            <MenuItem value="liability">Liability (Credit Card, Loan)</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Starting Balance ($)"
          variant="outlined"
          type="number"
          inputProps={{ step: "0.01" }} // Allow decimals
          value={startBalanceStr}
          onChange={(e) => setStartBalanceStr(e.target.value)}
          required
          fullWidth
          size="small"
        />
        <TextField
          label="Starting Balance Date"
          variant="outlined"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }} // Important for date input label
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button type="submit" variant="contained">
            {isEditing ? 'Update Account' : 'Add Account'}
            </Button>
            {isEditing && (
            <Button variant="outlined" onClick={() => onSubmit(null)}>
                Cancel
            </Button>
            )}
        </Box>
      </Stack>
    </Box>
  );
};

export default AccountForm;
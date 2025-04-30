// src/components/TransactionForm.tsx
import React, { useState, useEffect } from 'react';
import { Account } from '../models/Account';
import { Category } from '../models/Category';
import { Transaction } from '../models/Transaction'; // Import base Transaction type

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';

// Define the type for the data submitted by the form (excluding generated IDs)
export type TransactionFormData = Omit<Transaction, 'transactionId' | 'displayId'>;

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (formData: TransactionFormData) => void;
}

// List of transaction types from your enum
const transactionTypes = [
  'Deposit', 'Transfer', 'Debit', 'ACH', 'Withdrawal',
  'Interest Payment', 'Check', 'Wire', 'Purchase', 'Dividend'
];

// Helper to convert display amount string (potentially signed) to cents integer
const parseAmountToCents = (amountStr: string): number | null => {
    const num = parseFloat(amountStr);
    if (isNaN(num)) {
        return null; // Indicate parsing failure
    }
    return Math.round(num * 100);
};

const TransactionForm: React.FC<TransactionFormProps> = ({ accounts, categories, onSubmit }) => {
  // Form State
  const [accountId, setAccountId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amountStr, setAmountStr] = useState<string>(''); // Signed amount as string
  const [vendor, setVendor] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subCategory, setSubCategory] = useState<string>('');
  const [digits, setDigits] = useState<string>('');
  const [isIncome, setIsIncome] = useState<boolean>(false);
  const [isFixed, setIsFixed] = useState<boolean>(false);
  const [isSpend, setIsSpend] = useState<boolean>(true); // Default spend to true
  const [notes, setNotes] = useState<string>('');

  // Reset form fields
  const resetForm = () => {
    setAccountId(accounts[0]?.id || ''); // Default to first account if available
    setDate(new Date().toISOString().split('T')[0]);
    setAmountStr('');
    setVendor('');
    setType('');
    setCategoryId(categories[0]?.id || ''); // Default to first category if available
    setSubCategory('');
    setDigits('');
    setIsIncome(false);
    setIsFixed(false);
    setIsSpend(true);
    setNotes('');
  };

    // Set default selections once accounts/categories load
    useEffect(() => {
        if (accounts.length > 0 && !accountId) {
            setAccountId(accounts[0].id);
        }
    }, [accounts, accountId]);

    useEffect(() => {
        if (categories.length > 0 && !categoryId) {
            setCategoryId(categories[0].id);
        }
    }, [categories, categoryId]);


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Basic Validation
    if (!accountId || !date || !vendor || !type || !categoryId) {
      alert('Please fill in all required fields: Account, Date, Vendor, Type, Category.');
      return;
    }

    const amountCents = parseAmountToCents(amountStr);
    if (amountCents === null) {
      alert('Please enter a valid number for the amount.');
      return;
    }

    const formData: TransactionFormData = {
      accountId,
      date,
      amount: amountCents,
      vendor: vendor.trim(),
      type,
      categoryId,
      subCategory: subCategory.trim() || undefined, // Store as undefined if empty
      digits: digits.trim() || undefined,
      isIncome,
      isFixed,
      isSpend,
      notes: notes.trim() || undefined,
    };

    onSubmit(formData);
    resetForm(); // Clear form after successful submission
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        '& .MuiTextField-root': { mb: 2 }, // Margin bottom for text fields
        '& .MuiFormControl-root': { mb: 2 }, // Margin bottom for form controls (selects)
        '& .MuiFormControlLabel-root': { mb: 1 }, // Margin bottom for checkboxes
         p: 2, border: '1px solid', borderColor: 'grey.300',
         borderRadius: 1, backgroundColor: 'grey.50'
      }}
    >
      <Typography variant="h6" gutterBottom>Enter New Transaction</Typography>

      <Stack spacing={2}>
        {/* Row 1: Account & Date */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth required size="small">
            <InputLabel id="account-select-label">Account</InputLabel>
            <Select
              labelId="account-select-label"
              label="Account"
              value={accountId}
              onChange={(e: SelectChangeEvent<string>) => setAccountId(e.target.value)}
            >
              {accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.name} ({acc.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
            size="small"
          />
        </Stack>

        {/* Row 2: Amount & Vendor */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Amount (+/-)"
            // Use text type for better control over +/- and decimals
            type="text"
            // Basic pattern to allow optional '-', digits, optional '.', optional digits
            inputProps={{ inputMode: 'decimal', pattern: "^-?\\d*\\.?\\d*$" }}
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            required
            fullWidth
            size="small"
            placeholder="e.g., 25.50 or -10.00"
          />
           <TextField
            label="Vendor/Description"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            required
            fullWidth
            size="small"
          />
        </Stack>

        {/* Row 3: Type & Category */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth required size="small">
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              label="Type"
              value={type}
              onChange={(e: SelectChangeEvent<string>) => setType(e.target.value)}
            >
              {transactionTypes.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>
           <FormControl fullWidth required size="small">
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              label="Category"
              value={categoryId}
              onChange={(e: SelectChangeEvent<string>) => setCategoryId(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

         {/* Row 4: SubCategory & Digits */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
                label="Sub-Category (Optional)"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                fullWidth
                size="small"
            />
            <TextField
                label="Card/Account Digits (Optional)"
                value={digits}
                onChange={(e) => setDigits(e.target.value)}
                fullWidth
                size="small"
            />
        </Stack>

        {/* Row 5: Flags (Checkboxes) */}
         <Stack direction="row" spacing={1} justifyContent="space-around" flexWrap="wrap">
             <FormControlLabel
                control={<Checkbox checked={isIncome} onChange={(e) => setIsIncome(e.target.checked)} />}
                label="Income?"
             />
             <FormControlLabel
                control={<Checkbox checked={isFixed} onChange={(e) => setIsFixed(e.target.checked)} />}
                label="Fixed/Recurring?"
             />
             <FormControlLabel
                control={<Checkbox checked={isSpend} onChange={(e) => setIsSpend(e.target.checked)} />}
                label="Counts as Spending?"
             />
         </Stack>

        {/* Row 6: Notes */}
        <TextField
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            size="small"
            multiline
            rows={2}
        />

        {/* Row 7: Submit Button */}
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          Add Transaction
        </Button>
      </Stack>
    </Box>
  );
};

export default TransactionForm;
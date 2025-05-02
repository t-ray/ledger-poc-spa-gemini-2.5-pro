import React, { useState, useEffect, useRef } from 'react';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { Category } from '../models/Category';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  IconButton,
  Box,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse, isValid, isAfter, isBefore } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

interface TransactionGridProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  selectedAccountId?: string;
  onUpdate: (transaction: Transaction, isTemporary?: boolean) => void;
  onDelete: (transactionId: string) => void;
  onAdd: (transaction: Omit<Transaction, 'transactionId' | 'displayId'>) => void;
}

const transactionTypes = [
  'Deposit', 'Transfer', 'Debit', 'ACH', 'Withdrawal',
  'Interest Payment', 'Check', 'Wire', 'Purchase', 'Dividend'
];

// Column definitions with fixed widths
const columns = [
  { field: 'account', headerName: 'Account', width: 100 },
  { field: 'displayId', headerName: 'Id', width: 100 },
  { field: 'date', headerName: 'Date', width: 100 },
  { field: 'amount', headerName: 'Amount', width: 100 },
  { field: 'balance', headerName: 'Balance', width: 100 },
  { field: 'vendor', headerName: 'Vendor', width: 150 },
  { field: 'digits', headerName: 'Digits', width: 80 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'categoryId', headerName: 'Category', width: 120 },
  { field: 'subCategory', headerName: 'Subcategory', width: 120 },
  { field: 'notes', headerName: 'Notes', width: 150 },
  { field: 'isIncome', headerName: 'Income', width: 70 },
  { field: 'isFixed', headerName: 'Fixed', width: 70 },
  { field: 'isSpend', headerName: 'Spend', width: 70 }
];

// Define the navigation map for explicit next/previous field relationships
const navigationMap: Record<string, { next: string; prev: string }> = {
  date: { next: 'amount', prev: 'isSpend' },
  amount: { next: 'vendor', prev: 'date' },
  vendor: { next: 'digits', prev: 'amount' },
  digits: { next: 'type', prev: 'vendor' },
  type: { next: 'categoryId', prev: 'digits' },
  categoryId: { next: 'subCategory', prev: 'type' },
  subCategory: { next: 'notes', prev: 'categoryId' },
  notes: { next: 'isIncome', prev: 'subCategory' },
  isIncome: { next: 'isFixed', prev: 'notes' },
  isFixed: { next: 'isSpend', prev: 'isIncome' },
  isSpend: { next: 'date', prev: 'isFixed' }
};

const TransactionGrid = ({
  transactions,
  accounts,
  categories,
  selectedAccountId,
  onUpdate,
  onDelete,
  onAdd,
}: TransactionGridProps): React.ReactElement => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: keyof Transaction } | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRow, setNewRow] = useState<Partial<Omit<Transaction, 'transactionId' | 'displayId'>>>({});
  const [previousValue, setPreviousValue] = useState<any>(null);
  const [editingAmount, setEditingAmount] = useState<{ rowId: string; tempValue: string } | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const cellRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Debug logging
  useEffect(() => {
    console.log('isAddingNew:', isAddingNew);
    console.log('newRow:', newRow);
  }, [isAddingNew, newRow]);

  // Focus management
  const focusCell = (rowId: string, field: keyof Transaction) => {
    const cellKey = `${rowId}-${field}`;
    const cellElement = cellRefs.current[cellKey];
    if (cellElement) {
      cellElement.focus();
    }
  };

  // Update cell refs when editing cell changes
  useEffect(() => {
    if (editingCell) {
      focusCell(editingCell.rowId, editingCell.field);
    }
  }, [editingCell]);

  // Calculate running balances for each account
  const calculateBalances = () => {
    const balancesByAccount: { [key: string]: { balance: number, hasTransactions: boolean } } = {};
    
    // Sort transactions by date and ID to ensure correct order
    const sortedTransactions = [...transactions].sort((a, b) => {
      // First sort by date
      const dateA = parse(a.date, 'MM/dd/yyyy', new Date());
      const dateB = parse(b.date, 'MM/dd/yyyy', new Date());
      const dateCompare = dateA.getTime() - dateB.getTime();
      if (dateCompare !== 0) return dateCompare;
      
      // If dates are equal, sort by displayId
      return parseInt(a.displayId) - parseInt(b.displayId);
    });

    // Calculate running balances
    const transactionsWithBalance = sortedTransactions.map(transaction => {
      // Initialize account balance if not already done
      if (!balancesByAccount[transaction.accountId]) {
        const account = accounts.find(a => a.id === transaction.accountId);
        balancesByAccount[transaction.accountId] = {
          balance: account?.startingBalance || 0,
          hasTransactions: false
        };
      }

      const accountState = balancesByAccount[transaction.accountId];
      const newBalance = accountState.balance + transaction.amount;
      accountState.balance = newBalance;
      accountState.hasTransactions = true;

      return { ...transaction, balance: newBalance };
    });

    return transactionsWithBalance;
  };

  // Memoize the balance calculations
  const transactionsWithBalance = React.useMemo(() => {
    return calculateBalances();
  }, [transactions, accounts, JSON.stringify(transactions.map(t => ({ id: t.transactionId, amount: t.amount })))]);

  const getBalance = (transaction: Transaction | Partial<Omit<Transaction, 'transactionId' | 'displayId'>>) => {
    if (!transaction.accountId) return 0;
    
    // Get the account's starting balance
    const account = accounts.find(a => a.id === transaction.accountId);
    const startingBalance = account?.startingBalance || 0;
    
    // Get all transactions for this account
    const accountTransactions = transactionsWithBalance.filter(t => t.accountId === transaction.accountId);
    
    // If there are no transactions at all, use the starting balance
    if (accountTransactions.length === 0) {
      return startingBalance;
    }
    
    // For existing transactions, find the balance from our calculated balances
    if ('transactionId' in transaction) {
      const transWithBalance = transactionsWithBalance.find(t => t.transactionId === transaction.transactionId);
      return transWithBalance?.balance || 0;
    }
    
    // For the new row, return the last transaction's balance
    return accountTransactions[accountTransactions.length - 1].balance;
  };

  const formatCurrency = (cents: number) => {
    if (cents === 0) return '--';
    const dollars = Math.abs(cents) / 100;
    const formatted = `$${dollars.toFixed(2)}`;
    return cents < 0 ? `(${formatted})` : formatted;
  };

  const formatDisplayId = (id?: string) => {
    if (!id) return '';
    return id.padStart(8, '0');
  };

  const formatDateForDisplay = (dateStr: string) => {
    try {
      const date = parse(dateStr, 'MM/dd/yyyy', new Date());
      return format(date, 'MM/dd/yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const validateDate = (dateStr: string, transactionId: string | 'new'): string | null => {
    try {
      // Check if empty
      if (!dateStr.trim()) {
        return 'Date is required';
      }

      // Parse and validate date format
      const date = parse(dateStr, 'MM/dd/yyyy', new Date());
      if (!isValid(date)) {
        return 'Invalid date format (MM/dd/yyyy)';
      }
      
      // Check if future date
      const today = new Date();
      if (isAfter(date, today)) {
        return 'Date cannot be in the future';
      }

      // For new transactions, only validate against the future date
      if (transactionId === 'new') {
        return null;
      }

      // Sort transactions by date to find the previous transaction
      const sortedTransactions = [...transactions].sort((a, b) => {
        const dateA = parse(a.date, 'MM/dd/yyyy', new Date());
        const dateB = parse(b.date, 'MM/dd/yyyy', new Date());
        const dateCompare = dateA.getTime() - dateB.getTime();
        if (dateCompare !== 0) return dateCompare;
        return parseInt(a.displayId) - parseInt(b.displayId);
      });

      // Find current transaction index
      const currentIndex = sortedTransactions.findIndex(t => t.transactionId === transactionId);
      
      // If there's a previous transaction, check its date
      if (currentIndex > 0) {
        const prevTransaction = sortedTransactions[currentIndex - 1];
        const prevDate = parse(prevTransaction.date, 'MM/dd/yyyy', new Date());
        if (isBefore(date, prevDate)) {
          return `Date cannot be before previous transaction (${prevTransaction.date})`;
        }
      }

      return null;
    } catch (e) {
      return 'Invalid date format (MM/dd/yyyy)';
    }
  };

  const validateAmount = (value: string): string | null => {
    if (value === '') return 'Amount is required';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Invalid amount';
    return null;
  };

  const validateVendor = (value: string): string | null => {
    if (!value.trim()) {
      return 'Vendor is required';
    }
    return null;
  };

  const validateField = (field: keyof Transaction, value: any, transactionId: string | 'new'): string | null => {
    switch (field) {
      case 'date':
        return validateDate(value, transactionId);
      case 'vendor':
        return validateVendor(value);
      default:
        return null;
    }
  };

  const handleCellChange = (value: any, rowId: string, field: keyof Transaction) => {
    // For amount field, store temporary value during edit
    if (field === 'amount') {
      setEditingAmount({ rowId, tempValue: value });
      return;
    }

    // For date field, only allow numeric and slash characters
    if (field === 'date') {
      if (value === '' || /^[\d/]*$/.test(value)) {
        if (rowId === 'new') {
          setNewRow(prev => ({ ...prev, [field]: value }));
        } else {
          // During editing, just update the display value without persisting
          const transaction = transactions.find(t => t.transactionId === rowId);
          if (transaction) {
            // Create a temporary update that won't persist to storage
            onUpdate({ ...transaction, [field]: value }, true);
          }
        }
      }
      return;
    }

    if (rowId === 'new') {
      setNewRow(prev => ({ ...prev, [field]: value }));
    } else {
      const transaction = transactions.find(t => t.transactionId === rowId);
      if (transaction) {
        // During editing, just update the display value without persisting
        onUpdate({ ...transaction, [field]: value }, true);
      }
    }
  };

  const commitCellEdit = (field: keyof Transaction, value: any, rowId: string) => {
    // Special handling for amount field
    if (field === 'amount' && editingAmount) {
      commitAmountEdit();
      return true;
    }

    // Validate the field
    const validationError = validateField(field, value, rowId);
    if (validationError) {
      alert(validationError);
      // Restore previous value
      if (rowId === 'new') {
        setNewRow(prev => ({ ...prev, [field]: previousValue }));
      } else {
        const transaction = transactions.find(t => t.transactionId === rowId);
        if (transaction) {
          // Persist the previous valid value
          onUpdate({ ...transaction, [field]: previousValue }, false);
        }
      }
      return false;
    }

    // If validation passes, commit the change
    if (rowId === 'new') {
      setNewRow(prev => ({ ...prev, [field]: value }));
    } else {
      const transaction = transactions.find(t => t.transactionId === rowId);
      if (transaction) {
        // Persist the valid value
        onUpdate({ ...transaction, [field]: value }, false);
      }
    }

    return true;
  };

  const handleCellClick = (rowId: string | 'new', field: keyof Transaction | 'account' | 'balance') => {
    if (rowId === 'new' && !isAddingNew) {
      // Ensure we have a selected account before allowing new row
      if (!selectedAccountId) {
        alert('Please select an account before adding a transaction');
        return;
      }

      // Initialize new row if not already adding
      const lastTransaction = transactions[transactions.length - 1];
      const defaultDate = lastTransaction?.date || format(new Date(), 'MM/dd/yyyy');
      
      // Ensure we have at least one category
      if (categories.length === 0) {
        alert('Please create at least one category before adding transactions');
        return;
      }
      
      setNewRow({
        date: defaultDate,
        accountId: selectedAccountId,
        amount: 0,
        vendor: '',
        type: transactionTypes[0],
        categoryId: categories[0]?.id || '',
        isIncome: false,
        isFixed: false,
        isSpend: true,
      });
      setIsAddingNew(true);
    }

    const transaction = rowId === 'new' ? newRow : transactions.find(t => t.transactionId === rowId);
    if (!transaction) return; // Guard against null transaction
    
    setPreviousValue(transaction[field as keyof typeof transaction]);
    setEditingCell({ rowId, field: field as keyof Transaction });
  };

  const commitAmountEdit = () => {
    if (!editingAmount) return;

    const { rowId, tempValue } = editingAmount;
    const numValue = parseFloat(tempValue || '0');
    const centsValue = Math.round(numValue * 100);

    if (rowId === 'new') {
      setNewRow(prev => ({ ...prev, amount: centsValue }));
    } else {
      const transaction = transactions.find(t => t.transactionId === rowId);
      if (transaction) {
        onUpdate({ ...transaction, amount: centsValue }, false);
      }
    }
    setEditingAmount(null);
  };

  const handleAddClick = () => {
    if (!selectedAccountId) {
      alert('Please select an account before adding a transaction');
      return;
    }

    const lastTransaction = transactions[transactions.length - 1];
    const defaultDate = lastTransaction?.date || format(new Date(), 'MM/dd/yyyy');
    
    setNewRow({
      date: defaultDate,
      accountId: selectedAccountId,
      amount: 0,
      vendor: '',
      type: transactionTypes[0],
      categoryId: categories[0]?.id || '',
      isIncome: false,
      isFixed: false,
      isSpend: true,
    });
    setIsAddingNew(true);
    setEditingCell({ rowId: 'new', field: 'date' });
  };

  const validateNewTransaction = () => {
    if (!newRow.date) return 'Date is required';
    if (!newRow.vendor) return 'Vendor is required';
    if (!newRow.type) return 'Type is required';
    if (!newRow.categoryId) return 'Category is required';
    if (newRow.amount === undefined) return 'Amount is required';
    return null;
  };

  const handleNewRowSubmit = () => {
    const validationError = validateNewTransaction();
    if (validationError) {
      alert(validationError);
      return;
    }

    onAdd(newRow as Omit<Transaction, 'transactionId' | 'displayId'>);
    setNewRow({});
    setIsAddingNew(false);
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, transaction: Transaction | Partial<Omit<Transaction, 'transactionId' | 'displayId'>>) => {
    if (!editingCell) return;

    const currentRowIndex = transactions.findIndex(t => t.transactionId === editingCell.rowId);
    const currentField = editingCell.field as string;
    const isNewRow = editingCell.rowId === 'new';

    // Prevent default behavior for all navigation keys
    if (['Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'Escape'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    switch (e.key) {
      case 'Escape':
        // Restore previous value and clear editing state
        if (currentField === 'amount' && editingAmount) {
          setEditingAmount(null);
        }
        if (isNewRow) {
          setNewRow(prev => ({ ...prev, [editingCell.field]: previousValue }));
        } else {
          const transaction = transactions.find(t => t.transactionId === editingCell.rowId);
          if (transaction) {
            onUpdate({ ...transaction, [editingCell.field]: previousValue }, false);
          }
        }
        setEditingCell(null);
        setPreviousValue(null);
        break;

      case 'Tab':
      case 'Enter': {
        const currentValue = isNewRow 
          ? newRow[editingCell.field as keyof typeof newRow]
          : transaction[editingCell.field as keyof typeof transaction];

        // Try to commit the current edit
        const commitSuccess = commitCellEdit(
          editingCell.field,
          currentValue,
          editingCell.rowId
        );

        // Only proceed with navigation if commit was successful
        if (commitSuccess) {
          if (e.key === 'Tab') {
            const nextField = e.shiftKey ? navigationMap[currentField].prev : navigationMap[currentField].next;
            setEditingCell({
              rowId: editingCell.rowId,
              field: nextField as keyof Transaction
            });
          } else if (e.key === 'Enter') {
            if (isNewRow) {
              const validationError = validateNewTransaction();
              if (validationError) {
                alert(validationError);
                return;
              }
              handleNewRowSubmit();
            } else {
              const nextRowIndex = currentRowIndex + 1;
              if (nextRowIndex < transactions.length) {
                setEditingCell({
                  rowId: transactions[nextRowIndex].transactionId,
                  field: editingCell.field
                });
              } else {
                setEditingCell(null);
              }
            }
          }
          setPreviousValue(null);
        }
        break;
      }

      case 'ArrowLeft':
        setEditingCell({
          rowId: editingCell.rowId,
          field: navigationMap[currentField].prev as keyof Transaction
        });
        break;

      case 'ArrowRight':
        setEditingCell({
          rowId: editingCell.rowId,
          field: navigationMap[currentField].next as keyof Transaction
        });
        break;

      case 'ArrowUp':
        if (currentRowIndex > 0) {
          setEditingCell({
            rowId: transactions[currentRowIndex - 1].transactionId,
            field: editingCell.field
          });
        }
        break;

      case 'ArrowDown':
        if (currentRowIndex < transactions.length - 1) {
          setEditingCell({
            rowId: transactions[currentRowIndex + 1].transactionId,
            field: editingCell.field
          });
        } else if (!isNewRow) {
          // Only start editing new row if we're not already editing it
          handleAddClick();
        }
        break;

      case ' ':
        if (['isIncome', 'isFixed', 'isSpend'].includes(currentField)) {
          const currentValue = transaction[currentField as keyof typeof transaction] as boolean;
          handleCellChange(!currentValue, editingCell.rowId, currentField as keyof Transaction);
        }
        break;
    }
  };

  const renderCell = (
    transaction: Transaction | Partial<Omit<Transaction, 'transactionId' | 'displayId'>>,
    field: keyof Omit<Transaction, 'transactionId' | 'displayId'> | 'account' | 'displayId' | 'balance'
  ) => {
    // Guard against null transaction
    if (!transaction) return null;

    const isEditing = editingCell && (
      (editingCell.rowId === (transaction as Transaction).transactionId && editingCell.field === field) ||
      (editingCell.rowId === 'new' && transaction === newRow && editingCell.field === field)
    );
    const value = transaction[field as keyof typeof transaction];
    const cellKey = `${(transaction as Transaction).transactionId || 'new'}-${field}`;

    // Helper function to handle input focus and selection
    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
      event.target.select();
    };

    // Don't allow editing or focus of readonly fields
    if (['displayId', 'account', 'balance'].includes(field)) {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {field === 'account' ? (transaction as any).accountId || '' :
           field === 'displayId' ? formatDisplayId(value as string) :
           field === 'balance' ? formatCurrency(getBalance(transaction as any)) : value || ''}
        </Box>
      );
    }

    if (isEditing) {
      switch (field) {
        case 'amount':
          const amountValue = editingAmount && (editingAmount.rowId === (transaction as Transaction).transactionId || (editingAmount.rowId === 'new' && transaction === newRow))
            ? editingAmount.tempValue 
            : typeof value === 'number' ? (value / 100).toString() : '';
          return (
            <TextField
              value={amountValue}
              onChange={(e) => {
                const input = e.target.value;
                if (input === '' || /^-?\d*\.?\d*$/.test(input)) {
                  handleCellChange(input, (transaction as Transaction).transactionId || 'new', field as keyof Transaction);
                }
              }}
              onFocus={handleInputFocus}
              onBlur={(e) => {
                if (editingAmount) {
                  commitAmountEdit();
                }
                setEditingCell(null);
              }}
              onKeyDown={(e) => handleKeyDown(e, transaction)}
              size="small"
              fullWidth
              variant="standard"
              autoFocus
              InputProps={{ 
                disableUnderline: false,
                sx: { 
                  '& .MuiInputBase-input': {
                    border: 'none',
                    outline: 'none'
                  }
                }
              }}
            />
          );
        case 'date':
        case 'vendor':
        case 'digits':
        case 'subCategory':
        case 'notes':
          return (
            <TextField
              value={value || ''}
              onChange={(e) => handleCellChange(e.target.value, (transaction as Transaction).transactionId || 'new', field as keyof Transaction)}
              onFocus={handleInputFocus}
              onBlur={(e) => {
                // Only clear editing state if we're not handling a keyboard navigation event
                if (!e.relatedTarget || !e.relatedTarget.closest('.MuiTableCell-root')) {
                  setEditingCell(null);
                  setPreviousValue(null);
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, transaction)}
              size="small"
              fullWidth
              variant="standard"
              autoFocus
              InputProps={{ 
                disableUnderline: false,
                sx: { 
                  '& .MuiInputBase-input': {
                    border: 'none',
                    outline: 'none'
                  }
                }
              }}
            />
          );
        case 'type':
          return (
            <FormControl fullWidth size="small" variant="standard">
              <Select
                value={value || ''}
                onChange={(e) => handleCellChange(e.target.value, (transaction as Transaction).transactionId || 'new', field as keyof Transaction)}
                onKeyDown={(e) => handleKeyDown(e, transaction)}
                disableUnderline={false}
                autoFocus
                open={false}
                inputRef={(el) => {
                  cellRefs.current[cellKey] = el;
                }}
                MenuProps={{
                  onKeyDown: (e) => handleKeyDown(e, transaction),
                  disableAutoFocusItem: true,
                  disablePortal: true,
                  anchorEl: null,
                  open: false
                }}
                sx={{
                  '& .MuiSelect-select': {
                    border: 'none',
                    outline: 'none'
                  }
                }}
              >
                {transactionTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        case 'categoryId':
          return (
            <FormControl fullWidth size="small" variant="standard">
              <Select
                value={value || ''}
                onChange={(e) => handleCellChange(e.target.value, (transaction as Transaction).transactionId || 'new', field as keyof Transaction)}
                onKeyDown={(e) => handleKeyDown(e, transaction)}
                disableUnderline={false}
                autoFocus
                open={false}
                inputRef={(el) => {
                  cellRefs.current[cellKey] = el;
                }}
                MenuProps={{
                  onKeyDown: (e) => handleKeyDown(e, transaction),
                  disableAutoFocusItem: true,
                  disablePortal: true,
                  anchorEl: null,
                  open: false
                }}
                sx={{
                  '& .MuiSelect-select': {
                    border: 'none',
                    outline: 'none'
                  }
                }}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        case 'isIncome':
        case 'isFixed':
        case 'isSpend':
          return (
            <Checkbox
              checked={!!value}
              onChange={(e) => handleCellChange(e.target.checked, (transaction as Transaction).transactionId || 'new', field as keyof Transaction)}
              onKeyDown={(e) => handleKeyDown(e, transaction)}
              autoFocus
              inputRef={(el) => {
                cellRefs.current[cellKey] = el;
              }}
              inputProps={{
                'aria-label': field,
                tabIndex: 0
              }}
              sx={{
                '&:focus': {
                  outline: 'none'
                }
              }}
            />
          );
        default:
          return (
            <TextField
              value={value || ''}
              onChange={(e) => handleCellChange(e.target.value, (transaction as Transaction).transactionId || 'new', field as keyof Transaction)}
              onKeyDown={(e) => handleKeyDown(e, transaction)}
              size="small"
              fullWidth
              variant="standard"
              autoFocus
              InputProps={{ 
                disableUnderline: false,
                sx: { 
                  '& .MuiInputBase-input': {
                    border: 'none',
                    outline: 'none'
                  }
                }
              }}
            />
          );
      }
    }

    // Display value for non-editing state
    switch (field) {
      case 'account':
        return (transaction as any).accountId || '';
      case 'displayId':
        if (transaction === newRow) {
          // Get the selected account
          const selectedAccount = accounts.find(a => a.id === selectedAccountId);
          if (!selectedAccount) return '';

          // If there are existing transactions for this account, increment the last one
          const accountTransactions = transactions.filter(t => t.accountId === selectedAccountId);
          const lastTransaction = accountTransactions[accountTransactions.length - 1];
          
          if (lastTransaction) {
            return formatDisplayId((parseInt(lastTransaction.displayId) + 1).toString());
          } else if (selectedAccount.startingTransactionId) {
            // If no transactions but account has a starting ID, use that
            return formatDisplayId(selectedAccount.startingTransactionId);
          } else {
            // Default to 00000001
            return formatDisplayId('1');
          }
        }
        return formatDisplayId((transaction as Transaction).displayId);
      case 'date':
        return formatDateForDisplay(value as string || '');
      case 'amount':
        // Show temporary value if editing this cell
        if (editingAmount && editingAmount.rowId === (transaction as Transaction).transactionId) {
          const tempNumValue = parseFloat(editingAmount.tempValue || '0');
          return isNaN(tempNumValue) ? '--' : formatCurrency(Math.round(tempNumValue * 100));
        }
        return typeof value === 'number' ? formatCurrency(value) : '--';
      case 'balance':
        return formatCurrency(getBalance(transaction as any));
      case 'categoryId':
        const category = categories.find(cat => cat.id === value);
        return category ? category.name : '';
      case 'isIncome':
      case 'isFixed':
      case 'isSpend':
        return <Checkbox checked={!!value} disabled />;
      default:
        return value || '';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TableContainer 
        component={Paper} 
        sx={{ 
          height: '100%',
          width: '100%',
          overflow: 'auto',
          '& .MuiTable-root': {
            tableLayout: 'fixed',
            width: 'max-content',
            minWidth: '100%'
          },
          '& .MuiTableCell-root': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            padding: '4px 8px',
            '&:last-child': {
              borderRight: 'none',
              padding: '4px'
            }
          }
        }}
      >
        <Table 
          ref={tableRef} 
          size="small" 
          stickyHeader
          tabIndex={0}
          onKeyDown={(e) => {
            if (editingCell) {
              handleKeyDown(e as React.KeyboardEvent, 
                editingCell.rowId === 'new' ? newRow : 
                transactions.find(t => t.transactionId === editingCell.rowId)!
              );
            }
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  sx={{
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width,
                    fontWeight: 'bold',
                    backgroundColor: 'grey.100',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              <TableCell 
                padding="checkbox"
                sx={{ 
                  width: 70,
                  minWidth: 70,
                  maxWidth: 70,
                  backgroundColor: 'grey.100',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transactionId}>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    onClick={() => handleCellClick(transaction.transactionId, column.field as keyof Transaction | 'account' | 'balance')}
                    sx={{
                      width: column.width,
                      minWidth: column.width,
                      maxWidth: column.width,
                      cursor: 'pointer',
                      padding: '8px',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      ...(editingCell?.rowId === transaction.transactionId && editingCell?.field === column.field && {
                        outline: '2px solid #1976d2',
                        outlineOffset: '-2px',
                        zIndex: 1
                      })
                    }}
                  >
                    {renderCell(transaction, column.field as keyof Omit<Transaction, 'transactionId' | 'displayId'>)}
                  </TableCell>
                ))}
                <TableCell padding="checkbox">
                  <IconButton onClick={() => onDelete(transaction.transactionId)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {/* Always show new row at bottom */}
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  onClick={() => {
                    if (!selectedAccountId) {
                      alert('Please select an account before adding a transaction');
                      return;
                    }
                    if (categories.length === 0) {
                      alert('Please create at least one category before adding transactions');
                      return;
                    }
                    if (!isAddingNew) {
                      const lastTransaction = transactions[transactions.length - 1];
                      const defaultDate = lastTransaction?.date || format(new Date(), 'MM/dd/yyyy');
                    
                      setNewRow({
                        date: defaultDate,
                        accountId: selectedAccountId,
                        amount: 0,
                        vendor: '',
                        type: transactionTypes[0],
                        categoryId: categories[0]?.id || '',
                        isIncome: false,
                        isFixed: false,
                        isSpend: true,
                      });
                      setIsAddingNew(true);
                      setEditingCell({ rowId: 'new', field: column.field as keyof Transaction });
                    } else {
                      handleCellClick('new', column.field as keyof Transaction | 'account' | 'balance');
                    }
                  }}
                  sx={{
                    width: column.width,
                    minWidth: column.width,
                    maxWidth: column.width,
                    cursor: 'pointer',
                    padding: '8px',
                    position: 'relative',
                    height: '43px', // Match the height of regular rows
                    backgroundColor: isAddingNew ? 'action.hover' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    },
                    ...(editingCell?.rowId === 'new' && editingCell?.field === column.field && {
                      outline: '2px solid #1976d2',
                      outlineOffset: '-2px',
                      zIndex: 1
                    }),
                    // Show a subtle placeholder when empty
                    ...((!isAddingNew && column.field === 'vendor') && {
                      '&::before': {
                        content: '"Click to add a new transaction"',
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'text.disabled',
                        fontStyle: 'italic'
                      }
                    })
                  }}
                >
                  {isAddingNew && newRow ? renderCell(newRow, column.field as keyof Omit<Transaction, 'transactionId' | 'displayId'>) : ''}
                </TableCell>
              ))}
              <TableCell 
                padding="checkbox" 
                sx={{ 
                  backgroundColor: isAddingNew ? 'action.hover' : 'transparent',
                  height: '43px' // Match the height of regular rows
                }}
              >
                {isAddingNew && (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      onClick={() => {
                        const validationError = validateNewTransaction();
                        if (validationError) {
                          alert(validationError);
                          return;
                        }
                        handleNewRowSubmit();
                      }} 
                      size="small" 
                      color="primary"
                    >
                      <CheckIcon />
                    </IconButton>
                  </Box>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </LocalizationProvider>
  );
};

export default TransactionGrid; 
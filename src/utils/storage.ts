import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import { Category } from '../models/Category';

const STORAGE_KEYS = {
  ACCOUNTS: 'ledger_accounts',
  TRANSACTIONS: 'ledger_transactions',
  CATEGORIES: 'ledger_categories'
} as const;

export const storage = {
  // Account operations
  getAccounts: (): Account[] => {
    const accounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return accounts ? JSON.parse(accounts) : [];
  },

  saveAccounts: (accounts: Account[]): void => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },

  // Add a single account
  addAccount: (account: Account): void => {
    const accounts = storage.getAccounts();
    accounts.push(account);
    storage.saveAccounts(accounts);
  },

  // Update a single account
  updateAccount: (updatedAccount: Account): void => {
    const accounts = storage.getAccounts();
    const index = accounts.findIndex(acc => acc.id === updatedAccount.id);
    if (index !== -1) {
      accounts[index] = updatedAccount;
      storage.saveAccounts(accounts);
    }
  },

  // Delete a single account
  deleteAccount: (accountId: string): void => {
    const accounts = storage.getAccounts();
    const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
    storage.saveAccounts(filteredAccounts);
  },

  // Transaction operations
  getTransactions: (): Transaction[] => {
    const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return transactions ? JSON.parse(transactions) : [];
  },

  saveTransactions: (transactions: Transaction[]): void => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  addTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    transactions.push(transaction);
    storage.saveTransactions(transactions);
  },

  updateTransaction: (updatedTransaction: Transaction): void => {
    const transactions = storage.getTransactions();
    const index = transactions.findIndex(trans => trans.transactionId === updatedTransaction.transactionId);
    if (index !== -1) {
      transactions[index] = updatedTransaction;
      storage.saveTransactions(transactions);
    }
  },

  deleteTransaction: (transactionId: string): void => {
    const transactions = storage.getTransactions();
    const filteredTransactions = transactions.filter(trans => trans.transactionId !== transactionId);
    storage.saveTransactions(filteredTransactions);
  },

  // Category operations
  getCategories: (): Category[] => {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : [];
  },

  saveCategories: (categories: Category[]): void => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  addCategory: (category: Category): void => {
    const categories = storage.getCategories();
    categories.push(category);
    storage.saveCategories(categories);
  },

  updateCategory: (updatedCategory: Category): void => {
    const categories = storage.getCategories();
    const index = categories.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      categories[index] = updatedCategory;
      storage.saveCategories(categories);
    }
  },

  deleteCategory: (categoryId: string): void => {
    const categories = storage.getCategories();
    const filteredCategories = categories.filter(cat => cat.id !== categoryId);
    storage.saveCategories(filteredCategories);
  }
}; 
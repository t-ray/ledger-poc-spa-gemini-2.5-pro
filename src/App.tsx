// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import AccountsPage from './pages/AccountsPage';
import AccountFormPage from './pages/AccountFormPage';
import TransactionPage from './pages/TransactionPage';
import TransactionEntryPage from './pages/TransactionEntryPage';
import CategoriesPage from './pages/CategoriesPage';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline
import Container from '@mui/material/Container'; // Import Container

const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline /> {/* Apply baseline styles */}
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<TransactionPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/enter-transaction" element={<TransactionEntryPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/new" element={<AccountFormPage />} />
          <Route path="/accounts/edit/:accountId" element={<AccountFormPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
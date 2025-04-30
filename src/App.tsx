// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import TransactionEntryPage from './pages/TransactionEntryPage';
import AccountsPage from './pages/AccountsPage';
import CategoriesPage from './pages/CategoriesPage';
import CssBaseline from '@mui/material/CssBaseline'; // Import CssBaseline
import Container from '@mui/material/Container'; // Import Container

const App: React.FC = () => {
  return (
    <>
      <CssBaseline /> {/* Apply baseline styles */}
      <NavBar />
      {/* Use MUI Container for consistent padding and max-width */}
      <Container component="main" sx={{ mt: 2, mb: 2 }}> {/* Add top/bottom margin */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/entry" element={<TransactionEntryPage />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
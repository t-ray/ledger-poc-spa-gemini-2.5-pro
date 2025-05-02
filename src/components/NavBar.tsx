// src/components/NavBar.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Use alias for Router Link
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const NavBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Application Title */}
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            flexGrow: 0,
            textDecoration: 'none',
            color: 'inherit',
            marginRight: 4
          }}
        >
          Ledger
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/transactions">Transactions</Button>
          <Button color="inherit" component={RouterLink} to="/accounts">Accounts</Button>
          <Button color="inherit" component={RouterLink} to="/categories">Categories</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
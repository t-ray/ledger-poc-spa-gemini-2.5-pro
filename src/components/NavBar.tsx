// src/components/NavBar.tsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Use alias for Router Link
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; // Optional for title

const NavBar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Optional Title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Finance Tracker
        </Typography>

        {/* Navigation Buttons */}
        <Box>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/entry">Enter Transaction</Button>
          <Button color="inherit" component={RouterLink} to="/accounts">Accounts</Button>
          <Button color="inherit" component={RouterLink} to="/categories">Categories</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
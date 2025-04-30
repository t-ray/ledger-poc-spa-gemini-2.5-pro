// src/components/AccountList.tsx
import React from 'react';
import { Account } from '../models/Account';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const formatCurrency = (cents: number): string => `$${(cents / 100).toFixed(2)}`;

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (accountId: string) => void;
}

const AccountList: React.FC<AccountListProps> = ({ accounts, onEdit, onDelete }) => {
  return (
     <Box>
      <Typography variant="h6" gutterBottom>Existing Accounts</Typography>
      {accounts.length === 0 ? (
        <Typography>No accounts found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table" size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold' }}}>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Start Balance</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow
                  key={account.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{account.id}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.accountType}</TableCell>
                  <TableCell align="right">{formatCurrency(account.startingBalance)}</TableCell>
                  <TableCell>{account.startingBalanceDate}</TableCell>
                  <TableCell align="right">
                     <IconButton onClick={() => onEdit(account)} size="small" aria-label="edit">
                      <EditIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={() => onDelete(account.id)} size="small" aria-label="delete">
                      <DeleteIcon fontSize="small"/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
       )}
    </Box>
  );
};

export default AccountList;
// src/components/CategoryList.tsx
import React from 'react';
import { Category } from '../models/Category';
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

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Existing Categories</Typography>
      {categories.length === 0 ? (
        <Typography>No categories found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 300 }} size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold' }}}>
                <TableCell>Name</TableCell>
                {/* Optional: Show ID if different from Name
                <TableCell>ID</TableCell> */}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow
                  key={category.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {category.name}
                  </TableCell>
                  {/* <TableCell>{category.id}</TableCell> */}
                  <TableCell align="right">
                    <IconButton onClick={() => onEdit(category)} size="small" aria-label="edit">
                      <EditIcon fontSize="small"/>
                    </IconButton>
                    <IconButton onClick={() => onDelete(category.id)} size="small" aria-label="delete">
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

export default CategoryList;
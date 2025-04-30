// src/components/CategoryForm.tsx
import React, { useState, useEffect } from 'react';
import { Category } from '../models/Category';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface CategoryFormProps {
  onSubmit: (category: Category | null) => void; // Null allows cancelling edit
  initialData?: Category | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const isEditing = !!initialData;

  useEffect(() => {
    setName(initialData ? initialData.name : '');
  }, [initialData]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      alert('Category name cannot be empty.');
      return;
    }
    const categoryData: Category = {
      id: isEditing ? initialData!.id : name,
      name: name.trim(),
    };
    onSubmit(categoryData);
    if (!isEditing) {
      setName('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mb: 3, // Margin bottom
        p: 2, // Padding
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 1,
        backgroundColor: 'grey.50'
      }}
    >
      <Typography variant="h6" gutterBottom>
        {isEditing ? 'Edit Category' : 'Add New Category'}
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Category Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth // Takes full width of its container in the stack
          size="small"
        />
        <Button type="submit" variant="contained">
          {isEditing ? 'Update' : 'Add'}
        </Button>
        {isEditing && (
          <Button variant="outlined" onClick={() => onSubmit(null)}>
            Cancel
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default CategoryForm;
// src/pages/CategoriesPage.tsx
import React, { useState } from 'react';
import { Category } from '../models/Category';
import CategoryForm from '../components/CategoryForm';
import CategoryList from '../components/CategoryList';
import Typography from '@mui/material/Typography'; // Use Typography
import Box from '@mui/material/Box'; // Use Box for layout if needed

// Mock data - replace with actual data fetching later
const initialCategories: Category[] = [
  { id: 'Groceries', name: 'Groceries' },
  { id: 'Salary', name: 'Salary' },
  { id: 'Utilities', name: 'Utilities' },
];

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = (newCategory: Category) => {
     // Basic check for duplicate name/id
    if (categories.some(cat => cat.id.toLowerCase() === newCategory.id.toLowerCase())) {
        alert(`Category with name/ID '${newCategory.id}' already exists.`);
        return;
    }
    setCategories([...categories, newCategory]);
    setEditingCategory(null); // Clear editing state
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    // Check if name changed to one that already exists (excluding itself)
    if (categories.some(cat => cat.id.toLowerCase() === updatedCategory.name.toLowerCase() && cat.id !== updatedCategory.id)) {
        alert(`Another category with the name '${updatedCategory.name}' already exists.`);
        return;
    }
     // Assume ID doesn't change, update name based on ID
    setCategories(
      categories.map((cat) =>
        cat.id === updatedCategory.id ? { ...cat, name: updatedCategory.name } : cat
      )
    );
    setEditingCategory(null); // Exit editing mode
  };

   // This is called from the form's submit when editing
  const handleFormSubmit = (categoryData: Category | null) => {
      if (!categoryData) { // Handle Cancel Edit button
          setEditingCategory(null);
          return;
      }
      if (editingCategory) {
          handleUpdateCategory(categoryData);
      } else {
          handleAddCategory(categoryData);
      }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm(`Are you sure you want to delete category "${categoryId}"?`)) {
      // TODO: Check if category is used in transactions before deleting in a real app
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      if (editingCategory?.id === categoryId) {
          setEditingCategory(null); // Clear form if deleted category was being edited
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category); // Set category to edit, form will populate
  };

  return (
    // Use Box or Fragment, Container is handled in App.tsx
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
          Manage Categories
      </Typography>
      <CategoryForm onSubmit={handleFormSubmit} initialData={editingCategory} />
      <CategoryList
        categories={categories}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />
    </Box>
  );
};

export default CategoriesPage;
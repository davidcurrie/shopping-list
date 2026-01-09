import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Fab,
  FormControlLabel,
  Switch,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useShoppingStore } from '../../store/shoppingStore';
import { groupItemsByHomeCategory } from '../../utils/categoryHelpers';
import { CategoryGroup } from './CategoryGroup';
import { fileSystemService } from '../../services/fileSystemService';
import { yamlService } from '../../services/yamlService';
import { useState } from 'react';
import { Item } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function HomeListView() {
  const items = useShoppingStore((state) => state.items);
  const selectedItemIds = useShoppingStore(
    (state) => state.selection
  );
  const toggleItemSelection = useShoppingStore(
    (state) => state.toggleItemSelection
  );
  const addItem = useShoppingStore((state) => state.addItem);
  const updateItem = useShoppingStore((state) => state.updateItem);
  const deleteItem = useShoppingStore((state) => state.deleteItem);
  const loadData = useShoppingStore((state) => state.loadData);
  const setFileHandle = useShoppingStore((state) => state.setFileHandle);
  const fileHandle = useShoppingStore((state) => state.fileHandle);

  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    homeCategory: '',
    notes: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showUnselected, setShowUnselected] = useState(true);

  const homeCategories = useShoppingStore((state) => state.homeCategories);

  // Filter items based on showUnselected toggle
  const filteredItems = showUnselected
    ? items
    : items.filter(item => selectedItemIds.includes(item.id));

  const categories = groupItemsByHomeCategory(filteredItems, homeCategories);
  const selectedCount = selectedItemIds.length;

  const handleOpenFile = async () => {
    try {
      setError(null);
      const handle = await fileSystemService.requestFileHandle();
      const content = await fileSystemService.readFile(handle);
      const data = yamlService.deserialize(content);
      loadData(data);
      setFileHandle(handle);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to open file');
      }
    }
  };

  const handleCreateFile = async () => {
    try {
      setError(null);
      const handle = await fileSystemService.createNewFile();
      const defaultData = yamlService.createDefaultData();
      const content = yamlService.serialize(defaultData);
      await fileSystemService.writeFile(handle, content);
      loadData(defaultData);
      setFileHandle(handle);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create file');
      }
    }
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({ name: '', homeCategory: '', notes: '' });
    setDialogOpen(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      homeCategory: item.homeCategory,
      notes: item.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name.trim() || !formData.homeCategory.trim()) {
      return;
    }

    if (editingItem) {
      updateItem(editingItem.id, {
        name: formData.name.trim(),
        homeCategory: formData.homeCategory.trim(),
        notes: formData.notes.trim() || undefined,
      });
    } else {
      addItem({
        name: formData.name.trim(),
        homeCategory: formData.homeCategory.trim(),
        notes: formData.notes.trim() || undefined,
        shopAvailability: [],
      });
    }

    setDialogOpen(false);
  };

  const handleDeleteItem = () => {
    if (editingItem && deleteConfirm) {
      deleteItem(deleteConfirm);
      setDeleteConfirm(null);
      setDialogOpen(false);
    }
  };

  // Check if File System Access API is supported
  if (!fileSystemService.isSupported()) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error">
          <Typography variant="body1" paragraph>
            Your browser doesn't support the File System Access API, which is
            required for this application.
          </Typography>
          <Typography variant="body2">
            Please use a modern browser like Chrome, Edge, or Safari 15.2+ on
            desktop or mobile.
          </Typography>
        </Alert>
      </Box>
    );
  }

  // Show file picker if no file is loaded
  if (!fileHandle) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Welcome to Shopping List
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            To get started, open an existing shopping list file or create a new
            one.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <Button
              variant="contained"
              startIcon={<FolderOpenIcon />}
              onClick={handleOpenFile}
            >
              Open File
            </Button>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleCreateFile}
            >
              Create New File
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  // Show empty state if no items
  if (items.length === 0) {
    return (
      <>
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No Items Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click the + button below to add your first item.
            </Typography>
          </Paper>
        </Box>

        <Fab
          color="primary"
          aria-label="add item"
          onClick={handleAddItem}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Item Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Home Category"
              fullWidth
              value={formData.homeCategory}
              onChange={(e) =>
                setFormData({ ...formData, homeCategory: e.target.value })
              }
              required
              helperText="e.g., Fridge, Cupboard, Vegetable drawer"
            />
            <TextField
              margin="dense"
              label="Notes (optional)"
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              helperText="e.g., Brand preference, specification"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveItem}
              variant="contained"
              disabled={!formData.name.trim() || !formData.homeCategory.trim()}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h5">
            Home List
            {selectedCount > 0 && (
              <Typography component="span" variant="h6" color="primary" sx={{ ml: 2 }}>
                ({selectedCount} selected)
              </Typography>
            )}
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={showUnselected}
              onChange={(e) => setShowUnselected(e.target.checked)}
            />
          }
          label="Show unselected items"
        />
      </Box>

      {categories.map((category, index) => (
        <CategoryGroup
          key={category.name}
          category={category}
          selectedItemIds={selectedItemIds}
          onToggleItem={toggleItemSelection}
          onEditItem={handleEditItem}
          isFirst={index === 0}
          isLast={index === categories.length - 1}
        />
      ))}

      <Fab
        color="primary"
        aria-label="add item"
        onClick={handleAddItem}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit Item' : 'Add Item'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Home Category"
            fullWidth
            value={formData.homeCategory}
            onChange={(e) =>
              setFormData({ ...formData, homeCategory: e.target.value })
            }
            required
            helperText="e.g., Fridge, Cupboard, Vegetable drawer"
          />
          <TextField
            margin="dense"
            label="Notes (optional)"
            fullWidth
            multiline
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            helperText="e.g., Brand preference, specification"
          />
        </DialogContent>
        <DialogActions>
          {editingItem && (
            <Button
              onClick={() => setDeleteConfirm(editingItem.id)}
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ mr: 'auto' }}
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveItem}
            variant="contained"
            disabled={!formData.name.trim() || !formData.homeCategory.trim()}
          >
            {editingItem ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Item"
        message="Are you sure you want to delete this item? This will also remove it from all shops."
        onConfirm={handleDeleteItem}
        onCancel={() => setDeleteConfirm(null)}
      />
    </Box>
  );
}

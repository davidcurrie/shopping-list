import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Fab,
  Checkbox,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useShoppingStore } from '../../store/shoppingStore';
import { groupItemsByShopCategory } from '../../utils/categoryHelpers';
import { ShopCategoryGroup } from './ShopCategoryGroup';
import { Item } from '../../types';

export function ShopListView() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [showUnselected, setShowUnselected] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addItemsDialogOpen, setAddItemsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [editCategory, setEditCategory] = useState('');

  const shop = useShoppingStore((state) =>
    state.shops.find((s) => s.id === shopId)
  );
  const items = useShoppingStore((state) => state.items);
  const getItemsForShop = useShoppingStore((state) => state.getItemsForShop);
  const selectedItemIds = useShoppingStore(
    (state) => state.selection
  );
  const toggleItemSelection = useShoppingStore((state) => state.toggleItemSelection);
  const setItemShopAvailability = useShoppingStore((state) => state.setItemShopAvailability);
  const removeItemFromShop = useShoppingStore((state) => state.removeItemFromShop);

  if (!shopId || !shop) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Alert severity="error">Shop not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/shops')}
          sx={{ mt: 2 }}
        >
          Back to Shops
        </Button>
      </Box>
    );
  }

  const allItems = getItemsForShop(shopId, false);

  // Filter items based on showUnselected toggle
  const filteredItems = showUnselected
    ? allItems
    : allItems.filter((item) => selectedItemIds.includes(item.id));

  const selectedItems = allItems.filter((item) =>
    selectedItemIds.includes(item.id)
  );
  const categories = groupItemsByShopCategory(filteredItems, shop);

  const remainingCount = selectedItems.length;
  const totalCount = allItems.length;

  // Items not yet in this shop
  const availableToAdd = items.filter(
    (item) => !item.shopAvailability.some((avail) => avail.shopId === shopId)
  );

  const handleBack = () => {
    navigate('/shops');
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    const availability = item.shopAvailability.find((a) => a.shopId === shopId);
    setEditCategory(availability?.shopCategory || '');
    setEditDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (editingItem) {
      setItemShopAvailability(editingItem.id, shopId, editCategory);
      setEditDialogOpen(false);
    }
  };

  const handleRemoveFromShop = () => {
    if (editingItem) {
      removeItemFromShop(editingItem.id, shopId);
      setEditDialogOpen(false);
    }
  };

  const handleAddItems = (itemIds: string[]) => {
    itemIds.forEach((itemId) => {
      setItemShopAvailability(itemId, shopId, undefined);
    });
    setAddItemsDialogOpen(false);
  };

  const shopCategories = shop.categories || [];

  if (totalCount === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Items Available
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This shop has no items configured. Click the + button below to add
            items to this shop.
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Shops
          </Button>
        </Paper>

        <Fab
          color="primary"
          aria-label="add items"
          onClick={() => setAddItemsDialogOpen(true)}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>

        <AddItemsDialog
          open={addItemsDialogOpen}
          availableItems={availableToAdd}
          onClose={() => setAddItemsDialogOpen(false)}
          onAdd={handleAddItems}
        />
      </Box>
    );
  }

  if (remainingCount === 0 && !showUnselected) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Shopping Complete!
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You've purchased all selected items from {shop.name}.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mt: 2 }}
          >
            Back to Shops
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Shops
        </Button>
        <Typography variant="h5">
          {shop.name}
          <Typography component="span" variant="h6" color="primary" sx={{ ml: 2 }}>
            ({remainingCount}/{totalCount} items)
          </Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Uncheck items as you add them to your basket
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showUnselected}
              onChange={(e) => setShowUnselected(e.target.checked)}
            />
          }
          label="Show unselected items"
          sx={{ mt: 1 }}
        />
      </Box>

      {categories.map((category, index) => (
        <ShopCategoryGroup
          key={category.name}
          category={category}
          shopId={shopId}
          selectedItemIds={selectedItemIds}
          onToggleItem={toggleItemSelection}
          onEditItem={handleEditItem}
          isFirst={index === 0}
          isLast={index === categories.length - 1}
        />
      ))}

      <Fab
        color="primary"
        aria-label="add items"
        onClick={() => setAddItemsDialogOpen(true)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* Edit Category Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Item in {shop.name}</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            {editingItem?.name}
          </Typography>
          <Autocomplete
            freeSolo
            options={shopCategories}
            value={editCategory}
            onChange={(_, newValue) => {
              setEditCategory(newValue || '');
            }}
            onInputChange={(_, newInputValue) => {
              setEditCategory(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Shop Category"
                helperText="Select existing or type to create new (leave empty for Uncategorized)"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRemoveFromShop}
            color="error"
            startIcon={<DeleteIcon />}
          >
            Remove from Shop
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Items Dialog */}
      <AddItemsDialog
        open={addItemsDialogOpen}
        availableItems={availableToAdd}
        onClose={() => setAddItemsDialogOpen(false)}
        onAdd={handleAddItems}
      />
    </Box>
  );
}

interface AddItemsDialogProps {
  open: boolean;
  availableItems: Item[];
  onClose: () => void;
  onAdd: (itemIds: string[]) => void;
}

function AddItemsDialog({ open, availableItems, onClose, onAdd }: AddItemsDialogProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (itemId: string) => {
    setSelected((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAdd = () => {
    onAdd(selected);
    setSelected([]);
  };

  const handleClose = () => {
    setSelected([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Items to Shop</DialogTitle>
      <DialogContent>
        {availableItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            All items are already in this shop.
          </Typography>
        ) : (
          <List>
            {availableItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton onClick={() => handleToggle(item.id)} dense>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(item.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={item.name}
                    secondary={item.homeCategory}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={selected.length === 0}
        >
          Add {selected.length > 0 ? `(${selected.length})` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

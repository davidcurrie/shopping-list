import { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useShoppingStore } from '../../store/shoppingStore';

export function ItemShopMapping() {
  const items = useShoppingStore((state) => state.items);
  const shops = useShoppingStore((state) => state.shops);
  const setItemShopAvailability = useShoppingStore(
    (state) => state.setItemShopAvailability
  );
  const removeItemFromShop = useShoppingStore(
    (state) => state.removeItemFromShop
  );

  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState<string>('');
  const [shopCategory, setShopCategory] = useState('');

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const handleAddShop = () => {
    setSelectedShopId('');
    setShopCategory('');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedItemId && selectedShopId && shopCategory.trim()) {
      setItemShopAvailability(
        selectedItemId,
        selectedShopId,
        shopCategory.trim()
      );
      setDialogOpen(false);
    }
  };

  const handleRemove = (shopId: string) => {
    if (selectedItemId) {
      removeItemFromShop(selectedItemId, shopId);
    }
  };

  const getAvailableShops = () => {
    if (!selectedItem) return shops;

    const assignedShopIds = selectedItem.shopAvailability.map(
      (avail) => avail.shopId
    );
    return shops.filter((shop) => !assignedShopIds.includes(shop.id));
  };

  if (items.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No items available. Add items first.
        </Typography>
      </Paper>
    );
  }

  if (shops.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          No shops available. Add shops first.
        </Typography>
      </Paper>
    );
  }

  const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Item-Shop Mapping
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure which items are available at which shops and their
        shop-specific categories.
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Item</InputLabel>
        <Select
          value={selectedItemId}
          label="Select Item"
          onChange={(e) => setSelectedItemId(e.target.value)}
        >
          {sortedItems.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedItem && (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">
              Available at {selectedItem.shopAvailability.length} shop(s)
            </Typography>
            {getAvailableShops().length > 0 && (
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
                onClick={handleAddShop}
              >
                Add Shop
              </Button>
            )}
          </Box>

          {selectedItem.shopAvailability.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                This item is not available at any shop yet.
              </Typography>
            </Paper>
          ) : (
            <List>
              {selectedItem.shopAvailability.map((avail) => {
                const shop = shops.find((s) => s.id === avail.shopId);
                if (!shop) return null;

                return (
                  <ListItem
                    key={avail.shopId}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleRemove(avail.shopId)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={shop.name}
                      secondary={
                        <Chip
                          label={avail.shopCategory}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Shop Availability</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Shop</InputLabel>
            <Select
              value={selectedShopId}
              label="Shop"
              onChange={(e) => setSelectedShopId(e.target.value)}
            >
              {getAvailableShops().map((shop) => (
                <MenuItem key={shop.id} value={shop.id}>
                  {shop.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Shop Category"
            fullWidth
            value={shopCategory}
            onChange={(e) => setShopCategory(e.target.value)}
            required
            helperText="e.g., Dairy, Meat, Vegetables"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!selectedShopId || !shopCategory.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

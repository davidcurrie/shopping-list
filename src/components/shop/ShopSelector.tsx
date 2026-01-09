import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Paper,
  Fab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useShoppingStore } from '../../store/shoppingStore';
import { Shop } from '../../types';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function ShopSelector() {
  const navigate = useNavigate();
  const shops = useShoppingStore((state) => state.shops);
  const addShop = useShoppingStore((state) => state.addShop);
  const updateShop = useShoppingStore((state) => state.updateShop);
  const deleteShop = useShoppingStore((state) => state.deleteShop);
  const getItemsForShop = useShoppingStore((state) => state.getItemsForShop);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [shopName, setShopName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleShopClick = (shopId: string) => {
    navigate(`/shop/${shopId}`);
  };

  const handleAddShop = () => {
    setEditingShop(null);
    setShopName('');
    setDialogOpen(true);
  };

  const handleEditShop = (e: React.MouseEvent, shop: Shop) => {
    e.stopPropagation();
    setEditingShop(shop);
    setShopName(shop.name);
    setDialogOpen(true);
  };

  const handleSaveShop = () => {
    if (!shopName.trim()) {
      return;
    }

    if (editingShop) {
      updateShop(editingShop.id, { name: shopName.trim() });
    } else {
      addShop({ name: shopName.trim() });
    }

    setDialogOpen(false);
  };

  const handleDeleteShop = () => {
    if (editingShop && deleteConfirm) {
      deleteShop(deleteConfirm);
      setDeleteConfirm(null);
      setDialogOpen(false);
    }
  };

  if (shops.length === 0) {
    return (
      <>
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No Shops Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Click the + button below to add your first shop.
            </Typography>
          </Paper>
        </Box>

        <Fab
          color="primary"
          aria-label="add shop"
          onClick={handleAddShop}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <AddIcon />
        </Fab>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Shop</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Shop Name"
              fullWidth
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveShop}
              variant="contained"
              disabled={!shopName.trim()}
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
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Select a Shop
      </Typography>

      <Grid container spacing={2}>
        {shops.map((shop) => {
          const availableItems = getItemsForShop(shop.id, true);
          const itemCount = availableItems.length;

          return (
            <Grid item xs={12} sm={6} md={4} key={shop.id}>
              <Card sx={{ position: 'relative' }}>
                <IconButton
                  onClick={(e) => handleEditShop(e, shop)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' },
                    zIndex: 1,
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <CardActionArea onClick={() => handleShopClick(shop.id)}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <StoreIcon
                        sx={{ mr: 1, color: 'primary.main', fontSize: 32 }}
                      />
                      <Typography variant="h6">{shop.name}</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {itemCount === 0
                        ? 'No items needed'
                        : itemCount === 1
                        ? '1 item needed'
                        : `${itemCount} items needed`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Fab
        color="primary"
        aria-label="add shop"
        onClick={handleAddShop}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingShop ? 'Edit Shop' : 'Add Shop'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Shop Name"
            fullWidth
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          {editingShop && (
            <Button
              onClick={() => setDeleteConfirm(editingShop.id)}
              color="error"
              startIcon={<DeleteIcon />}
              sx={{ mr: 'auto' }}
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveShop}
            variant="contained"
            disabled={!shopName.trim()}
          >
            {editingShop ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="Delete Shop"
        message="Are you sure you want to delete this shop? This will remove it from all item availability mappings."
        onConfirm={handleDeleteShop}
        onCancel={() => setDeleteConfirm(null)}
      />
    </Box>
  );
}

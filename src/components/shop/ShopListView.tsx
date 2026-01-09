import { Box, Typography, Button, Paper, Alert, FormControlLabel, Switch } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useShoppingStore } from '../../store/shoppingStore';
import { groupItemsByShopCategory } from '../../utils/categoryHelpers';
import { ShopCategoryGroup } from './ShopCategoryGroup';

export function ShopListView() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const [showUnselected, setShowUnselected] = useState(false);

  const shop = useShoppingStore((state) =>
    state.shops.find((s) => s.id === shopId)
  );
  const getItemsForShop = useShoppingStore((state) => state.getItemsForShop);
  const selectedItemIds = useShoppingStore(
    (state) => state.selection
  );
  const toggleItemSelection = useShoppingStore((state) => state.toggleItemSelection);

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

  const handleBack = () => {
    navigate('/shops');
  };

  if (totalCount === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No Items Available
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This shop has no items configured. Go to Settings to add items to
            this shop.
          </Typography>
          <Button
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

  if (remainingCount === 0) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Shopping Complete!
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            You've purchased all items from {shop.name}.
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
          isFirst={index === 0}
          isLast={index === categories.length - 1}
        />
      ))}
    </Box>
  );
}

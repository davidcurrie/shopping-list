import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { ShopCategory, Item } from '../../types';
import { ShopItemRow } from './ShopItemRow';
import { useShoppingStore } from '../../store/shoppingStore';

interface ShopCategoryGroupProps {
  category: ShopCategory;
  shopId: string;
  selectedItemIds: string[];
  onToggleItem: (itemId: string) => void;
  onEditItem?: (item: Item) => void;
  isFirst: boolean;
  isLast: boolean;
  defaultExpanded?: boolean;
}

export function ShopCategoryGroup({
  category,
  shopId,
  selectedItemIds,
  onToggleItem,
  onEditItem,
  isFirst,
  isLast,
  defaultExpanded = true,
}: ShopCategoryGroupProps) {
  const moveShopCategoryUp = useShoppingStore((state) => state.moveShopCategoryUp);
  const moveShopCategoryDown = useShoppingStore((state) => state.moveShopCategoryDown);

  const selectedCount = category.items.filter((item) =>
    selectedItemIds.includes(item.id)
  ).length;

  const isUncategorized = category.name === 'Uncategorized';

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveShopCategoryUp(shopId, category.name);
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveShopCategoryDown(shopId, category.name);
  };

  return (
    <Accordion defaultExpanded={defaultExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
            pr: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isUncategorized && (
              <Box>
                <IconButton
                  size="small"
                  onClick={handleMoveUp}
                  disabled={isFirst}
                  sx={{ p: 0.5 }}
                >
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleMoveDown}
                  disabled={isLast}
                  sx={{ p: 0.5 }}
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Typography variant="h6">{category.name}</Typography>
          </Box>
          {selectedCount > 0 && (
            <Chip
              label={`${selectedCount}/${category.items.length} remaining`}
              size="small"
              color="primary"
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          {category.items.map((item) => (
            <ShopItemRow
              key={item.id}
              item={item}
              selected={selectedItemIds.includes(item.id)}
              onToggle={onToggleItem}
              onEdit={onEditItem}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

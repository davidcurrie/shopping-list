import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  Box,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ShopCategory } from '../../types';
import { ShopItemRow } from './ShopItemRow';

interface ShopCategoryGroupProps {
  category: ShopCategory;
  selectedItemIds: string[];
  onToggleItem: (itemId: string) => void;
  defaultExpanded?: boolean;
}

export function ShopCategoryGroup({
  category,
  selectedItemIds,
  onToggleItem,
  defaultExpanded = true,
}: ShopCategoryGroupProps) {
  const selectedCount = category.items.filter((item) =>
    selectedItemIds.includes(item.id)
  ).length;

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
          <Typography variant="h6">{category.name}</Typography>
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
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}

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
import { HomeCategory, Item } from '../../types';
import { ItemRow } from './ItemRow';

interface CategoryGroupProps {
  category: HomeCategory;
  selectedItemIds: string[];
  onToggleItem: (itemId: string) => void;
  onEditItem: (item: Item) => void;
  defaultExpanded?: boolean;
}

export function CategoryGroup({
  category,
  selectedItemIds,
  onToggleItem,
  onEditItem,
  defaultExpanded = true,
}: CategoryGroupProps) {
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
              label={`${selectedCount}/${category.items.length}`}
              size="small"
              color="primary"
            />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          {category.items.map((item) => (
            <ItemRow
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

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { Item } from '../../types';

interface ShopItemRowProps {
  item: Item;
  selected: boolean;
  onToggle: (itemId: string) => void;
}

export function ShopItemRow({ item, selected, onToggle }: ShopItemRowProps) {
  const handleToggle = () => {
    onToggle(item.id);
  };

  return (
    <ListItem
      disablePadding
      sx={{
        textDecoration: selected ? 'none' : 'line-through',
        opacity: selected ? 1 : 0.6,
      }}
    >
      <ListItemButton onClick={handleToggle} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={selected}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText
          primary={item.name}
          secondary={item.notes}
          secondaryTypographyProps={{
            variant: 'body2',
            color: 'text.secondary',
            sx: { fontStyle: 'italic' },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

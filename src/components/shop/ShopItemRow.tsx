import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Item } from '../../types';

interface ShopItemRowProps {
  item: Item;
  selected: boolean;
  onToggle: (itemId: string) => void;
  onEdit?: (item: Item) => void;
}

export function ShopItemRow({ item, selected, onToggle, onEdit }: ShopItemRowProps) {
  const handleToggle = () => {
    onToggle(item.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item);
  };

  return (
    <ListItem
      disablePadding
      sx={{
        textDecoration: selected ? 'none' : 'line-through',
        opacity: selected ? 1 : 0.6,
      }}
      secondaryAction={
        onEdit && (
          <IconButton edge="end" size="small" onClick={handleEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        )
      }
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

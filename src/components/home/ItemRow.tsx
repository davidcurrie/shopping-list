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

interface ItemRowProps {
  item: Item;
  selected: boolean;
  onToggle: (itemId: string) => void;
  onEdit: (item: Item) => void;
}

export function ItemRow({ item, selected, onToggle, onEdit }: ItemRowProps) {
  const handleToggle = () => {
    onToggle(item.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <IconButton edge="end" onClick={handleEdit} size="small">
          <EditIcon fontSize="small" />
        </IconButton>
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

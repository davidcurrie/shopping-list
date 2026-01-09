import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { SaveStatus } from '../../types';

interface AppBarProps {
  onMenuClick: () => void;
  title: string;
  saveStatus: SaveStatus;
}

export function AppBar({ onMenuClick, title, saveStatus }: AppBarProps) {
  const getStatusColor = () => {
    switch (saveStatus) {
      case 'saved':
        return 'success';
      case 'saving':
        return 'info';
      case 'error':
        return 'error';
      case 'unsaved':
        return 'warning';
    }
  };

  const getStatusLabel = () => {
    switch (saveStatus) {
      case 'saved':
        return 'Saved';
      case 'saving':
        return 'Saving...';
      case 'error':
        return 'Error';
      case 'unsaved':
        return 'Unsaved';
    }
  };

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Box>
          <Chip
            label={getStatusLabel()}
            color={getStatusColor()}
            size="small"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255, 255, 255, 0.5)' }}
          />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
}

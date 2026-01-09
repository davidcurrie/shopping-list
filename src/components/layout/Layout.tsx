import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { AppBar } from './AppBar';
import { AppDrawer } from './AppDrawer';
import { useShoppingStore } from '../../store/shoppingStore';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const saveStatus = useShoppingStore((state) => state.saveStatus);
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home List';
      case '/shops':
        return 'Shops';
      case '/settings':
        return 'Settings';
      default:
        if (location.pathname.startsWith('/shop/')) {
          return 'Shopping';
        }
        return 'Shopping List';
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        onMenuClick={handleDrawerToggle}
        title={getTitle()}
        saveStatus={saveStatus}
      />
      <AppDrawer open={drawerOpen} onClose={handleDrawerClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

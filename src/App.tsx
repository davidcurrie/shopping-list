import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Layout } from './components/layout/Layout';
import { HomeListView } from './components/home/HomeListView';
import { ShopSelector } from './components/shop/ShopSelector';
import { ShopListView } from './components/shop/ShopListView';
import { SettingsView } from './components/settings/SettingsView';
import { useAutoSave } from './hooks/useAutoSave';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function AppContent() {
  // Enable auto-save functionality
  useAutoSave();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomeListView />} />
        <Route path="/shops" element={<ShopSelector />} />
        <Route path="/shop/:shopId" element={<ShopListView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename="/shopping-list">
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;

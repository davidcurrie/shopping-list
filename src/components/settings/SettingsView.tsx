import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { ItemShopMapping } from './ItemShopMapping';
import { FileLocationSettings } from './FileLocationSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export function SettingsView() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Item-Shop Mapping" />
        <Tab label="File Location" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <ItemShopMapping />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <FileLocationSettings />
      </TabPanel>
    </Box>
  );
}

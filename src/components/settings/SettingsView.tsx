import { Box, Typography } from '@mui/material';
import { FileLocationSettings } from './FileLocationSettings';

export function SettingsView() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <FileLocationSettings />
    </Box>
  );
}

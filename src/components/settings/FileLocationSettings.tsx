import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useShoppingStore } from '../../store/shoppingStore';
import { useFileSystem } from '../../hooks/useFileSystem';
import { fileSystemService } from '../../services/fileSystemService';

export function FileLocationSettings() {
  const fileHandle = useShoppingStore((state) => state.fileHandle);
  const { openFile, createFile, saveFile, loading, error } = useFileSystem();

  const fileName = fileHandle
    ? fileSystemService.getFileName(fileHandle)
    : 'No file selected';

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        File Location
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Your shopping list is stored in a YAML file that you can place in any
        location, including cloud-synced folders like Google Drive or Dropbox.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Current File
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace' }}>
          {fileName}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            startIcon={loading ? <CircularProgress size={20} /> : <FolderOpenIcon />}
            variant="outlined"
            onClick={openFile}
            disabled={loading}
          >
            Open Different File
          </Button>
          <Button
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            variant="outlined"
            onClick={createFile}
            disabled={loading}
          >
            Create New File
          </Button>
          {fileHandle && (
            <Button
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              variant="outlined"
              onClick={saveFile}
              disabled={loading}
            >
              Save Now
            </Button>
          )}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, bgcolor: 'info.light' }}>
        <Typography variant="subtitle2" gutterBottom>
          Tips
        </Typography>
        <Typography variant="body2" component="div">
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              The file is human-readable YAML format that you can edit manually
              if needed
            </li>
            <li>
              Place the file in a cloud-synced folder to access it across
              devices
            </li>
            <li>Changes are auto-saved after 2 seconds of inactivity</li>
            <li>
              You may need to re-grant file permissions when you reload the app
            </li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
}

import { useState } from 'react';
import { fileSystemService } from '../services/fileSystemService';
import { yamlService } from '../services/yamlService';
import { useShoppingStore } from '../store/shoppingStore';

export function useFileSystem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useShoppingStore((state) => state.loadData);
  const setFileHandle = useShoppingStore((state) => state.setFileHandle);

  const openFile = async () => {
    try {
      setLoading(true);
      setError(null);

      const handle = await fileSystemService.requestFileHandle();
      const content = await fileSystemService.readFile(handle);
      const data = yamlService.deserialize(content);

      loadData(data);
      setFileHandle(handle);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to open file');
      }
    } finally {
      setLoading(false);
    }
  };

  const createFile = async () => {
    try {
      setLoading(true);
      setError(null);

      const handle = await fileSystemService.createNewFile();
      const defaultData = yamlService.createDefaultData();
      const content = yamlService.serialize(defaultData);

      await fileSystemService.writeFile(handle, content);
      loadData(defaultData);
      setFileHandle(handle);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create file');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveFile = async () => {
    try {
      setLoading(true);
      setError(null);

      const fileHandle = useShoppingStore.getState().fileHandle;
      if (!fileHandle) {
        throw new Error('No file handle available');
      }

      const items = useShoppingStore.getState().items;
      const shops = useShoppingStore.getState().shops;
      const selection = useShoppingStore.getState().selection;

      const data = { items, shops, selection };
      const content = yamlService.serialize(data);

      await fileSystemService.writeFile(fileHandle, content);
      useShoppingStore.getState().setSaveStatus('saved');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save file');
      }
      useShoppingStore.getState().setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return {
    openFile,
    createFile,
    saveFile,
    loading,
    error,
    isSupported: fileSystemService.isSupported(),
  };
}

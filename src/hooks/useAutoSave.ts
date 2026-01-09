import { useEffect, useRef } from 'react';
import { useShoppingStore } from '../store/shoppingStore';
import { fileSystemService } from '../services/fileSystemService';
import { yamlService } from '../services/yamlService';

const AUTOSAVE_DELAY_MS = 2000; // 2 seconds

export function useAutoSave() {
  const saveTimeoutRef = useRef<number | null>(null);

  const items = useShoppingStore((state) => state.items);
  const shops = useShoppingStore((state) => state.shops);
  const selection = useShoppingStore((state) => state.selection);
  const fileHandle = useShoppingStore((state) => state.fileHandle);
  const saveStatus = useShoppingStore((state) => state.saveStatus);
  const setSaveStatus = useShoppingStore((state) => state.setSaveStatus);

  useEffect(() => {
    // Only auto-save if we have a file handle and status is unsaved
    if (!fileHandle || saveStatus !== 'unsaved') {
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current !== null) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        setSaveStatus('saving');

        const data = { items, shops, selection };
        const content = yamlService.serialize(data);
        await fileSystemService.writeFile(fileHandle, content);

        setSaveStatus('saved');
      } catch (error) {
        console.error('Auto-save failed:', error);
        setSaveStatus('error');
      }
    }, AUTOSAVE_DELAY_MS);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current !== null) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [items, shops, selection, fileHandle, saveStatus, setSaveStatus]);
}

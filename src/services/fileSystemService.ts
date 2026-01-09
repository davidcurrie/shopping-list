export class FileSystemService {
  /**
   * Check if File System Access API is supported
   */
  isSupported(): boolean {
    return 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;
  }

  /**
   * Open file picker to select an existing YAML file
   */
  async requestFileHandle(
    mode: 'read' | 'readwrite' = 'readwrite'
  ): Promise<FileSystemFileHandle> {
    if (!this.isSupported()) {
      throw new Error('File System Access API not supported in this browser');
    }

    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'YAML files',
          accept: { 'text/yaml': ['.yaml', '.yml'] },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    });

    // Request permission
    const permission = await this.verifyPermission(handle, mode);
    if (!permission) {
      throw new Error('Permission denied to access file');
    }

    return handle;
  }

  /**
   * Open save file picker to create a new YAML file
   */
  async createNewFile(): Promise<FileSystemFileHandle> {
    if (!this.isSupported()) {
      throw new Error('File System Access API not supported in this browser');
    }

    const handle = await window.showSaveFilePicker({
      suggestedName: 'shopping-list.yaml',
      types: [
        {
          description: 'YAML files',
          accept: { 'text/yaml': ['.yaml', '.yml'] },
        },
      ],
    });

    return handle;
  }

  /**
   * Read contents of a file
   */
  async readFile(handle: FileSystemFileHandle): Promise<string> {
    // Verify we have read permission
    const permission = await this.verifyPermission(handle, 'read');
    if (!permission) {
      throw new Error('Permission denied to read file');
    }

    const file = await handle.getFile();
    return await file.text();
  }

  /**
   * Write content to a file
   */
  async writeFile(
    handle: FileSystemFileHandle,
    content: string
  ): Promise<void> {
    // Verify we have write permission
    const permission = await this.verifyPermission(handle, 'readwrite');
    if (!permission) {
      throw new Error('Permission denied to write to file');
    }

    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
  }

  /**
   * Verify and request permission if needed
   */
  private async verifyPermission(
    handle: FileSystemFileHandle,
    mode: 'read' | 'readwrite'
  ): Promise<boolean> {
    const options = { mode };

    // Check if already have permission
    if ((await handle.queryPermission(options)) === 'granted') {
      return true;
    }

    // Request permission
    if ((await handle.requestPermission(options)) === 'granted') {
      return true;
    }

    return false;
  }

  /**
   * Get file name from handle
   */
  getFileName(handle: FileSystemFileHandle): string {
    return handle.name;
  }
}

export const fileSystemService = new FileSystemService();
